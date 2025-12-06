/**
 * ==================================================
 * RISKCAST - Overview v21 FutureOS
 * Global Route Overview with 3D Globe & Live Intelligence
 * ==================================================
 */

(function() {
    'use strict';

    // ==================================================
    // PORT COORDINATES MAP
    // ==================================================
    const PORT_COORDS = {
        // Vietnam Ports
        HPH: { lat: 20.86, lng: 106.68, name: 'Hai Phong' },
        CMP: { lat: 10.61, lng: 107.02, name: 'Cai Mep' },
        SGN: { lat: 10.77, lng: 106.70, name: 'Saigon (HCMC)' },
        DNG: { lat: 16.08, lng: 108.22, name: 'Da Nang' },
        VUT: { lat: 10.35, lng: 107.08, name: 'Vung Tau' },
        
        // US Ports
        USLAX: { lat: 33.74, lng: -118.27, name: 'Los Angeles' },
        USLGB: { lat: 33.77, lng: -118.20, name: 'Long Beach' },
        USOAK: { lat: 37.80, lng: -122.30, name: 'Oakland' },
        USSEA: { lat: 47.60, lng: -122.33, name: 'Seattle' },
        USNYC: { lat: 40.71, lng: -74.00, name: 'New York' },
        
        // China Ports
        CNSHA: { lat: 31.23, lng: 121.47, name: 'Shanghai' },
        CNSZX: { lat: 22.54, lng: 114.06, name: 'Shenzhen' },
        CNNGB: { lat: 29.87, lng: 121.55, name: 'Ningbo' },
        CNQIN: { lat: 36.07, lng: 120.38, name: 'Qingdao' },
        
        // Europe Ports
        NLRTM: { lat: 51.95, lng: 4.13, name: 'Rotterdam' },
        DEHAM: { lat: 53.55, lng: 9.99, name: 'Hamburg' },
        BEANR: { lat: 51.23, lng: 4.40, name: 'Antwerp' },
        FRLEH: { lat: 49.49, lng: 0.11, name: 'Le Havre' },
        
        // Singapore
        SGSIN: { lat: 1.29, lng: 103.85, name: 'Singapore' },
        
        // Other Asia
        JPYOK: { lat: 35.44, lng: 139.64, name: 'Yokohama' },
        KRPUS: { lat: 35.10, lng: 129.04, name: 'Busan' },
        THBKK: { lat: 13.75, lng: 100.50, name: 'Bangkok' }
    };

    // ==================================================
    // MAIN CONTROLLER
    // ==================================================
    const RISKCAST_OVERVIEW = {
        globe: null,
        currentShipment: null,
        allActivities: [],

        /**
         * Initialize the Overview page
         */
        init() {
            this.safeLog('Initializing Overview v21...');
            
            // Load shipment data
            const rawResult = this.loadResultFromLocal();
            
            if (!rawResult) {
                this.safeLog('No result found in localStorage, trying API...');
                this.fetchLatestResultFromAPI();
                return;
            }

            // Normalize and process data
            const shipment = this.normalizeResult(rawResult);
            this.currentShipment = shipment;
            this.safeLog('Loaded shipment:', shipment);

            // Initialize all components
            this.initGlobe(shipment);
            this.updateStats(shipment);
            this.updateTimeline(shipment);
            this.updateActivities(shipment);
            this.updateWeather(shipment);
            this.bindGlobeControls();
            this.bindSearchFilter();
        },

        /**
         * Safe console logging with prefix
         */
        safeLog(...args) {
            if (window && window.console && window.console.log) {
                console.log('[[RISKCAST Overview]]', ...args);
            }
        },

        /**
         * Load result from localStorage
         */
        loadResultFromLocal() {
            try {
                // Try window state first (from input_controller_v20)
        if (window.RC_STATE) {
                    this.safeLog('✓ Loaded from window.RC_STATE');
                    return window.RC_STATE;
                }

                // Try localStorage - input_controller_v20 saves as 'rc_overview_data'
                let stored = localStorage.getItem('rc_overview_data');
                if (stored) {
                    const parsed = JSON.parse(stored);
                    this.safeLog('✓ Loaded from localStorage (rc_overview_data)');
                    return parsed;
                }

                // Fallback: try old 'last_result' key for backward compatibility
                stored = localStorage.getItem('last_result');
            if (stored) {
                    const parsed = JSON.parse(stored);
                    this.safeLog('✓ Loaded from localStorage (last_result)');
                    return parsed;
                }

                return null;
            } catch (e) {
                this.safeLog('Warning: Failed to load from localStorage:', e);
                return null;
            }
        },

        /**
         * Fetch latest result from API (fallback)
         */
        async fetchLatestResultFromAPI() {
            try {
                const response = await fetch('/api/get_last_result', {
                    credentials: 'same-origin'
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data && data.result) {
                        this.safeLog('✓ Loaded from API');
                        const shipment = this.normalizeResult(data.result);
                        this.currentShipment = shipment;
                        
                        // Initialize components
                        this.initGlobe(shipment);
                        this.updateStats(shipment);
                        this.updateTimeline(shipment);
                        this.updateActivities(shipment);
                        this.updateWeather(shipment);
                        this.bindGlobeControls();
                        this.bindSearchFilter();
                        return;
                    }
                }

                this.safeLog('No data from API, keeping empty state');
            } catch (e) {
                this.safeLog('API fetch failed:', e);
            }
        },

        /**
         * Normalize result into unified shipment object
         */
        normalizeResult(rawResult) {
            // Handle data from input_controller_v20 (rc_overview_data structure)
            const transport = rawResult?.transport || {};
            const input = rawResult?.input || {};
            const result = rawResult?.result || rawResult;

            // Extract basic info - prioritize transport object from input_controller_v20
            const tradeLaneKey = transport.tradeLane || input.trade_lane || input.route || 'unknown';
            const mode = transport.mode || input.transport_mode || input.mode || 'SEA';
            const shipmentType = transport.shipmentType || input.shipment_type || 'ocean_fcl';

            // Parse POL/POD from transport object
            let polCode = '';
            let podCode = '';
            let polName = '';
            let podName = '';

            // From transport object (input_controller_v20 format)
            if (transport.pol) {
                if (typeof transport.pol === 'string') {
                    const match = transport.pol.match(/\(([A-Z]+)\)/);
                    polCode = match ? match[1] : transport.pol.toUpperCase();
                    polName = transport.pol.replace(/\s*\([A-Z]+\)/, '').trim();
                } else if (transport.pol.code) {
                    polCode = transport.pol.code.toUpperCase();
                    polName = transport.pol.name || '';
                }
            }

            if (transport.pod) {
                if (typeof transport.pod === 'string') {
                    const match = transport.pod.match(/\(([A-Z]+)\)/);
                    podCode = match ? match[1] : transport.pod.toUpperCase();
                    podName = transport.pod.replace(/\s*\([A-Z]+\)/, '').trim();
                } else if (transport.pod.code) {
                    podCode = transport.pod.code.toUpperCase();
                    podName = transport.pod.name || '';
                }
            }

            // Fallback to input object
            if (!polCode) polCode = (input.pol_code || input.origin_port || '').toUpperCase();
            if (!podCode) podCode = (input.pod_code || input.destination_port || '').toUpperCase();
            
            const pol = {
                name: polName || PORT_COORDS[polCode]?.name || input.pol_name || polCode || 'Origin Port',
                code: polCode
            };
            
            const pod = {
                name: podName || PORT_COORDS[podCode]?.name || input.pod_name || podCode || 'Destination Port',
                code: podCode
            };

            // Get dates - prioritize transport object
            const etd = transport.etd || input.etd || input.departure_date || null;
            const eta = transport.eta || input.eta || input.arrival_date || null;

            // Calculate transit days
            let transitDays = transport.transitDays || input.transit_days || result.transit_days || null;
            if (!transitDays && etd && eta) {
                const etdDate = new Date(etd);
                const etaDate = new Date(eta);
                const diffMs = etaDate - etdDate;
                transitDays = Math.round(diffMs / (1000 * 60 * 60 * 24));
            }

            // Risk score - from rawResult.riskScore or result object
            const riskScore = rawResult.riskScore ?? result.risk_score ?? result.total_risk_score ?? 0;
            const riskLevel = this.getRiskLevel(riskScore);

            // Reliability - prioritize transport object
            const reliability = transport.reliability ?? result.carrier_reliability ?? result.reliability ?? 85;

            // Weather (if available)
            const weather = {
                pol: result.weather?.pol || { tempC: null, condition: null, icon: '☀️' },
                pod: result.weather?.pod || { tempC: null, condition: null, icon: '☀️' },
                summary: result.weather?.route_summary || null
            };

            // Activities (mock for now)
            const activities = result.activities || [];

            // Trade lane label
            const tradeLaneLabel = this.getTradeLaneLabel(tradeLaneKey, pol, pod);
        
        return {
                id: result.id || rawResult.id || `RC-${Date.now().toString().slice(-6)}`,
                tradeLaneKey,
                tradeLaneLabel,
                mode: mode.toUpperCase(),
                shipmentType,
                pol,
                pod,
                etd,
                eta,
                transitDays,
                riskScore,
                riskLevel,
                reliability,
                weather,
                activities
            };
        },

        /**
         * Get risk level from score
         */
        getRiskLevel(score) {
            if (score < 30) return 'LOW';
            if (score < 60) return 'MEDIUM';
            return 'HIGH';
        },

        /**
         * Get trade lane label
         */
        getTradeLaneLabel(key, pol, pod) {
            const labels = {
                'vn_us': 'Vietnam → United States',
                'vn_cn': 'Vietnam → China',
                'vn_eu': 'Vietnam → Europe',
                'cn_us': 'China → United States',
                'cn_eu': 'China → Europe',
                'us_vn': 'United States → Vietnam'
            };
            return labels[key] || `${pol.name} → ${pod.name}`;
        },

        /**
         * Initialize Globe.gl
         */
        initGlobe(shipment) {
            // Check if Globe.gl is available
            if (typeof Globe === 'undefined') {
                this.safeLog('Globe.js not available, skipping globe render');
                const loading = document.getElementById('rc-globe-loading');
                if (loading) {
                    loading.innerHTML = '<p style="color: #94a3b8;">Globe library not loaded</p>';
                }
                return;
            }

            try {
                const globeElem = document.getElementById('rc-globe-container');
                if (!globeElem) {
                    this.safeLog('Globe container not found');
                    return;
                }

                // Build arcs data
                const arcsData = this.buildArcsData(shipment);

                // Build points data
                const pointsData = this.buildPointsData(shipment);

                // Initialize globe
                this.globe = Globe()
                    (globeElem)
                    .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
                    .backgroundColor('rgba(0,0,0,0)')
                    .arcsData(arcsData)
                    .arcColor(() => ['#3b82f6', '#22c55e'])
                    .arcStroke(1.5)
                    .arcDashLength(0.4)
                    .arcDashGap(0.2)
                    .arcDashInitialGap(() => Math.random())
                    .arcDashAnimateTime(4000)
                    .pointsData(pointsData)
                    .pointColor(() => '#f59e0b')
                    .pointAltitude(0.01)
                    .pointRadius(0.3);

                // Enable controls
                this.globe.controls().autoRotate = true;
                this.globe.controls().autoRotateSpeed = 0.5;
                this.globe.controls().enableZoom = true;

                // Set initial view
                if (arcsData.length > 0) {
                    const firstArc = arcsData[0];
                    setTimeout(() => {
                        this.globe.pointOfView({
                            lat: (firstArc.startLat + firstArc.endLat) / 2,
                            lng: (firstArc.startLng + firstArc.endLng) / 2,
                            altitude: 2.5
                        }, 2000);
                    }, 1000);
                }

                // Hide loading
                setTimeout(() => {
                    const loading = document.getElementById('rc-globe-loading');
                    if (loading) loading.classList.add('hidden');
                }, 1500);

                // Update globe chip
                this.updateGlobeChip(shipment);

                this.safeLog('✓ Globe initialized');
            } catch (error) {
                this.safeLog('Error initializing globe:', error);
                const loading = document.getElementById('rc-globe-loading');
                if (loading) {
                    loading.innerHTML = '<p style="color: #ef4444;">Failed to load globe</p>';
                }
            }
        },

        /**
         * Build arcs data for globe
         */
        buildArcsData(shipment) {
            const arcs = [];
            
            const polCoords = PORT_COORDS[shipment.pol.code];
            const podCoords = PORT_COORDS[shipment.pod.code];

            if (polCoords && podCoords) {
                arcs.push({
                    startLat: polCoords.lat,
                    startLng: polCoords.lng,
                    endLat: podCoords.lat,
                    endLng: podCoords.lng
                });
            }

            return arcs;
        },

        /**
         * Build points data for globe
         */
        buildPointsData(shipment) {
            const points = [];
            
            const polCoords = PORT_COORDS[shipment.pol.code];
            const podCoords = PORT_COORDS[shipment.pod.code];

            if (polCoords) {
                points.push({ lat: polCoords.lat, lng: polCoords.lng, name: shipment.pol.name });
            }

            if (podCoords) {
                points.push({ lat: podCoords.lat, lng: podCoords.lng, name: shipment.pod.name });
            }

            return points;
        },

        /**
         * Update globe chip
         */
        updateGlobeChip(shipment) {
            const chipRoute = document.getElementById('rc-globe-chip-route');
            const chipMode = document.getElementById('rc-globe-chip-mode');

            if (chipRoute) {
                chipRoute.textContent = shipment.tradeLaneLabel;
            }

            if (chipMode) {
                const modeLabels = {
                    'SEA': 'Sea Freight',
                    'AIR': 'Air Freight',
                    'ROAD': 'Road Transport',
                    'RAIL': 'Rail Transport'
                };
                const modeText = modeLabels[shipment.mode] || shipment.mode;
                const typeText = shipment.shipmentType.includes('fcl') ? ' — FCL' : 
                               shipment.shipmentType.includes('lcl') ? ' — LCL' : '';
                chipMode.textContent = modeText + typeText;
            }
        },

        /**
         * Bind globe controls (3D/2D toggle, zoom)
         */
        bindGlobeControls() {
            // View toggle buttons
            const toggleBtns = document.querySelectorAll('.rc-globe-toggle-btn');
            toggleBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const mode = btn.getAttribute('data-mode');
                    
                    // Update active state
                    toggleBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');

                    // Apply view mode
                    if (this.globe) {
                        if (mode === '3d') {
                            this.globe.controls().autoRotate = true;
                            this.globe.pointOfView({ altitude: 2.5 }, 1000);
        } else {
                            this.globe.controls().autoRotate = false;
                            this.globe.pointOfView({ altitude: 3.5, lat: 20, lng: 0 }, 1000);
                        }
                    }
                });
            });

            // Zoom controls
            const zoomIn = document.getElementById('rc-zoom-in');
            const zoomOut = document.getElementById('rc-zoom-out');

            if (zoomIn && this.globe) {
                zoomIn.addEventListener('click', () => {
                    const pov = this.globe.pointOfView();
                    this.globe.pointOfView({ 
                        altitude: Math.max(pov.altitude - 0.5, 1.5) 
                    }, 300);
                });
            }

            if (zoomOut && this.globe) {
                zoomOut.addEventListener('click', () => {
                    const pov = this.globe.pointOfView();
                    this.globe.pointOfView({ 
                        altitude: Math.min(pov.altitude + 0.5, 5) 
                    }, 300);
                });
            }
        },

        /**
         * Update stats panel
         */
        updateStats(shipment) {
            try {
                // Risk Score
                const riskValue = document.getElementById('rc-risk-value');
                const riskBadge = document.getElementById('rc-risk-badge');
                const riskDescription = document.getElementById('rc-risk-description');

                if (riskValue) {
                    riskValue.textContent = `${shipment.riskScore.toFixed(1)}%`;
                }

                if (riskBadge) {
                    riskBadge.className = 'rc-risk-badge ' + shipment.riskLevel.toLowerCase();
                    const badgeTexts = {
                        'LOW': 'Low Risk',
                        'MEDIUM': 'Medium Risk',
                        'HIGH': 'High Risk'
                    };
                    riskBadge.textContent = badgeTexts[shipment.riskLevel] || 'Unknown';
                }

                if (riskDescription) {
                    const descriptions = {
                        'LOW': 'Minimal risk detected',
                        'MEDIUM': 'Moderate operational risk — monitor closely',
                        'HIGH': 'High disruption risk — consider alternative route'
                    };
                    riskDescription.textContent = descriptions[shipment.riskLevel] || '';
                }

                // Transit Information
                const etdValue = document.getElementById('rc-etd-value');
                const etaValue = document.getElementById('rc-eta-value');
                const transitDays = document.getElementById('rc-transit-days');

                if (etdValue) {
                    etdValue.textContent = shipment.etd ? this.formatDate(shipment.etd) : '—';
                }

                if (etaValue) {
                    etaValue.textContent = shipment.eta ? this.formatDate(shipment.eta) : '—';
                }

                if (transitDays) {
                    transitDays.textContent = shipment.transitDays ? `${shipment.transitDays} days` : '—';
                }

                // Reliability
                const reliabilityValue = document.getElementById('rc-reliability-value');
        const reliabilityFill = document.getElementById('rc-reliability-fill');
        
                if (reliabilityValue) {
                    reliabilityValue.textContent = `${Math.round(shipment.reliability)}%`;
        }

        if (reliabilityFill) {
                    reliabilityFill.style.width = `${shipment.reliability}%`;
                }

                this.safeLog('✓ Stats updated');
            } catch (error) {
                this.safeLog('Error updating stats:', error);
            }
        },

        /**
         * Update route timeline
         */
        updateTimeline(shipment) {
            try {
                const timelineList = document.getElementById('rc-timeline-list');
                if (!timelineList) return;

                if (!shipment || !shipment.pol || !shipment.pod) {
                    timelineList.innerHTML = '<li class="rc-timeline-empty">No route data yet.</li>';
            return;
        }
        
                // Build timeline segments
                const segments = [
                    {
                        icon: '🚢',
                        label: 'Origin Port',
                        port: shipment.pol.name,
                        code: shipment.pol.code,
                        date: shipment.etd,
                        status: 'Planned',
                        risk: 'low'
                    },
                    {
                        icon: '🌊',
                        label: 'Main Ocean Leg',
                        port: 'On-water',
                        code: null,
                        date: null,
                        status: 'In transit',
                        risk: shipment.riskLevel.toLowerCase()
                    },
                    {
                        icon: '🏁',
                        label: 'Destination Port',
                        port: shipment.pod.name,
                        code: shipment.pod.code,
                        date: shipment.eta,
                        status: 'ETA',
                        risk: shipment.riskLevel.toLowerCase()
                    }
                ];

                // Render timeline items
                let html = '';
                segments.forEach((seg, idx) => {
                    const statusClass = seg.status.toLowerCase().replace(' ', '-');
                    html += `
                        <li class="rc-timeline-item">
                            <div class="rc-timeline-badge ${seg.risk}">${seg.icon}</div>
                            <div class="rc-timeline-content">
                                <div class="rc-timeline-content-header">
                                    <div>
                                        <h3 class="rc-timeline-port">
                                            ${seg.port}
                                            ${seg.code ? `<span class="rc-timeline-code">(${seg.code})</span>` : ''}
                                        </h3>
                                        <p class="rc-timeline-label">${seg.label}</p>
                                    </div>
                                </div>
                                <div class="rc-timeline-meta">
                                    ${seg.date ? `<span class="rc-timeline-date">📅 ${this.formatDate(seg.date)}</span>` : ''}
                                    <span class="rc-timeline-status-pill ${statusClass}">${seg.status}</span>
                                </div>
                            </div>
                        </li>
                    `;
                });

                timelineList.innerHTML = html;

                // Update subtitle
                const subtitle = document.getElementById('rc-timeline-subtitle');
                if (subtitle) {
                    subtitle.textContent = `${shipment.pol.name} to ${shipment.pod.name} with ${segments.length - 2} intermediate hubs.`;
                }

                this.safeLog('✓ Timeline updated');
            } catch (error) {
                this.safeLog('Error updating timeline:', error);
            }
        },

        /**
         * Update activities table
         */
        updateActivities(shipment) {
            try {
                const tbody = document.getElementById('rc-activities-tbody');
                if (!tbody) return;

                if (!shipment) {
                    tbody.innerHTML = '<tr><td colspan="5" class="rc-table-empty">No shipment data available.</td></tr>';
                    return;
                }

                // Build activities (single shipment for now)
                const activities = [{
                    id: shipment.id,
                    origin: shipment.pol.name,
                    destination: shipment.pod.name,
                    eta: this.formatDate(shipment.eta),
                    status: this.deriveActivityStatus(shipment)
                }];

                this.allActivities = activities;

                // Render rows
                this.renderActivities(activities);

                this.safeLog('✓ Activities updated');
            } catch (error) {
                this.safeLog('Error updating activities:', error);
            }
        },

        /**
         * Render activities table rows
         */
        renderActivities(activities) {
            const tbody = document.getElementById('rc-activities-tbody');
            if (!tbody) return;

            if (activities.length === 0) {
                tbody.innerHTML = '<tr><td colspan="5" class="rc-table-empty">No matching shipments found.</td></tr>';
                return;
            }

            let html = '';
            activities.forEach(act => {
                html += `
                    <tr>
                        <td><strong>${act.id}</strong></td>
                        <td>${act.origin}</td>
                        <td>${act.destination}</td>
                        <td>${act.eta}</td>
                        <td><span class="rc-status-pill ${act.status.class}">${act.status.text}</span></td>
                    </tr>
                `;
            });

            tbody.innerHTML = html;
        },

        /**
         * Derive activity status from shipment
         */
        deriveActivityStatus(shipment) {
            if (!shipment.eta) {
                return { text: 'Pending', class: 'pending' };
            }

            const etaDate = new Date(shipment.eta);
            const now = new Date();

            if (etaDate < now) {
                return { text: 'Arrived', class: 'arrived' };
            }

            if (shipment.riskScore > 60) {
                return { text: 'High Risk', class: 'high-risk' };
            }

            return { text: 'Calculated', class: 'calculated' };
        },

        /**
         * Bind search filter for activities
         */
        bindSearchFilter() {
            const searchInput = document.getElementById('rc-activities-search');
            if (!searchInput) return;

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase().trim();
                
                if (!query) {
                    this.renderActivities(this.allActivities);
                    return;
                }

                // Filter activities
                const filtered = this.allActivities.filter(act => {
                    return act.id.toLowerCase().includes(query) ||
                           act.origin.toLowerCase().includes(query) ||
                           act.destination.toLowerCase().includes(query);
                });

                this.renderActivities(filtered);
            });
        },

        /**
         * Update weather panel
         */
        updateWeather(shipment) {
            try {
                const weatherIcon = document.getElementById('rc-weather-icon');
                const weatherTemp = document.getElementById('rc-weather-temp');
                const weatherCondition = document.getElementById('rc-weather-condition');
                const weatherRoute = document.getElementById('rc-weather-route');

                // Use weather data if available
                if (shipment.weather && shipment.weather.summary) {
                    if (weatherIcon) weatherIcon.textContent = '⛅';
                    if (weatherTemp) weatherTemp.textContent = '—°C';
                    if (weatherCondition) weatherCondition.textContent = shipment.weather.summary;
                } else {
                    // Fallback heuristics
                    let icon = '☀️';
                    let condition = 'Mostly clear';

                    if (shipment.transitDays && shipment.transitDays > 25) {
                        icon = '⛅';
                        condition = 'Mixed conditions along route';
                    }

                    if (shipment.riskScore > 60) {
                        icon = '⛈️';
                        condition = 'Stormy or congested conditions';
                    }

                    if (weatherIcon) weatherIcon.textContent = icon;
                    if (weatherTemp) weatherTemp.textContent = '—°C';
                    if (weatherCondition) weatherCondition.textContent = condition;
                }

                // Update route label
                if (weatherRoute) {
                    weatherRoute.textContent = `${shipment.pol.name} (${shipment.pol.code}) ➝ ${shipment.pod.name} (${shipment.pod.code})`;
                }

                this.safeLog('✓ Weather updated');
            } catch (error) {
                this.safeLog('Error updating weather:', error);
            }
        },

        /**
         * Format date string
         */
        formatDate(dateStr) {
            if (!dateStr) return '—';
            
            try {
                const date = new Date(dateStr);
                const options = { day: '2-digit', month: 'short', year: 'numeric' };
                return date.toLocaleDateString('en-GB', options);
            } catch (e) {
                return dateStr;
            }
        }
    };

    // ==================================================
    // INITIALIZE ON DOM READY
    // ==================================================
    document.addEventListener('DOMContentLoaded', () => {
        RISKCAST_OVERVIEW.init();
    });

    // Expose to window for debugging
    if (window) {
        window.RISKCAST_OVERVIEW = RISKCAST_OVERVIEW;
    }

})();
