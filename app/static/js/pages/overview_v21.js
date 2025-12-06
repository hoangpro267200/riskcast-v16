/**
 * ========================================
 * RISKCAST Overview v21 - FutureOS Edition
 * Global Route Overview with 3D Globe
 * ========================================
 */

(function() {
    'use strict';

    let globeInstance = null;
    let globeMode = '3d';
    let currentShipment = null;

    /**
     * ========================================
     * INITIALIZATION
     * ========================================
     */
    document.addEventListener('DOMContentLoaded', () => {
        console.log('[Overview v21] Initializing...');
        
        const snapshot = loadSnapshotFromStorage();
        if (snapshot) {
            console.log('[Overview v21] ✓ Loaded snapshot from localStorage', snapshot);
            initOverview(snapshot);
        } else {
            console.log('[Overview v21] No localStorage data, fetching from API...');
            fetch('/api/overview_data')
                .then(r => r.json())
                .then(data => {
                    console.log('[Overview v21] ✓ Loaded from API', data);
                    initOverview(data);
                })
                .catch(err => {
                    console.error('[Overview v21] Failed to load overview data', err);
                    showEmptyState();
                });
        }
    });

    /**
     * Load snapshot from localStorage
     */
    function loadSnapshotFromStorage() {
        try {
            // Try v21 key first
            let raw = localStorage.getItem('RC_LIVE_SHIPMENT_V21');
            if (raw) return JSON.parse(raw);
            
            // Fallback to old key
            raw = localStorage.getItem('rc_overview_data');
            if (raw) return JSON.parse(raw);
            
            return null;
        } catch (e) {
            console.warn('[Overview v21] Invalid localStorage data', e);
            return null;
        }
    }

    /**
     * ========================================
     * MAIN INITIALIZATION
     * ========================================
     */
    function initOverview(data) {
        currentShipment = data;
        
        updateRouteSummaryBadge(data);
        updateRiskCard(data);
        updateTransitCard(data);
        updateReliabilityCard(data);
        updateWeatherCard(data);
        buildRouteTimeline(data);
        buildActivitiesTable(data);
        initGlobeView(data);
    }

    /**
     * ========================================
     * ROUTE SUMMARY BADGE
     * ========================================
     */
    function updateRouteSummaryBadge(data) {
        const el = document.getElementById('rc-globe-chip-route');
        const modeEl = document.getElementById('rc-globe-chip-mode');
        
        if (el) {
            const polCode = data.pol_code || '';
            const podCode = data.pod_code || '';
            el.textContent = polCode && podCode ? `${polCode} → ${podCode}` : '—';
        }
        
        if (modeEl) {
            const modeLabel = data.mode_label || data.shipment_type_label || '';
            modeEl.textContent = modeLabel || '—';
        }
    }

    /**
     * ========================================
     * RISK CARD
     * ========================================
     */
    function updateRiskCard(data) {
        const riskVal = document.getElementById('rc-risk-value');
        const riskBadge = document.getElementById('rc-risk-badge');
        const riskDesc = document.getElementById('rc-risk-description');
        
        if (!riskVal) return;
        
        const score = Number(data.risk_score || 0);
        let level = data.risk_level || 'low';
        if (!['low', 'medium', 'high'].includes(level)) {
            if (score < 30) level = 'low';
            else if (score < 60) level = 'medium';
            else level = 'high';
        }
        
        riskVal.textContent = `${Math.round(score)}%`;
        
        if (riskBadge) {
            riskBadge.classList.remove('low', 'medium', 'high');
            riskBadge.classList.add(level);
            
            const badgeText = {
                low: 'Low Risk',
                medium: 'Medium Risk',
                high: 'High Risk'
            };
            riskBadge.textContent = badgeText[level] || 'Low Risk';
        }
        
        if (riskDesc) {
            const descMap = {
                low: 'Minimal risk detected',
                medium: 'Moderate risk - monitor closely',
                high: 'High disruption risk - mitigation required'
            };
            riskDesc.textContent = descMap[level] || 'Risk profile calculated';
        }
    }

    /**
     * ========================================
     * TRANSIT CARD
     * ========================================
     */
    function updateTransitCard(data) {
        const etdEl = document.getElementById('rc-etd-value');
        const etaEl = document.getElementById('rc-eta-value');
        const daysEl = document.getElementById('rc-transit-days');
        
        if (etdEl) etdEl.textContent = formatDateISO(data.etd);
        if (etaEl) etaEl.textContent = formatDateISO(data.eta);
        if (daysEl) {
            const days = data.transit_days || data.transitDays;
            daysEl.textContent = days != null ? `${days} days` : '—';
        }
    }

    /**
     * Format ISO date string
     */
    function formatDateISO(isoStr) {
        if (!isoStr) return '—';
        try {
            const d = new Date(isoStr);
            if (isNaN(d.getTime())) return '—';
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return '—';
        }
    }

    /**
     * ========================================
     * RELIABILITY CARD
     * ========================================
     */
    function updateReliabilityCard(data) {
        const valEl = document.getElementById('rc-reliability-value');
        const barEl = document.getElementById('rc-reliability-fill');
        
        const score = Math.max(0, Math.min(100, Number(data.reliability_score || data.reliability || 0)));
        
        if (valEl) valEl.textContent = `${Math.round(score)}%`;
        if (barEl) barEl.style.width = `${score}%`;
    }

    /**
     * ========================================
     * WEATHER CARD
     * ========================================
     */
    function updateWeatherCard(data) {
        const iconEl = document.getElementById('rc-weather-icon');
        const tempEl = document.getElementById('rc-weather-temp');
        const condEl = document.getElementById('rc-weather-condition');
        const routeEl = document.getElementById('rc-weather-route');
        
        if (!iconEl || !tempEl || !condEl) return;
        
        const weather = data.weather;
        let temp = 28, cond = 'Sunny', emoji = '☀️';
        
        if (weather) {
            const dest = weather.destination || weather.pod || weather;
            if (dest) {
                temp = dest.temp_c ?? temp;
                cond = dest.condition || cond;
            }
        }
        
        // Determine emoji based on condition
        const lower = cond.toLowerCase();
        if (lower.includes('rain')) emoji = '🌧️';
        else if (lower.includes('cloud')) emoji = '⛅';
        else if (lower.includes('storm')) emoji = '⛈️';
        else if (lower.includes('sun')) emoji = '☀️';
        
        iconEl.textContent = emoji;
        tempEl.textContent = `${Math.round(temp)}°C`;
        condEl.textContent = cond;
        
        if (routeEl) {
            const polCode = data.pol_code || '';
            const podCode = data.pod_code || '';
            const polPort = LOGISTICS_DATA.getPort(polCode);
            const podPort = LOGISTICS_DATA.getPort(podCode);
            const polName = polPort ? polPort.name : polCode;
            const podName = podPort ? podPort.name : podCode;
            routeEl.textContent = `${polName} (${polCode}) ➝ ${podName} (${podCode})`;
        }
    }

    /**
     * ========================================
     * ROUTE TIMELINE
     * ========================================
     */
    function buildRouteTimeline(data) {
        const container = document.getElementById('rc-timeline-list');
        if (!container) return;
        
        container.innerHTML = '';
        
        const polCode = data.pol_code || '';
        const podCode = data.pod_code || '';
        const pol = LOGISTICS_DATA.getPort(polCode);
        const pod = LOGISTICS_DATA.getPort(podCode);
        
        if (!pol || !pod) {
            container.innerHTML = '<li class="rc-timeline-empty">No route data available</li>';
            return;
        }
        
        const transitDays = data.transit_days || data.transitDays || 0;
        const riskLevel = (data.risk_level || 'low').toLowerCase();
        
        const legs = [
            {
                type: 'origin',
                icon: '🚢',
                title: polCode,
                subtitle: pol.name,
                date: formatDateISO(data.etd),
                status: 'Planned',
                statusClass: 'planned',
                risk: 'low'
            },
            {
                type: 'main',
                icon: '🌊',
                title: 'On-water',
                subtitle: 'Main ocean leg',
                date: transitDays ? `${transitDays} days` : '—',
                status: 'In Transit',
                statusClass: 'in-transit',
                risk: riskLevel
            },
            {
                type: 'destination',
                icon: '🏁',
                title: podCode,
                subtitle: pod.name,
                date: formatDateISO(data.eta),
                status: 'ETA',
                statusClass: 'eta',
                risk: riskLevel
            }
        ];
        
        legs.forEach(leg => {
            const li = document.createElement('li');
            li.className = 'rc-timeline-item';
            
            li.innerHTML = `
                <div class="rc-timeline-badge ${leg.risk}">${leg.icon}</div>
                <div class="rc-timeline-content">
                    <div class="rc-timeline-content-header">
                        <div>
                            <h3 class="rc-timeline-port">
                                ${leg.title}
                                <span class="rc-timeline-code">(${leg.subtitle})</span>
                            </h3>
                        </div>
                    </div>
                    <div class="rc-timeline-meta">
                        ${leg.date ? `<span class="rc-timeline-date">📅 ${leg.date}</span>` : ''}
                        <span class="rc-timeline-status-pill ${leg.statusClass}">${leg.status}</span>
                    </div>
                </div>
            `;
            
            container.appendChild(li);
        });
    }

    /**
     * ========================================
     * ACTIVITIES TABLE
     * ========================================
     */
    function buildActivitiesTable(data) {
        const tbody = document.getElementById('rc-activities-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const shipmentId = data.shipment_id || 'RC-DEMO';
        const polCode = data.pol_code || '—';
        const podCode = data.pod_code || '—';
        const eta = formatDateISO(data.eta);
        const statusClass = deriveStatusClass(data);
        const statusText = deriveStatusText(data);
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${shipmentId}</strong></td>
            <td>${polCode}</td>
            <td>${podCode}</td>
            <td>${eta}</td>
            <td><span class="rc-status-pill ${statusClass}">${statusText}</span></td>
        `;
        
        tbody.appendChild(row);
        
        // Bind search filter
        bindSearchFilter(data);
    }

    /**
     * Derive status class from shipment
     */
    function deriveStatusClass(data) {
        if (!data.eta) return 'pending';
        
        const etaDate = new Date(data.eta);
        const now = new Date();
        
        if (etaDate < now) return 'arrived';
        if (data.risk_score && data.risk_score > 60) return 'high-risk';
        return 'calculated';
    }

    /**
     * Derive status text from shipment
     */
    function deriveStatusText(data) {
        if (!data.eta) return 'Pending';
        
        const etaDate = new Date(data.eta);
        const now = new Date();
        
        if (etaDate < now) return 'Arrived';
        if (data.risk_score && data.risk_score > 60) return 'High Risk';
        return 'Calculated';
    }

    /**
     * Bind search filter
     */
    function bindSearchFilter(data) {
        const searchInput = document.getElementById('rc-activities-search');
        if (!searchInput) return;
        
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase().trim();
            const tbody = document.getElementById('rc-activities-tbody');
            const rows = tbody.querySelectorAll('tr');
            
            rows.forEach(row => {
                const text = row.textContent.toLowerCase();
                row.style.display = text.includes(query) ? '' : 'none';
            });
        });
    }

    /**
     * ========================================
     * GLOBE INITIALIZATION
     * ========================================
     */
    function initGlobeView(data) {
        const container = document.getElementById('rc-globe-container');
        const loader = document.getElementById('rc-globe-loading');
        
        if (!container) return;
        
        // Check if Globe is available
        if (typeof Globe === 'undefined') {
            console.error('[Overview v21] Globe.gl not loaded');
            if (loader) loader.innerHTML = '<p style="color: #94a3b8;">3D view unavailable</p>';
            return;
        }
        
        const polCode = data.pol_code || '';
        const podCode = data.pod_code || '';
        const origin = LOGISTICS_DATA.getPort(polCode);
        const dest = LOGISTICS_DATA.getPort(podCode);
        
        if (!origin || !dest) {
            console.warn('[Overview v21] No coordinates for ports:', polCode, podCode);
            if (loader) loader.innerHTML = '<p style="color: #94a3b8;">No coordinates for selected ports</p>';
            return;
        }
        
        console.log('[Overview v21] Rendering globe:', origin, '→', dest);
        
        const arcData = [{
            startLat: origin.lat,
            startLng: origin.lng,
            endLat: dest.lat,
            endLng: dest.lng,
            color: ['#22c55e', '#3b82f6']
        }];
        
        try {
            globeInstance = Globe()
                (container)
                .backgroundColor('rgba(0,0,0,0)')
                .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-night.jpg')
                .arcColor('color')
                .arcStroke(1.2)
                .arcAltitude(0.3)
                .arcDashLength(0.4)
                .arcDashGap(0.2)
                .arcDashAnimateTime(4000)
                .arcsData(arcData);
            
            // Set initial view
            globeInstance.pointOfView({
                lat: (origin.lat + dest.lat) / 2,
                lng: (origin.lng + dest.lng) / 2,
                altitude: 2.5
            }, 1500);
            
            // Hide loader
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
            }, 1500);
            
            // Init controls
            initGlobeControls();
            
            console.log('[Overview v21] ✓ Globe initialized successfully');
        } catch (error) {
            console.error('[Overview v21] Globe initialization error:', error);
            if (loader) loader.innerHTML = '<p style="color: #ef4444;">Failed to load globe</p>';
        }
    }

    /**
     * ========================================
     * GLOBE CONTROLS
     * ========================================
     */
    function initGlobeControls() {
        const zoomIn = document.getElementById('rc-zoom-in');
        const zoomOut = document.getElementById('rc-zoom-out');
        const btn3d = document.querySelector('.rc-globe-toggle-btn[data-mode="3d"]');
        const btn2d = document.querySelector('.rc-globe-toggle-btn[data-mode="2d"]');
        
        if (zoomIn) zoomIn.onclick = () => adjustZoom(-0.3);
        if (zoomOut) zoomOut.onclick = () => adjustZoom(0.3);
        
        if (btn3d && btn2d) {
            btn3d.onclick = () => setGlobeMode('3d');
            btn2d.onclick = () => setGlobeMode('2d');
        }
    }

    /**
     * Adjust zoom
     */
    function adjustZoom(delta) {
        if (!globeInstance) return;
        const pov = globeInstance.pointOfView();
        globeInstance.pointOfView({
            ...pov,
            altitude: Math.max(0.5, Math.min(5, pov.altitude + delta))
        }, 600);
    }

    /**
     * Set globe mode (3D/2D)
     */
    function setGlobeMode(mode) {
        globeMode = mode;
        
        const btns = document.querySelectorAll('.rc-globe-toggle-btn');
        btns.forEach(b => {
            b.classList.toggle('active', b.dataset.mode === mode);
        });
        
        if (!globeInstance) return;
        
        const pov = globeInstance.pointOfView();
        const altitude = mode === '2d' ? 4.0 : 2.5;
        globeInstance.pointOfView({ ...pov, altitude }, 800);
    }

    /**
     * ========================================
     * EMPTY STATE
     * ========================================
     */
    function showEmptyState() {
        console.log('[Overview v21] Showing empty state');
        
        const loader = document.getElementById('rc-globe-loading');
        if (loader) {
            loader.innerHTML = '<p style="color: #94a3b8;">No shipment data available</p>';
        }
    }

    // Expose to window for debugging
    if (typeof window !== 'undefined') {
        window.OVERVIEW_V21 = {
            initOverview,
            currentShipment: () => currentShipment,
            globeInstance: () => globeInstance
        };
    }

})();





