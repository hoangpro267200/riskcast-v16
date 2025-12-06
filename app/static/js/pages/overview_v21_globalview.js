/**
 * ========================================
 * RISKCAST Overview v21 - Global View Controller
 * FutureOS Edition with Inline Edit
 * ========================================
 */

(function() {
    'use strict';

    let globeInstance = null;
    let currentData = null;
    let globeMode = '3d';

    /**
     * Main Initialization
     */
    function rcInitOverview() {
        console.log('[Overview v21 Global] Initializing...');
        
        // Load data
        currentData = loadDataFromStorage();
        
        if (!currentData) {
            console.warn('[Overview v21 Global] No data found');
            showEmptyState();
            return;
        }
        
        console.log('[Overview v21 Global] Data loaded:', currentData);
        
        // Render all components
        renderGlobe();
        updateStats();
        renderTimeline();
        renderActivities();
        
        // Wire events
        bindEditDrawer();
        bindGlobeControls();
    }

    /**
     * Load data from localStorage
     */
    function loadDataFromStorage() {
        try {
            // Try v21 key
            let raw = localStorage.getItem('RC_LIVE_SHIPMENT_V21');
            if (raw) return JSON.parse(raw);
            
            // Fallback
            raw = localStorage.getItem('rc_overview_data');
            if (raw) return JSON.parse(raw);
            
            return null;
        } catch (e) {
            console.error('[Overview v21 Global] Parse error:', e);
            return null;
        }
    }

    /**
     * Render 3D Globe
     */
    function renderGlobe() {
        if (typeof Globe === 'undefined') {
            console.error('[Overview v21 Global] Globe.gl not loaded');
            document.getElementById('rc-globe-loading').innerHTML = 
                '<p style="color: #94a3b8;">3D Globe unavailable</p>';
            return;
        }
        
        const container = document.getElementById('rc-globe-container');
        const loader = document.getElementById('rc-globe-loading');
        
        if (!container) return;
        
        const polCode = currentData.pol_code || '';
        const podCode = currentData.pod_code || '';
        
        const polPort = LOGISTICS_DATA.getPort(polCode);
        const podPort = LOGISTICS_DATA.getPort(podCode);
        
        if (!polPort || !podPort) {
            console.warn('[Overview v21 Global] Missing port coords:', polCode, podCode);
            if (loader) {
                loader.innerHTML = '<p style="color: #94a3b8;">Port coordinates not found</p>';
            }
            return;
        }
        
        console.log('[Overview v21 Global] Rendering globe:', polPort, '→', podPort);
        
        // Determine arc color based on mode
        const mode = (currentData.mode || '').toLowerCase();
        const arcColor = mode.includes('air') ? ['#ffd447', '#ff9d47'] : ['#4dd2ff', '#9d84ff'];
        
        const arcsData = [{
            startLat: polPort.lat,
            startLng: polPort.lng,
            endLat: podPort.lat,
            endLng: podPort.lng,
            color: arcColor
        }];
        
        const pointsData = [
            { lat: polPort.lat, lng: polPort.lng, size: 0.3, color: '#22c55e', label: polCode },
            { lat: podPort.lat, lng: podPort.lng, size: 0.3, color: '#ffd447', label: podCode }
        ];
        
        try {
            globeInstance = Globe()
                (container)
                .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
                .backgroundColor('rgba(0,0,0,0)')
                .arcsData(arcsData)
                .arcColor('color')
                .arcStroke(2)
                .arcAltitude(0.3)
                .arcDashLength(0.4)
                .arcDashGap(0.2)
                .arcDashAnimateTime(3000)
                .pointsData(pointsData)
                .pointColor('color')
                .pointAltitude(0.01)
                .pointRadius('size')
                .pointLabel('label');
            
            // Set camera
            globeInstance.pointOfView({
                lat: (polPort.lat + podPort.lat) / 2,
                lng: (polPort.lng + podPort.lng) / 2,
                altitude: 2.5
            }, 1500);
            
            // Hide loader
            setTimeout(() => {
                if (loader) loader.classList.add('hidden');
            }, 1500);
            
            // Update route summary
            updateRouteSummary();
            
            console.log('[Overview v21 Global] ✓ Globe rendered');
        } catch (error) {
            console.error('[Overview v21 Global] Globe error:', error);
            if (loader) {
                loader.innerHTML = '<p style="color: #ef4444;">Globe rendering failed</p>';
            }
        }
    }

    /**
     * Update route summary band
     */
    function updateRouteSummary() {
        const el = document.getElementById('rc-route-text');
        if (!el) return;
        
        const polCode = currentData.pol_code || '—';
        const podCode = currentData.pod_code || '—';
        const mode = currentData.mode_label || currentData.mode || '—';
        
        el.textContent = `${polCode} → ${podCode} • ${mode}`;
    }

    /**
     * Update stats panel
     */
    function updateStats() {
        // Risk score
        const riskValue = document.getElementById('rc-risk-value');
        const riskBadge = document.getElementById('rc-risk-badge');
        const riskDesc = document.getElementById('rc-risk-desc');
        
        const riskScore = currentData.risk_score || 0;
        let riskLevel = currentData.risk_level || 'low';
        
        if (!['low', 'medium', 'high'].includes(riskLevel)) {
            if (riskScore < 30) riskLevel = 'low';
            else if (riskScore < 60) riskLevel = 'medium';
            else riskLevel = 'high';
        }
        
        if (riskValue) riskValue.textContent = `${Math.round(riskScore)}%`;
        if (riskBadge) {
            riskBadge.className = `rc-risk-badge ${riskLevel}`;
            riskBadge.textContent = riskLevel.toUpperCase();
        }
        if (riskDesc) {
            const descriptions = {
                low: 'Minimal risk detected',
                medium: 'Moderate risk - monitor closely',
                high: 'High disruption risk - mitigation required'
            };
            riskDesc.textContent = descriptions[riskLevel] || 'Risk assessed';
        }
        
        // Transit info
        const etd = document.getElementById('rc-etd');
        const eta = document.getElementById('rc-eta');
        const days = document.getElementById('rc-days');
        
        if (etd) etd.textContent = formatDate(currentData.etd);
        if (eta) eta.textContent = formatDate(currentData.eta);
        if (days) {
            const transitDays = currentData.transit_days || currentData.transitDays;
            days.textContent = transitDays ? `${transitDays} days` : '—';
        }
        
        // Reliability
        const reliabilityValue = document.getElementById('rc-reliability-value');
        const reliabilityFill = document.getElementById('rc-reliability-fill');
        
        const reliability = currentData.reliability_score || currentData.reliability || 0;
        if (reliabilityValue) reliabilityValue.textContent = `${Math.round(reliability)}%`;
        if (reliabilityFill) reliabilityFill.style.width = `${reliability}%`;
        
        // Weather
        updateWeather();
        
        console.log('[Overview v21 Global] ✓ Stats updated');
    }

    /**
     * Update weather
     */
    function updateWeather() {
        const icon = document.getElementById('rc-weather-icon');
        const temp = document.getElementById('rc-weather-temp');
        const cond = document.getElementById('rc-weather-cond');
        
        if (!icon || !temp || !cond) return;
        
        const weather = currentData.weather;
        let emoji = '☀️';
        let temperature = 28;
        let condition = 'Sunny';
        
        if (weather) {
            const dest = weather.destination || weather.pod || weather;
            if (dest) {
                temperature = dest.temp_c || temperature;
                condition = dest.condition || condition;
            }
        }
        
        // Emoji mapping
        const lower = condition.toLowerCase();
        if (lower.includes('rain')) emoji = '🌧️';
        else if (lower.includes('cloud')) emoji = '⛅';
        else if (lower.includes('storm')) emoji = '⛈️';
        
        icon.textContent = emoji;
        temp.textContent = `${Math.round(temperature)}°C`;
        cond.textContent = condition;
    }

    /**
     * Render timeline
     */
    function renderTimeline() {
        const wrapper = document.getElementById('timeline-wrapper');
        if (!wrapper) return;
        
        wrapper.innerHTML = '';
        
        const polCode = currentData.pol_code || '';
        const podCode = currentData.pod_code || '';
        const polPort = LOGISTICS_DATA.getPort(polCode);
        const podPort = LOGISTICS_DATA.getPort(podCode);
        
        if (!polPort || !podPort) {
            wrapper.innerHTML = '<p class="rc-timeline-empty">Route data unavailable</p>';
            return;
        }
        
        const transitDays = currentData.transit_days || currentData.transitDays || 0;
        
        const timeline = [
            {
                type: 'origin',
                icon: '🚢',
                title: `${polPort.name} (${polCode})`,
                date: formatDate(currentData.etd),
                status: 'Planned'
            },
            {
                type: 'transit',
                icon: '🌊',
                title: 'Main Ocean Leg',
                date: transitDays ? `${transitDays} days` : 'In Transit',
                status: 'In Transit'
            },
            {
                type: 'destination',
                icon: '🏁',
                title: `${podPort.name} (${podCode})`,
                date: formatDate(currentData.eta),
                status: 'ETA'
            }
        ];
        
        timeline.forEach(item => {
            const div = document.createElement('div');
            div.className = 'rc-timeline-item';
            div.innerHTML = `
                <div class="rc-timeline-icon ${item.type}">${item.icon}</div>
                <div class="rc-timeline-content">
                    <h4 class="rc-timeline-title">${item.title}</h4>
                    <div class="rc-timeline-meta">
                        <span class="rc-timeline-date">📅 ${item.date}</span>
                        <span class="rc-timeline-status ${item.status.toLowerCase().replace(' ', '-')}">${item.status}</span>
                    </div>
                </div>
            `;
            wrapper.appendChild(div);
        });
        
        console.log('[Overview v21 Global] ✓ Timeline rendered');
    }

    /**
     * Render activities table
     */
    function renderActivities() {
        const tbody = document.getElementById('activities-tbody');
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        const shipmentId = currentData.shipment_id || 'RC-DEMO';
        const polCode = currentData.pol_code || '—';
        const podCode = currentData.pod_code || '—';
        const eta = formatDate(currentData.eta);
        
        const status = deriveStatus();
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><strong>${shipmentId}</strong></td>
            <td>${polCode} → ${podCode}</td>
            <td>${eta}</td>
            <td><span class="rc-status-pill ${status.class}">${status.text}</span></td>
        `;
        
        tbody.appendChild(row);
        
        console.log('[Overview v21 Global] ✓ Activities rendered');
    }

    /**
     * Derive status from data
     */
    function deriveStatus() {
        if (!currentData.eta) {
            return { text: 'Pending', class: 'pending' };
        }
        
        const etaDate = new Date(currentData.eta);
        const now = new Date();
        
        if (etaDate < now) {
            return { text: 'Arrived', class: 'arrived' };
        }
        
        if (currentData.risk_score && currentData.risk_score > 60) {
            return { text: 'High Risk', class: 'high-risk' };
        }
        
        return { text: 'Calculated', class: 'calculated' };
    }

    /**
     * Format date
     */
    function formatDate(dateStr) {
        if (!dateStr) return '—';
        try {
            const d = new Date(dateStr);
            if (isNaN(d.getTime())) return '—';
            return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        } catch (e) {
            return '—';
        }
    }

    /**
     * Bind edit drawer
     */
    function bindEditDrawer() {
        const drawer = document.getElementById('rc-edit-drawer');
        const btnToggle = document.getElementById('rc-btn-toggle-edit');
        const btnClose = document.getElementById('rc-drawer-close');
        const btnSave = document.getElementById('rc-btn-save');
        
        if (!drawer) return;
        
        // Open drawer
        if (btnToggle) {
            btnToggle.addEventListener('click', () => {
                drawer.classList.add('open');
                populateEditForm();
            });
        }
        
        // Close drawer
        if (btnClose) {
            btnClose.addEventListener('click', () => {
                drawer.classList.remove('open');
            });
        }
        
        // Save changes
        if (btnSave) {
            btnSave.addEventListener('click', () => {
                saveEditForm();
                drawer.classList.remove('open');
            });
        }
    }

    /**
     * Populate edit form
     */
    function populateEditForm() {
        const shipmentId = document.getElementById('edit-shipment-id');
        const pol = document.getElementById('edit-pol');
        const pod = document.getElementById('edit-pod');
        const mode = document.getElementById('edit-mode');
        const etd = document.getElementById('edit-etd');
        
        if (shipmentId) shipmentId.value = currentData.shipment_id || '';
        if (pol) pol.value = currentData.pol_code || '';
        if (pod) pod.value = currentData.pod_code || '';
        if (mode) {
            const modeValue = (currentData.mode || '').toLowerCase();
            if (modeValue.includes('air')) mode.value = 'air';
            else if (modeValue.includes('road')) mode.value = 'road';
            else if (modeValue.includes('rail')) mode.value = 'rail';
            else mode.value = 'ocean';
        }
        if (etd) etd.value = currentData.etd || '';
    }

    /**
     * Save edit form
     */
    function saveEditForm() {
        const pol = document.getElementById('edit-pol').value;
        const pod = document.getElementById('edit-pod').value;
        const mode = document.getElementById('edit-mode').value;
        const etd = document.getElementById('edit-etd').value;
        
        // Update currentData
        currentData.pol_code = pol;
        currentData.pod_code = pod;
        currentData.mode = mode;
        currentData.etd = etd;
        
        // Save to localStorage
        localStorage.setItem('RC_LIVE_SHIPMENT_V21', JSON.stringify(currentData));
        
        // Rerender
        renderGlobe();
        updateStats();
        renderTimeline();
        renderActivities();
        
        console.log('[Overview v21 Global] ✓ Changes saved');
    }

    /**
     * Bind globe controls
     */
    function bindGlobeControls() {
        const btn3d = document.querySelector('[data-mode="3d"]');
        const btn2d = document.querySelector('[data-mode="2d"]');
        const zoomIn = document.getElementById('rc-zoom-in');
        const zoomOut = document.getElementById('rc-zoom-out');
        const zoomReset = document.getElementById('rc-zoom-reset');
        
        if (btn3d) {
            btn3d.addEventListener('click', () => {
                setGlobeMode('3d');
            });
        }
        
        if (btn2d) {
            btn2d.addEventListener('click', () => {
                setGlobeMode('2d');
            });
        }
        
        if (zoomIn) {
            zoomIn.addEventListener('click', () => {
                adjustZoom(-0.3);
            });
        }
        
        if (zoomOut) {
            zoomOut.addEventListener('click', () => {
                adjustZoom(0.3);
            });
        }
        
        if (zoomReset) {
            zoomReset.addEventListener('click', () => {
                resetCamera();
            });
        }
    }

    /**
     * Set globe mode
     */
    function setGlobeMode(mode) {
        globeMode = mode;
        
        const btns = document.querySelectorAll('.rc-view-btn');
        btns.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        
        if (!globeInstance) return;
        
        const pov = globeInstance.pointOfView();
        const altitude = mode === '2d' ? 4.0 : 2.5;
        globeInstance.pointOfView({ ...pov, altitude }, 800);
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
        }, 300);
    }

    /**
     * Reset camera
     */
    function resetCamera() {
        if (!globeInstance) return;
        
        const polPort = LOGISTICS_DATA.getPort(currentData.pol_code);
        const podPort = LOGISTICS_DATA.getPort(currentData.pod_code);
        
        if (!polPort || !podPort) return;
        
        globeInstance.pointOfView({
            lat: (polPort.lat + podPort.lat) / 2,
            lng: (polPort.lng + podPort.lng) / 2,
            altitude: 2.5
        }, 1000);
    }

    /**
     * Show empty state
     */
    function showEmptyState() {
        const loader = document.getElementById('rc-globe-loading');
        if (loader) {
            loader.innerHTML = '<p style="color: #94a3b8;">No shipment data available</p>';
        }
    }

    // Initialize on DOM ready
    document.addEventListener('DOMContentLoaded', rcInitOverview);

    // Expose to window
    if (typeof window !== 'undefined') {
        window.rcInitOverview = rcInitOverview;
        window.OVERVIEW_GLOBAL_V21 = {
            currentData: () => currentData,
            globeInstance: () => globeInstance,
            refresh: rcInitOverview
        };
    }

})();





