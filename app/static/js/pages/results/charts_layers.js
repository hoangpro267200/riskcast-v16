
import { $id } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

export function renderLayerChart(layers) {
    if (!window.Plotly || !layers || !Array.isArray(layers)) return;
    
    const el = $id("layerChart") || 
               $id("layers") || 
               document.querySelector("[data-chart='layers']");
    if (!el) {
        return;
    }
    
    const layerNames = layers.map(l => safe(l.name, ''));
    const contributions = layers.map(l => (safe(l.score, 0)) * 100); // Convert 0-1 to 0-100
    
    const trace = {
        type: 'bar',
        x: layerNames,
        y: contributions,
        marker: {
            color: contributions.map((v, i) => {
                const intensity = 0.3 + (v / Math.max(...contributions, 1)) * 0.7;
                return `rgba(0, 255, 136, ${intensity})`;
            }),
            line: { color: '#00ff88', width: 1 }
        },
        text: contributions.map(v => v.toFixed(1)),
        textposition: 'outside',
        cliponaxis: false,
        textfont: { color: '#9fb3c8', size: 11 }
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.05)'
        },
        yaxis: {
            title: { text: 'Đóng Góp Vào Chỉ Số Rủi Ro', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        showlegend: false
    };
    
    Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
}

