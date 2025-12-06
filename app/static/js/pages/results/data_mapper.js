
export function mapBackendToAppData(data) {
    // Safe getter helper
    const safe = (...values) => {
        for (const v of values) {
            if (v !== null && v !== undefined && v !== '') return v;
        }
        return values[values.length - 1];
    };
    
    // Convert risk_score (0-1) to overall_risk_index (0-100)
    const riskScore = safe(data.risk_score, 0.5) * 100;
    const reliability = safe(data.reliability, 0.5) * 100;
    const esg = safe(data.esg, 0.5) * 100;

    // Map layers: convert score (0-1) to (0-100) and calculate contribution
    const rawLayers = safe(data.layers, []);
    
    const layers = rawLayers.map((layer, idx) => {
        const score = safe(layer.score, 0) * 100;
        const contribution = safe(layer.score, 0) * 15.0;
        return {
            name: safe(layer.name, `Layer ${idx + 1}`),
            score: score,
            contribution: contribution
        };
    });
    

    // Map Monte Carlo data
    const mcSamples = safe(data.mc_samples, []);
    
    const monte_carlo = {
        num_simulations: mcSamples.length || 10000,
        loss_distribution: mcSamples.length > 0 ? mcSamples : generateLossDistribution(),
        expected_loss: safe(data.expected_loss, 0),
        p95: safe(data.var, 0),
        var_95: safe(data.var, 0),
        cvar_95: safe(data.cvar, 0)
    };
    

    // Map scenarios from data.scenarios (backend format)
    let scenarios = [];
    const scen = safe(data.scenarios, safe(data.scenario_analysis, {}));
    
    // Map scenarios object { base: {...}, best: {...}, worst: {...} }
    if (scen && typeof scen === 'object') {
        // Base case (always first)
        if (scen.base) {
            const base = scen.base;
            scenarios.push({
                name: safe(base.name, "Trường Hợp Cơ Bản"),
                description: safe(base.description, "Hoạt động bình thường, không có gián đoạn cực đoan."),
                overall_risk: safe(base.risk_index, base.risk || riskScore),
                expected_loss: safe(base.expected_loss, data.expected_loss || 0),
                var_95: safe(base.var_95, data.var || 0),
                cvar_95: safe(base.cvar_95, data.cvar || 0),
                risk_index: safe(base.risk_index, base.risk || riskScore)
            });
        } else {
            scenarios.push({
                name: "Trường Hợp Cơ Bản",
                description: "Hoạt động bình thường, không có gián đoạn cực đoan.",
                overall_risk: riskScore,
                expected_loss: safe(data.expected_loss, 0),
                var_95: safe(data.var, 0),
                cvar_95: safe(data.cvar, 0),
                risk_index: riskScore
            });
        }

        // Best case
        if (scen.best) {
            const best = scen.best;
            scenarios.push({
                name: safe(best.name, "Kịch Bản Tốt Nhất"),
                description: safe(best.description, "Điều kiện tối ưu với gián đoạn tối thiểu."),
                overall_risk: safe(best.risk_index, best.risk || riskScore * 0.7),
                expected_loss: safe(best.expected_loss, data.expected_loss * 0.7),
                var_95: safe(best.var_95, data.var * 0.7),
                cvar_95: safe(best.cvar_95, data.cvar * 0.7),
                risk_index: safe(best.risk_index, best.risk || riskScore * 0.7)
            });
        }

        // Worst case
        if (scen.worst) {
            const worst = scen.worst;
            scenarios.push({
                name: safe(worst.name, "Kịch Bản Xấu Nhất"),
                description: safe(worst.description, "Gián đoạn nghiêm trọng và điều kiện bất lợi."),
                overall_risk: safe(worst.risk_index, worst.risk || riskScore * 1.5),
                expected_loss: safe(worst.expected_loss, data.expected_loss * 1.5),
                var_95: safe(worst.var_95, data.var * 1.5),
                cvar_95: safe(worst.cvar_95, data.cvar * 1.5),
                risk_index: safe(worst.risk_index, worst.risk || riskScore * 1.5)
            });
        }
    }
    
    // Ensure at least 3 scenarios
    if (scenarios.length < 3) {
        const baseLoss = safe(data.expected_loss, 0);
        const baseVar = safe(data.var, 0);
        const baseCVar = safe(data.cvar, 0);
        
        if (scenarios.length === 1) {
            scenarios.push({
                name: "Tắc Nghẽn Cảng",
                description: "Tắc nghẽn nghiêm trọng tại trung tâm chuyển tải chính (ví dụ: Singapore, LA).",
                overall_risk: Math.min(100, riskScore + 12),
                expected_loss: Math.round(baseLoss * 1.3),
                var_95: Math.round(baseVar * 1.25),
                cvar_95: Math.round(baseCVar * 1.2),
                risk_index: Math.min(100, riskScore + 12)
            });
        }
        if (scenarios.length === 2) {
            scenarios.push({
                name: "Mùa Bão",
                description: "Rủi ro khí hậu cao dọc theo tuyến đường biển, có khả năng phải đổi tuyến.",
                overall_risk: Math.min(100, riskScore + 6),
                expected_loss: Math.round(baseLoss * 1.15),
                var_95: Math.round(baseVar * 1.18),
                cvar_95: Math.round(baseCVar * 1.15),
                risk_index: Math.min(100, riskScore + 6)
            });
        }
    }
    

    // Map timeline from data.timeline (real backend data)
    let timeline_points = [];
    let risk_over_time = [];
    
    // Priority 1: Use data.timeline if available (array of daily risk values)
    if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
        risk_over_time = data.timeline.map(v => {
            const val = safe(v, 0);
            // If value is 0-1, convert to 0-100; if already 0-100, use as-is
            return val <= 1 ? val * 100 : val;
        });
        timeline_points = risk_over_time.map((_, i) => `Ngày ${i + 1}`);
    }
    // Priority 2: Use forecast data
    else if (data.forecast) {
        const forecast = safe(data.forecast, {});
        if (forecast.days && forecast.days.length > 0) {
            timeline_points = forecast.days.map(d => `Ngày ${d}`);
            risk_over_time = forecast.values ? forecast.values.map(v => {
                const val = safe(v, 0);
                return val <= 1 ? val * 100 : val;
            }) : [];
        } else if (forecast.values && forecast.values.length > 0) {
            timeline_points = forecast.values.map((_, i) => `Ngày ${i + 1}`);
            risk_over_time = forecast.values.map(v => {
                const val = safe(v, 0);
                return val <= 1 ? val * 100 : val;
            });
        }
    }
    
    // Fallback: Generate 30 points if no data
    if (timeline_points.length === 0 || risk_over_time.length === 0) {
        const baseRisk = riskScore;
        timeline_points = [];
        risk_over_time = [];
        for (let i = 0; i < 30; i++) {
            timeline_points.push(`Ngày ${i + 1}`);
            const variation = (Math.sin(i * 0.2) * 5) + (Math.random() * 3 - 1.5);
            risk_over_time.push(Math.max(50, Math.min(100, baseRisk + variation)));
        }
    }
    
    const time_series = {
        timeline_points,
        risk_over_time
    };
    

    // Extract route from backend (use full route, not simplified)
    let routeText = safe(data.route, "—");
    
    // Default meta info
    const meta = {
        route: routeText,
        incoterm: safe(data.incoterm, "CIF"),
        cargo_type: safe(data.cargo_type, "Electronics / High-value"),
        transport_mode: safe(data.transport_mode, "Ocean + Multimodal"),
        scenario_name: safe(data.scenario_name, "VN Export - Balanced Priority"),
        analysis_date: safe(data.analysis_date, new Date().toISOString().split('T')[0])
    };

    // Default savings_and_business
    const savings_and_business = {
        baseline_cost: 8500,
        optimized_cost: Math.round(8500 * 0.85),
        cost_saving_pct: 15,
        baseline_expected_loss: Math.round((safe(data.expected_loss, 0)) * 1.3),
        baseline_reliability: Math.max(0, reliability - 16),
        baseline_insurance_pct: 2.8,
        optimized_insurance_pct: 2.1,
        risk_reduction_pct: 32,
        potential_arr_annual: 3000000
    };

    // Default risk_matrix with Vietnamese labels
    const risk_matrix = {
        labels_probability: ["Rất Thấp", "Thấp", "Trung Bình", "Cao", "Rất Cao"],
        labels_impact: ["Nhỏ", "Vừa", "Lớn", "Nghiêm Trọng", "Tới Hạn"],
        matrix_values: [
            [1, 2, 3, 4, 5],
            [0, 2, 4, 6, 8],
            [0, 1, 5, 7, 9],
            [0, 0, 2, 6, 10],
            [0, 0, 1, 4, 8]
        ]
    };

    // Map route_segments from backend
    let route_breakdown = [];
    if (data.route_segments && Array.isArray(data.route_segments) && data.route_segments.length > 0) {
        route_breakdown = data.route_segments.map(seg => ({
            segment: safe(seg.name, seg.segment || "Đoạn không xác định"),
            mode: safe(seg.mode, "Không xác định"),
            risk_index: safe(seg.risk, seg.risk_index || 0),
            delay_risk: safe(seg.delay_risk, 0),
            damage_risk: safe(seg.damage_risk, 0),
            detail: safe(seg.detail, seg.description || "")
        }));
    } else {
        // Fallback with Vietnamese labels
        route_breakdown = [
            { segment: "Nhà Máy VN → Cảng VN", mode: "Xe Tải (FCL)", risk_index: 62, delay_risk: 0.18, damage_risk: 0.10, detail: "Vận chuyển nội địa từ nhà máy đến cảng" },
            { segment: "Cảng VN → Trung Tâm Chuyển Tải", mode: "Đường Biển", risk_index: 80, delay_risk: 0.26, damage_risk: 0.12, detail: "Hành trình biển quốc tế" },
            { segment: "Trung Tâm → Cảng Đích", mode: "Đường Biển", risk_index: 78, delay_risk: 0.24, damage_risk: 0.11, detail: "Hành trình biển đến cảng đích" },
            { segment: "Cảng Đích → Người Mua", mode: "Xe Tải / Đường Sắt", risk_index: 70, delay_risk: 0.20, damage_risk: 0.09, detail: "Vận chuyển cuối cùng đến người nhận" }
        ];
    }

    // Map radar data
    const radar = safe(data.radar, { labels: [], values: [] });
    const radarData = {
        labels: safe(radar.labels, layers.map(l => l.name)),
        values: safe(radar.values, layers.map(l => l.score / 100)) // Convert 0-100 back to 0-1
    };
    

    // Map recommendations from backend
    const recommendations_vi = safe(data.recommendations_vi, []);
    const recommendations_en = safe(data.recommendations_en, []);
    
    
    const finalAppData = {
        meta,
        risk_layers: layers,
        monte_carlo,
        radar: radarData,
        summary: {
            expected_loss: safe(data.expected_loss, 0),
            reliability_score: reliability,
            esg_score: esg,
            overall_risk_index: riskScore,
            risk_level_label: safe(data.risk_level, "MODERATE"),
            top_route_risk: safe(data.top_route_risk, 
                layers.length > 0 ? layers[0].name : "Chưa xác định"),
            main_driver: safe(data.main_driver, 
                "Mô phỏng Monte Carlo với các lớp rủi ro điều chỉnh theo khí hậu"),
            recommendation: safe(data.recommendation, 
                "Tập trung vào 2-3 lớp rủi ro hàng đầu; cân nhắc các hãng vận chuyển cao cấp và tối ưu hóa tuyến đường.")
        },
        time_series,
        scenarios,
        savings_and_business,
        risk_matrix,
        route_breakdown,
        recommendations_vi,
        recommendations_en,
        criteria_weights: layers.map(l => ({ name: l.name, weight: l.contribution / 100 }))
    };

    return finalAppData;
}

function generateLossDistribution() {
    const distribution = [];
    for (let i = 0; i < 10000; i++) {
        distribution.push(Math.random() * 1000);
    }
    return distribution;
}

