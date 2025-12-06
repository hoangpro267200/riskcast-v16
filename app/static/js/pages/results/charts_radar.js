
import { $id } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

export function renderRadarChart(radarData) {
    if (!window.Plotly || !radarData) return;
    
    const el = $id("radarChart") || 
               $id("radar") || 
               document.querySelector("[data-chart='radar']");
    if (!el) {
        return;
    }
    
    const labels = radarData.labels || [];
    const values = radarData.values || [];
    const scores = values.map(v => (safe(v, 0)) * 100); // Convert 0-1 to 0-100
    
    const trace = {
        type: 'scatterpolar',
        r: scores.concat([scores[0]]),
        theta: labels.concat([labels[0]]),
        fill: 'toself',
        fillcolor: 'rgba(0, 255, 136, 0.2)',
        line: { color: '#00ff88', width: 2 },
        marker: { color: '#00ff88', size: 6 }
    };
    
    const layout = {
        polar: {
            bgcolor: 'rgba(0,0,0,0)',
            radialaxis: {
                visible: true,
                range: [0, 100],
                gridcolor: 'rgba(255,255,255,0.1)',
                tickfont: { color: '#9fb3c8', size: 11 }
            },
            angularaxis: {
                tickfont: { color: '#9fb3c8', size: 11 },
                gridcolor: 'rgba(255,255,255,0.1)'
            }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        showlegend: false
    };
    
    Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
}

