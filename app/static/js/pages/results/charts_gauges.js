
import { $id, setText } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return parseFloat(num).toFixed(decimals);
}

export function renderGaugeCharts(summary) {
    if (!window.Plotly || !summary) {
        return;
    }
    
    
    const { overall_risk_index, reliability_score, esg_score } = summary;
    const commonLayout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        margin: { t: 40, b: 20, l: 30, r: 30 },
        font: { color: '#9fb3c8' }
    };
    
    // Risk Gauge
    const riskEl = $id('gaugeRisk');
    if (riskEl) {
        const riskGauge = {
            type: 'indicator',
            mode: 'gauge+number',
            value: safe(overall_risk_index, 50),
            title: { text: 'Chỉ Số Rủi Ro Tổng Thể', font: { size: 16 } },
            gauge: {
                axis: { range: [0, 100] },
                bar: { color: '#00ff88' },
                steps: [
                    { range: [0, 40], color: 'rgba(0, 255, 136, 0.3)' },
                    { range: [40, 75], color: 'rgba(255, 170, 0, 0.3)' },
                    { range: [75, 100], color: 'rgba(255, 68, 68, 0.3)' }
                ]
            }
        };
        Plotly.newPlot(riskEl, [riskGauge], commonLayout, { displayModeBar: false, responsive: true });
    } else {
    }
    
    // Reliability Gauge
    const relEl = $id('gaugeReliability');
    if (relEl) {
        const relGauge = {
            type: 'indicator',
            mode: 'gauge+number',
            value: safe(reliability_score, 50),
            title: { text: 'Điểm Độ Tin Cậy', font: { size: 16 } },
            gauge: {
                axis: { range: [0, 100] },
                bar: { color: '#00d9ff' }
            }
        };
        Plotly.newPlot(relEl, [relGauge], commonLayout, { displayModeBar: false, responsive: true });
    } else {
    }
    
    // ESG Gauge
    const esgEl = $id('gaugeEsg');
    if (esgEl) {
        const esgGauge = {
            type: 'indicator',
            mode: 'gauge+number',
            value: safe(esg_score, 50),
            title: { text: 'Điểm ESG', font: { size: 16 } },
            gauge: {
                axis: { range: [0, 100] },
                bar: { color: '#00ff88' }
            }
        };
        Plotly.newPlot(esgEl, [esgGauge], commonLayout, { displayModeBar: false, responsive: true });
    } else {
    }
}

export function renderGauge(targetId, value, color = "#00ffa7") {
    if (!window.Plotly) return;

    const el = $id(targetId);
    if (!el) {
        return;
    }

    // Clear previous content
    el.innerHTML = '';

    // Check if this is a Priority Profile gauge
    const isPriorityGauge = targetId === "gaugeSpeed" || targetId === "gaugeCost" || targetId === "gaugeRiskTolerance";
    
    // Adjust layout based on gauge type
    const layout = {
        paper_bgcolor: "rgba(0,0,0,0)",
        plot_bgcolor: "rgba(0,0,0,0)",
        autosize: true,
        margin: isPriorityGauge 
            ? { t: 10, b: 10, l: 10, r: 10 }  // Smaller margins for Priority Profile
            : { t: 20, b: 0, l: 20, r: 20 }
    };

    Plotly.newPlot(targetId, [{
        type: "indicator",
        mode: "gauge+number",
        value: value,
        gauge: {
            axis: { 
                range: [0, 100], 
                tickcolor: "#00ffa7",
                tickfont: { size: 10 }
            },
            bar: { color: color },
            bgcolor: "rgba(0,0,0,0)",
            borderwidth: 2,
            bordercolor: "#00ffa7",
            steps: [
                { range: [0, 50], color: "rgba(0,255,180,0.15)" },
                { range: [50, 100], color: "rgba(0,255,180,0.25)" }
            ],
            threshold: {
                line: { color: "#00ffa7", width: 2 },
                thickness: 0.75,
                value: value
            }
        },
        number: { 
            font: { color: "#00ffa7", size: isPriorityGauge ? 24 : 28 },
            suffix: "%"
        }
    }], layout, {
        responsive: true,
        displayModeBar: false,
        staticPlot: false
    });

    // Fix offset for Priority Profile gauges
    if (isPriorityGauge) {
        fixGaugeOffset(targetId);
    }
}

function fixGaugeOffset(gaugeId) {
    let el = $id(gaugeId);
    if (!el) return;

    // Fix multiple times to ensure it works after Plotly renders
    const fixOffset = () => {
        const svg = el.querySelector("svg");
        const plotlyDiv = el.querySelector(".js-plotly-plot");
        
        if (svg) {
            svg.style.marginTop = "-40px";
            svg.style.display = "block";
            svg.style.maxHeight = "220px";
            svg.style.width = "100%";
            svg.style.height = "auto";
        }
        
        if (plotlyDiv) {
            plotlyDiv.style.marginTop = "-40px";
            plotlyDiv.style.overflow = "visible";
        }
        
        // Fix parent container
        const parentBox = el.closest(".pp-gauge-box");
        if (parentBox) {
            parentBox.style.overflow = "visible";
            parentBox.style.minHeight = "auto";
        }
    };

    // Fix immediately and after delays
    fixOffset();
    setTimeout(fixOffset, 100);
    setTimeout(fixOffset, 300);
    setTimeout(fixOffset, 500);
}

