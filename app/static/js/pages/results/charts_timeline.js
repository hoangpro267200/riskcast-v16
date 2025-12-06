
import { $id } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

export function renderTimelineChart(tsData) {
    if (!window.Plotly) {
        return;
    }
    
    const el = $id("timelineChart") || 
               $id("forecastChart") || 
               document.querySelector("[data-chart='timeline']");
    if (!el) {
        return;
    }
    
    let timeline = tsData?.timeline_points || tsData?.days || [];
    let riskOverTime = tsData?.risk_over_time || tsData?.values || [];
    
    // Fallback if no data
    if (timeline.length === 0 || riskOverTime.length === 0) {
        const baseRisk = window.appData?.summary?.overall_risk_index || 76;
        timeline = [];
        riskOverTime = [];
        for (let i = 0; i < 30; i++) {
            timeline.push(`Ngày ${i + 1}`);
            const variation = (Math.sin(i * 0.2) * 5) + (Math.random() * 3 - 1.5);
            riskOverTime.push(Math.max(50, Math.min(100, baseRisk + variation)));
        }
    }
    
    // Ensure arrays match length
    const minLen = Math.min(timeline.length, riskOverTime.length);
    timeline = timeline.slice(0, minLen);
    riskOverTime = riskOverTime.slice(0, minLen);
    
    // Auto-scale y-axis
    const minRisk = Math.max(0, Math.min(...riskOverTime) - 10);
    const maxRisk = Math.min(100, Math.max(...riskOverTime) + 10);
    
    
    const trace = {
        type: 'scatter',
        x: timeline,
        y: riskOverTime,
        mode: 'lines+markers',
        line: { color: '#00d9ff', width: 3 },
        marker: { color: '#00d9ff', size: 8 },
        fill: 'tozeroy',
        fillcolor: 'rgba(0, 217, 255, 0.2)',
        hovertemplate: 'Ngày: %{x}<br>Chỉ Số Rủi Ro: %{y:.1f}<extra></extra>'
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            title: { text: 'Thời Gian', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.05)',
            tickangle: -45
        },
        yaxis: {
            title: { text: 'Chỉ Số Rủi Ro', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.1)',
            range: [minRisk, maxRisk]
        },
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        showlegend: false
    };
    
    Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
}

