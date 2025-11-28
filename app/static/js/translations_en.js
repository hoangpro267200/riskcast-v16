// ============================================
// RISKCAST v16.5 — ENGLISH TRANSLATIONS
// Complete bilingual dictionary for all UI elements
// ============================================

window.TRANSLATIONS_EN = {
    // Header & Navigation
    brand_title: "RISKCAST v12.5",
    brand_subtitle: "AI-Powered Logistics Risk Intelligence Platform",
    status_ready: "Analysis Complete",
    status_loading: "Loading data...",
    
    // View Mode Tabs
    tab_enterprise: "Enterprise Dashboard",
    tab_research: "Research / NCKH View",
    tab_investor: "Investor Pitch View",
    
    // Executive Snapshot
    section_executive: "Executive Snapshot",
    label_overall_risk: "Overall Risk Index",
    label_expected_loss: "Expected Loss",
    label_reliability: "Delivery Reliability",
    label_esg: "ESG Score (Environment – Social – Governance)",
    subtitle_per_shipment: "Per shipment",
    subtitle_on_time_prob: "On-time probability",
    subtitle_climate_political: "Climate + Political",
    label_top_route: "Top Route Risk:",
    label_main_driver: "Main Driver:",
    label_recommendation: "System Recommendation:",
    
    // Risk Gauges Section
    section_risk_gauges: "Risk Gauges Overview",
    gauge_risk_title: "Overall Risk Index",
    gauge_reliability_title: "Reliability Score",
    gauge_esg_title: "ESG Score",
    
    // Gauge Explanations (McKinsey-style)
    gauge_explanations: {
        title: "Detailed Insights",
        risk_title: "Overall Risk Index",
        risk: {
            low: "Low risk (0–40). The logistics flow is stable with minimal disruption probability. Suitable for cost/time optimization.",
            medium: "Moderate risk (40–70). Certain operational or weather-driven fluctuations are emerging. Active monitoring required.",
            high: "High risk (70–100). Elevated probability of delays or incidents. Route reassessment and mitigation actions recommended."
        },
        reliability_title: "Reliability Score",
        reliability: {
            very_high: "Very high reliability (>85). Strong predictive stability; ideal for high-value shipments.",
            stable: "Stable (60–85). Acceptable variations within control limits.",
            unstable: "Unstable (<60). Sensitive to disruptions. Not ideal for time-critical cargo."
        },
        esg_title: "ESG Score",
        esg: {
            strong: "Strong ESG compliance (>70). Environmentally aligned route, suitable for sustainability-focused businesses.",
            moderate: "Moderate ESG performance (40–70). Acceptable but not optimized.",
            weak: "Weak ESG compliance (<40). Elevated ESG risk; alternative routing recommended."
        }
    },
    
    // Risk Levels
    risk_level_low: "Low",
    risk_level_medium: "Medium",
    risk_level_high: "High",
    
    // Charts & Sections
    section_radar: "Risk Profile Radar Chart",
    section_layers: "Risk Layer Decomposition",
    section_montecarlo: "Monte Carlo Distribution",
    section_timeline: "Risk Timeline",
    section_matrix: "Probability × Impact Risk Matrix",
    section_scenario: "Scenario Stress Test (What-if)",
    section_tradeoff: "Cost-Time-Risk Tradeoff",
    section_route: "Route Segment Analysis",
    section_recommendations: "AI Expert Recommendations",
    
    // Research View
    section_research_methodology: "Research Methodology Overview",
    panel_dataset: "Panel 1: Dataset Interpretation",
    panel_criteria: "Panel 2: Criteria Construction",
    panel_fuzzy_ahp: "Panel 3: Fuzzy AHP Methodology",
    panel_fuzzy_topsis: "Panel 4: Fuzzy-TOPSIS Analysis",
    panel_montecarlo: "Panel 5: Monte Carlo Simulation",
    panel_integrated: "Panel 6: Integrated Risk Model",
    panel_policy: "Panel 7: Policy Implications for Vietnamese SMEs",
    panel_sensitivity: "Panel 8: Sensitivity & Robustness Check",
    
    // Investor View
    section_problem_solution: "Problem → Solution → Why Now",
    problem_title: "Problem",
    solution_title: "Solution",
    why_now_title: "Why Now",
    section_economics: "Economics Snapshot",
    section_arr: "ARR / Revenue Potential",
    section_architecture: "Engine-as-a-Service Architecture",
    section_pitch: "One-Slide Story for Investors",
    investor_ask: "The Ask:",
    
    // Scenario Names
    scenario_base: "Base Case",
    scenario_best: "Best Case",
    scenario_worst: "Worst Case",
    
    // Risk Layer Names
    layer_delay: "Delay Risk",
    layer_damage: "Damage Risk",
    layer_cost: "Cost Volatility",
    layer_operational: "Operational Risk",
    layer_esg: "ESG Risk",
    layer_political: "Political Risk",
    layer_climate: "Climate Risk",
    
    // Common Terms
    based_on_simulations: "Based on",
    simulations: "simulations",
    days: "days",
    usd: "USD",
    percent: "%",
    
    // Placeholders
    loading: "Loading...",
    no_data: "No data available",
    calculating: "Calculating...",
    
    // Buttons & Actions
    btn_analyze: "Run Analysis",
    btn_reset: "Reset",
    btn_export: "Export Report",
    
    // Errors
    error_no_data: "No data available. Please run analysis first.",
    error_fetch: "Failed to fetch data from server.",
    
    // Input Page Labels
    input_transport_mode: "Transport Mode",
    input_cargo_type: "Cargo Type",
    input_route: "Route",
    input_incoterm: "Incoterm Condition",
    input_container: "Container Type",
    input_quality: "Packaging Quality",
    input_priority: "Priority Mode",
    input_analysis_button: "Run Risk Analysis",
    input_transport_placeholder: "Select transport mode",
    placeholder_select: "Select...",
    placeholder_packages: "Enter quantity",
    placeholder_auto: "Auto-calculated",
    
    // Input Page Sections
    section1_title: "Cargo Configuration",
    section1_subtitle: "Background data for AI to optimize routes, time and risks by shipping region.",
    section2_title: "Shipping Information",
    section2_subtitle: "Route details and delivery conditions",
    section3_title: "Additional Parameters",
    section3_subtitle: "Factors affecting risk",
    
    // Input Page Status
    status_ready: "System Ready",
    loading_text: "Initializing Risk Engine...",
    
    // Input Page Labels (detailed)
    label_transport_mode: "Transport Mode",
    label_cargo_type: "Cargo Type",
    label_route: "Route",
    label_incoterm: "Incoterm Condition",
    label_container: "Container Type",
    label_packaging: "Packaging Quality",
    label_priority: "Priority Mode",
    label_packages: "Number of Packages",
    label_etd: "Expected Departure Date (ETD)",
    label_eta: "Expected Arrival Date (ETA)",
    label_cargo_value: "Cargo Value (USD)",
    
    // Transport Mode Options (11 International Modes)
    transport_sea: "Sea Freight",
    transport_air: "Air Freight",
    transport_road: "Road Transport",
    transport_rail: "Rail Transport",
    transport_multimodal: "Multimodal Transport",
    transport_intermodal: "Intermodal Transport",
    transport_express: "Courier / Express",
    transport_postal: "International Postal / Parcel",
    transport_pipeline: "Pipeline Transport",
    transport_inland: "Inland Waterway",
    transport_roro: "Ro-Ro Transport",
    
    // Input Page Options (Transport Mode - Legacy)
    opt_tm_ocean_fcl: "Ocean Freight — FCL",
    opt_tm_ocean_lcl: "Ocean Freight — LCL",
    opt_tm_air: "Air Freight",
    opt_tm_rail: "Rail Freight",
    opt_tm_road: "Road — Truck",
    opt_tm_multimodal: "Multimodal Transport",
    opt_tm_courier: "Courier / Express",
    opt_tm_inland: "Inland Waterway",
    opt_tm_pipeline: "Pipeline",
    opt_tm_cross: "Cross-border Road",
    opt_tm_lastmile: "Last-mile Delivery",
    
    // Input Page Error Messages
    error_required: "This field is required",
    error_positive: "Value must be a positive number",
    error_date_invalid: "Invalid date",
    confirm_reset: "Are you sure you want to reset all fields?",
    alert_success: "Risk analysis completed successfully!",
    
    // Buyer/Seller Fields
    buyer_section: "Buyer Information",
    buyer_name: "Buyer Name",
    buyer_country: "Buyer Country",
    buyer_size: "Company Size",
    buyer_esg: "ESG Score (if available)",
    buyer_reliability: "Reliability Score",
    seller_section: "Seller Information",
    seller_name: "Seller Name",
    seller_country: "Seller Country",
    seller_size: "Company Size",
    seller_esg: "ESG Score (if available)",
    seller_reliability: "Reliability Score",
    
    // Country Options
    country_vn: "Vietnam",
    country_cn: "China",
    country_jp: "Japan",
    country_kr: "South Korea",
    country_us: "United States",
    country_eu: "European Union",
    
    // Company Size Options
    company_sme: "SME (10–200 employees)",
    company_medium: "Medium (200–500)",
    company_large: "Large (>500)",
    
    // Cargo Type Options
    opt_ct_general: "General Cargo",
    opt_ct_electronics: "Electronics",
    opt_ct_food_bev: "Food & Beverage",
    opt_ct_garments: "Garments / Textile",
    opt_ct_agriculture: "Agriculture",
    opt_ct_refrigerated: "Refrigerated / Frozen",
    opt_ct_chemicals: "Chemicals",
    opt_ct_machinery: "Machinery",
    opt_ct_fragile: "Fragile Goods",
    opt_ct_auto_parts: "Automotive Parts",
    
    // Route Options
    opt_vn_us: "Vietnam → United States",
    opt_vn_eu: "Vietnam → Europe",
    opt_vn_cn: "Vietnam → China",
    opt_vn_sg: "Vietnam → Singapore",
    opt_domestic: "Domestic",
    
    // Incoterm Options
    opt_ic_exw: "EXW",
    opt_ic_fca: "FCA",
    opt_ic_fas: "FAS",
    opt_ic_fob: "FOB",
    opt_ic_cfr: "CFR",
    opt_ic_cif: "CIF",
    opt_ic_cpt: "CPT",
    opt_ic_cip: "CIP",
    opt_ic_dap: "DAP",
    opt_ic_dpu: "DPU",
    opt_ic_ddp: "DDP",
    
    // Container Type Options
    opt_cn_20ft: "20ft Standard",
    opt_cn_40ft: "40ft Standard",
    opt_cn_40hc: "40ft High Cube",
    opt_cn_45hc: "45ft High Cube",
    opt_cn_reefer: "Reefer Container",
    opt_cn_opentop: "Open-top",
    opt_cn_flatrack: "Flat-rack",
    opt_cn_isotank: "ISO Tank",
    
    // Packaging Quality Options
    opt_pk_poor: "Poor",
    opt_pk_medium: "Medium",
    opt_pk_good: "Good",
    opt_pk_excellent: "Excellent",
    
    // Climate Inputs
    label_climate_tail_prob: "Climate Tail Event Probability",
    
    // Priority Profile Options
    opt_pr_economy: "Economy",
    opt_pr_standard: "Standard",
    opt_pr_express: "Express",
    opt_pr_critical: "Critical",
    
    // Section Titles
    section_buyer_seller: "Buyer & Seller",
    section_buyer_seller_subtitle: "Trading partner information",
    
    // Transit Time Label
    label_transit_time: "Transit Time",
    
    // Suffixes
    suffix_days: "days",
    suffix_units: "units",
    
    // Module Titles & Descriptions
    module_fuzzy_title: "Fuzzy AHP",
    module_fuzzy_desc: "Multi-criteria decision analysis",
    module_arima_title: "ARIMA Forecasting",
    module_arima_desc: "Time series prediction model",
    module_mc_title: "Monte Carlo",
    module_mc_desc: "Stochastic simulation engine",
    module_var_title: "VaR / CVaR",
    module_var_desc: "Extreme risk quantification"
};

