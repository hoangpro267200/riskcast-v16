// ========================================
// RISKCAST FutureOS - Overview Page v34.4 Ultra Vision Pro
// JavaScript Implementation (Upgraded from v34.3)
// ========================================

(function() {
    'use strict';

    // ========================================
    // STATE MANAGEMENT
    // ========================================
    
    let state = {
        transport: {},
        cargo: {},
        parties: {},
        risk: {},
        routeLegs: [],
        editMode: false
    };

    // ========================================
    // INITIALIZATION
    // ========================================
    
    document.addEventListener('DOMContentLoaded', function() {
        initializeApp();
    });

    function initializeApp() {
        console.log('[Overview v34.4] Initializing application...');
        
        // Load state first
        loadState();
        
        // Populate UI with loaded state
        populateUI(state);
        
        // Populate route legs
        populateRouteLegs(state);
        
        // Initialize Cesium (with delay to ensure DOM is ready)
        setTimeout(() => {
            initCesium(document.getElementById('cesiumContainer'), state);
        }, 500);
        
        // Initialize event listeners
        initEventListeners();
        
        // Initialize Smart Edit Mode
        initSmartEditMode();
        
        // Initialize AI Assist
        initAIAssist();
        
        // Animate on load
        animateOnLoad();
        
        console.log('[Overview v34.4] Application initialized successfully');
    }

    // ========================================
    // DATA LOADING & MERGING
    // ========================================
    
    function loadState() {
        const injectedState = window.__RISKCAST_STATE__ || {};
        const logisticsData = window.LOGISTICS_DATA || {};
        
        console.log('[Overview v34.4] Injected state:', injectedState);
        console.log('[Overview v34.4] LOGISTICS_DATA available:', !!logisticsData);
        
        // Reset fields but keep the same state reference
        state.transport = {};
        state.cargo = {};
        state.parties = {};
        state.risk = {};
        state.routeLegs = [];
        state.editMode = false;

        // Merge injected state (transport / cargo / parties / risk)
        if (injectedState.transport) {
            state.transport = { ...injectedState.transport };
        }
        if (injectedState.cargo) {
            state.cargo = { ...injectedState.cargo };
        }
        if (injectedState.parties) {
            state.parties = { ...injectedState.parties };
        }
        if (injectedState.risk) {
            state.risk = { ...injectedState.risk };
        }
        
        // If routeLegs already exist in injected state, use them
        if (injectedState.routeLegs && Array.isArray(injectedState.routeLegs) && injectedState.routeLegs.length > 0) {
            state.routeLegs = [...injectedState.routeLegs];
            console.log('[Overview v34.4] Using routeLegs from injected state:', state.routeLegs.length);
        }

        // Extract tradeLane from injected state
        const tradeLane = state.transport.tradeLane || injectedState.transport?.tradeLane || 'vn_cn';
        console.log('[Overview v34.4] Trade lane:', tradeLane);

        // If routeLegs is empty, build from LOGISTICS_DATA
        if ((!state.routeLegs || state.routeLegs.length === 0) && tradeLane && logisticsData.routes && logisticsData.routes[tradeLane]) {
            const route = logisticsData.routes[tradeLane];
            console.log('[Overview v34.4] Found route in LOGISTICS_DATA:', route.name);
            
            // Find matching transport mode or use default
            let defaultMode = null;
            if (route.transport_modes && route.transport_modes.length > 0) {
                // Try to match by transport mode value from injected state
                const modeValue = state.transport.mode ? 
                    state.transport.mode.toLowerCase().replace(/\s+/g, '_') : null;
                
                if (modeValue) {
                    defaultMode = route.transport_modes.find(m => 
                        m.value === modeValue || 
                        m.value.includes(modeValue) ||
                        modeValue.includes(m.value.split('_')[0])
                    );
                }
                
                // Fallback to default mode
                if (!defaultMode) {
                    defaultMode = route.transport_modes.find(m => m.default) || route.transport_modes[0];
                }
                
                console.log('[Overview v34.4] Selected transport mode:', defaultMode.label);
                
                // Update transport mode info
                if (defaultMode) {
                    if (!state.transport.mode || state.transport.mode === '-') {
                        state.transport.mode = defaultMode.label || defaultMode.label_en || 'Transport';
                    }
                    state.transport.modeValue = defaultMode.value;
                    
                    // Extract vessel name from carriers if available
                    const carriers = logisticsData.carriersByRoute ? 
                        logisticsData.carriersByRoute[tradeLane] : null;
                    if (carriers && carriers.length > 0 && (!state.transport.vesselName || state.transport.vesselName === '-')) {
                        state.transport.vesselName = carriers[0].name || '-';
                    }
                    
                    // Generate route legs from defaultMode.routes
                    if (defaultMode.routes && defaultMode.routes.length > 0) {
                        let totalDist = 0;
                        const legs = [];
                        
                        defaultMode.routes.forEach((r, idx) => {
                            if (r.km) {
                                totalDist += r.km;
                            }
                            
                            const modeIcon = getModeIcon(defaultMode.value);
                            
                            legs.push({
                                mode: defaultMode.value,
                                icon: modeIcon,
                                from: r.pol || state.transport.pol || '',
                                fromCode: r.pol_code || state.transport.polCode || '',
                                to: r.pod || state.transport.pod || '',
                                toCode: r.pod_code || state.transport.podCode || '',
                                distance: r.km ? `${Number(r.km).toLocaleString()} km` : '0 km',
                                modeText: defaultMode.label || defaultMode.label_en || 'Transport',
                                step: idx + 1,
                                lat1: null,  // Will be populated from port database
                                lon1: null,
                                lat2: null,
                                lon2: null
                            });
                        });
                        
                        if (legs.length > 0) {
                            state.routeLegs = legs;
                            state.transport.segmentCount = legs.length;
                            state.transport.totalDistance = `${Number(totalDist).toLocaleString()} km`;
                            console.log('[Overview v34.4] Generated', legs.length, 'route legs, total distance:', state.transport.totalDistance);
                        }
                    }
                    
                    // Update risk from logistics data if not set
                    if (defaultMode.risk_score && (!state.risk.score || state.risk.score === 0)) {
                        state.risk.score = Math.round(defaultMode.risk_score * 10);
                    }
                    if (defaultMode.risk_level && (!state.risk.weatherRisk || state.risk.weatherRisk === '-')) {
                        state.risk.weatherRisk = capitalizeFirst(defaultMode.risk_level);
                    }
                }
            }
        }

        // Fallback defaults
        if (!state.transport.mode || state.transport.mode === '-') {
            state.transport.mode = 'Ocean Freight';
        }
        if (!state.transport.vesselName || state.transport.vesselName === '-') {
            state.transport.vesselName = 'TBA';
        }
        if (state.risk.score == null || state.risk.score === 0) {
            state.risk.score = 7.2;
        }
        if (!state.risk.weatherRisk || state.risk.weatherRisk === '-') {
            state.risk.weatherRisk = 'Moderate';
        }
        
        console.log('[Overview v34.4] Final merged state:', state);
        if (!state.risk.congestion || state.risk.congestion === '-') {
            state.risk.congestion = 'Low';
        }
        if (!state.risk.delayProb || state.risk.delayProb === '-') {
            state.risk.delayProb = '15%';
        }
        
        console.log('[Overview v34.4] Final state:', state);
    }

    function getModeIcon(modeValue) {
        if (!modeValue) return '🚢';
        const m = String(modeValue).toLowerCase();
        if (m.startsWith('ocean') || m.startsWith('sea') || m.includes('vessel')) return '🚢';
        if (m.startsWith('air') || m.includes('air')) return '✈️';
        if (m.startsWith('road') || m.includes('truck') || m.includes('road')) return '🚚';
        if (m.startsWith('rail') || m.includes('rail')) return '🚂';
        return '🚢';
    }

    function capitalizeFirst(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    // ========================================
    // UI POPULATION
    // ========================================
    
    function populateUI(state) {
        if (!state) {
            console.warn('[Overview v34.4] No state provided to populateUI');
            return;
        }

        console.log('[Overview v34.4] Populating UI with state:', state);

        // Transport Details
        safeSetContent('transportMode', state.transport.mode || '-');
        safeSetContent('vesselName', state.transport.vesselName || '-');
        safeSetContent('pol', state.transport.pol || '-');
        safeSetContent('pod', state.transport.pod || '-');
        safeSetContent('totalDistance', state.transport.totalDistance || '0 km');
        safeSetContent('segmentCount', state.transport.segmentCount ? String(state.transport.segmentCount) : '0');

        // Cargo Details
        safeSetContent('commodity', state.cargo.commodity || '-');
        safeSetContent('cargoWeight', state.cargo.weight || '-');
        safeSetContent('cargoVolume', state.cargo.volume || '-');
        safeSetContent('containerType', state.cargo.containerType || '-');
        safeSetContent('hsCode', state.cargo.hsCode || '-');

        // Parties
        safeSetContent('shipper', state.parties.shipper || '-');
        safeSetContent('consignee', state.parties.consignee || '-');
        safeSetContent('forwarder', state.parties.forwarder || '-');

        // Risk Assessment
        const riskScore = state.risk.score || 0;
        updateRiskGauge(riskScore);
        safeSetContent('weatherRisk', state.risk.weatherRisk || '-');
        safeSetContent('congestion', state.risk.congestion || '-');
        safeSetContent('delayProb', state.risk.delayProb || '-');

        console.log('[Overview v34.4] UI populated successfully');
    }

    function safeSetContent(id, value) {
        const element = document.getElementById(id);
        if (!element) return;
        if (value === undefined || value === null) {
            element.textContent = '';
        } else {
            element.textContent = value;
        }
    }

    function updateRiskGauge(score) {
        const riskScoreElement = document.getElementById('riskScore');
        const gaugeProgress = document.querySelector('.rc-gauge-progress');
        
        const numScore = typeof score === 'number'
            ? score
            : (score ? parseFloat(score) : 0);

        const bounded = isNaN(numScore) ? 0 : Math.max(0, Math.min(100, numScore));
        
        if (riskScoreElement) {
            riskScoreElement.textContent = bounded.toString();
        }
        
        if (gaugeProgress) {
            const circumference = 502.65;
            const offset = bounded > 0
                ? circumference - (bounded / 100) * circumference
                : circumference;
            gaugeProgress.style.strokeDashoffset = offset;
            
            // Change color based on risk level
            if (bounded < 30) {
                gaugeProgress.style.stroke = '#00FF9D';
            } else if (bounded < 60) {
                gaugeProgress.style.stroke = '#FFD65A';
            } else {
                gaugeProgress.style.stroke = '#FF4757';
            }
        }
    }

    // ========================================
    // ROUTE LEGS POPULATION
    // ========================================
    
    function populateRouteLegs(state) {
        const container = document.getElementById('routeLegsContainer');
        if (!container) return;

        container.innerHTML = '';

        if (!state.routeLegs || state.routeLegs.length === 0) {
            container.innerHTML =
                '<p style="text-align: center; color: #94A3B8; padding: 40px;">No route legs available</p>';
            return;
        }

        state.routeLegs.forEach((leg, index) => {
            const item = createRouteLegElement(leg, index);
            container.appendChild(item);
        });
    }

    function createRouteLegElement(leg, index) {
        const div = document.createElement('div');
        div.className = 'rc-activity-item';
        div.style.animationDelay = `${index * 0.05}s`;

        const icon = leg.icon || getModeIcon(leg.mode);
        const from = leg.from || '';
        const to = leg.to || '';
        const fromCode = leg.fromCode || '';
        const toCode = leg.toCode || '';
        const distance = leg.distance || 'N/A';
        const modeText = leg.modeText || 'Transport';
        const step = leg.step || index + 1;

        div.innerHTML = `
            <div class="rc-activity-icon">${icon}</div>
            <div class="rc-activity-route">
                <div class="rc-activity-route-text">${from} → ${to}</div>
                <div class="rc-activity-route-meta">${fromCode} → ${toCode}</div>
            </div>
            <div class="rc-activity-distance">${distance}</div>
            <div class="rc-activity-mode">${modeText}</div>
            <div class="rc-activity-step">${step}</div>
        `;

        return div;
    }

    // ========================================
    // CESIUM INITIALIZATION
    // ========================================
    
    let cesiumViewer = null;
    
    function initCesium(container, state) {
        if (!container) {
            console.error('[Overview v34.4] Cesium container not found');
            return;
        }

        // Wait for Cesium to load
        if (typeof Cesium === 'undefined') {
            console.warn('[Overview v34.4] Cesium not loaded yet, retrying...');
            setTimeout(() => initCesium(container, state), 500);
            return;
        }

        try {
            // Set Cesium base URL
            window.CESIUM_BASE_URL = "/static/cesium/";
            if (Cesium.buildModuleUrl) {
                Cesium.buildModuleUrl.setBaseUrl("/static/cesium/");
            }

            // Disable Ion
            if (Cesium.Ion) {
                Cesium.Ion.defaultAccessToken = "";
            }

            // Create viewer
            cesiumViewer = new Cesium.Viewer(container, {
                baseLayerPicker: false,
                geocoder: false,
                timeline: false,
                animation: false,
                selectionIndicator: false,
                infoBox: false,
                scene3DOnly: false,
                shadows: true,
                terrainProvider: new Cesium.EllipsoidTerrainProvider(),
                imageryProvider: new Cesium.OpenStreetMapImageryProvider({
                    url: "https://tile.openstreetmap.org/"
                }),
                requestRenderMode: true,
                maximumRenderTimeChange: Infinity
            });

            // Configure dark premium styling
            cesiumViewer.scene.backgroundColor = Cesium.Color.fromCssColorString('#0a0e27');
            cesiumViewer.scene.globe.enableLighting = true;
            cesiumViewer.scene.globe.depthTestAgainstTerrain = false;
            cesiumViewer.scene.globe.atmosphereLightIntensity = 0.3;
            cesiumViewer.scene.globe.baseColor = Cesium.Color.fromCssColorString('#1a1f3a');
            cesiumViewer.scene.skyAtmosphere.show = true;
            cesiumViewer.scene.skyAtmosphere.hueShift = -0.5;
            cesiumViewer.scene.skyAtmosphere.saturationShift = -0.5;
            cesiumViewer.scene.skyAtmosphere.brightnessShift = -0.3;
            cesiumViewer.scene.fog.enabled = true;
            cesiumViewer.scene.fog.density = 0.0002;

            console.log('[Overview v34.4] Cesium viewer initialized');

            // Draw route and fit camera
            if (state.routeLegs && state.routeLegs.length > 0) {
                drawRouteOnGlobe(state.routeLegs);
                fitCameraToRoute(state.routeLegs);
            }
        } catch (error) {
            console.error('[Overview v34.4] Failed to initialize Cesium:', error);
        }
    }

    function drawRouteOnGlobe(routeLegs) {
        if (!cesiumViewer || !routeLegs || routeLegs.length === 0) return;

        routeLegs.forEach((leg, index) => {
            // Get port coordinates
            let lat1 = leg.lat1, lon1 = leg.lon1;
            let lat2 = leg.lat2, lon2 = leg.lon2;

            // Try to get from port database
            if (!lat1 || !lon1) {
                const coords = getPortCoordinates(leg.fromCode);
                if (coords) {
                    lat1 = coords.lat;
                    lon1 = coords.lon;
                }
            }
            if (!lat2 || !lon2) {
                const coords = getPortCoordinates(leg.toCode);
                if (coords) {
                    lat2 = coords.lat;
                    lon2 = coords.lon;
                }
            }

            if (lat1 && lon1 && lat2 && lon2) {
                const start = Cesium.Cartesian3.fromDegrees(lon1, lat1);
                const end = Cesium.Cartesian3.fromDegrees(lon2, lat2);

                // Create arc path
                const distance = Cesium.Cartesian3.distance(start, end);
                const arcHeight = distance * 0.1;
                const numPoints = 20;
                const arcPositions = [];

                for (let i = 0; i <= numPoints; i++) {
                    const t = i / numPoints;
                    const cartesian = Cesium.Cartesian3.lerp(start, end, t, new Cesium.Cartesian3());
                    const cartographic = Cesium.Cartographic.fromCartesian(cartesian);
                    cartographic.height = arcHeight * Math.sin(Math.PI * t);
                    arcPositions.push(Cesium.Cartesian3.fromRadians(
                        cartographic.longitude,
                        cartographic.latitude,
                        cartographic.height
                    ));
                }

                // Draw yellow arc
                cesiumViewer.entities.add({
                    name: `${leg.from} → ${leg.to}`,
                    polyline: {
                        positions: arcPositions,
                        width: 4,
                        material: new Cesium.PolylineGlowMaterialProperty({
                            glowPower: 0.25,
                            color: Cesium.Color.YELLOW
                        }),
                        clampToGround: false,
                        arcType: Cesium.ArcType.GEODESIC
                    }
                });

                // Add port markers
                if (index === 0) {
                    cesiumViewer.entities.add({
                        position: start,
                        point: {
                            pixelSize: 20,
                            color: Cesium.Color.fromCssColorString('#fbbf24'),
                            outlineColor: Cesium.Color.fromCssColorString('#fbbf24').withAlpha(0.3),
                            outlineWidth: 15
                        },
                        label: {
                            text: leg.from,
                            font: '16px sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 3,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -30)
                        }
                    });
                }

                if (index === routeLegs.length - 1) {
                    cesiumViewer.entities.add({
                        position: end,
                        point: {
                            pixelSize: 20,
                            color: Cesium.Color.fromCssColorString('#06b6d4'),
                            outlineColor: Cesium.Color.fromCssColorString('#06b6d4').withAlpha(0.3),
                            outlineWidth: 15
                        },
                        label: {
                            text: leg.to,
                            font: '16px sans-serif',
                            fillColor: Cesium.Color.WHITE,
                            outlineColor: Cesium.Color.BLACK,
                            outlineWidth: 3,
                            style: Cesium.LabelStyle.FILL_AND_OUTLINE,
                            verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
                            pixelOffset: new Cesium.Cartesian2(0, -30)
                        }
                    });
                }
            }
        });

        console.log('[Overview v34.4] Route drawn on globe');
    }

    function fitCameraToRoute(routeLegs) {
        if (!cesiumViewer || !routeLegs || routeLegs.length === 0) return;

        // Collect all positions
        const positions = [];
        let totalDistance = 0;

        routeLegs.forEach(leg => {
            let lat1 = leg.lat1, lon1 = leg.lon1;
            let lat2 = leg.lat2, lon2 = leg.lon2;

            if (!lat1 || !lon1) {
                const coords = getPortCoordinates(leg.fromCode);
                if (coords) {
                    lat1 = coords.lat;
                    lon1 = coords.lon;
                }
            }
            if (!lat2 || !lon2) {
                const coords = getPortCoordinates(leg.toCode);
                if (coords) {
                    lat2 = coords.lat;
                    lon2 = coords.lon;
                }
            }

            if (lat1 && lon1) positions.push(Cesium.Cartesian3.fromDegrees(lon1, lat1));
            if (lat2 && lon2) positions.push(Cesium.Cartesian3.fromDegrees(lon2, lat2));

            // Calculate distance
            const distStr = leg.distance || '0 km';
            const dist = parseFloat(String(distStr).replace(/[^\d.]/g, ''));
            if (!isNaN(dist)) totalDistance += dist;
        });

        if (positions.length === 0) return;

        // Calculate bounding sphere
        const boundingSphere = Cesium.BoundingSphere.fromPoints(positions);

        // Determine camera altitude and pitch based on total distance
        let altitude, pitch;
        if (totalDistance > 10000) {
            // SEA View (long distance)
            altitude = 20000000;
            pitch = Cesium.Math.toRadians(-60);
        } else if (totalDistance > 4000) {
            // AIR View (medium-long distance)
            altitude = 12000000;
            pitch = Cesium.Math.toRadians(-50);
        } else if (totalDistance > 1000) {
            // RAIL View (medium distance)
            altitude = 6000000;
            pitch = Cesium.Math.toRadians(-40);
        } else {
            // ROAD/TRUCK View (short distance)
            altitude = 3000000;
            pitch = Cesium.Math.toRadians(-30);
        }

        // Fly to route using bounding sphere center
        cesiumViewer.camera.flyTo({
            destination: boundingSphere.center,
            orientation: {
                heading: Cesium.Math.toRadians(0),
                pitch: pitch,
                roll: 0
            },
            duration: 2.0,
            complete: function() {
                // Move camera back to show full route
                const distance = boundingSphere.radius * 3;
                cesiumViewer.camera.moveBackward(distance);
                console.log('[Overview v34.4] Camera fitted to route (distance:', totalDistance, 'km, altitude:', altitude, ')');
            }
        });
    }

    // ========================================
    // SMART ADAPTIVE CAMERA & ROUTE ENGINE
    // ========================================
    
    function fitRouteToView(routeLegs) {
        if (!routeLegs || routeLegs.length === 0) {
            return {
                center: { lat: 0, lng: 0 },
                altitude: 15000000,
                pitch: -45
            };
        }

        // Calculate total distance
        let totalDistance = 0;
        routeLegs.forEach(leg => {
            const distStr = leg.distance || '0 km';
            const dist = parseFloat(String(distStr).replace(/[^\d.]/g, ''));
            if (!isNaN(dist)) {
                totalDistance += dist;
            }
        });

        // Get ports for bounding box calculation
        const ports = getPortsFromLegs(routeLegs);
        if (ports.length === 0) {
            return {
                center: { lat: 0, lng: 0 },
                altitude: 15000000,
                pitch: -45
            };
        }

        // Calculate bounding box
        let minLat = 90, maxLat = -90, minLng = 180, maxLng = -180;
        ports.forEach(port => {
            if (typeof port.lat === 'number' && typeof port.lng === 'number') {
                if (port.lat < minLat) minLat = port.lat;
                if (port.lat > maxLat) maxLat = port.lat;
                if (port.lng < minLng) minLng = port.lng;
                if (port.lng > maxLng) maxLng = port.lng;
            }
        });

        // Calculate center
        const centerLat = (minLat + maxLat) / 2;
        const centerLng = (minLng + maxLng) / 2;

        // Classify view based on distance
        let altitude, pitch;
        if (totalDistance > 10000) {
            // SEA View (long distance)
            altitude = 20000000;
            pitch = -60;
        } else if (totalDistance > 4000) {
            // AIR View (medium-long distance)
            altitude = 12000000;
            pitch = -50;
        } else if (totalDistance > 1000) {
            // RAIL View (medium distance)
            altitude = 6000000;
            pitch = -40;
        } else {
            // ROAD/TRUCK View (short distance)
            altitude = 3000000;
            pitch = -30;
        }

        return {
            center: { lat: centerLat, lng: centerLng },
            altitude: altitude,
            pitch: pitch,
            totalDistance: totalDistance
        };
    }

    function getPortsFromLegs(routeLegs) {
        const portsList = [];

        routeLegs.forEach(leg => {
            if (leg.fromCode) {
                const coords = getPortCoordinates(leg.fromCode);
                if (coords) {
                    portsList.push({ ...coords, code: leg.fromCode, name: leg.from });
                }
            }
            if (leg.toCode) {
                const coords = getPortCoordinates(leg.toCode);
                if (coords) {
                    portsList.push({ ...coords, code: leg.toCode, name: leg.to });
                }
            }
        });

        return portsList;
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================
    
    function initEventListeners() {
        // Get elements
        const zoomIn = document.getElementById('zoomIn');
        const zoomOut = document.getElementById('zoomOut');
        const resetView = document.getElementById('resetViewBtn');

        // Reset view button
        if (resetView) {
            resetView.addEventListener('click', () => {
                console.log('[Overview v34.4] Reset view');
                if (cesiumViewer && state.routeLegs && state.routeLegs.length > 0) {
                    fitCameraToRoute(state.routeLegs);
                }
            });
        }

        // Zoom controls
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                if (cesiumViewer && cesiumViewer.camera) {
                    cesiumViewer.camera.zoomIn(1000000);
                }
            });
        }

        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                if (cesiumViewer && cesiumViewer.camera) {
                    cesiumViewer.camera.zoomOut(1000000);
                }
            });
        }

        // View toggle (3D/2D) - setup after Cesium is initialized
        const viewBtns = document.querySelectorAll('.rc-view-btn');
        if (viewBtns && viewBtns.length > 0) {
            viewBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active from all buttons
                    viewBtns.forEach(b => b.classList.remove('active'));
                    // Add active to clicked button
                    this.classList.add('active');
                    const view = this.dataset.view;
                    
                    // Only apply Cesium morph if viewer is ready
                    if (cesiumViewer && cesiumViewer.scene) {
                        if (view === '2d') {
                            cesiumViewer.scene.morphTo2D(1.0);
                        } else if (view === '3d') {
                            cesiumViewer.scene.morphTo3D(1.0);
                        }
                    }
                    console.log('[Overview v34.4] View changed to:', view);
                });
            });
        }

        // Coordinate update (simulate)
        updateCoordinates();
        setInterval(updateCoordinates, 2000);
    }

    function updateCoordinates() {
        const coordX = document.getElementById('coordX');
        const coordY = document.getElementById('coordY');
        
        if (coordX && coordY) {
            const x = (Math.random() * 10 - 5).toFixed(6);
            const y = (Math.random() * 180 - 90).toFixed(6);
            coordX.textContent = x;
            coordY.textContent = y;
        }
    }

    // ========================================
    // SMART EDIT MODE
    // ========================================
    
    function initSmartEditMode() {
        const editToggle = document.getElementById('editToggle');
        const editableFields = document.querySelectorAll('.editable');

        if (!editToggle) {
            console.warn('[Overview v34.4] Edit toggle not found');
            return;
        }

        editToggle.addEventListener('click', function() {
            state.editMode = !state.editMode;
            
            if (state.editMode) {
                this.classList.add('active');
                editableFields.forEach(field => {
                    field.setAttribute('contenteditable', 'true');
                    field.style.cursor = 'text';
                });
                console.log('[Overview v34.4] Smart Edit Mode enabled');
            } else {
                this.classList.remove('active');
                editableFields.forEach(field => {
                    field.setAttribute('contenteditable', 'false');
                    field.style.cursor = 'default';
                    field.style.boxShadow = 'none';
                    
                    // Sync edited value back to state
                    const fieldId = field.id;
                    const value = field.textContent.trim();
                    
                    // Update state based on field ID
                    if (fieldId === 'transportMode') state.transport.mode = value;
                    else if (fieldId === 'vesselName') state.transport.vesselName = value;
                    else if (fieldId === 'pol') state.transport.pol = value;
                    else if (fieldId === 'pod') state.transport.pod = value;
                    else if (fieldId === 'commodity') state.cargo.commodity = value;
                    else if (fieldId === 'cargoWeight') state.cargo.weight = value;
                    else if (fieldId === 'cargoVolume') state.cargo.volume = value;
                    else if (fieldId === 'containerType') state.cargo.containerType = value;
                    else if (fieldId === 'hsCode') state.cargo.hsCode = value;
                    else if (fieldId === 'shipper') state.parties.shipper = value;
                    else if (fieldId === 'consignee') state.parties.consignee = value;
                    else if (fieldId === 'forwarder') state.parties.forwarder = value;
                    else if (fieldId === 'weatherRisk') state.risk.weatherRisk = value;
                    else if (fieldId === 'congestion') state.risk.congestion = value;
                    else if (fieldId === 'delayProb') state.risk.delayProb = value;
                });
                console.log('[Overview v34.4] Smart Edit Mode disabled, state synced:', state);
            }
        });

        // Add glow effect on hover in edit mode
        editableFields.forEach(field => {
            field.addEventListener('mouseenter', function() {
                if (state.editMode) {
                    this.style.boxShadow = '0 0 0 2px rgba(76, 139, 255, 0.3)';
                }
            });

            field.addEventListener('mouseleave', function() {
                if (state.editMode && !this.matches(':focus')) {
                    this.style.boxShadow = 'none';
                }
            });

            field.addEventListener('focus', function() {
                if (state.editMode) {
                    this.style.boxShadow = '0 0 0 2px rgba(76, 139, 255, 0.4)';
                }
            });

            field.addEventListener('blur', function() {
                if (state.editMode) {
                    this.style.boxShadow = 'none';
                    // Sync on blur
                    const fieldId = this.id;
                    const value = this.textContent.trim();
                    if (fieldId === 'transportMode') state.transport.mode = value;
                    else if (fieldId === 'vesselName') state.transport.vesselName = value;
                    else if (fieldId === 'pol') state.transport.pol = value;
                    else if (fieldId === 'pod') state.transport.pod = value;
                    else if (fieldId === 'commodity') state.cargo.commodity = value;
                    else if (fieldId === 'cargoWeight') state.cargo.weight = value;
                    else if (fieldId === 'cargoVolume') state.cargo.volume = value;
                    else if (fieldId === 'containerType') state.cargo.containerType = value;
                    else if (fieldId === 'hsCode') state.cargo.hsCode = value;
                    else if (fieldId === 'shipper') state.parties.shipper = value;
                    else if (fieldId === 'consignee') state.parties.consignee = value;
                    else if (fieldId === 'forwarder') state.parties.forwarder = value;
                    else if (fieldId === 'weatherRisk') state.risk.weatherRisk = value;
                    else if (fieldId === 'congestion') state.risk.congestion = value;
                    else if (fieldId === 'delayProb') state.risk.delayProb = value;
                }
            });
        });
    }

    // ========================================
    // AI SMART ASSIST
    // ========================================
    
    function initAIAssist() {
        const aiAssistBtn = document.getElementById('aiAssistBtn');
        const aiPanel = document.getElementById('aiPanel');
        const aiCloseBtn = document.getElementById('aiCloseBtn');

        if (!aiAssistBtn || !aiPanel || !aiCloseBtn) return;

        aiAssistBtn.addEventListener('click', function() {
            aiPanel.classList.add('active');
        });

        aiCloseBtn.addEventListener('click', function() {
            aiPanel.classList.remove('active');
        });

        // Click outside to close
        document.addEventListener('click', function(e) {
            if (!aiPanel.contains(e.target) && !aiAssistBtn.contains(e.target)) {
                aiPanel.classList.remove('active');
            }
        });

        // AI suggestions
        const suggestions = document.querySelectorAll('.rc-ai-suggestion');
        suggestions.forEach(suggestion => {
            suggestion.addEventListener('click', function() {
                console.log('AI Suggestion clicked:', this.textContent);
                // Implement AI suggestion handling with backend/LLM later
            });
        });
    }

    // ========================================
    // ANIMATIONS
    // ========================================
    
    function animateOnLoad() {
        // Stagger animation for cards
        const cards = document.querySelectorAll('.rc-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        // Animate route legs
        const activities = document.querySelectorAll('.rc-activity-item');
        activities.forEach((activity, index) => {
            activity.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s both`;
        });
    }

    // ========================================
    // EXPORT TO WINDOW
    // ========================================
    
    window.RISKCAST = {
        state: state,
        loadState: loadState,
        populateUI: populateUI,
        populateRouteLegs: populateRouteLegs,
        fitRouteToView: fitRouteToView,
        updateRiskGauge: updateRiskGauge
    };

    console.log('✅ RISKCAST FutureOS v34.4 initialized');
    console.log('Current state:', state);
})();
