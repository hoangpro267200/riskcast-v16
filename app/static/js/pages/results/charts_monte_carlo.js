
import { $id, setText } from '../../core/dom.js';

function safe(...values) {
    for (const v of values) {
        if (v !== null && v !== undefined && v !== '') return v;
    }
    return values[values.length - 1];
}

function formatUSD(amount) {
    if (!amount || isNaN(amount)) return '$0';
    return '$' + parseInt(amount).toLocaleString('en-US');
}

export function renderMonteCarlo(mcData) {
    if (!window.Plotly || !mcData) return;
    
    const el = $id("mcChart") || 
               $id("lossChart") || 
               $id("monteCarloChart");
    if (!el) {
        return;
    }
    
    const dist = mcData.loss_distribution || mcData.samples || [];
    const var95 = safe(mcData.var_95, 0);
    const cvar95 = safe(mcData.cvar_95, 0);
    const numSims = safe(mcData.num_simulations, 10000);
    
    // Update MC stats in HTML
    setText("mcVar", formatUSD(var95));
    setText("mcCVar", formatUSD(cvar95));
    setText("mcRuns", numSims.toLocaleString("vi-VN"));
    
    if (dist.length === 0) {
        el.innerHTML = "<div style='font-size:12px;color:#9ca3af'>Không có dữ liệu phân phối tổn thất.</div>";
        return;
    }
    
    // Histogram
    const trace = {
        type: 'histogram',
        x: dist,
        nbinsx: 50,
        marker: {
            color: 'rgba(0, 255, 136, 0.6)',
            line: { color: '#00ff88', width: 1 }
        },
        name: 'Loss Distribution'
    };
    
    const traces = [trace];
    
    // VaR line
    if (var95 > 0) {
        traces.push({
            type: 'scatter',
            x: [var95, var95],
            y: [0, 400],
            mode: 'lines',
            line: { color: '#ffaa00', width: 2, dash: 'dash' },
            name: 'VaR 95%',
            hovertemplate: 'VaR 95%: %{x}<extra></extra>'
        });
    }
    
    // CVaR line
    if (cvar95 > 0) {
        traces.push({
            type: 'scatter',
            x: [cvar95, cvar95],
            y: [0, 400],
            mode: 'lines',
            line: { color: '#ff4444', width: 2, dash: 'dash' },
            name: 'CVaR 95%',
            hovertemplate: 'CVaR 95%: %{x}<extra></extra>'
        });
    }
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            title: { text: 'Số Tiền Tổn Thất (USD)', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        yaxis: {
            title: { text: 'Tần Suất', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        showlegend: true,
        legend: {
            x: 0.7,
            y: 0.95,
            font: { color: '#9fb3c8', size: 11 }
        }
    };
    
    Plotly.newPlot(el, traces, layout, { displayModeBar: false, responsive: true });
}

