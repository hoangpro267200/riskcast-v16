// ===============================
// RISKCAST v14.5 — RESULTS CORE
// Map Backend JSON → appData → Charts
// ===============================

console.log("🔥 results_core.js LOADED");

window.ResultsCore = {
    _initCalled: false,
    mode: "enterprise",
    
    async init(data = null) {
        // Prevent multiple calls
        if (this._initCalled) {
            console.log("🔥 INIT() already called, skipping duplicate");
            return;
        }
        this._initCalled = true;
        
        console.log("=".repeat(80));
        console.log("[RISKCAST DEBUG] ResultsCore.init() STARTED");
        console.log("=".repeat(80));
        
        // If no data provided, fetch from backend
        if (!data) {
            try {
                const res = await fetch("/api/get_last_result");
                if (!res.ok) {
                    this.showError("Không có kết quả. Vui lòng chạy phân tích trước.");
                    return;
                }
                const responseData = await res.json();
                
                // Check if response indicates no result
                if (responseData.error === "no_result") {
                    this.showError("Không có kết quả. Vui lòng chạy phân tích từ trang /input trước.");
                    return;
                }
                
                data = responseData;
            } catch (err) {
                console.error("[RESULTS] Fetch error:", err);
                this.showError("Không thể tải kết quả từ máy chủ.");
            return;
            }
        }

        // ===============================
        // STEP 1: MAP BACKEND DATA → appData
        // ===============================
        const appData = this.mapBackendToAppData(data);
        
        // Store in window for inline JS access
        window.appData = appData;
        console.log("[RISKCAST DEBUG] window.appData set:", Object.keys(window.appData));
        
        // ===============================
        // STEP 4: SET CHART DATA FOR RiskcastCharts
        // ===============================
        const radar = this.safe(data.radar, { labels: [], values: [] });
        window.RISKCAST_RADAR = {
            labels: this.safe(radar.labels, []),
            scores: (this.safe(radar.values, [])).map(v => (this.safe(v, 0)) * 10)  // Convert 0-1 to 0-10
        };
        
        window.RISKCAST_LOSS_DIST = this.safe(data.mc_samples, []);
        window.RISKCAST_FORECAST = this.safe(data.forecast, {});
        
        console.log("[RISKCAST DEBUG] Chart data set:");
        console.log("  RISKCAST_RADAR:", window.RISKCAST_RADAR);
        console.log("  RISKCAST_LOSS_DIST length:", window.RISKCAST_LOSS_DIST.length);
        console.log("  RISKCAST_FORECAST:", window.RISKCAST_FORECAST);
        
        // ===============================
        // STEP 5: INITIALIZE LANGUAGE SYSTEM
        // ===============================
        this.initializeLanguage();
        
        // ===============================
        // STEP 6: UPDATE UI ELEMENTS
        // ===============================
        this.updateHeader(data, appData);
        this.updateSummaryCards(data);
        this.updateClimateMetrics(data);
        this.updateInsights(data);
        this.updateBuyerSeller(data);
        this.renderLayersTable(this.safe(data.layers, []));
        this.updateSnapshot();
        
        // ===============================
        // STEP 6.5: RENDER PRIORITY GAUGES
        // ===============================
        this.renderPriorityGauges(data);
        
        // ===============================
        // STEP 7: RENDER GAUGE EXPLANATIONS
        // ===============================
        this.renderGaugeExplanation(appData);

        // ===============================
        // STEP 6: VALIDATE DOM ELEMENTS
        // ===============================
        this.validateDOMElements();

        // ===============================
        // STEP 7: BIND TABS AND APPLY MODE
        // ===============================
        this.bindTabs();
        this.applyMode(this.mode);
        
        // ===============================
        // STEP 8: UPDATE RECOMMENDATIONS
        // ===============================
        this.updateRecommendations(appData);
        
        // ===============================
        // STEP 9: CALL CHART RENDERING
        // ===============================
        console.log("🔥 INIT()");
        console.log("🔥 INIT CALLED, appData:", window.appData);
        
        // Wait for Plotly and DOM to be ready
        const waitForReady = () => {
            if (!window.Plotly) {
                console.log("Waiting for Plotly...");
                setTimeout(waitForReady, 50);
                return;
            }
            console.log("🔥 Rendering all charts…");
            this.renderAllCharts(window.appData);
        };
        waitForReady();
    },

    // ===============================
    // BIND TAB BUTTONS
    // ===============================
    bindTabs() {
        const tabEnterprise = document.getElementById("tab-enterprise");
        const tabResearch = document.getElementById("tab-research");
        const tabInvestor = document.getElementById("tab-investor");
        
        if (tabEnterprise) {
            tabEnterprise.onclick = () => this.applyMode("enterprise");
        }
        if (tabResearch) {
            tabResearch.onclick = () => this.applyMode("research");
        }
        if (tabInvestor) {
            tabInvestor.onclick = () => this.applyMode("investor");
        }
    },

    // === RISKCAST FIX === APPLY MODE (SHOW/HIDE SECTIONS)
    applyMode(mode) {
        this.mode = mode;
        
        // Hide all mode sections using view-hidden class
        document.querySelectorAll(".mode-section").forEach(el => {
            el.classList.add("view-hidden");
        });
        
        // Show selected mode
        const targetSection = document.getElementById("mode-" + mode);
        if (targetSection) {
            targetSection.classList.remove("view-hidden");
        }
        
        // Update tab buttons
        document.querySelectorAll(".view-tab").forEach(el => {
            el.classList.remove("active");
        });
        
        const targetTab = document.getElementById("tab-" + mode);
        if (targetTab) {
            targetTab.classList.add("active");
        }
        
        console.log("⭐ Switched to mode:", mode);
        
        // Re-render charts for this mode
        setTimeout(() => {
            this.renderAllCharts(window.appData);
        }, 100);
    },
    
    // === RISKCAST FIX === SET ACTIVE VIEW (alias for applyMode)
    setActiveView(mode) {
        this.applyMode(mode);
    },

    // ===============================
    // SAFE VALUE HELPER
    // ===============================
    safe(val, def) {
        if (val === undefined || val === null || (typeof val === 'number' && Number.isNaN(val))) {
            return def;
        }
        return val;
    },

    // ===============================
    // VALIDATE DOM ELEMENTS
    // ===============================
    validateDOMElements() {
        const requiredIds = [
            'radarChart', 'layerChart', 'mcChart', 
            'gaugeRisk', 'gaugeReliability', 'gaugeEsg',
            'forecastChart', 'scenarioChart', 'timelineChart'
        ];
        
        console.log("[RISKCAST DEBUG] Validating DOM elements:");
        const missing = [];
        requiredIds.forEach(id => {
            const el = document.getElementById(id);
            if (!el) {
                missing.push(id);
                console.warn(`  ❌ Missing: #${id}`);
            } else {
                console.log(`  ✅ Found: #${id}`);
            }
        });
        
        if (missing.length > 0) {
            console.error(`[RISKCAST ERROR] Missing ${missing.length} DOM elements:`, missing);
        }
    },

    // ===============================
    // MAP BACKEND → appData STRUCTURE
    // ===============================
    mapBackendToAppData(data) {
        console.log("[RISKCAST DEBUG] Mapping backend data to appData structure...");
        
        // Convert risk_score (0-1) to overall_risk_index (0-100)
        const riskScore = this.safe(data.risk_score, 0.5) * 100;
        const reliability = this.safe(data.reliability, 0.5) * 100;
        const esg = this.safe(data.esg, 0.5) * 100;

        console.log("[RISKCAST DEBUG] Summary values:");
        console.log("  riskScore:", riskScore);
        console.log("  reliability:", reliability);
        console.log("  esg:", esg);

        // Map layers: convert score (0-1) to (0-100) and calculate contribution
        const rawLayers = this.safe(data.layers, []);
        console.log("[RISKCAST DEBUG] Raw layers:", rawLayers);
        
        const layers = rawLayers.map((layer, idx) => {
            const score = this.safe(layer.score, 0) * 100;
            const contribution = this.safe(layer.score, 0) * 15.0;
            return {
                name: this.safe(layer.name, `Layer ${idx + 1}`),
                score: score,
                contribution: contribution
            };
        });
        
        console.log("[RISKCAST DEBUG] Mapped layers:", layers);

        // Map Monte Carlo data
        const mcSamples = this.safe(data.mc_samples, []);
        console.log("[RISKCAST DEBUG] MC samples count:", mcSamples.length);
        
        const monte_carlo = {
            num_simulations: mcSamples.length || 10000,
            loss_distribution: mcSamples.length > 0 ? mcSamples : this.generateLossDistribution(),
            expected_loss: this.safe(data.expected_loss, 0),
            p95: this.safe(data.var, 0),
            var_95: this.safe(data.var, 0),
            cvar_95: this.safe(data.cvar, 0)
        };
        
        console.log("[RISKCAST DEBUG] Monte Carlo:", {
            num_simulations: monte_carlo.num_simulations,
            loss_dist_length: monte_carlo.loss_distribution.length,
            var_95: monte_carlo.var_95,
            cvar_95: monte_carlo.cvar_95
        });

        // === RISKCAST FIX === Map scenarios from data.scenarios (backend format)
        let scenarios = [];
        const scen = this.safe(data.scenarios, this.safe(data.scenario_analysis, {}));
        console.log("[RISKCAST DEBUG] Scenario data:", scen);
        
        // Map scenarios object { base: {...}, best: {...}, worst: {...} }
        if (scen && typeof scen === 'object') {
            // Base case (always first)
            if (scen.base) {
                const base = scen.base;
                scenarios.push({
                    name: this.safe(base.name, "Trường Hợp Cơ Bản"),
                    description: this.safe(base.description, "Hoạt động bình thường, không có gián đoạn cực đoan."),
                    overall_risk: this.safe(base.risk_index, base.risk || riskScore),
                    expected_loss: this.safe(base.expected_loss, data.expected_loss || 0),
                    var_95: this.safe(base.var_95, data.var || 0),
                    cvar_95: this.safe(base.cvar_95, data.cvar || 0),
                    risk_index: this.safe(base.risk_index, base.risk || riskScore)
                });
            } else {
                scenarios.push({
                    name: "Trường Hợp Cơ Bản",
                    description: "Hoạt động bình thường, không có gián đoạn cực đoan.",
                    overall_risk: riskScore,
                    expected_loss: this.safe(data.expected_loss, 0),
                    var_95: this.safe(data.var, 0),
                    cvar_95: this.safe(data.cvar, 0),
                    risk_index: riskScore
                });
            }

            // Best case
            if (scen.best) {
                const best = scen.best;
                scenarios.push({
                    name: this.safe(best.name, "Kịch Bản Tốt Nhất"),
                    description: this.safe(best.description, "Điều kiện tối ưu với gián đoạn tối thiểu."),
                    overall_risk: this.safe(best.risk_index, best.risk || riskScore * 0.7),
                    expected_loss: this.safe(best.expected_loss, data.expected_loss * 0.7),
                    var_95: this.safe(best.var_95, data.var * 0.7),
                    cvar_95: this.safe(best.cvar_95, data.cvar * 0.7),
                    risk_index: this.safe(best.risk_index, best.risk || riskScore * 0.7)
                });
            }

            // Worst case
            if (scen.worst) {
                const worst = scen.worst;
                scenarios.push({
                    name: this.safe(worst.name, "Kịch Bản Xấu Nhất"),
                    description: this.safe(worst.description, "Gián đoạn nghiêm trọng và điều kiện bất lợi."),
                    overall_risk: this.safe(worst.risk_index, worst.risk || riskScore * 1.5),
                    expected_loss: this.safe(worst.expected_loss, data.expected_loss * 1.5),
                    var_95: this.safe(worst.var_95, data.var * 1.5),
                    cvar_95: this.safe(worst.cvar_95, data.cvar * 1.5),
                    risk_index: this.safe(worst.risk_index, worst.risk || riskScore * 1.5)
                });
            }
        }
        
        // Ensure at least 3 scenarios
        if (scenarios.length < 3) {
            const baseLoss = this.safe(data.expected_loss, 0);
            const baseVar = this.safe(data.var, 0);
            const baseCVar = this.safe(data.cvar, 0);
            
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
        
        console.log("[RISKCAST DEBUG] Scenarios mapped:", scenarios);

        // === RISKCAST FIX === Map timeline from data.timeline (real backend data)
        let timeline_points = [];
        let risk_over_time = [];
        
        // Priority 1: Use data.timeline if available (array of daily risk values)
        if (data.timeline && Array.isArray(data.timeline) && data.timeline.length > 0) {
            risk_over_time = data.timeline.map(v => {
                const val = this.safe(v, 0);
                // If value is 0-1, convert to 0-100; if already 0-100, use as-is
                return val <= 1 ? val * 100 : val;
            });
            timeline_points = risk_over_time.map((_, i) => `Ngày ${i + 1}`);
            console.log("[RISKCAST DEBUG] Using data.timeline - Points:", timeline_points.length);
        }
        // Priority 2: Use forecast data
        else if (data.forecast) {
            const forecast = this.safe(data.forecast, {});
            if (forecast.days && forecast.days.length > 0) {
                timeline_points = forecast.days.map(d => `Ngày ${d}`);
                risk_over_time = forecast.values ? forecast.values.map(v => {
                    const val = this.safe(v, 0);
                    return val <= 1 ? val * 100 : val;
                }) : [];
            } else if (forecast.values && forecast.values.length > 0) {
                timeline_points = forecast.values.map((_, i) => `Ngày ${i + 1}`);
                risk_over_time = forecast.values.map(v => {
                    const val = this.safe(v, 0);
                    return val <= 1 ? val * 100 : val;
                });
            }
        }
        
        // Fallback: Generate 30 points if no data
        if (timeline_points.length === 0 || risk_over_time.length === 0) {
            console.log("[RISKCAST DEBUG] Generating fallback timeline data");
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
        
        console.log("[RISKCAST DEBUG] Time series:", time_series);

        // Extract route from backend (use full route, not simplified)
        let routeText = this.safe(data.route, "—");
        
        // Default meta info
        const meta = {
            route: routeText,
            incoterm: this.safe(data.incoterm, "CIF"),
            cargo_type: this.safe(data.cargo_type, "Electronics / High-value"),
            transport_mode: this.safe(data.transport_mode, "Ocean + Multimodal"),
            scenario_name: this.safe(data.scenario_name, "VN Export - Balanced Priority"),
            analysis_date: this.safe(data.analysis_date, new Date().toISOString().split('T')[0])
        };

        // Default savings_and_business
        const savings_and_business = {
            baseline_cost: 8500,
            optimized_cost: Math.round(8500 * 0.85),
            cost_saving_pct: 15,
            baseline_expected_loss: Math.round((this.safe(data.expected_loss, 0)) * 1.3),
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

        // === RISKCAST FIX === Map route_segments from backend
        let route_breakdown = [];
        if (data.route_segments && Array.isArray(data.route_segments) && data.route_segments.length > 0) {
            route_breakdown = data.route_segments.map(seg => ({
                segment: this.safe(seg.name, seg.segment || "Đoạn không xác định"),
                mode: this.safe(seg.mode, "Không xác định"),
                risk_index: this.safe(seg.risk, seg.risk_index || 0),
                delay_risk: this.safe(seg.delay_risk, 0),
                damage_risk: this.safe(seg.damage_risk, 0),
                detail: this.safe(seg.detail, seg.description || "")
            }));
            console.log("[RISKCAST DEBUG] Using data.route_segments - Segments:", route_breakdown.length);
        } else {
            // Fallback with Vietnamese labels
            route_breakdown = [
                { segment: "Nhà Máy VN → Cảng VN", mode: "Xe Tải (FCL)", risk_index: 62, delay_risk: 0.18, damage_risk: 0.10, detail: "Vận chuyển nội địa từ nhà máy đến cảng" },
                { segment: "Cảng VN → Trung Tâm Chuyển Tải", mode: "Đường Biển", risk_index: 80, delay_risk: 0.26, damage_risk: 0.12, detail: "Hành trình biển quốc tế" },
                { segment: "Trung Tâm → Cảng Đích", mode: "Đường Biển", risk_index: 78, delay_risk: 0.24, damage_risk: 0.11, detail: "Hành trình biển đến cảng đích" },
                { segment: "Cảng Đích → Người Mua", mode: "Xe Tải / Đường Sắt", risk_index: 70, delay_risk: 0.20, damage_risk: 0.09, detail: "Vận chuyển cuối cùng đến người nhận" }
            ];
            console.log("[RISKCAST DEBUG] Using fallback route_breakdown");
        }

        // Map radar data
        const radar = this.safe(data.radar, { labels: [], values: [] });
        const radarData = {
            labels: this.safe(radar.labels, layers.map(l => l.name)),
            values: this.safe(radar.values, layers.map(l => l.score / 100)) // Convert 0-100 back to 0-1
        };
        
        console.log("[RISKCAST DEBUG] Radar data:", radarData);

        // === RISKCAST FIX === Map recommendations from backend
        const recommendations_vi = this.safe(data.recommendations_vi, []);
        const recommendations_en = this.safe(data.recommendations_en, []);
        
        console.log("[RISKCAST DEBUG] Recommendations VI:", recommendations_vi.length);
        console.log("[RISKCAST DEBUG] Recommendations EN:", recommendations_en.length);
        
        const finalAppData = {
            meta,
            risk_layers: layers,
            monte_carlo,
            radar: radarData,
            summary: {
                expected_loss: this.safe(data.expected_loss, 0),
                reliability_score: reliability,
                esg_score: esg,
                overall_risk_index: riskScore,
                risk_level_label: this.safe(data.risk_level, "MODERATE"),
                top_route_risk: this.safe(data.top_route_risk, 
                    layers.length > 0 ? layers[0].name : "Chưa xác định"),
                main_driver: this.safe(data.main_driver, 
                    "Mô phỏng Monte Carlo với các lớp rủi ro điều chỉnh theo khí hậu"),
                recommendation: this.safe(data.recommendation, 
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
    },

    // ===============================
    // === RISKCAST FIX === UPDATE HEADER (dynamic route and date)
    updateHeader(data, appData) {
        // Update status
        this.setText("statusText", "Phân Tích Hoàn Tất");
        
        // === RISKCAST FIX === Update route from backend data.route (use full route, not simplified)
        let route = this.safe(data.route, appData?.meta?.route, "—");
        // Render exactly as backend: "Vietnam (SGN) → EU (Rotterdam) / US (LA)"
        this.setText("routeChip", route || "—");
        
        // === RISKCAST FIX === Update date from backend data.analysis_date
        const date = this.safe(data.analysis_date, appData?.meta?.analysis_date, new Date().toISOString().split('T')[0]);
        this.setText("dateChip", date);
        
        console.log("🔥 Header updated - Route:", route, "Date:", date);
    },

    // ===============================
    // UPDATE SUMMARY CARDS
    // ===============================
    updateSummaryCards(data) {
        const riskScore = (this.safe(data.risk_score, 0.5)) * 10;
        this.setText("overall_risk_value", this.formatNumber(riskScore, 2));
        this.setText("risk_level_label", this.safe(data.risk_level, "MODERATE"));

        const expectedLoss = this.safe(data.expected_loss, 0);
        this.setText("expected_loss_usd_value", this.formatUSD(expectedLoss));

        const var95 = this.safe(data.var, 0);
        const cvar95 = this.safe(data.cvar, 0);
        this.setText("var99_value", this.formatUSD(var95));
        this.setText("std_value", this.formatUSD(cvar95));
    },

    // ===============================
    // UPDATE CLIMATE METRICS
    // ===============================
    updateClimateMetrics(data) {
        if (data.climate_hazard_index !== undefined) {
            const chi = this.safe(data.climate_hazard_index, 5.0);
            this.setText("climate_hazard_index_value", this.formatNumber(chi, 2));
            
            const climateVar = this.safe(data.climate_var_metrics, {});
            if (climateVar.climate_var_95 !== undefined) {
                this.setText("climate_var_95_value", this.formatNumber(climateVar.climate_var_95, 2));
            }
            if (climateVar.climate_var_99 !== undefined) {
                this.setText("climate_var_99_value", this.formatNumber(climateVar.climate_var_99, 2));
            }
            if (climateVar.climate_cvar_95 !== undefined) {
                this.setText("climate_cvar_95_value", this.formatNumber(climateVar.climate_cvar_95, 2));
            }
            if (climateVar.climate_extreme_probability !== undefined) {
                const probPct = (this.safe(climateVar.climate_extreme_probability, 0)) * 100;
                this.setText("climate_extreme_prob_value", this.formatPercent(probPct));
            }
        }
    },

    // ===============================
    // UPDATE BUYER-SELLER ANALYSIS (v16.2)
    // ===============================
    updateBuyerSeller(data) {
        const buyerSeller = this.safe(data.buyer_seller_analysis, null);
        const card = document.getElementById('buyer-seller-card');
        
        if (buyerSeller && card) {
            // Show card if data exists
            card.style.display = 'block';
            
            // Update buyer score
            const buyerRisk = this.safe(buyerSeller.buyer_risk, 50);
            this.setText("buyer_score", this.formatNumber(buyerRisk, 1));
            
            // Update seller score
            const sellerRisk = this.safe(buyerSeller.seller_risk, 50);
            this.setText("seller_score", this.formatNumber(sellerRisk, 1));
            
            console.log('[RISKCAST] Buyer-Seller analysis updated:', buyerSeller);
        } else if (card) {
            // Hide card if no data
            card.style.display = 'none';
        }
    },
    
    // ===============================
    // UPDATE INSIGHTS
    // ===============================
    updateInsights(data) {
        const layers = this.safe(data.layers, []);
        if (layers.length > 0) {
            const sortedLayers = [...layers].sort((a, b) => (this.safe(b.score, 0)) - (this.safe(a.score, 0)));
            const topLayer = sortedLayers[0];
            this.setText(
                "insight_toprisk",
                `Top Risk Layer: ${topLayer.name} → ${this.formatNumber(
                    (this.safe(topLayer.score, 0)) * 100,
                    1
                )}%`
            );
        } else {
            this.setText("insight_toprisk", "Top Risk Layer: N/A");
        }

        this.setText(
            "insight_driver",
            "Main Driver: Monte Carlo simulation with climate-adjusted risk layers"
        );

        this.setText(
            "insight_reco",
            "Recommendation: Focus on top 2–3 risk layers; consider premium carriers and route optimization."
        );
    },

    // === RISKCAST FIX === UPDATE AI RECOMMENDATIONS (uses data.recommendations_vi)
    updateRecommendations(appData) {
        const container = document.getElementById("recommendations-list");
        if (!container) {
            console.warn("[RISKCAST] Recommendations container #recommendations-list not found");
            return;
        }
        
        const recommendations = appData?.recommendations_vi || [];
        
        if (recommendations.length > 0) {
            container.innerHTML = "";
            recommendations.slice(0, 5).forEach(rec => {
                const li = document.createElement("li");
                li.style.borderLeft = "3px solid var(--accent-green)";
                li.style.paddingLeft = "12px";
                li.style.marginBottom = "8px";
                li.style.padding = "12px 16px";
                li.style.background = "rgba(0, 255, 136, 0.05)";
                li.style.borderRadius = "6px";
                li.textContent = rec;
                container.appendChild(li);
            });
            console.log("🔥 Recommendations updated - Count:", recommendations.length);
        } else {
            // Fallback recommendations
            const fallback = [
                "Ưu tiên tuyến đường trực tiếp để giảm thiểu độ trễ chuyển tải",
                "Triển khai bao bì nâng cao cho hàng điện tử giá trị cao",
                "Cân nhắc nâng cấp bảo hiểm với VaR 95% hiện tại",
                "Theo dõi sự kiện khí hậu trong mùa bão cao điểm (Tháng 6-11)",
                "Đánh giá các hãng vận chuyển thay thế với xếp hạng ESG tốt hơn"
            ];
            container.innerHTML = "";
            fallback.forEach(rec => {
                const li = document.createElement("li");
                li.style.borderLeft = "3px solid var(--accent-green)";
                li.style.paddingLeft = "12px";
                li.style.marginBottom = "8px";
                li.style.padding = "12px 16px";
                li.style.background = "rgba(0, 255, 136, 0.05)";
                li.style.borderRadius = "6px";
                li.textContent = rec;
                container.appendChild(li);
            });
            console.warn("[RISKCAST] No recommendations_vi found, using fallback");
        }
    },

    // ===============================
    // UPDATE EXECUTIVE SNAPSHOT
    // ===============================
    updateSnapshot() {
        const s = window.appData?.summary;
        if (!s) {
            console.error("🔥 updateSnapshot() ERROR: No summary data!");
            return;
        }

        console.log("🔥 updateSnapshot() OK", s);

        // Overall Risk Index
        const riskIndex = this.safe(s.overall_risk_index, 0);
        this.setText("overall-risk-index", this.formatNumber(riskIndex, 1));

        // Risk Level Label (auto-generate from index)
        let riskLevel = "Thấp";
        let riskLevelEn = "Low";
        if (riskIndex >= 75) {
            riskLevel = "Cao";
            riskLevelEn = "High";
        } else if (riskIndex >= 40) {
            riskLevel = "Trung Bình";
            riskLevelEn = "Medium";
        }
        this.setText("risk-level-label", riskLevel);

        // Expected Loss
        const expectedLoss = this.safe(s.expected_loss, 0);
        this.setText("expected-loss", this.formatUSD(expectedLoss));

        // Reliability Score
        const reliability = this.safe(s.reliability_score, 0);
        this.setText("reliability-score", this.formatNumber(reliability, 1) + "%");

        // ESG Score
        const esg = this.safe(s.esg_score, 0);
        this.setText("esg-score", this.formatNumber(esg, 1));

        // Top Route Risk
        const topRouteRisk = this.safe(s.top_route_risk, 
            window.appData?.risk_layers?.[0]?.name || "Chưa xác định");
        this.setText("top-route-risk", topRouteRisk);

        // Main Driver
        const mainDriver = this.safe(s.main_driver, 
            "Mô phỏng Monte Carlo với các lớp rủi ro điều chỉnh theo khí hậu");
        this.setText("main-driver", mainDriver);

        // Recommendation
        const recommendation = this.safe(s.recommendation, 
            "Tập trung vào 2-3 lớp rủi ro hàng đầu; cân nhắc các hãng vận chuyển cao cấp và tối ưu hóa tuyến đường.");
        this.setText("recommendation", recommendation);
    },

    // ===============================
    // RENDER ALL CHARTS (MODE-SPECIFIC)
    // ===============================
    renderAllCharts(data) {
        console.log("🔥 Rendering all charts for mode:", this.mode);
        console.log("Data received:", data);
        
        // Use data parameter or fallback to window.appData
        const appData = data || window.appData || {};
        
        // Check if Plotly is available
        if (!window.Plotly) {
            console.error("[RISKCAST ERROR] Plotly is not loaded!");
            return;
        }
        console.log("[RISKCAST DEBUG] Plotly is available");
        
        // Render mode-specific charts
        if (this.mode === "enterprise") {
            this.renderEnterpriseCharts(appData);
        } else if (this.mode === "research") {
            this.renderResearchCharts(appData);
        } else if (this.mode === "investor") {
            this.renderInvestorCharts(appData);
        }
        
        console.log("[RISKCAST DEBUG] renderAllCharts() COMPLETED");
    },

    // ===============================
    // RENDER ENTERPRISE CHARTS
    // ===============================
    renderEnterpriseCharts(appData) {
        console.log("🔥 Rendering Enterprise charts");
        
        if (appData.summary) {
            this.renderGaugeCharts(appData.summary);
        }
        if (appData.radar) {
            this.renderRadarChart(appData.radar);
        }
        if (appData.risk_layers) {
            this.renderLayerChart(appData.risk_layers);
        }
        if (appData.monte_carlo) {
            this.renderMonteCarlo(appData.monte_carlo);
        }
        if (appData.time_series || appData.forecast) {
            this.renderTimelineChart(appData.time_series || appData.forecast);
        }
        if (appData.risk_matrix) {
            this.renderRiskMatrixChart(appData.risk_matrix);
        }
        if (appData.scenarios && appData.scenarios.length > 0) {
            this.renderScenarioCharts(appData.scenarios);
        }
        if (appData.route_breakdown) {
            this.renderRouteBreakdown(appData.route_breakdown);
        }
        if (appData.savings_and_business) {
            this.renderTradeoffChart(appData.savings_and_business);
        }
    },

    // ===============================
    // RENDER RESEARCH CHARTS
    // ===============================
    renderResearchCharts(appData) {
        console.log("🔥 Rendering Research charts");
        
        if (appData.risk_layers) {
            this.renderLayerChart(appData.risk_layers);
        }
        if (appData.monte_carlo) {
            this.renderMonteCarlo(appData.monte_carlo);
        }
        if (appData.time_series || appData.forecast) {
            this.renderTimelineChart(appData.time_series || appData.forecast);
        }
        if (appData.scenarios && appData.scenarios.length > 0) {
            this.renderScenarioCharts(appData.scenarios);
        }
        if (appData.risk_matrix) {
            this.renderRiskMatrixChart(appData.risk_matrix);
        }
    },

    // ===============================
    // RENDER INVESTOR CHARTS
    // ===============================
    renderInvestorCharts(appData) {
        console.log("🔥 Rendering Investor charts");
        
        if (appData.summary) {
            this.renderGaugeCharts(appData.summary);
        }
        if (appData.savings_and_business) {
            this.renderTradeoffChart(appData.savings_and_business);
            this.renderSavingsChart(appData.savings_and_business);
        }
        this.renderARRChart();
        this.renderPitchChart();
    },

    // RENDER SAVINGS CHART (Investor)
    renderSavingsChart(savingsData) {
        if (!window.Plotly || !savingsData) return;
        
        const el = document.getElementById("savingsChart");
        if (!el) return;
        
        const baseline = this.safe(savingsData.baseline_cost, 8500);
        const optimized = this.safe(savingsData.optimized_cost, 7200);
        
        const trace = {
            type: 'bar',
            x: ['Cơ Sở', 'Tối Ưu'],
            y: [baseline, optimized],
            marker: {
                color: ['#ff4444', '#00ff88'],
                line: { color: '#ffffff', width: 1 }
            },
            text: [this.formatUSD(baseline), this.formatUSD(optimized)],
            textposition: 'outside',
            cliponaxis: false,
            textfont: { color: '#e8f5ff', size: 14, weight: 'bold' }
        };
        
        const layout = {
            title: {
                text: 'Chi Phí Mỗi Lô Hàng',
                font: { color: '#9fb3c8', size: 14 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                tickfont: { color: '#9fb3c8', size: 12 },
                gridcolor: 'rgba(255,255,255,0.05)'
            },
            yaxis: {
                title: { text: 'Chi Phí (USD)', font: { color: '#9fb3c8', size: 12 } },
                tickfont: { color: '#9fb3c8', size: 11 },
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            margin: { t: 40, b: 60, l: 60, r: 60 },
            automargin: true,
            showlegend: false
        };
        
        Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
    },

    // RENDER ARR CHART (Investor)
    renderARRChart() {
        if (!window.Plotly) return;
        
        const el = document.getElementById("arrChart");
        if (!el) return;
        
        const years = ['Năm 1', 'Năm 2', 'Năm 3'];
        const customers = [50, 150, 500];
        const arr = [300000, 900000, 3000000];
        
        const trace1 = {
            type: 'bar',
            x: years,
            y: arr,
            name: 'ARR',
            marker: {
                color: 'rgba(0, 255, 136, 0.7)',
                line: { color: '#00ff88', width: 1 }
            },
            text: arr.map(v => this.formatUSD(v)),
            textposition: 'outside',
            cliponaxis: false,
            textfont: { color: '#00ff88', size: 13, weight: 'bold' }
        };
        
        const trace2 = {
            type: 'scatter',
            x: years,
            y: customers,
            name: 'Khách Hàng',
            yaxis: 'y2',
            mode: 'lines+markers',
            line: { color: '#00d9ff', width: 3 },
            marker: { color: '#00d9ff', size: 10 }
        };
        
        const layout = {
            title: {
                text: 'Dự Báo Tăng Trưởng ARR',
                font: { color: '#9fb3c8', size: 15 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                tickfont: { color: '#9fb3c8', size: 12 }
            },
            yaxis: {
                title: { text: 'Doanh Thu Định Kỳ Hàng Năm (USD)', font: { color: '#00ff88', size: 11 } },
                tickfont: { color: '#9fb3c8', size: 11 },
                gridcolor: 'rgba(255,255,255,0.1)'
            },
            yaxis2: {
                title: { text: 'Số Lượng Khách Hàng', font: { color: '#00d9ff', size: 11 } },
                tickfont: { color: '#9fb3c8', size: 11 },
                overlaying: 'y',
                side: 'right'
            },
            margin: { t: 40, b: 60, l: 60, r: 60 },
            automargin: true,
            showlegend: true,
            legend: {
                x: 0.05,
                y: 0.95,
                font: { color: '#9fb3c8', size: 11 }
            }
        };
        
        Plotly.newPlot(el, [trace1, trace2], layout, { displayModeBar: false, responsive: true });
    },

    // RENDER PITCH CHART (Investor)
    renderPitchChart() {
        if (!window.Plotly) return;
        
        const el = document.getElementById("pitchChart");
        if (!el) return;
        
        const categories = ['Quy Mô Thị Trường', 'Điểm Đau', 'Giải Pháp Của Chúng Tôi', 'Traction', 'Doanh Thu'];
        const values = [85, 95, 90, 65, 70];
        
        const trace = {
            type: 'bar',
            x: categories,
            y: values,
            marker: {
                color: ['#00ff88', '#ff4444', '#00d9ff', '#ffaa00', '#00ff88'],
                line: { color: '#ffffff', width: 1 }
            },
            text: values.map(v => v + '%'),
            textposition: 'outside',
            cliponaxis: false,
            textfont: { color: '#e8f5ff', size: 13, weight: 'bold' }
        };
        
        const layout = {
            title: {
                text: 'Điểm Cơ Hội Đầu Tư',
                font: { color: '#9fb3c8', size: 15 }
            },
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                tickfont: { color: '#9fb3c8', size: 11 },
                gridcolor: 'rgba(255,255,255,0.05)',
                tickangle: -20
            },
            yaxis: {
                title: { text: 'Điểm', font: { color: '#9fb3c8', size: 12 } },
                tickfont: { color: '#9fb3c8', size: 11 },
                gridcolor: 'rgba(255,255,255,0.1)',
                range: [0, 110]
            },
            margin: { t: 40, b: 60, l: 60, r: 60 },
            automargin: true,
            showlegend: false
        };
        
        Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
    },
    
    // ===============================
    // RENDER PRIORITY GAUGES (Speed, Cost, Risk)
    // ===============================
    renderPriorityGauges(data) {
        if (!window.Plotly) {
            console.warn("[RISKCAST] Plotly not loaded for priority gauges");
            return;
        }

        const w = this.safe(data.priority_weights, { speed: 40, cost: 40, risk: 20 });
        
        console.log("[RISKCAST] Rendering priority gauges:", w);

        // Render 3 gauges
        this.renderGauge("gaugeSpeed", w.speed);
        this.renderGauge("gaugeCost", w.cost);
        this.renderGauge("gaugeRiskTolerance", w.risk);
    },

    // ===============================
    // FIX GAUGE OFFSET - Đẩy gauge lên trên
    // ===============================
    fixGaugeOffset(gaugeId) {
        let el = document.getElementById(gaugeId);
        if (!el) return;

        setTimeout(() => {
            const svg = el.querySelector("svg");
            if (svg) {
                svg.style.marginTop = "-60px";   // QUAN TRỌNG – ĐẨY GAUGE LÊN TRÊN
                svg.style.display = "block";
            }
        }, 300);
    },

    // ===============================
    // RENDER SINGLE GAUGE
    // ===============================
    renderGauge(targetId, value, color = "#00ffa7") {
        if (!window.Plotly) return;

        const el = document.getElementById(targetId);
        if (!el) {
            console.warn(`[RISKCAST] Gauge element #${targetId} not found`);
            return;
        }

        Plotly.newPlot(targetId, [{
            type: "indicator",
            mode: "gauge+number",
            value: value,
            gauge: {
                axis: { range: [0, 100], tickcolor: "#00ffa7" },
                bar: { color: color },
                bgcolor: "rgba(0,0,0,0)",
                borderwidth: 2,
                bordercolor: "#00ffa7",
                steps: [
                    { range: [0, 50], color: "rgba(0,255,180,0.15)" },
                    { range: [50, 100], color: "rgba(0,255,180,0.25)" }
                ]
            },
            number: { font: { color: "#00ffa7", size: 28 } }
        }], {
            paper_bgcolor: "rgba(0,0,0,0)",
            plot_bgcolor: "rgba(0,0,0,0)",
            margin: { t: 20, b: 0 }
        });

        // Fix offset cho Priority Profile gauges
        if (targetId === "gaugeSpeed" || targetId === "gaugeCost" || targetId === "gaugeRiskTolerance") {
            this.fixGaugeOffset(targetId);
        }
    },

    // RENDER GAUGE CHARTS
    renderGaugeCharts(summary) {
        if (!window.Plotly || !summary) {
            console.warn("[RISKCAST] Cannot render gauges: Plotly or summary missing");
            return;
        }
        
        console.log("[RISKCAST] Rendering all 3 gauges:", {
            risk: this.safe(summary.overall_risk_index, 0),
            reliability: this.safe(summary.reliability_score, 0),
            esg: this.safe(summary.esg_score, 0)
        });
        
        const { overall_risk_index, reliability_score, esg_score } = summary;
        const t = this.getTranslations();
        const commonLayout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 40, b: 20, l: 30, r: 30 },
            font: { color: '#9fb3c8' }
        };
        
        // Risk Gauge
        const riskEl = document.getElementById('gaugeRisk');
        if (riskEl) {
            const riskGauge = {
                type: 'indicator',
                mode: 'gauge+number',
                value: this.safe(overall_risk_index, 50),
                title: { text: t.gauge_risk_title || 'Chỉ Số Rủi Ro Tổng Thể', font: { size: 16 } },
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
            console.log("[RISKCAST] ✅ Risk gauge rendered");
        } else {
            console.warn("[RISKCAST] ❌ Risk gauge element not found");
        }
        
        // Reliability Gauge
        const relEl = document.getElementById('gaugeReliability');
        if (relEl) {
            const relGauge = {
                type: 'indicator',
                mode: 'gauge+number',
                value: this.safe(reliability_score, 50),
                title: { text: t.gauge_reliability_title || 'Điểm Độ Tin Cậy', font: { size: 16 } },
                gauge: {
                    axis: { range: [0, 100] },
                    bar: { color: '#00d9ff' }
                }
            };
            Plotly.newPlot(relEl, [relGauge], commonLayout, { displayModeBar: false, responsive: true });
            console.log("[RISKCAST] ✅ Reliability gauge rendered");
        } else {
            console.warn("[RISKCAST] ❌ Reliability gauge element not found");
        }
        
        // ESG Gauge
        const esgEl = document.getElementById('gaugeEsg');
        if (esgEl) {
            const esgGauge = {
                type: 'indicator',
                mode: 'gauge+number',
                value: this.safe(esg_score, 50),
                title: { text: t.gauge_esg_title || 'Điểm ESG', font: { size: 16 } },
                gauge: {
                    axis: { range: [0, 100] },
                    bar: { color: '#00ff88' }
                }
            };
            Plotly.newPlot(esgEl, [esgGauge], commonLayout, { displayModeBar: false, responsive: true });
            console.log("[RISKCAST] ✅ ESG gauge rendered");
        } else {
            console.warn("[RISKCAST] ❌ ESG gauge element not found");
        }
    },
    
    // RENDER RADAR CHART
    renderRadarChart(radarData) {
        if (!window.Plotly || !radarData) return;
        
        const el = document.getElementById("radarChart") || 
                   document.getElementById("radar") || 
                   document.querySelector("[data-chart='radar']");
        if (!el) {
            console.warn("[RISKCAST] Radar chart container not found");
            return;
        }
        
        const labels = radarData.labels || [];
        const values = radarData.values || [];
        const scores = values.map(v => (this.safe(v, 0)) * 100); // Convert 0-1 to 0-100
        
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
    },
    
    // RENDER LAYER CHART
    renderLayerChart(layers) {
        if (!window.Plotly || !layers || !Array.isArray(layers)) return;
        
        const el = document.getElementById("layerChart") || 
                   document.getElementById("layers") || 
                   document.querySelector("[data-chart='layers']");
        if (!el) {
            console.warn("[RISKCAST] Layer chart container not found");
            return;
        }
        
        const layerNames = layers.map(l => this.safe(l.name, ''));
        const contributions = layers.map(l => (this.safe(l.score, 0)) * 100); // Convert 0-1 to 0-100
        
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
    },
    
    // RENDER MONTE CARLO CHART
    renderMonteCarlo(mcData) {
        if (!window.Plotly || !mcData) return;
        
        const el = document.getElementById("mcChart") || 
                   document.getElementById("lossChart") || 
                   document.getElementById("monteCarloChart");
        if (!el) {
            console.warn("[RISKCAST] MC chart container not found");
            return;
        }
        
        const dist = mcData.loss_distribution || mcData.samples || [];
        const var95 = this.safe(mcData.var_95, 0);
        const cvar95 = this.safe(mcData.cvar_95, 0);
        const numSims = this.safe(mcData.num_simulations, 10000);
        
        // Update MC stats in HTML
        this.setText("mcVar", this.formatUSD(var95));
        this.setText("mcCVar", this.formatUSD(cvar95));
        this.setText("mcRuns", numSims.toLocaleString("vi-VN"));
        
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
    },
    
    // === RISKCAST FIX === RENDER TIMELINE CHART (uses real data.timeline)
    renderTimelineChart(tsData) {
        if (!window.Plotly) {
            console.warn("[RISKCAST] Plotly not loaded for timeline");
            return;
        }
        
        const el = document.getElementById("timelineChart") || 
                   document.getElementById("forecastChart") || 
                   document.querySelector("[data-chart='timeline']");
        if (!el) {
            console.warn("[RISKCAST] Timeline chart container not found");
            return;
        }
        
        let timeline = tsData?.timeline_points || tsData?.days || [];
        let riskOverTime = tsData?.risk_over_time || tsData?.values || [];
        
        // === RISKCAST FIX === Fallback if no data
        if (timeline.length === 0 || riskOverTime.length === 0) {
            const baseRisk = window.appData?.summary?.overall_risk_index || 76;
            timeline = [];
            riskOverTime = [];
            for (let i = 0; i < 30; i++) {
                timeline.push(`Ngày ${i + 1}`);
                const variation = (Math.sin(i * 0.2) * 5) + (Math.random() * 3 - 1.5);
                riskOverTime.push(Math.max(50, Math.min(100, baseRisk + variation)));
            }
            console.log("[RISKCAST] Generated fallback timeline data");
        }
        
        // Ensure arrays match length
        const minLen = Math.min(timeline.length, riskOverTime.length);
        timeline = timeline.slice(0, minLen);
        riskOverTime = riskOverTime.slice(0, minLen);
        
        // === RISKCAST FIX === Auto-scale y-axis (remove hardcoded 60)
        const minRisk = Math.max(0, Math.min(...riskOverTime) - 10);
        const maxRisk = Math.min(100, Math.max(...riskOverTime) + 10);
        
        console.log("🔥 Rendering timeline chart - Points:", timeline.length, "Range:", minRisk, "-", maxRisk);
        
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
    },
    
    // RENDER RISK MATRIX CHART
    renderRiskMatrixChart(riskMatrix) {
        if (!window.Plotly || !riskMatrix) return;
        
        console.log("🔥 Rendering chart: riskMatrix", riskMatrix);
        const el = document.getElementById("riskMatrixChart") || 
                   document.getElementById("riskMatrix") || 
                   document.querySelector("[data-chart='riskMatrix']");
        if (!el) {
            console.warn("[RISKCAST] Risk matrix container not found");
            return;
        }
        
        const labels_probability = this.safe(riskMatrix.labels_probability, ["Rất Thấp", "Thấp", "Trung Bình", "Cao", "Rất Cao"]);
        const labels_impact = this.safe(riskMatrix.labels_impact, ["Nhỏ", "Vừa", "Lớn", "Nghiêm Trọng", "Tới Hạn"]);
        const matrix_values = this.safe(riskMatrix.matrix_values, []);
        
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
    },
    
    // === RISKCAST FIX === SCENARIO CONTROLLER
    renderScenarioCharts(scenarios) {
        if (!window.Plotly) {
            console.warn("[RISKCAST] Plotly not loaded for scenarios");
            return;
        }
        
        if (!scenarios || scenarios.length === 0) {
            console.warn("[RISKCAST] No scenarios data");
            scenarios = this.generateDefaultScenarios();
        }
        
        console.log("🔥 Rendering chart: scenarioChart", scenarios);
        
        // === RISKCAST FIX === Render scenario buttons (base, best, worst)
        this.renderScenarioButtons(scenarios);
        
        // === RISKCAST FIX === Initialize with base scenario
        this.setScenario("base", scenarios);
    },
    
    // === RISKCAST FIX === RENDER SCENARIO BUTTONS
    renderScenarioButtons(scenarios) {
        const container = document.getElementById("scenarioPills");
        if (!container) {
            console.warn("[RISKCAST] Scenario pills container not found");
            return;
        }
        
        // Clear container
        container.innerHTML = "";
        
        // Map scenarios to buttons: base, best, worst
        const scenarioMap = {
            base: scenarios[0] || null,
            best: scenarios.find(s => s.name.toLowerCase().includes("tốt") || s.name.toLowerCase().includes("best")) || scenarios[1] || null,
            worst: scenarios.find(s => s.name.toLowerCase().includes("xấu") || s.name.toLowerCase().includes("worst")) || scenarios[2] || null
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
            btn.onclick = () => this.setScenario(mode, scenarios);
            container.appendChild(btn);
        });
    },
    
    // === RISKCAST FIX === SET ACTIVE SCENARIO
    setScenario(mode, scenarios) {
        if (!scenarios || scenarios.length === 0) return;
        
        // Find scenario by mode
        let scenario = null;
        if (mode === "base") {
            scenario = scenarios[0];
        } else if (mode === "best") {
            scenario = scenarios.find(s => s.name.toLowerCase().includes("tốt") || s.name.toLowerCase().includes("best")) || scenarios[1];
        } else if (mode === "worst") {
            scenario = scenarios.find(s => s.name.toLowerCase().includes("xấu") || s.name.toLowerCase().includes("worst")) || scenarios[2];
        }
        
        if (!scenario) {
            console.warn(`[RISKCAST] Scenario ${mode} not found`);
            return;
        }
        
        // Update active button
        document.querySelectorAll(".scenario-btn").forEach(b => b.classList.remove("active"));
        const btn = document.getElementById(`btn-scenario-${mode}`);
        if (btn) btn.classList.add("active");
        
        // Update description
        const descEl = document.getElementById("scenario-description");
        if (descEl) {
            descEl.textContent = scenario.description || "Mô tả kịch bản";
        }
        
        // Update chart with mode
        this.loadScenario(scenario, mode);
        
        console.log(`🔥 Scenario set to: ${mode}`, scenario);
    },
    
    // === RISKCAST FIX === LOAD SCENARIO CHART
    loadScenario(scenario, mode = "base") {
        if (!window.Plotly || !scenario) return;
        
        const el = document.getElementById("scenarioChart");
        if (!el) {
            console.warn("[RISKCAST] scenarioChart element not found");
            return;
        }
        
        const categories = ['Chỉ Số Rủi Ro', 'Tổn Thất Kỳ Vọng', 'VaR (95%)', 'CVaR (95%)'];
        const values = [
            this.safe(scenario.risk_index, scenario.overall_risk, 0),
            this.safe(scenario.expected_loss, 0),
            this.safe(scenario.var_95, 0),
            this.safe(scenario.cvar_95, 0)
        ];
        
        // === RISKCAST FIX === Neon palette based on mode
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
                if (v >= 1000) return this.formatUSD(v);
                return this.formatNumber(v, 0);
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
    },
    
    // UPDATE SCENARIO SUMMARY (legacy support)
    updateScenarioSummary(scenario) {
        const container = document.getElementById("scenarioSummary");
        if (!container || !scenario) return;
        
        container.innerHTML = `
            <h4 style="color: var(--text-primary); margin-bottom: 8px;">${scenario.name || 'Kịch Bản'}</h4>
            <p style="color: var(--text-secondary); font-size: 14px;">${scenario.description || 'Mô tả kịch bản'}</p>
        `;
    },
    
    // GENERATE DEFAULT SCENARIOS
    generateDefaultScenarios() {
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
            },
            {
                name: "Tăng Đột Biến Cước Vận Chuyển",
                description: "Tăng mạnh về cước vận chuyển và phụ phí nhiên liệu (Bunker).",
                overall_risk: Math.min(100, baseRisk + 4),
                expected_loss: Math.round(baseLoss * 1.45),
                var_95: Math.round(baseVar * 1.3),
                cvar_95: Math.round(baseCVar * 1.23)
            }
        ];
    },
    
    // === RISKCAST FIX === RENDER ROUTE BREAKDOWN (uses data.route_segments)
    renderRouteBreakdown(routeBreakdown) {
        if (!window.Plotly || !routeBreakdown || !Array.isArray(routeBreakdown)) {
            console.warn("[RISKCAST] Route breakdown data missing");
            return;
        }
        
        console.log("🔥 Rendering chart: routeBreakdown", routeBreakdown);
        const el = document.getElementById("routeBreakdownChart") || 
                   document.getElementById("routeBreakdown") || 
                   document.querySelector("[data-chart='routeBreakdown']");
        if (!el) {
            console.warn("[RISKCAST] Route breakdown container not found");
            return;
        }
        
        const segments = routeBreakdown.map(d => this.safe(d.segment, ''));
        const risks = routeBreakdown.map(d => this.safe(d.risk_index, 0));
        
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
        
        // Also render table
        this.renderRouteBreakdownTable(routeBreakdown);
    },
    
    // === RISKCAST FIX === RENDER ROUTE BREAKDOWN TABLE
    renderRouteBreakdownTable(routeBreakdown) {
        const container = document.getElementById("routeBreakdownTable");
        if (!container) {
            console.warn("[RISKCAST] Route breakdown table container not found");
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
                    <td><strong>${this.safe(row.segment, '')}</strong></td>
                    <td>${this.safe(row.mode, '')}</td>
                    <td><strong style="color: var(--accent-green);">${this.formatNumber(this.safe(row.risk_index, 0), 0)}</strong></td>
                    <td>${this.formatPercent((this.safe(row.delay_risk, 0)) * 100)}</td>
                    <td>${this.formatPercent((this.safe(row.damage_risk, 0)) * 100)}</td>
                    <td style="font-size: 12px; color: var(--text-secondary);">${this.safe(row.detail, '')}</td>
                </tr>
            `;
        });
        
        tableHTML += '</tbody></table>';
        container.innerHTML = tableHTML;
    },
    
    // RENDER TRADEOFF CHART
    renderTradeoffChart(savingsData) {
        if (!window.Plotly || !savingsData) return;
        
        console.log("🔥 Rendering chart: tradeoffChart", savingsData);
        const el = document.getElementById("tradeoffChart") || 
                   document.querySelector("[data-chart='tradeoff']");
        if (!el) {
            console.warn("[RISKCAST] Tradeoff chart container not found");
            return;
        }
        
        const categories = ['Chi Phí', 'Thời Gian Vận Chuyển', 'Chỉ Số Rủi Ro'];
        const values = [
            this.safe(savingsData.cost_saving_pct, 15),
            this.safe(savingsData.baseline_reliability, 72),
            this.safe(savingsData.risk_reduction_pct, 32)
        ];
        
        const trace = {
            type: 'bar',
            x: categories,
            y: values,
            marker: {
                color: ['#00ff88', '#00d9ff', '#ffaa00'],
                line: { color: '#ffffff', width: 1 }
            },
            text: values.map(v => v.toFixed(0) + '%'),
            textposition: 'outside',
            cliponaxis: false,
            textfont: { color: '#e8f5ff', size: 13 }
        };
        
        const layout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            xaxis: {
                tickfont: { color: '#9fb3c8', size: 12 },
                gridcolor: 'rgba(255,255,255,0.05)'
            },
            yaxis: {
                title: { text: 'Điểm Chuẩn Hóa (0-100)', font: { color: '#9fb3c8', size: 12 } },
                tickfont: { color: '#9fb3c8', size: 11 },
                gridcolor: 'rgba(255,255,255,0.1)',
                range: [0, 100]
            },
            margin: { t: 40, b: 60, l: 60, r: 60 },
            automargin: true,
            showlegend: false
        };
        
        Plotly.newPlot(el, [trace], layout, { displayModeBar: false, responsive: true });
    },

    // ===============================
    // FALLBACK: RENDER CHARTS DIRECTLY
    // ===============================
    renderChartsDirectly() {
        console.log("[RISKCAST DEBUG] Rendering charts directly...");
        
        // Render gauges
        if (window.appData && window.appData.summary) {
            this.renderGaugesDirectly();
        }
        
        // Render radar
        if (window.RISKCAST_RADAR && window.RiskcastCharts) {
            console.log("[RISKCAST DEBUG] Rendering radar via RiskcastCharts...");
            window.RiskcastCharts.renderRadar(window.RISKCAST_RADAR);
        }
        
        // Render loss histogram
        if (window.RISKCAST_LOSS_DIST && window.RiskcastCharts) {
            console.log("[RISKCAST DEBUG] Rendering loss histogram via RiskcastCharts...");
            window.RiskcastCharts.renderLossHistogram(window.RISKCAST_LOSS_DIST);
        }
        
        // Render forecast
        if (window.RISKCAST_FORECAST && window.RiskcastCharts) {
            console.log("[RISKCAST DEBUG] Rendering forecast via RiskcastCharts...");
            window.RiskcastCharts.renderForecast(window.RISKCAST_FORECAST);
        }
    },

    // ===============================
    // RENDER GAUGES DIRECTLY
    // ===============================
    renderGaugesDirectly() {
        if (!window.Plotly) return;
        
        const { overall_risk_index, reliability_score, esg_score } = window.appData.summary;
        const commonLayout = {
            paper_bgcolor: 'rgba(0,0,0,0)',
            plot_bgcolor: 'rgba(0,0,0,0)',
            margin: { t: 40, b: 20, l: 30, r: 30 },
            font: { color: '#9fb3c8' }
        };
        
        // Risk Gauge
        const riskEl = document.getElementById('gaugeRisk');
        if (riskEl) {
            const riskGauge = {
                type: 'indicator',
                mode: 'gauge+number',
                value: this.safe(overall_risk_index, 50),
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
            console.log("[RISKCAST DEBUG] Rendered risk gauge");
        }
        
        // Reliability Gauge
        const relEl = document.getElementById('gaugeReliability');
        if (relEl) {
            const relGauge = {
                type: 'indicator',
                mode: 'gauge+number',
                value: this.safe(reliability_score, 50),
                title: { text: t.gauge_reliability_title || 'Điểm Độ Tin Cậy', font: { size: 16 } },
                gauge: {
                    axis: { range: [0, 100] },
                    bar: { color: '#00d9ff' }
                }
            };
            Plotly.newPlot(relEl, [relGauge], commonLayout, { displayModeBar: false, responsive: true });
            console.log("[RISKCAST DEBUG] Rendered reliability gauge");
        }
        
        // ESG Gauge
        const esgEl = document.getElementById('gaugeEsg');
        if (esgEl) {
            const esgGauge = {
                type: 'indicator',
                mode: 'gauge+number',
                value: this.safe(esg_score, 50),
                title: { text: t.gauge_esg_title || 'Điểm ESG', font: { size: 16 } },
                gauge: {
                    axis: { range: [0, 100] },
                    bar: { color: '#00ff88' }
                }
            };
            Plotly.newPlot(esgEl, [esgGauge], commonLayout, { displayModeBar: false, responsive: true });
            console.log("[RISKCAST DEBUG] Rendered ESG gauge");
        }
    },

    // ===============================
    // HELPERS
    // ===============================
    setText(id, text) {
        const el = document.getElementById(id);
        if (el) {
            el.textContent = text;
        } else {
            console.warn(`[RISKCAST WARN] Element #${id} not found`);
        }
    },

    formatNumber(value, digits = 1) {
        if (value === null || value === undefined || isNaN(value)) return "--";
        return Number(value).toFixed(digits);
    },

    formatUSD(value) {
        if (value === null || value === undefined || isNaN(value)) return "--";
        const v = Number(value);
        // Vietnamese format: 12.500 USD
        return v.toLocaleString("vi-VN") + " USD";
    },

    formatPercent(value) {
        if (value === null || value === undefined || isNaN(value)) return "--";
        return value.toFixed(1) + "%";
    },

    renderLayersTable(layers) {
        const tbody = document.querySelector("#risk_factors_table tbody") || 
                     document.querySelector("#layers_table tbody") ||
                     document.querySelector(".layers-table tbody");
        
        if (!tbody) {
            console.warn("Could not find layers table tbody");
            return;
        }

        tbody.innerHTML = "";

        if (!layers || layers.length === 0) {
            const tr = document.createElement("tr");
            const td = document.createElement("td");
            td.colSpan = 2;
            td.textContent = "No layer data available.";
            td.style.color = "#9ca3af";
            tr.appendChild(td);
            tbody.appendChild(tr);
            return;
        }

        const sortedLayers = [...layers].sort((a, b) => (this.safe(b.score, 0)) - (this.safe(a.score, 0)));

        sortedLayers.forEach((layer) => {
            const tr = document.createElement("tr");

            const tdName = document.createElement("td");
            tdName.textContent = this.safe(layer.name, "");
            tr.appendChild(tdName);

            const tdScore = document.createElement("td");
            const scoreValue = (this.safe(layer.score, 0)) * 100;
            tdScore.textContent = this.formatNumber(scoreValue, 1) + "%";
            tdScore.style.textAlign = "right";
            tr.appendChild(tdScore);

            tbody.appendChild(tr);
        });
    },

    generateLossDistribution() {
        const dist = [];
        for (let i = 0; i < 1000; i++) {
            const r1 = Math.random();
            const r2 = Math.random();
            const loss = 5000 + Math.pow(r1, 2) * 40000 + (r2 - 0.5) * 15000;
            dist.push(Math.max(0, loss));
        }
        return dist.sort((a, b) => a - b);
    },

    // ===============================
    // LANGUAGE SYSTEM
    // ===============================
    currentLang: localStorage.getItem('riskcast_lang') || 'vi',
    
    initializeLanguage() {
        // Bind language buttons
        const btnVI = document.getElementById('lang-btn-vi');
        const btnEN = document.getElementById('lang-btn-en');
        
        if (btnVI) {
            btnVI.onclick = () => this.setLanguage('vi');
        }
        if (btnEN) {
            btnEN.onclick = () => this.setLanguage('en');
        }
        
        // Apply initial language
        this.applyLanguage();
        
        // Update button states
        this.updateLanguageButtons();
    },
    
    setLanguage(lang) {
        if (lang === 'vi' || lang === 'en') {
            this.currentLang = lang;
            localStorage.setItem('riskcast_lang', lang);
            this.applyLanguage();
            this.updateLanguageButtons();
            
            // Re-render gauge explanation with new language
            if (window.appData) {
                this.renderGaugeExplanation(window.appData);
            }
            
            // Re-render gauge charts with translated titles
            if (window.appData?.summary) {
                this.renderGaugeCharts(window.appData.summary);
            }
        }
    },
    
    updateLanguageButtons() {
        const btnVI = document.getElementById('lang-btn-vi');
        const btnEN = document.getElementById('lang-btn-en');
        
        if (btnVI) {
            if (this.currentLang === 'vi') {
                btnVI.classList.add('active');
            } else {
                btnVI.classList.remove('active');
            }
        }
        if (btnEN) {
            if (this.currentLang === 'en') {
                btnEN.classList.add('active');
            } else {
                btnEN.classList.remove('active');
            }
        }
    },
    
    getTranslations() {
        if (this.currentLang === 'en') {
            return window.TRANSLATIONS_EN || {};
        } else {
            return window.TRANSLATIONS_VI || {};
        }
    },
    
    applyLanguage() {
        const t = this.getTranslations();
        
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        // Update tab buttons (they have spans inside)
        const tabEnterprise = document.querySelector('#tab-enterprise span[data-lang="tab_enterprise"]');
        const tabResearch = document.querySelector('#tab-research span[data-lang="tab_research"]');
        const tabInvestor = document.querySelector('#tab-investor span[data-lang="tab_investor"]');
        
        if (tabEnterprise && t.tab_enterprise) tabEnterprise.textContent = t.tab_enterprise;
        if (tabResearch && t.tab_research) tabResearch.textContent = t.tab_research;
        if (tabInvestor && t.tab_investor) tabInvestor.textContent = t.tab_investor;
        
        // Update card titles (they have spans inside)
        document.querySelectorAll('.card-title span[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
        
        // Update card badges
        document.querySelectorAll('.card-badge[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
        
        console.log(`[RISKCAST] Language applied: ${this.currentLang}`);
    },
    
    // ===============================
    // GAUGE EXPLANATION (McKinsey/NCKH Style)
    // ===============================
    renderGaugeExplanation(appData) {
        // Get individual explain boxes
        const riskExplainEl = document.getElementById('gaugeRiskExplain');
        const reliExplainEl = document.getElementById('gaugeReliExplain');
        const esgExplainEl = document.getElementById('gaugeEsgExplain');
        
        if (!riskExplainEl || !reliExplainEl || !esgExplainEl) {
            console.warn('[RISKCAST] Gauge explanation boxes not found');
            return;
        }
        
        const summary = appData?.summary || {};
        const risk = this.safe(summary.overall_risk_index, 0);
        const reliability = this.safe(summary.reliability_score, 0);
        const esg = this.safe(summary.esg_score, 0);
        
        // Determine categories
        const riskLevel = risk <= 40 ? "low" : risk <= 70 ? "medium" : "high";
        const reliabilityLevel = reliability >= 85 ? "very_high" : reliability >= 60 ? "stable" : "unstable";
        const esgLevel = esg >= 70 ? "strong" : esg >= 40 ? "moderate" : "weak";
        
        // Get translations
        const t = this.getTranslations();
        const exp = t.gauge_explanations || {};
        
        if (!exp.title) {
            console.warn('[RISKCAST] Gauge explanations not found in translations');
            return;
        }
        
        // Render Risk explanation
        riskExplainEl.innerHTML = `
            <strong>${exp.risk_title || 'Overall Risk Index'} (${this.formatNumber(risk, 1)})</strong>
            <p>${exp.risk?.[riskLevel] || 'No explanation available'}</p>
        `;
        
        // Render Reliability explanation
        reliExplainEl.innerHTML = `
            <strong>${exp.reliability_title || 'Reliability Score'} (${this.formatNumber(reliability, 1)})</strong>
            <p>${exp.reliability?.[reliabilityLevel] || 'No explanation available'}</p>
        `;
        
        // Render ESG explanation
        esgExplainEl.innerHTML = `
            <strong>${exp.esg_title || 'ESG Score'} (${this.formatNumber(esg, 1)})</strong>
            <p>${exp.esg?.[esgLevel] || 'No explanation available'}</p>
        `;
        
        console.log('[RISKCAST] Gauge explanations rendered to individual boxes');
    },
    
    showError(msg) {
        const box = document.getElementById("error_box");
        if (box) {
            box.style.display = "block";
            box.textContent = msg;
        }
    },
};

/**
 * RISKCAST v16 - AI ADVISER MODULE
 * Frontend Integration for Claude-based Risk Analysis
 */

// Global state for last result
let lastResult = null;

let aiAdviserRunning = false;

/**
 * Main function to run AI Adviser analysis
 */
async function runAIAdviser() {
    console.log("=== AI ADVISER INITIATED ===");
    
    // Prevent multiple simultaneous calls
    if (aiAdviserRunning) {
        console.warn("AI Adviser already running, please wait...");
        return;
    }
    
    // Check if we have results to analyze
    if (!lastResult) {
        console.error("No risk analysis result available");
        showAIError("Vui lòng chạy phân tích rủi ro trước khi sử dụng AI Adviser");
        return;
    }
    
    try {
        aiAdviserRunning = true;
        
        // Show loading state
        showAILoading();
        
        console.log("Sending request to AI Adviser API...");
        console.log("Payload:", JSON.stringify(lastResult, null, 2));
        
        // Build prompt from risk data
        const prompt = buildFullReportPrompt();
        
        // Call backend API
        const response = await fetch("/api/ai/adviser", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                prompt: prompt
            })
        });
        
        console.log("Response status:", response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.detail || `HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("AI Adviser response received");
        
        // Display the AI report (handle both reply and ai_report formats)
        if (data.reply) {
            displayAIReport(data.reply);
        } else if (data.ai_report) {
            displayAIReport(data.ai_report);
        } else {
            throw new Error("Invalid response format from AI Adviser");
        }
        
        console.log("=== AI ADVISER COMPLETED ===");
        
    } catch (error) {
        console.error("=== AI ADVISER ERROR ===");
        console.error("Error:", error);
        console.error("Stack:", error.stack);
        
        showAIError(`Lỗi khi phân tích AI: ${error.message}`);
        
    } finally {
        aiAdviserRunning = false;
    }
}

/**
 * Display loading animation in AI output panel
 */
function showAILoading() {
    const outputDiv = document.getElementById("ai_output");
    if (!outputDiv) {
        console.error("AI output div not found");
        return;
    }
    
    outputDiv.innerHTML = `
        <div class="ai-loading">
            <div class="ai-loading-spinner"></div>
            <p class="ai-loading-text">🤖 Claude đang phân tích rủi ro...</p>
            <p class="ai-loading-subtext">Đang xử lý dữ liệu shipment và tạo báo cáo chuyên nghiệp</p>
        </div>
    `;
    
    // Scroll into view
    outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Display AI-generated report
 */
function displayAIReport(htmlContent) {
    const outputDiv = document.getElementById("ai_output");
    if (!outputDiv) {
        console.error("AI output div not found");
        return;
    }
    
    // Add fade-in animation class
    outputDiv.classList.add("ai-fade-in");
    
    // Set the HTML content (Claude returns HTML directly)
    outputDiv.innerHTML = `
        <div class="ai-report-content">
            ${htmlContent}
        </div>
        <div class="ai-report-footer">
            <span class="ai-badge">🤖 Powered by Claude 3.5 Sonnet</span>
            <span class="ai-timestamp">Generated: ${new Date().toLocaleString('vi-VN')}</span>
        </div>
    `;
    
    // Scroll into view
    setTimeout(() => {
        outputDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

/**
 * Display error message in AI panel
 */
function showAIError(message) {
    const outputDiv = document.getElementById("ai_output");
    if (!outputDiv) {
        console.error("AI output div not found");
        return;
    }
    
    outputDiv.innerHTML = `
        <div class="ai-error">
            <div class="ai-error-icon">⚠️</div>
            <h4>Lỗi AI Adviser</h4>
            <p>${message}</p>
            <button class="ai-retry-btn" onclick="runAIAdviser()">
                Thử lại
            </button>
        </div>
    `;
}

/**
 * Auto-run AI Adviser if user has setting enabled
 */
function autoRunAIAdviser() {
    // Check user preferences (can be stored in localStorage)
    const autoAI = localStorage.getItem("auto_ai") === "true";
    
    if (autoAI && lastResult) {
        console.log("Auto-run AI Adviser enabled, starting analysis...");
        setTimeout(() => {
            runAIAdviser();
        }, 1000); // Delay 1 second after risk analysis completes
    }
}

/**
 * Toggle auto-run AI setting
 */
function toggleAutoAI() {
    const currentSetting = localStorage.getItem("auto_ai") === "true";
    const newSetting = !currentSetting;
    
    localStorage.setItem("auto_ai", newSetting.toString());
    
    console.log(`Auto AI ${newSetting ? "enabled" : "disabled"}`);
    
    // Update UI toggle if exists
    const toggleBtn = document.getElementById("auto_ai_toggle");
    if (toggleBtn) {
        toggleBtn.classList.toggle("active", newSetting);
        toggleBtn.textContent = newSetting ? "Auto AI: ON" : "Auto AI: OFF";
    }
    
    return newSetting;
}

/**
 * Update lastResult when risk analysis completes
 * Call this function from your existing risk calculation function
 */
function updateLastResult(result) {
    console.log("Updating last result for AI Adviser");
    lastResult = result;
    
    // Enable AI button
    const aiButton = document.querySelector(".ai-btn");
    if (aiButton) {
        aiButton.disabled = false;
        aiButton.classList.remove("disabled");
    }
    
    // Auto-run if enabled
    autoRunAIAdviser();
}

/**
 * Initialize AI Adviser module on page load
 */
function initAIAdviser() {
    console.log("=== AI ADVISER MODULE INITIALIZED ===");
    
    // Check if auto-AI is enabled
    const autoAI = localStorage.getItem("auto_ai") === "true";
    console.log("Auto AI setting:", autoAI);
    
    // Update toggle button state if exists
    const toggleBtn = document.getElementById("auto_ai_toggle");
    if (toggleBtn) {
        toggleBtn.classList.toggle("active", autoAI);
        toggleBtn.textContent = autoAI ? "Auto AI: ON" : "Auto AI: OFF";
    }
    
    // Check API health
    fetch("/api/ai/health")
        .then(response => response.json())
        .then(data => {
            console.log("AI API Health:", data);
            if (data.status !== "healthy") {
                console.warn("AI API not fully configured:", data);
            }
        })
        .catch(error => {
            console.error("Failed to check AI API health:", error);
        });
}

/**
 * Export AI report to PDF (optional enhancement)
 */
async function exportAIReportPDF() {
    const reportContent = document.querySelector(".ai-report-content");
    if (!reportContent) {
        alert("Không có báo cáo để xuất");
        return;
    }
    
    // This is a placeholder - implement PDF generation as needed
    console.log("PDF export requested");
    alert("Chức năng xuất PDF đang được phát triển");
}

// Initialize on page load
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initAIAdviser);
} else {
    initAIAdviser();
}

/**
 * Build full report prompt from last result
 */
function buildFullReportPrompt() {
    if (!lastResult) {
        return "No risk analysis data available.";
    }
    
    // Format the risk data into a comprehensive prompt
    const prompt = `
Phân tích rủi ro logistics cho shipment sau:

=== THÔNG TIN CƠ BẢN ===
${JSON.stringify(lastResult, null, 2)}

Hãy phân tích chi tiết các rủi ro và đưa ra khuyến nghị cụ thể.
`;
    
    return prompt;
}

/**
 * Send data to AI Adviser endpoint
 */
function sendToAI() {
    const prompt = buildFullReportPrompt();
    
    if (!prompt || prompt.trim() === "") {
        showAIError("Không có dữ liệu để phân tích. Vui lòng chạy phân tích rủi ro trước.");
        return;
    }
    
    // Show loading
    showAILoading();
    
    fetch("/api/ai/adviser", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt })
    })
    .then(res => {
        if (!res.ok) {
            return res.json().then(err => {
                throw new Error(err.detail || `HTTP ${res.status}: ${res.statusText}`);
            });
        }
        return res.json();
    })
    .then(data => {
        if (data.reply) {
            displayAIReport(data.reply);
        } else {
            throw new Error("Invalid response format: missing 'reply' field");
        }
    })
    .catch(error => {
        console.error("Error calling AI Adviser:", error);
        showAIError(`Lỗi khi gọi AI: ${error.message}`);
    });
}

// Export functions for global access
window.runAIAdviser = runAIAdviser;
window.toggleAutoAI = toggleAutoAI;
window.updateLastResult = updateLastResult;
window.exportAIReportPDF = exportAIReportPDF;
window.sendToAI = sendToAI;
window.buildFullReportPrompt = buildFullReportPrompt;
