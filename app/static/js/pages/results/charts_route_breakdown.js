
import { $id } from '../../core/dom.js';

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

function formatPercent(value) {
    return formatNumber(value, 1) + '%';
}

export function renderRouteBreakdown(routeBreakdown) {
    if (!window.Plotly || !routeBreakdown || !Array.isArray(routeBreakdown)) {
        return;
    }
    
    
    renderRouteBreakdownChart(routeBreakdown);
    renderRouteBreakdownTable(routeBreakdown);
}

function renderRouteBreakdownChart(routeBreakdown) {
    const el = $id("routeBreakdownChart") || 
               $id("routeBreakdown") || 
               document.querySelector("[data-chart='routeBreakdown']");
    if (!el) {
        return;
    }
    
    const segments = routeBreakdown.map(d => safe(d.segment, ''));
    const risks = routeBreakdown.map(d => safe(d.risk_index, 0));
    
    const trace = {
        type: 'bar',
        x: risks,
        y: segments,
        orientation: 'h',
        marker: {
            color: risks.map(v => `rgba(0, 255, 136, ${0.3 + (v/100)*0.7})`),
            line: { color: '#00ff88', width: 1 }
        },
        text: risks.map(v => v.toFixed(0)),
        textposition: 'outside',
        cliponaxis: false,
        textfont: { color: '#9fb3c8', size: 11 }
    };
    
    const layout = {
        title: {
            text: 'Chỉ Số Rủi Ro Theo Đoạn Tuyến',
            font: { color: '#9fb3c8', size: 14 },
            x: 0.05
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            title: { text: 'Chỉ Số Rủi Ro (0-100)', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        yaxis: {
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.05)'
        },
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        showlegend: false
    };
    
    Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
}

function renderRouteBreakdownTable(routeBreakdown) {
    const container = $id("routeBreakdownTable");
    if (!container) {
        return;
    }
    
    if (!routeBreakdown || routeBreakdown.length === 0) {
        container.innerHTML = "<div style='font-size:12px;color:#9ca3af'>Không có dữ liệu phân tích tuyến đường.</div>";
        return;
    }
    
    let tableHTML = '<table class="data-table"><thead><tr>' +
                    '<th>Đoạn Tuyến</th>' +
                    '<th>Phương Thức</th>' +
                    '<th>Chỉ Số Rủi Ro</th>' +
                    '<th>Rủi Ro Trễ</th>' +
                    '<th>Rủi Ro Hư Hại</th>' +
                    '<th>Chi Tiết</th>' +
                    '</tr></thead><tbody>';
                    
    routeBreakdown.forEach(row => {
        tableHTML += `
            <tr>
                <td><strong>${safe(row.segment, '')}</strong></td>
                <td>${safe(row.mode, '')}</td>
                <td><strong style="color: var(--accent-green);">${formatNumber(safe(row.risk_index, 0), 0)}</strong></td>
                <td>${formatPercent((safe(row.delay_risk, 0)) * 100)}</td>
                <td>${formatPercent((safe(row.damage_risk, 0)) * 100)}</td>
                <td style="font-size: 12px; color: var(--text-secondary);">${safe(row.detail, '')}</td>
            </tr>
        `;
    });
    
    tableHTML += '</tbody></table>';
    container.innerHTML = tableHTML;
}

