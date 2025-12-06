
import { $id } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

export function renderRiskMatrixChart(riskMatrix) {
    if (!window.Plotly || !riskMatrix) return;
    
    const el = $id("riskMatrixChart") || 
               $id("riskMatrix") || 
               document.querySelector("[data-chart='riskMatrix']");
    if (!el) {
        return;
    }
    
    const labels_probability = safe(riskMatrix.labels_probability, ["Rất Thấp", "Thấp", "Trung Bình", "Cao", "Rất Cao"]);
    const labels_impact = safe(riskMatrix.labels_impact, ["Nhỏ", "Vừa", "Lớn", "Nghiêm Trọng", "Tới Hạn"]);
    const matrix_values = safe(riskMatrix.matrix_values, []);
    
    if (matrix_values.length === 0) {
        el.innerHTML = "<div style='font-size:12px;color:#9ca3af'>Không có dữ liệu ma trận rủi ro.</div>";
        return;
    }
    
    const text = matrix_values.map(row => row.map(val => val > 0 ? val.toString() : ''));
    
    const trace = {
        type: 'heatmap',
        x: labels_impact,
        y: labels_probability,
        z: matrix_values,
        text: text,
        texttemplate: "%{text}",
        colorscale: [
            ['0.0', 'rgba(0,0,0,0.1)'],
            ['0.1', '#00ff88'],
            ['0.5', '#ffaa00'],
            ['1.0', '#ff4444']
        ],
        showscale: false,
        zmin: 0,
        zmax: 10
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            title: { text: 'Mức Độ Tác Động', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            side: 'top'
        },
        yaxis: {
            title: { text: 'Xác Suất', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            autorange: 'reversed'
        },
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        annotations: []
    };
    
    for (let i = 0; i < labels_probability.length; i++) {
        for (let j = 0; j < labels_impact.length; j++) {
            if (matrix_values[i][j] > 0) {
                layout.annotations.push({
                    x: labels_impact[j],
                    y: labels_probability[i],
                    text: matrix_values[i][j],
                    showarrow: false,
                    font: { color: 'black', size: 12, weight: 'bold' }
                });
            }
        }
    }
    
    Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
}

