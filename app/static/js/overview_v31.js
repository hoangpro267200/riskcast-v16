/**
 * RISKCAST FUTUREOS OVERVIEW V31 - JAVASCRIPT ENGINE
 * Ultra Globe + Inline Editor + Multi-Segment Route
 */

(function() {
    'use strict';

    // ============================================
    // STATE ENGINE V31
    // ============================================
    
    let STATE = {
        transport: {
            mode: 'ocean',
            pol: { name: 'Ho Chi Minh', country: 'Vietnam', code: 'VNSGN', lat: 10.8231, lon: 106.6297 },
            pod: { name: 'Shanghai', country: 'China', code: 'CNSHA', lat: 31.2304, lon: 121.4737 },
            etd: '2025-12-10',
            eta: '2025-12-25'
        },
        cargo: {
            type: 'Electronics',
            hsCode: '8471.30',
            quantity: '2 x 40\' HC',
            weight: '24,000 kg',
            value: '$150,000'
        },
        parties: {
            seller: 'VN Tech Export Ltd.',
            buyer: 'Shanghai Electronics Co.',
            incoterms: 'FOB',
            paymentTerms: 'L/C at sight'
        },
        risk: {
            score: 7.2,
            level: 'Medium',
            factors: [
                { icon: '🌊', label: 'Weather: Moderate' },
                { icon: '⚓', label: 'Port Congestion: Low' },
                { icon: '📋', label: 'Documentation: OK' }
            ]
        },
        segments: [
            { 
                fromCode: 'VNSGN', 
                toCode: 'SGSIN',
                fromName: 'Ho Chi Minh',
                toName: 'Singapore',
                fromLat: 10.8231,
                fromLon: 106.6297,
                toLat: 1.3521,
                toLon: 103.8198,
                mode: 'ocean'
            },
            { 
                fromCode: 'SGSIN', 
                toCode: 'CNSHA',
                fromName: 'Singapore',
                toName: 'Shanghai',
                fromLat: 1.3521,
                fromLon: 103.8198,
                toLat: 31.2304,
                toLon: 121.4737,
                mode: 'ocean'
            }
        ],
        ui: {
            isNightMode: true,
            is3DMode: true
        }
    };

    // Merge with bootstrap data if available
    if (window.__RC_OVERVIEW_BOOTSTRAP__) {
        deepMerge(STATE, window.__RC_OVERVIEW_BOOTSTRAP__);
    }

    // Deep merge utility
    function deepMerge(target, source) {
        for (let key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                target[key] = target[key] || {};
                deepMerge(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        }
    }

    // ============================================
    // CESIUM GLOBE ENGINE
    // ============================================
    
    let viewer = null;
    let routeEntities = [];
    let vehicleEntity = null;
    let leafletMap = null;

    // Cesium Configuration
    if (typeof Cesium !== 'undefined') {
        // Set Cesium base URL for workers and assets (must be set before creating Viewer)
        if (window.CESIUM_BASE_URL) {
            Cesium.buildModuleUrl.setBaseUrl(window.CESIUM_BASE_URL);
            console.log('✅ Cesium base URL set to:', window.CESIUM_BASE_URL);
        } else {
            console.warn('⚠️ CESIUM_BASE_URL not set, using default');
        }
        
        // Cesium Ion access token (replace with your own)
        Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI5N2U3MzM1NS00YWYxLTRmYmQtYmJhOC0yNTg0ZDI3YzA3ZTkiLCJpZCI6MjQzNTg1LCJpYXQiOjE3MzMzOTk2NTd9.example';
        
        // Fix for module worker importScripts error
        // Cesium workers use importScripts() which doesn't work in module workers
        // Intercept Worker creation to ensure classic workers are used
        if (typeof Worker !== 'undefined') {
            const OriginalWorker = window.Worker;
            window.Worker = function(scriptURL, options) {
                // Remove type: 'module' if present to force classic worker mode
                // This fixes the "Module scripts don't support importScripts()" error
                if (options && typeof options === 'object' && options.type === 'module') {
                    const restOptions = Object.assign({}, options);
                    delete restOptions.type;
                    return new OriginalWorker(scriptURL, restOptions);
                }
                return new OriginalWorker(scriptURL, options);
            };
            // Preserve Worker prototype and static properties
            Object.setPrototypeOf(window.Worker, OriginalWorker);
            Object.setPrototypeOf(window.Worker.prototype, OriginalWorker.prototype);
        }
    }

    async function initCesiumGlobe() {
        try {
            const container = document.getElementById('globe-3d-container');
            
            if (!container) {
                console.error('❌ Globe container not found');
                return;
            }

            // Use EllipsoidTerrainProvider (fast, no async needed)
            // For World Terrain, use: await Cesium.createWorldTerrainAsync() in async context
            viewer = new Cesium.Viewer(container, {
                terrainProvider: new Cesium.EllipsoidTerrainProvider(),
                animation: false,
                timeline: false,
                baseLayerPicker: false,
                fullscreenButton: false,
                vrButton: false,
                geocoder: false,
                homeButton: false,
                sceneModePicker: false,
                selectionIndicator: false,
                infoBox: false,
                navigationHelpButton: false,
                imageryProvider: new Cesium.IonImageryProvider({ assetId: 3845 }),
                skyBox: new Cesium.SkyBox({
                    sources: {
                        positiveX: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
                        negativeX: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
                        positiveY: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
                        negativeY: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
                        positiveZ: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
                        negativeZ: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
                    }
                })
            });

            // Configure scene
            viewer.scene.globe.enableLighting = true;
            viewer.scene.globe.atmosphereLightIntensity = STATE.ui.isNightMode ? 0.3 : 3.0;
            viewer.scene.skyAtmosphere.show = true;

            // Dark cosmic background
            viewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a0e27');

            // Hide loading overlay
            const loadingEl = document.getElementById('globeLoading');
            if (loadingEl) loadingEl.style.display = 'none';

            // Render route
            await renderFullRoute();

            console.log('✅ Cesium Globe initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Cesium:', error);
            const loadingEl = document.getElementById('globeLoading');
            const errorEl = document.getElementById('globeError');
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) errorEl.style.display = 'flex';
        }
    }

    async function renderFullRoute() {
        if (!viewer) return;

        // Clear existing entities
        routeEntities.forEach(entity => viewer.entities.remove(entity));
        routeEntities = [];
        if (vehicleEntity) {
            viewer.entities.remove(vehicleEntity);
            vehicleEntity = null;
        }

        const segments = STATE.segments || [];
        if (segments.length === 0) return;

        let allPositions = [];

        // Render each segment
        for (let i = 0; i < segments.length; i++) {
            const segment = segments[i];
            
            // Start marker
            const startMarker = viewer.entities.add({
                position: Cesium.Cartesian3.fromDegrees(segment.fromLon, segment.fromLat),
                point: {
                    pixelSize: 15,
                    color: Cesium.Color.fromCssColorString('#fbbf24'),
                    outlineColor: Cesium.Color.fromCssColorString('#fbbf24').withAlpha(0.3),
                    outlineWidth: 10,
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
                },
                label: {
                    text: segment.fromName,
                    font: '14px sans-serif',
                    fillColor: Cesium.Color.WHITE,
                    outlineColor: Cesium.Color.BLACK,
                    outlineWidth: 2,
                    style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                    verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                    pixelOffset: new Cesium.Cartesian2(0, -20),
                    scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.5)
                }
            });
            routeEntities.push(startMarker);

            // End marker (only for last segment)
            if (i === segments.length - 1) {
                const endMarker = viewer.entities.add({
                    position: Cesium.Cartesian3.fromDegrees(segment.toLon, segment.toLat),
                    point: {
                        pixelSize: 15,
                        color: Cesium.Color.fromCssColorString('#06b6d4'),
                        outlineColor: Cesium.Color.fromCssColorString('#06b6d4').withAlpha(0.3),
                        outlineWidth: 10,
                        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
                    },
                    label: {
                        text: segment.toName,
                        font: '14px sans-serif',
                        fillColor: Cesium.Color.WHITE,
                        outlineColor: Cesium.Color.BLACK,
                        outlineWidth: 2,
                        style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                        verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                        pixelOffset: new Cesium.Cartesian2(0, -20),
                        scaleByDistance: new Cesium.NearFarScalar(1.5e2, 1.5, 1.5e7, 0.5)
                    }
                });
                routeEntities.push(endMarker);
            }

            // Arc path with glow
            const positions = [
                Cesium.Cartesian3.fromDegrees(segment.fromLon, segment.fromLat),
                Cesium.Cartesian3.fromDegrees(segment.toLon, segment.toLat)
            ];

            const arcEntity = viewer.entities.add({
                polyline: {
                    positions: positions,
                    width: 3,
                    material: new Cesium.PolylineGlowMaterialProperty({
                        glowPower: 0.3,
                        color: Cesium.Color.fromCssColorString('#fbbf24')
                    }),
                    clampToGround: false,
                    arcType: Cesium.ArcType.GEODESIC
                }
            });
            routeEntities.push(arcEntity);

            allPositions.push(...positions);
        }

        // Add animated vehicle
        addMovingVehicle();

        // Auto camera fit
        if (allPositions.length > 0) {
            setTimeout(() => {
                viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, -Math.PI / 4, 5000000));
            }, 500);
        }

        // Update mini map
        updateMiniMap();
    }

    function addMovingVehicle() {
        if (!viewer || !STATE.segments || STATE.segments.length === 0) return;

        const firstSegment = STATE.segments[0];
        const start = Cesium.Cartesian3.fromDegrees(firstSegment.fromLon, firstSegment.fromLat, 100000);
        const end = Cesium.Cartesian3.fromDegrees(firstSegment.toLon, firstSegment.toLat, 100000);

        // Get vehicle icon
        const icon = getVehicleIcon(STATE.transport.mode);

        // Create animated position
        const startTime = Cesium.JulianDate.now();
        const totalSeconds = 30; // 30 seconds animation

        const positionProperty = new Cesium.SampledPositionProperty();
        positionProperty.addSample(startTime, start);
        positionProperty.addSample(
            Cesium.JulianDate.addSeconds(startTime, totalSeconds, new Cesium.JulianDate()),
            end
        );

        vehicleEntity = viewer.entities.add({
            position: positionProperty,
            billboard: {
                image: createVehicleCanvas(icon),
                scale: 1.5,
                scaleByDistance: new Cesium.NearFarScalar(1.5e2, 2.0, 1.5e7, 0.5)
            }
        });

        // Animate through all segments
        animateVehicleThroughSegments(0, startTime);
    }

    function animateVehicleThroughSegments(segmentIndex, startTime) {
        if (!STATE.segments || segmentIndex >= STATE.segments.length) {
            // Loop back to start
            setTimeout(() => animateVehicleThroughSegments(0, Cesium.JulianDate.now()), 1000);
            return;
        }

        const segment = STATE.segments[segmentIndex];
        const start = Cesium.Cartesian3.fromDegrees(segment.fromLon, segment.fromLat, 100000);
        const end = Cesium.Cartesian3.fromDegrees(segment.toLon, segment.toLat, 100000);
        const duration = 15; // seconds per segment

        if (vehicleEntity) {
            const positionProperty = new Cesium.SampledPositionProperty();
            positionProperty.addSample(startTime, start);
            positionProperty.addSample(
                Cesium.JulianDate.addSeconds(startTime, duration, new Cesium.JulianDate()),
                end
            );
            vehicleEntity.position = positionProperty;
        }

        setTimeout(() => {
            animateVehicleThroughSegments(segmentIndex + 1, Cesium.JulianDate.addSeconds(startTime, duration, new Cesium.JulianDate()));
        }, duration * 1000);
    }

    function getVehicleIcon(mode) {
        const icons = {
            ocean: '🚢',
            air: '✈️',
            truck: '🚚',
            rail: '🚂'
        };
        return icons[mode] || '🚢';
    }

    function createVehicleCanvas(emoji) {
        const canvas = document.createElement('canvas');
        canvas.width = 64;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');
        
        // Glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#fbbf24';
        
        ctx.font = '48px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(emoji, 32, 32);
        
        return canvas;
    }

    function toggleDayNight() {
        STATE.ui.isNightMode = !STATE.ui.isNightMode;
        
        if (viewer) {
            viewer.scene.globe.atmosphereLightIntensity = STATE.ui.isNightMode ? 0.3 : 3.0;
        }

        const btn = document.getElementById('dayNightToggle');
        if (btn) {
            const icon = btn.querySelector('.mode-icon');
            const text = btn.querySelector('.mode-text');
            if (icon) icon.textContent = STATE.ui.isNightMode ? '🌙' : '☀️';
            if (text) text.textContent = STATE.ui.isNightMode ? 'Night Mode' : 'Day Mode';
        }
    }

    // ============================================
    // MINI 2D MAP (LEAFLET)
    // ============================================

    function initMiniMap() {
        const container = document.getElementById('globe-2d-minimap');
        if (!container) {
            console.warn('⚠️ Mini map container not found');
            return;
        }
        
        if (typeof L === 'undefined') {
            console.error('❌ Leaflet not loaded');
            return;
        }

        leafletMap = L.map(container, {
            center: [20, 100],
            zoom: 3,
            zoomControl: false,
            attributionControl: false
        });

        // Use Esri Dark Gray Canvas - stable, no network errors
        L.tileLayer(
            'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
            { 
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.esri.com/">Esri</a>'
            }
        ).addTo(leafletMap);

        updateMiniMap();
    }

    function updateMiniMap() {
        if (!leafletMap || !STATE.segments || STATE.segments.length === 0) return;

        // Clear existing layers
        leafletMap.eachLayer(layer => {
            if (layer instanceof L.Polyline || layer instanceof L.CircleMarker) {
                leafletMap.removeLayer(layer);
            }
        });

        // Draw route
        const latLngs = [];
        STATE.segments.forEach(segment => {
            latLngs.push([segment.fromLat, segment.fromLon]);
            L.circleMarker([segment.fromLat, segment.fromLon], {
                radius: 5,
                color: '#fbbf24',
                fillColor: '#fbbf24',
                fillOpacity: 0.8
            }).addTo(leafletMap);
        });

        // Add final destination
        const lastSegment = STATE.segments[STATE.segments.length - 1];
        latLngs.push([lastSegment.toLat, lastSegment.toLon]);
        L.circleMarker([lastSegment.toLat, lastSegment.toLon], {
            radius: 5,
            color: '#06b6d4',
            fillColor: '#06b6d4',
            fillOpacity: 0.8
        }).addTo(leafletMap);

        // Draw path
        L.polyline(latLngs, {
            color: '#fbbf24',
            weight: 3,
            opacity: 0.7
        }).addTo(leafletMap);

        // Fit bounds
        if (latLngs.length > 0) {
            leafletMap.fitBounds(latLngs);
        }
    }

    // ============================================
    // PORT AUTOCOMPLETE API
    // ============================================

    const PORT_DATABASE = [
        { name: 'Ho Chi Minh', country: 'Vietnam', code: 'VNSGN', lat: 10.8231, lon: 106.6297 },
        { name: 'Shanghai', country: 'China', code: 'CNSHA', lat: 31.2304, lon: 121.4737 },
        { name: 'Singapore', country: 'Singapore', code: 'SGSIN', lat: 1.3521, lon: 103.8198 },
        { name: 'Rotterdam', country: 'Netherlands', code: 'NLRTM', lat: 51.9244, lon: 4.4777 },
        { name: 'Los Angeles', country: 'USA', code: 'USLAX', lat: 33.7701, lon: -118.1937 },
        { name: 'Hamburg', country: 'Germany', code: 'DEHAM', lat: 53.5511, lon: 9.9937 },
        { name: 'Busan', country: 'South Korea', code: 'KRPUS', lat: 35.1796, lon: 129.0756 },
        { name: 'Tokyo', country: 'Japan', code: 'JPTYO', lat: 35.6532, lon: 139.7444 },
        { name: 'Hong Kong', country: 'Hong Kong', code: 'HKHKG', lat: 22.3193, lon: 114.1694 },
        { name: 'Dubai', country: 'UAE', code: 'AEDXB', lat: 25.2048, lon: 55.2708 },
        { name: 'Mumbai', country: 'India', code: 'INBOM', lat: 18.9667, lon: 72.8333 },
        { name: 'Sydney', country: 'Australia', code: 'AUSYD', lat: -33.8688, lon: 151.2093 }
    ];

    async function searchPorts(query) {
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                const results = PORT_DATABASE.filter(port => 
                    port.name.toLowerCase().includes(query.toLowerCase()) ||
                    port.code.toLowerCase().includes(query.toLowerCase()) ||
                    port.country.toLowerCase().includes(query.toLowerCase())
                ).slice(0, 10);
                resolve(results);
            }, 200);
        });
    }

    // ============================================
    // INLINE EDITING
    // ============================================

    function initInlineEditing() {
        document.querySelectorAll('.info-row.editable').forEach(row => {
            const field = row.dataset.field;
            const display = row.querySelector('.value-display');
            const edit = row.querySelector('.value-edit');

            if (!display || !edit) return;

            // Click to edit
            display.addEventListener('click', () => {
                display.style.display = 'none';
                edit.style.display = 'block';
                
                const input = edit.querySelector('input, select');
                if (input) {
                    input.focus();
                    if (input.tagName === 'INPUT' && input.type === 'text') {
                        input.select();
                    }
                }
            });

            // Handle input changes
            const input = edit.querySelector('input, select');
            if (input) {
                // For port autocomplete
                if (input.classList.contains('port-autocomplete')) {
                    const dropdown = row.querySelector('.autocomplete-dropdown');
                    
                    input.addEventListener('input', async (e) => {
                        const query = e.target.value;
                        if (query.length < 2) {
                            if (dropdown) dropdown.classList.remove('show');
                            return;
                        }

                        const results = await searchPorts(query);
                        if (dropdown) renderAutocomplete(dropdown, results, field, display, edit);
                    });

                    input.addEventListener('blur', () => {
                        if (dropdown) setTimeout(() => dropdown.classList.remove('show'), 200);
                    });
                }

                // Save on blur or enter
                input.addEventListener('blur', () => {
                    if (!input.classList.contains('port-autocomplete')) {
                        saveFieldValue(field, input.value, display, edit);
                    }
                });

                input.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter' && !input.classList.contains('port-autocomplete')) {
                        saveFieldValue(field, input.value, display, edit);
                    }
                });

                // Handle select change immediately
                if (input.tagName === 'SELECT') {
                    input.addEventListener('change', () => {
                        saveFieldValue(field, input.value, display, edit);
                    });
                }
            }
        });
    }

    function renderAutocomplete(dropdown, results, field, display, edit) {
        dropdown.innerHTML = '';
        
        if (results.length === 0) {
            dropdown.innerHTML = '<div class="autocomplete-item" style="color: #94a3b8;">No ports found</div>';
            dropdown.classList.add('show');
            return;
        }

        results.forEach(port => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.innerHTML = `
                <span class="autocomplete-item-name">${port.name}, ${port.country}</span>
                <span class="autocomplete-item-code">${port.code}</span>
            `;
            
            item.addEventListener('click', () => {
                selectPort(field, port, display, edit);
                dropdown.classList.remove('show');
            });
            
            dropdown.appendChild(item);
        });

        dropdown.classList.add('show');
    }

    function selectPort(field, port, display, edit) {
        if (field === 'pol') {
            STATE.transport.pol = port;
            display.textContent = `${port.name}, ${port.country} (${port.code})`;
        } else if (field === 'pod') {
            STATE.transport.pod = port;
            display.textContent = `${port.name}, ${port.country} (${port.code})`;
        }

        display.style.display = 'block';
        edit.style.display = 'none';

        // Update segments
        updateSegmentsFromPOLPOD();

        // Re-render globe
        renderFullRoute();

        console.log('✅ Port updated:', field, port);
    }

    function saveFieldValue(field, value, display, edit) {
        // Update STATE
        const fieldMap = {
            mode: { obj: STATE.transport, key: 'mode', transform: (v) => v },
            etd: { obj: STATE.transport, key: 'etd', transform: (v) => v },
            eta: { obj: STATE.transport, key: 'eta', transform: (v) => v },
            cargoType: { obj: STATE.cargo, key: 'type', transform: (v) => v },
            hsCode: { obj: STATE.cargo, key: 'hsCode', transform: (v) => v },
            quantity: { obj: STATE.cargo, key: 'quantity', transform: (v) => v },
            weight: { obj: STATE.cargo, key: 'weight', transform: (v) => v },
            value: { obj: STATE.cargo, key: 'value', transform: (v) => v },
            seller: { obj: STATE.parties, key: 'seller', transform: (v) => v },
            buyer: { obj: STATE.parties, key: 'buyer', transform: (v) => v },
            incoterms: { obj: STATE.parties, key: 'incoterms', transform: (v) => v },
            paymentTerms: { obj: STATE.parties, key: 'paymentTerms', transform: (v) => v }
        };

        if (fieldMap[field]) {
            const mapping = fieldMap[field];
            mapping.obj[mapping.key] = mapping.transform(value);

            // Update display
            if (field === 'mode') {
                const modeMap = { ocean: 'Ocean Freight', air: 'Air Freight', truck: 'Truck', rail: 'Rail' };
                display.textContent = modeMap[value] || value;
                updateVehicleIcon();
            } else {
                display.textContent = value;
            }

            // Calculate transit if ETD/ETA changed
            if (field === 'etd' || field === 'eta') {
                calculateTransitDays();
            }
        }

        display.style.display = 'block';
        edit.style.display = 'none';

        console.log('✅ Field saved:', field, value);
    }

    function updateSegmentsFromPOLPOD() {
        // Simple two-segment route: POL → Singapore → POD
        const singapore = { name: 'Singapore', country: 'Singapore', code: 'SGSIN', lat: 1.3521, lon: 103.8198 };
        
        if (!STATE.transport.pol || !STATE.transport.pod) return;
        
        STATE.segments = [
            {
                fromCode: STATE.transport.pol.code,
                toCode: singapore.code,
                fromName: STATE.transport.pol.name,
                toName: singapore.name,
                fromLat: STATE.transport.pol.lat,
                fromLon: STATE.transport.pol.lon,
                toLat: singapore.lat,
                toLon: singapore.lon,
                mode: STATE.transport.mode
            },
            {
                fromCode: singapore.code,
                toCode: STATE.transport.pod.code,
                fromName: singapore.name,
                toName: STATE.transport.pod.name,
                fromLat: singapore.lat,
                fromLon: singapore.lon,
                toLat: STATE.transport.pod.lat,
                toLon: STATE.transport.pod.lon,
                mode: STATE.transport.mode
            }
        ];

        renderSegments();
    }

    function calculateTransitDays() {
        if (!STATE.transport.etd || !STATE.transport.eta) return;
        
        const etd = new Date(STATE.transport.etd);
        const eta = new Date(STATE.transport.eta);
        const diffTime = Math.abs(eta - etd);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        const transitEl = document.getElementById('displayTransit');
        if (transitEl) transitEl.textContent = `${diffDays} days`;
    }

    function updateVehicleIcon() {
        if (vehicleEntity) {
            const icon = getVehicleIcon(STATE.transport.mode);
            vehicleEntity.billboard.image = createVehicleCanvas(icon);
        }
        
        // Update card icon
        const cardIcon = document.querySelector('#transportCard .card-icon');
        if (cardIcon) {
            cardIcon.textContent = getVehicleIcon(STATE.transport.mode);
        }
    }

    // ============================================
    // SEGMENTS VIEWER
    // ============================================

    function renderSegments() {
        const container = document.getElementById('segmentsContainer');
        if (!container) return;
        
        container.innerHTML = '';

        if (!STATE.segments || STATE.segments.length === 0) {
            document.getElementById('segmentsCount').textContent = '0 segments';
            return;
        }

        STATE.segments.forEach((segment, index) => {
            const card = document.createElement('div');
            card.className = 'segment-card';
            card.innerHTML = `
                <div class="segment-header">
                    <span class="segment-number">LEG ${index + 1}</span>
                    <span class="segment-icon">${getVehicleIcon(segment.mode)}</span>
                </div>
                <div class="segment-route">${segment.fromName} → ${segment.toName}</div>
                <div class="segment-details">${segment.fromCode} to ${segment.toCode}</div>
            `;

            card.addEventListener('click', () => {
                focusOnSegment(index);
                document.querySelectorAll('.segment-card').forEach(c => c.classList.remove('active'));
                card.classList.add('active');
            });

            container.appendChild(card);

            if (index < STATE.segments.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'segment-arrow';
                arrow.textContent = '→';
                container.appendChild(arrow);
            }
        });

        const countEl = document.getElementById('segmentsCount');
        if (countEl) countEl.textContent = `${STATE.segments.length} segments`;
    }

    function focusOnSegment(index) {
        if (!viewer || !STATE.segments || index >= STATE.segments.length) return;

        const segment = STATE.segments[index];
        const position = Cesium.Cartesian3.fromDegrees(
            (segment.fromLon + segment.toLon) / 2,
            (segment.fromLat + segment.toLat) / 2,
            2000000
        );

        viewer.camera.flyTo({
            destination: position,
            duration: 2,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: Cesium.Math.toRadians(-45),
                roll: 0
            }
        });
    }

    // ============================================
    // GLOBE CONTROLS
    // ============================================

    function initGlobeControls() {
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetCamera = document.getElementById('resetCamera');
        const toggle3D2D = document.getElementById('toggle3D2D');
        const dayNightToggle = document.getElementById('dayNightToggle');

        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                if (viewer) viewer.camera.zoomIn(1000000);
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                if (viewer) viewer.camera.zoomOut(1000000);
            });
        }

        if (resetCamera) {
            resetCamera.addEventListener('click', () => {
                if (viewer && routeEntities.length > 0) {
                    viewer.zoomTo(viewer.entities, new Cesium.HeadingPitchRange(0, -Math.PI / 4, 5000000));
                }
            });
        }

        if (toggle3D2D) {
            toggle3D2D.addEventListener('click', function() {
                STATE.ui.is3DMode = !STATE.ui.is3DMode;
                const span = this.querySelector('span');
                if (span) span.textContent = STATE.ui.is3DMode ? '3D' : '2D';
                
                if (viewer) {
                    viewer.scene.mode = STATE.ui.is3DMode ? Cesium.SceneMode.SCENE3D : Cesium.SceneMode.SCENE2D;
                }
            });
        }

        if (dayNightToggle) {
            dayNightToggle.addEventListener('click', toggleDayNight);
        }
    }

    // ============================================
    // ANALYZE BUTTON
    // ============================================

    function initAnalyzeButton() {
        const button = document.getElementById('analyzeButton');
        if (!button) return;
        
        button.addEventListener('click', async () => {
            button.classList.add('loading');
            const textEl = button.querySelector('.button-text');
            const iconEl = button.querySelector('.button-icon');
            const loaderEl = button.querySelector('.button-loader');
            
            if (textEl) textEl.style.display = 'none';
            if (iconEl) iconEl.style.display = 'none';
            if (loaderEl) loaderEl.style.display = 'flex';

            // Log state
            console.log('🔍 Analyzing shipment with STATE:', STATE);

            // Simulate analysis
            await new Promise(resolve => setTimeout(resolve, 1200));

            button.classList.remove('loading');
            if (textEl) textEl.style.display = 'inline';
            if (iconEl) iconEl.style.display = 'inline';
            if (loaderEl) loaderEl.style.display = 'none';

            console.log('✅ Analysis complete');
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================

    async function init() {
        console.log('🚀 RiskCast FutureOS Overview v31 initializing...');

        // Wait for Cesium to load with retry mechanism
        let cesiumRetries = 0;
        const maxRetries = 10;
        
        while (typeof Cesium === 'undefined' && cesiumRetries < maxRetries) {
            await new Promise(resolve => setTimeout(resolve, 100));
            cesiumRetries++;
        }

        if (typeof Cesium === 'undefined') {
            console.error('❌ Cesium not loaded after', maxRetries * 100, 'ms');
            const errorEl = document.getElementById('globeError');
            const loadingEl = document.getElementById('globeLoading');
            if (loadingEl) loadingEl.style.display = 'none';
            if (errorEl) {
                errorEl.style.display = 'flex';
                errorEl.querySelector('p').textContent = 'Failed to load Cesium library. Please refresh the page.';
            }
            return;
        }

        console.log('✅ Cesium loaded successfully');

        // Hydrate UI with STATE (merge with shipmentData if available)
        if (typeof shipmentData !== 'undefined' && shipmentData && Object.keys(shipmentData).length > 0) {
            console.log('📦 Merging shipment data into STATE:', shipmentData);
            // Merge shipment data into STATE
            if (shipmentData.transport_mode) {
                STATE.transport.mode = shipmentData.transport_mode.replace('_fcl', '').replace('_lcl', '').replace('_', '') || 'ocean';
            }
            if (shipmentData.etd) STATE.transport.etd = shipmentData.etd;
            if (shipmentData.eta) STATE.transport.eta = shipmentData.eta;
            if (shipmentData.cargo_type) STATE.cargo.type = shipmentData.cargo_type;
            if (shipmentData.cargo_value) STATE.cargo.value = `$${parseFloat(shipmentData.cargo_value).toLocaleString()}`;
            if (shipmentData.seller) STATE.parties.seller = shipmentData.seller;
            if (shipmentData.buyer) STATE.parties.buyer = shipmentData.buyer;
            if (shipmentData.incoterm) STATE.parties.incoterms = shipmentData.incoterm;
            
            // Update POL/POD if available
            const polCode = shipmentData.pol_code || shipmentData.origin;
            const podCode = shipmentData.pod_code || shipmentData.destination;
            if (polCode || podCode) {
                // Port info will be set from overview_state_json bootstrap
                console.log('📍 POL:', polCode, 'POD:', podCode);
            }
        }

        hydrateUI();

        // Initialize Cesium Globe
        await initCesiumGlobe();

        // Initialize Mini Map (check for Leaflet)
        if (typeof L !== 'undefined') {
            initMiniMap();
        } else {
            console.warn('⚠️ Leaflet not loaded, mini map will not initialize');
        }

        // Initialize inline editing
        initInlineEditing();

        // Render segments
        renderSegments();

        // Initialize controls
        initGlobeControls();

        // Initialize analyze button
        initAnalyzeButton();

        console.log('✅ RiskCast FutureOS Overview v31 ready!');
    }

    function hydrateUI() {
        // Transport
        const modeMap = {
            ocean: 'Ocean Freight',
            air: 'Air Freight',
            truck: 'Truck',
            rail: 'Rail'
        };
        
        const displayMode = document.getElementById('displayMode');
        const editMode = document.getElementById('editMode');
        if (displayMode) displayMode.textContent = modeMap[STATE.transport.mode] || 'Ocean Freight';
        if (editMode) editMode.value = STATE.transport.mode || 'ocean';
        
        const displayPOL = document.getElementById('displayPOL');
        const editPOL = document.getElementById('editPOL');
        if (displayPOL && STATE.transport.pol) {
            displayPOL.textContent = `${STATE.transport.pol.name}, ${STATE.transport.pol.country} (${STATE.transport.pol.code})`;
        }
        if (editPOL && STATE.transport.pol) editPOL.value = STATE.transport.pol.name;
        
        const displayPOD = document.getElementById('displayPOD');
        const editPOD = document.getElementById('editPOD');
        if (displayPOD && STATE.transport.pod) {
            displayPOD.textContent = `${STATE.transport.pod.name}, ${STATE.transport.pod.country} (${STATE.transport.pod.code})`;
        }
        if (editPOD && STATE.transport.pod) editPOD.value = STATE.transport.pod.name;
        
        const displayETD = document.getElementById('displayETD');
        const editETD = document.getElementById('editETD');
        if (displayETD) displayETD.textContent = STATE.transport.etd || '2025-12-10';
        if (editETD) editETD.value = STATE.transport.etd || '2025-12-10';
        
        const displayETA = document.getElementById('displayETA');
        const editETA = document.getElementById('editETA');
        if (displayETA) displayETA.textContent = STATE.transport.eta || '2025-12-25';
        if (editETA) editETA.value = STATE.transport.eta || '2025-12-25';

        calculateTransitDays();

        // Cargo
        const displayCargoType = document.getElementById('displayCargoType');
        const editCargoType = document.getElementById('editCargoType');
        if (displayCargoType) displayCargoType.textContent = STATE.cargo.type || 'Electronics';
        if (editCargoType) editCargoType.value = STATE.cargo.type || 'Electronics';
        
        const displayHSCode = document.getElementById('displayHSCode');
        const editHSCode = document.getElementById('editHSCode');
        if (displayHSCode) displayHSCode.textContent = STATE.cargo.hsCode || '8471.30';
        if (editHSCode) editHSCode.value = STATE.cargo.hsCode || '8471.30';
        
        const displayQuantity = document.getElementById('displayQuantity');
        const editQuantity = document.getElementById('editQuantity');
        if (displayQuantity) displayQuantity.textContent = STATE.cargo.quantity || '2 x 40\' HC';
        if (editQuantity) editQuantity.value = STATE.cargo.quantity || '2 x 40\' HC';
        
        const displayWeight = document.getElementById('displayWeight');
        const editWeight = document.getElementById('editWeight');
        if (displayWeight) displayWeight.textContent = STATE.cargo.weight || '24,000 kg';
        if (editWeight) editWeight.value = STATE.cargo.weight || '24,000 kg';
        
        const displayValue = document.getElementById('displayValue');
        const editValue = document.getElementById('editValue');
        if (displayValue) displayValue.textContent = STATE.cargo.value || '$150,000';
        if (editValue) editValue.value = STATE.cargo.value || '$150,000';

        // Parties
        const displaySeller = document.getElementById('displaySeller');
        const editSeller = document.getElementById('editSeller');
        if (displaySeller) displaySeller.textContent = STATE.parties.seller || 'VN Tech Export Ltd.';
        if (editSeller) editSeller.value = STATE.parties.seller || 'VN Tech Export Ltd.';
        
        const displayBuyer = document.getElementById('displayBuyer');
        const editBuyer = document.getElementById('editBuyer');
        if (displayBuyer) displayBuyer.textContent = STATE.parties.buyer || 'Shanghai Electronics Co.';
        if (editBuyer) editBuyer.value = STATE.parties.buyer || 'Shanghai Electronics Co.';
        
        const displayIncoterms = document.getElementById('displayIncoterms');
        const editIncoterms = document.getElementById('editIncoterms');
        if (displayIncoterms) displayIncoterms.textContent = STATE.parties.incoterms || 'FOB';
        if (editIncoterms) editIncoterms.value = STATE.parties.incoterms || 'FOB';
        
        const displayPaymentTerms = document.getElementById('displayPaymentTerms');
        const editPaymentTerms = document.getElementById('editPaymentTerms');
        if (displayPaymentTerms) displayPaymentTerms.textContent = STATE.parties.paymentTerms || 'L/C at sight';
        if (editPaymentTerms) editPaymentTerms.value = STATE.parties.paymentTerms || 'L/C at sight';
    }

    // Start initialization when DOM is ready and Cesium is loaded
    document.addEventListener('DOMContentLoaded', () => {
        // Wait a bit for Cesium script to load
        setTimeout(() => {
            init();
        }, 100);
    });

})();