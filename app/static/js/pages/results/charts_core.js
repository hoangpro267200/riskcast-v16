
import { renderGaugeCharts } from './charts_gauges.js';
import { renderRadarChart } from './charts_radar.js';
import { renderLayerChart } from './charts_layers.js';
import { renderTimelineChart } from './charts_timeline.js';
import { renderMonteCarlo } from './charts_monte_carlo.js';
import { renderRiskMatrixChart } from './charts_risk_matrix.js';
import { renderScenarioCharts } from './charts_scenarios.js';
import { renderRouteBreakdown } from './charts_route_breakdown.js';

export function waitForPlotly() {
    return new Promise((resolve) => {
        if (window.Plotly) {
            resolve();
            return;
        }
        
        const checkInterval = setInterval(() => {
            if (window.Plotly) {
                clearInterval(checkInterval);
                resolve();
            }
        }, 50);
        
        // Timeout after 10 seconds
        setTimeout(() => {
            clearInterval(checkInterval);
            resolve();
        }, 10000);
    });
}

export async function renderAllCharts(data) {
    await waitForPlotly();
    
    if (!data) {
        return;
    }
    
    // Render gauges if summary available
    if (data.summary) {
        renderGaugeCharts(data.summary);
    }
    
    // Render radar chart
    if (data.radar) {
        renderRadarChart(data.radar);
    }
    
    // Render layer chart
    if (data.risk_layers) {
        renderLayerChart(data.risk_layers);
    }
    
    // Render timeline chart
    if (data.time_series) {
        renderTimelineChart(data.time_series);
    }
    
    // Render Monte Carlo chart
    if (data.monte_carlo) {
        renderMonteCarlo(data.monte_carlo);
    }
    
    // Render risk matrix chart
    if (data.risk_matrix) {
        renderRiskMatrixChart(data.risk_matrix);
    }
    
    // Render scenario charts
    if (data.scenarios && data.scenarios.length > 0) {
        renderScenarioCharts(data.scenarios);
    }
    
    // Render route breakdown
    if (data.route_breakdown) {
        renderRouteBreakdown(data.route_breakdown);
    }
    
    // Use ResultsCore for any remaining charts if available (backward compatibility)
    if (window.ResultsCore && typeof window.ResultsCore.renderTradeoffChart === 'function' && data.savings_and_business) {
        window.ResultsCore.renderTradeoffChart(data.savings_and_business);
    }
}

