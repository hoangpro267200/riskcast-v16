// ============================================
// RISKCAST v16.5 — VIETNAMESE TRANSLATIONS
// Complete bilingual dictionary for all UI elements
// ============================================

window.TRANSLATIONS_VI = {
    // Header & Navigation
    brand_title: "RISKCAST v12.5",
    brand_subtitle: "Nền Tảng Thông Minh Phân Tích Rủi Ro Logistics Được Hỗ Trợ Bởi AI",
    status_ready: "Phân Tích Hoàn Tất",
    status_loading: "Đang tải dữ liệu...",
    
    // View Mode Tabs
    tab_enterprise: "Chế Độ Doanh Nghiệp",
    tab_research: "Chế Độ Phân Tích NCKH",
    tab_investor: "Chế Độ Trình Bày Nhà Đầu Tư",
    
    // Executive Snapshot
    section_executive: "Tổng Quan Điều Hành",
    label_overall_risk: "Chỉ số rủi ro tổng hợp",
    label_expected_loss: "Tổn thất kỳ vọng",
    label_reliability: "Độ tin cậy giao hàng",
    label_esg: "Điểm ESG (Môi trường – Xã hội – Quản trị)",
    subtitle_per_shipment: "Mỗi lô hàng",
    subtitle_on_time_prob: "Xác suất đúng hạn",
    subtitle_climate_political: "Khí hậu + Chính trị",
    label_top_route: "Rủi ro tuyến vận tải lớn nhất:",
    label_main_driver: "Nguyên nhân chính:",
    label_recommendation: "Khuyến nghị của hệ thống:",
    
    // Risk Gauges Section
    section_risk_gauges: "Tổng Quan Đồng Hồ Rủi Ro",
    gauge_risk_title: "Chỉ Số Rủi Ro Tổng Thể",
    gauge_reliability_title: "Điểm Độ Tin Cậy",
    gauge_esg_title: "Điểm ESG",
    
    // Gauge Explanations (NCKH/Academic style)
    gauge_explanations: {
        title: "Giải Thích Chuyên Sâu",
        risk_title: "Chỉ Số Rủi Ro Tổng Thể",
        risk: {
            low: "Mức rủi ro thấp (0–40). Chuỗi vận tải duy trì độ ổn định cao, xác suất biến cố thấp. Có thể tối ưu thêm chi phí hoặc thời gian.",
            medium: "Rủi ro trung bình (40–70). Một số yếu tố vận hành – thời tiết – cảng có xu hướng biến động. Doanh nghiệp nên theo dõi sát để giảm thiểu tổn thất.",
            high: "Rủi ro cao (70–100). Xác suất sự cố hoặc chậm trễ tăng rõ rệt. Cần đánh giá lại tuyến đường, phương thức vận tải và điều kiện cargo."
        },
        reliability_title: "Điểm Độ Tin Cậy",
        reliability: {
            very_high: "Độ tin cậy rất cao (>85). Biến động thấp, mô hình dự báo ổn định. Phù hợp các lô hàng giá trị lớn.",
            stable: "Ổn định (60–85). Hệ thống có dao động nhẹ nhưng trong giới hạn cho phép.",
            unstable: "Không ổn định (<60). Hoạt động dễ chịu tác động bởi thời tiết hoặc tắc nghẽn. Không khuyến nghị với hàng nhạy cảm thời gian."
        },
        esg_title: "Điểm ESG",
        esg: {
            strong: "Tuân thủ ESG mạnh (>70). Tuyến vận tải thân thiện môi trường, phù hợp các doanh nghiệp ưu tiên bền vững.",
            moderate: "Mức trung bình (40–70). Chưa tối ưu ESG nhưng vẫn chấp nhận được.",
            weak: "Mức thấp (<40). Rủi ro tuân thủ ESG cao. Nên xem xét tuyến vận tải khác."
        }
    },
    
    // Risk Levels
    risk_level_low: "Thấp",
    risk_level_medium: "Trung Bình",
    risk_level_high: "Cao",
    
    // Charts & Sections
    section_radar: "Biểu Đồ Radar Hồ Sơ Rủi Ro",
    section_layers: "Phân Tích Phân Lớp Rủi Ro",
    section_montecarlo: "Phân Phối Monte Carlo",
    section_timeline: "Dòng Thời Gian Rủi Ro",
    section_matrix: "Ma Trận Rủi Ro Xác Suất × Tác Động",
    section_scenario: "Kiểm Tra Áp Lực Kịch Bản (What-if)",
    section_tradeoff: "Đánh Đổi Chi Phí-Thời Gian-Rủi Ro",
    section_route: "Phân Tích Theo Cấp Độ Tuyến Đường",
    section_recommendations: "Khuyến Nghị Từ Chuyên Gia AI",
    
    // Research View
    section_research_methodology: "Tổng Quan Phương Pháp Nghiên Cứu",
    panel_dataset: "Bảng 1: Giải Thích Dữ Liệu",
    panel_criteria: "Bảng 2: Xây Dựng Tiêu Chí",
    panel_fuzzy_ahp: "Bảng 3: Phương Pháp Fuzzy AHP",
    panel_fuzzy_topsis: "Bảng 4: Phân Tích Fuzzy-TOPSIS",
    panel_montecarlo: "Bảng 5: Mô Phỏng Monte Carlo",
    panel_integrated: "Bảng 6: Mô Hình Rủi Ro Tích Hợp",
    panel_policy: "Bảng 7: Ý Nghĩa Chính Sách Cho SME Việt Nam",
    panel_sensitivity: "Bảng 8: Kiểm Tra Độ Nhạy & Độ Vững Chắc",
    
    // Investor View
    section_problem_solution: "Vấn Đề → Giải Pháp → Tại Sao Bây Giờ",
    problem_title: "Vấn Đề",
    solution_title: "Giải Pháp",
    why_now_title: "Tại Sao Bây Giờ",
    section_economics: "Tóm Tắt Tác Động Kinh Tế",
    section_arr: "ARR / Tiềm Năng Doanh Thu",
    section_architecture: "Kiến Trúc Engine-as-a-Service",
    section_pitch: "Câu Chuyện Một Trang Cho Nhà Đầu Tư",
    investor_ask: "Yêu Cầu:",
    
    // Scenario Names
    scenario_base: "Trường Hợp Cơ Bản",
    scenario_best: "Kịch Bản Tốt Nhất",
    scenario_worst: "Kịch Bản Xấu Nhất",
    
    // Risk Layer Names
    layer_delay: "Rủi Ro Trễ",
    layer_damage: "Rủi Ro Hư Hại",
    layer_cost: "Biến Động Chi Phí",
    layer_operational: "Rủi Ro Vận Hành",
    layer_esg: "Rủi Ro ESG",
    layer_political: "Rủi Ro Chính Trị",
    layer_climate: "Rủi Ro Khí Hậu",
    
    // Common Terms
    based_on_simulations: "Dựa trên",
    simulations: "mô phỏng",
    days: "ngày",
    usd: "USD",
    percent: "%",
    
    // Placeholders
    loading: "Đang tải...",
    no_data: "Không có dữ liệu",
    calculating: "Đang tính toán...",
    
    // Buttons & Actions
    btn_analyze: "Chạy Phân Tích",
    btn_reset: "Đặt Lại",
    btn_export: "Xuất Báo Cáo",
    
    // Errors
    error_no_data: "Không có dữ liệu. Vui lòng chạy phân tích trước.",
    error_fetch: "Không thể tải dữ liệu từ máy chủ.",
    
    // Input Page Labels
    input_transport_mode: "Phương Thức Vận Tải",
    input_cargo_type: "Loại Hàng Hóa",
    input_route: "Tuyến Đường",
    input_incoterm: "Điều Kiện Incoterm",
    input_container: "Loại Container",
    input_quality: "Chất Lượng Bao Bì",
    input_priority: "Chế Độ Ưu Tiên",
    input_analysis_button: "Phân Tích Rủi Ro",
    input_transport_placeholder: "Chọn phương thức vận tải",
    placeholder_select: "Chọn...",
    placeholder_packages: "Nhập số lượng",
    placeholder_auto: "Tự động tính toán",
    
    // Transport Mode Options (11 International Modes)
    transport_sea: "Đường biển",
    transport_air: "Đường hàng không",
    transport_road: "Đường bộ",
    transport_rail: "Đường sắt",
    transport_multimodal: "Đa phương thức",
    transport_intermodal: "Liên hợp vận tải",
    transport_express: "Chuyển phát nhanh",
    transport_postal: "Bưu kiện quốc tế",
    transport_pipeline: "Đường ống",
    transport_inland: "Đường thủy nội địa",
    transport_roro: "Vận tải Ro-Ro",
    transport_mode: "Phương thức vận tải",
    cargo_type: "Loại hàng hóa",
    route: "Tuyến đường",
    incoterm: "Điều kiện Incoterm",
    container: "Loại container",
    packaging: "Chất lượng bao bì",
    priority: "Chế độ ưu tiên",
    
    // Input Page Sections
    section1_title: "Cấu Hình Hàng Hóa",
    section1_subtitle: "Dữ liệu nền để AI tối ưu lộ trình, thời gian và rủi ro theo từng khu vực vận chuyển.",
    section2_title: "Thông Tin Vận Chuyển",
    section2_subtitle: "Chi tiết tuyến đường và điều kiện giao hàng",
    section3_title: "Thông Số Bổ Sung",
    section3_subtitle: "Các yếu tố ảnh hưởng đến rủi ro",
    
    // Input Page Status
    status_ready: "Hệ Thống Sẵn Sàng",
    loading_text: "Đang khởi tạo Risk Engine...",
    
    // Input Page Labels (detailed)
    label_transport_mode: "Phương Thức Vận Tải",
    label_cargo_type: "Loại Hàng Hóa",
    label_route: "Tuyến Đường",
    label_incoterm: "Điều Kiện Incoterm",
    label_container: "Loại Container",
    label_packaging: "Chất Lượng Bao Bì",
    label_priority: "Chế Độ Ưu Tiên",
    label_packages: "Số Lượng Kiện Hàng",
    label_etd: "Ngày Gửi Hàng Dự Kiến (ETD)",
    label_eta: "Ngày Đến Dự Kiến (ETA)",
    label_cargo_value: "Giá Trị Hàng Hóa (USD)",
    
    // Input Page Options (Transport Mode)
    opt_tm_ocean_fcl: "Vận Tải Biển — FCL",
    opt_tm_ocean_lcl: "Vận Tải Biển — LCL",
    opt_tm_air: "Vận Tải Hàng Không",
    opt_tm_rail: "Vận Tải Đường Sắt",
    opt_tm_road: "Đường Bộ — Xe Tải",
    opt_tm_multimodal: "Vận Tải Đa Phương Thức",
    opt_tm_courier: "Chuyển Phát Nhanh / Express",
    opt_tm_inland: "Đường Thủy Nội Địa",
    opt_tm_pipeline: "Đường Ống",
    opt_tm_cross: "Đường Bộ Xuyên Biên Giới",
    opt_tm_lastmile: "Giao Hàng Cuối Dặm",
    
    // Input Page Error Messages
    error_required: "Trường này là bắt buộc",
    error_positive: "Giá trị phải là số dương",
    error_date_invalid: "Ngày không hợp lệ",
    confirm_reset: "Bạn có chắc chắn muốn đặt lại tất cả các trường?",
    alert_success: "Phân tích rủi ro hoàn tất thành công!",
    
    // Buyer/Seller Fields
    buyer_section: "Thông tin Người Mua (Buyer)",
    buyer_name: "Tên người mua",
    buyer_country: "Quốc gia người mua",
    buyer_size: "Quy mô doanh nghiệp",
    buyer_esg: "Điểm ESG (nếu có)",
    buyer_reliability: "Điểm uy tín (Reliability)",
    seller_section: "Thông tin Người Bán (Seller)",
    seller_name: "Tên người bán",
    seller_country: "Quốc gia người bán",
    seller_size: "Quy mô doanh nghiệp",
    seller_esg: "Điểm ESG (nếu có)",
    seller_reliability: "Điểm uy tín (Reliability)",
    
    // Country Options
    country_vn: "Việt Nam",
    country_cn: "Trung Quốc",
    country_jp: "Nhật Bản",
    country_kr: "Hàn Quốc",
    country_us: "Hoa Kỳ",
    country_eu: "Liên Minh Châu Âu",
    
    // Company Size Options
    company_sme: "SME (10–200 lao động)",
    company_medium: "Trung bình (200–500)",
    company_large: "Lớn (>500)",
    
    // Cargo Type Options
    opt_ct_general: "Hàng Hóa Thông Thường",
    opt_ct_electronics: "Điện Tử",
    opt_ct_food_bev: "Thực Phẩm & Đồ Uống",
    opt_ct_garments: "May Mặc / Dệt May",
    opt_ct_agriculture: "Nông Sản",
    opt_ct_refrigerated: "Hàng Lạnh / Đông Lạnh",
    opt_ct_chemicals: "Hóa Chất",
    opt_ct_machinery: "Máy Móc Thiết Bị",
    opt_ct_fragile: "Hàng Dễ Vỡ",
    opt_ct_auto_parts: "Linh Kiện Ô Tô",
    
    // Route Options
    opt_vn_us: "Việt Nam → Hoa Kỳ",
    opt_vn_eu: "Việt Nam → Châu Âu",
    opt_vn_cn: "Việt Nam → Trung Quốc",
    opt_vn_sg: "Việt Nam → Singapore",
    opt_domestic: "Nội Địa",
    
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
    opt_cn_20ft: "20ft Thường",
    opt_cn_40ft: "40ft Thường",
    opt_cn_40hc: "40ft Cao (High Cube)",
    opt_cn_45hc: "45ft Cao (High Cube)",
    opt_cn_reefer: "Container Lạnh (Reefer)",
    opt_cn_opentop: "Container Mở Nóc (Open-top)",
    opt_cn_flatrack: "Flat-rack (Sàn Phẳng)",
    opt_cn_isotank: "ISO Tank",
    
    // Packaging Quality Options
    opt_pk_poor: "Kém",
    opt_pk_medium: "Trung Bình",
    opt_pk_good: "Tốt",
    opt_pk_excellent: "Xuất Sắc",
    
    // Climate Inputs
    label_climate_tail_prob: "Xác Suất Sự Kiện Khí Hậu Cực Đoan",
    
    // Priority Profile Options
    opt_pr_economy: "Tiết Kiệm (Economy)",
    opt_pr_standard: "Tiêu Chuẩn (Standard)",
    opt_pr_express: "Hỏa Tốc (Express)",
    opt_pr_critical: "Cấp Bách (Critical)",
    
    // Section Titles
    section_buyer_seller: "Người Mua & Người Bán",
    section_buyer_seller_subtitle: "Thông tin đối tác thương mại",
    
    // Transit Time Label
    label_transit_time: "Thời Gian Vận Chuyển",
    
    // Suffixes
    suffix_days: "ngày",
    suffix_units: "đơn vị",
    
    // Module Titles & Descriptions
    module_fuzzy_title: "Fuzzy AHP",
    module_fuzzy_desc: "Phân tích quyết định đa tiêu chí",
    module_arima_title: "Dự Báo ARIMA",
    module_arima_desc: "Mô hình dự đoán chuỗi thời gian",
    module_mc_title: "Monte Carlo",
    module_mc_desc: "Công cụ mô phỏng ngẫu nhiên",
    module_var_title: "VaR / CVaR",
    module_var_desc: "Định lượng rủi ro cực đoan"
};

