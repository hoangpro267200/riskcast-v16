
import { $id, setText } from '../../core/dom.js';
import { on } from '../../core/events.js';

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

function formatNumber(num, decimals = 2) {
    if (num === null || num === undefined || isNaN(num)) return '0';
    return parseFloat(num).toFixed(decimals);
}

export function renderScenarioCharts(scenarios) {
    if (!window.Plotly) {
        return;
    }
    
    if (!scenarios || scenarios.length === 0) {
        scenarios = generateDefaultScenarios();
    }
    
    // Render scenario buttons (base, best, worst)
    renderScenarioButtons(scenarios);
    
    // Initialize with base scenario
    setScenario("base", scenarios);
}

function renderScenarioButtons(scenarios) {
    const container = $id("scenarioPills");
    if (!container) {
        return;
    }
    
    // Clear container
    container.innerHTML = "";
    
    // Map scenarios to buttons: base, best, worst
    const scenarioMap = {
        base: scenarios[0] || null,
        best: scenarios.find(s => s.name?.toLowerCase().includes("tốt") || s.name?.toLowerCase().includes("best")) || scenarios[1] || null,
        worst: scenarios.find(s => s.name?.toLowerCase().includes("xấu") || s.name?.toLowerCase().includes("worst")) || scenarios[2] || null
    };
    
    // Create buttons
    const buttons = [
        { mode: "base", label: "Trường Hợp Cơ Bản", scenario: scenarioMap.base },
        { mode: "best", label: "Kịch Bản Tốt Nhất", scenario: scenarioMap.best },
        { mode: "worst", label: "Kịch Bản Xấu Nhất", scenario: scenarioMap.worst }
    ];
    
    buttons.forEach(({ mode, label, scenario }) => {
        if (!scenario) return;
        
        const btn = document.createElement("button");
        btn.className = "scenario-btn scenario-pill";
        btn.id = `btn-scenario-${mode}`;
        btn.textContent = label;
        on(btn, 'click', () => setScenario(mode, scenarios));
        container.appendChild(btn);
    });
}

function setScenario(mode, scenarios) {
    if (!scenarios || scenarios.length === 0) return;
    
    // Find scenario by mode
    let scenario = null;
    if (mode === "base") {
        scenario = scenarios[0];
    } else if (mode === "best") {
        scenario = scenarios.find(s => s.name?.toLowerCase().includes("tốt") || s.name?.toLowerCase().includes("best")) || scenarios[1];
    } else if (mode === "worst") {
        scenario = scenarios.find(s => s.name?.toLowerCase().includes("xấu") || s.name?.toLowerCase().includes("worst")) || scenarios[2];
    }
    
    if (!scenario) {
        return;
    }
    
    // Update active button
    document.querySelectorAll(".scenario-btn").forEach(b => b.classList.remove("active"));
    const btn = $id(`btn-scenario-${mode}`);
    if (btn) btn.classList.add("active");
    
    // Update description
    const descEl = $id("scenario-description");
    if (descEl) {
        descEl.textContent = scenario.description || "Mô tả kịch bản";
    }
    
    // Update chart with mode
    loadScenario(scenario, mode);
}

function loadScenario(scenario, mode = "base") {
    if (!window.Plotly || !scenario) return;
    
    const el = $id("scenarioChart");
    if (!el) {
        return;
    }
    
    const categories = ['Chỉ Số Rủi Ro', 'Tổn Thất Kỳ Vọng', 'VaR (95%)', 'CVaR (95%)'];
    const values = [
        safe(scenario.risk_index, scenario.overall_risk, 0),
        safe(scenario.expected_loss, 0),
        safe(scenario.var_95, 0),
        safe(scenario.cvar_95, 0)
    ];
    
    // Neon palette based on mode
    const neonPalette = {
        base: 'rgba(0, 217, 255, 0.7)',
        best: 'rgba(0, 255, 136, 0.7)',
        worst: 'rgba(255, 68, 68, 0.7)'
    };
    
    // Determine color from scenario name or mode
    let color = neonPalette.base;
    const nameLower = (scenario.name || "").toLowerCase();
    if (nameLower.includes("tốt") || nameLower.includes("best")) {
        color = neonPalette.best;
    } else if (nameLower.includes("xấu") || nameLower.includes("worst")) {
        color = neonPalette.worst;
    } else if (mode === "best") {
        color = neonPalette.best;
    } else if (mode === "worst") {
        color = neonPalette.worst;
    }
    
    const trace = {
        type: 'bar',
        x: categories,
        y: values,
        marker: {
            color: color,
            line: { color: '#ffffff', width: 1 }
        },
        text: values.map(v => {
            if (v >= 1000) return formatUSD(v);
            return formatNumber(v, 0);
        }),
        textposition: 'outside',
        cliponaxis: false,
        textfont: { color: '#e8f5ff', size: 12, weight: 'bold' }
    };
    
    const layout = {
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        xaxis: {
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.05)'
        },
        yaxis: {
            title: { text: 'Giá Trị', font: { color: '#9fb3c8', size: 12 } },
            tickfont: { color: '#9fb3c8', size: 11 },
            gridcolor: 'rgba(255,255,255,0.1)'
        },
        margin: { t: 40, b: 60, l: 60, r: 60 },
        automargin: true,
        showlegend: false
    };
    
    Plotly.react(el, [trace], layout, { displayModeBar: false, responsive: true });
}

function generateDefaultScenarios() {
    const baseRisk = window.appData?.summary?.overall_risk_index || 76;
    const baseLoss = window.appData?.summary?.expected_loss || 12500;
    const baseVar = window.appData?.monte_carlo?.var_95 || 28000;
    const baseCVar = window.appData?.monte_carlo?.cvar_95 || 35000;
    
    return [
        {
            name: "Trường Hợp Cơ Bản",
            description: "Hoạt động bình thường, không có gián đoạn cực đoan.",
            overall_risk: baseRisk,
            expected_loss: baseLoss,
            var_95: baseVar,
            cvar_95: baseCVar
        },
        {
            name: "Tắc Nghẽn Cảng",
            description: "Tắc nghẽn nghiêm trọng tại trung tâm chuyển tải chính (ví dụ: Singapore, LA).",
            overall_risk: Math.min(100, baseRisk + 12),
            expected_loss: Math.round(baseLoss * 1.3),
            var_95: Math.round(baseVar * 1.25),
            cvar_95: Math.round(baseCVar * 1.2)
        },
        {
            name: "Mùa Bão",
            description: "Rủi ro khí hậu cao dọc theo tuyến đường biển, có khả năng phải đổi tuyến.",
            overall_risk: Math.min(100, baseRisk + 6),
            expected_loss: Math.round(baseLoss * 1.15),
            var_95: Math.round(baseVar * 1.18),
            cvar_95: Math.round(baseCVar * 1.15)
        }
    ];
}

