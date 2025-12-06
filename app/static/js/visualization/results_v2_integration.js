
(function() {
    'use strict';

    if (typeof window.RISKCAST === 'undefined') {
        window.RISKCAST = {};
    }
    if (typeof window.RISKCAST.visualization === 'undefined') {
        window.RISKCAST.visualization = {};
    }

    // Chart instances storage
    const chartInstances = {};

    /**
     * Fetch risk analysis from Engine v2 API
     */
    async function fetchRiskAnalysis(shipmentData) {
        try {
            const response = await fetch('/api/v1/risk/v2/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(shipmentData)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            return result.result || result;
        } catch (error) {
            console.error('Failed to fetch risk analysis:', error);
            throw error;
        }
    }

    /**
     * Render all visualizations from Engine v2 result
     */
    function renderVisualizations(result) {
        if (!result) {
            console.error('No result data provided');
            return;
        }

        const profile = result.profile || {};
        const factors = profile.factors || {};
        const matrix = profile.matrix || {};
        const confidence = result.confidence || 0.8;

        // 1. Render Confidence Gauge
        if (window.RISKCAST.visualization.gauge) {
            const gaugeContainer = document.getElementById('confidence-gauge');
            if (gaugeContainer) {
                chartInstances.gauge = window.RISKCAST.visualization.gauge.create('confidence-gauge', confidence);
            }
        }

        // 2. Render Heatmap (Impact Matrix)
        if (window.RISKCAST.visualization.heatmap) {
            const heatmapContainer = document.getElementById('risk-heatmap');
            if (heatmapContainer) {
                chartInstances.heatmap = window.RISKCAST.visualization.heatmap.create('risk-heatmap', matrix);
            }
        }

        // 3. Render Radar Chart
        if (window.RISKCAST.visualization.radar) {
            const radarContainer = document.getElementById('risk-radar');
            if (radarContainer) {
                chartInstances.radar = window.RISKCAST.visualization.radar.create('risk-radar', factors);
            }
        }

        // 4. Render Driver Bar Chart
        if (window.RISKCAST.visualization.driversBar) {
            const driversContainer = document.getElementById('risk-drivers');
            if (driversContainer) {
                chartInstances.driversBar = window.RISKCAST.visualization.driversBar.create('risk-drivers', factors);
            }
        }

        // 5. Render Timeline Chart
        if (window.RISKCAST.visualization.timeline) {
            const timelineContainer = document.getElementById('risk-timeline');
            if (timelineContainer) {
                // Generate timeline data from risk score
                const timelineData = window.RISKCAST.visualization.timeline.generateTimelineData(
                    result.risk_score || 50,
                    30
                );
                chartInstances.timeline = window.RISKCAST.visualization.timeline.create('risk-timeline', timelineData);
            }
        }

        // 6. Render Network Graph (if network data provided)
        if (result.details && result.details.network && window.RISKCAST.visualization.networkGraph) {
            const networkContainer = document.getElementById('risk-network');
            if (networkContainer) {
                // Build network data from result
                const networkData = buildNetworkData(result);
                chartInstances.networkGraph = window.RISKCAST.visualization.networkGraph.create('risk-network', networkData);
            }
        }

        // 7. Update summary cards
        updateSummaryCards(result);
    }

    /**
     * Build network data from result
     */
    function buildNetworkData(result) {
        // Extract network information from result
        const pol = result.inputs?.pol || 'UNKNOWN';
        const pod = result.inputs?.pod || 'UNKNOWN';
        const network = result.details?.network || {};

        const nodes = [
            {
                id: pol.toUpperCase(),
                risk: network.port_centrality || 0.5
            },
            {
                id: pod.toUpperCase(),
                risk: network.port_centrality || 0.5
            }
        ];

        const edges = [
            {
                source: pol.toUpperCase(),
                target: pod.toUpperCase(),
                volume: 1.0,
                propagation: network.propagation_factor || 0.5
            }
        ];

        return { nodes, edges };
    }

    /**
     * Update summary cards
     */
    function updateSummaryCards(result) {
        // Update risk score card
        const scoreElement = document.getElementById('risk-score-value');
        if (scoreElement) {
            scoreElement.textContent = (result.risk_score || 0).toFixed(1);
        }

        // Update risk level
        const levelElement = document.getElementById('risk-level-value');
        if (levelElement) {
            levelElement.textContent = result.risk_level || 'Medium';
        }

        // Update drivers list
        const driversList = document.getElementById('risk-drivers-list');
        if (driversList && result.drivers) {
            driversList.innerHTML = result.drivers
                .map(driver => `<li>${driver}</li>`)
                .join('');
        }

        // Update recommendations
        const recommendationsList = document.getElementById('risk-recommendations-list');
        if (recommendationsList && result.recommendations) {
            recommendationsList.innerHTML = result.recommendations
                .map(rec => `<li>${rec}</li>`)
                .join('');
        }
    }

    /**
     * Cleanup all charts (on page unload)
     */
    function cleanupCharts() {
        Object.values(chartInstances).forEach(instance => {
            if (instance && typeof instance.destroy === 'function') {
                instance.destroy();
            } else if (instance && typeof instance.cleanup === 'function') {
                instance.cleanup();
            }
        });
        chartInstances = {};
    }

    /**
     * Initialize visualizations (called when results page loads)
     */
    async function initializeVisualizations(shipmentData) {
        try {
            // Show loading state
            const loadingElements = document.querySelectorAll('.viz-loading');
            loadingElements.forEach(el => el.style.display = 'flex');

            // Fetch risk analysis
            const result = await fetchRiskAnalysis(shipmentData);

            // Render visualizations
            renderVisualizations(result);

            // Hide loading state
            loadingElements.forEach(el => el.style.display = 'none');

            return result;
        } catch (error) {
            console.error('Failed to initialize visualizations:', error);
            
            // Show error state
            const containers = document.querySelectorAll('.riskcast-viz-container');
            containers.forEach(container => {
                const loading = container.querySelector('.viz-loading');
                if (loading) {
                    loading.innerHTML = '<div>Error loading visualization. Please refresh the page.</div>';
                }
            });
        }
    }

    // Export API
    window.RISKCAST.visualization.results = {
        fetchRiskAnalysis,
        renderVisualizations,
        initializeVisualizations,
        cleanupCharts,
    };

    // Cleanup on page unload
    window.addEventListener('beforeunload', cleanupCharts);

    console.log('✅ RISKCAST Results v2 integration initialized');

})();




















