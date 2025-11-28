/**
 * ============================================================
 * INPUT FORM JAVASCRIPT
 * Extracted from input.html for better organization
 * ============================================================
 */

window.disableSmartProgressTracking = true;

const LANG = {
    en: {
        brand_title: "RISKCAST v12",
        brand_subtitle: "Enterprise Risk Assessment Platform",
        status_ready: "System Ready",
        demo_btn: "Demo Case: Điện tử 50 tấn HCM→LA",
        progress_label: "Form Completion:",
        loading_text: "Initializing Risk Engine...",
       
        section1_title: "Shipping Information",
        section1_subtitle: "Background data for AI to optimize routes, time and risks by shipping region.",
        section2_title: "Shipment Details",
        section2_subtitle: "Specify quantity, timeline and value parameters",
        section3_title: "Algorithm Modules",
        section3_subtitle: "Configure risk analysis engines",
        section4_title: "Seller Information",
        section4_subtitle: "Thông Tin Người Bán",
        section5_title: "Buyer Information",
        section5_subtitle: "Thông Tin Người Mua",
        section6_title: "Advanced Risk Parameters",
        section6_subtitle: "Detailed risk factors for accurate analysis",
        section7_title: "Climate & ESG Data",
        section7_subtitle: "Optional climate risk parameters (auto-filled if empty)",
       
        label_transport_mode: "Transport Mode",
        label_cargo_type: "Cargo Type",
        label_route: "Trade Route",
        label_carrier: "Carrier / Shipping Line",
        label_incoterm: "Incoterm",
        label_container: "Container Type",
        label_packaging: "Packaging Quality",
        label_packages: "Number of Packages",
        label_etd: "ETD - Departure Date",
        label_eta: "ETA - Arrival Date",
        label_transit_time: "Transit Time",
        label_cargo_value: "Cargo Value",
        label_priority: "Priority Profile",
       
        label_seller_name: "Company Name",
        label_seller_address: "Address",
        label_seller_country: "Country",
        label_seller_email: "Email",
        label_seller_phone: "Phone Number",
        label_seller_pic: "Person in Charge",
        label_seller_size: "Company Size",
        label_seller_esg: "ESG Score",
       
        label_buyer_name: "Company Name",
        label_buyer_address: "Address",
        label_buyer_country: "Country",
        label_buyer_email: "Email",
        label_buyer_phone: "Phone Number",
        label_buyer_pic: "Person in Charge",
        label_buyer_size: "Company Size",
        label_buyer_esg: "ESG Score",
       
        label_distance: "Transport Distance",
        label_route_type: "Route Type",
        label_carrier_rating: "Carrier Rating",
        label_weather_risk: "Weather Risk Score",
        label_port_risk: "Port Risk Score",
        label_priority_level: "Priority Level",
        label_container_match: "Container Match Quality",
        label_shipment_value: "Total Shipment Value",
       
        label_enso_index: "ENSO Index (El Niño/La Niña)",
        label_typhoon_freq: "Seasonal Typhoon Frequency",
        label_sst_anomaly: "Sea Surface Temperature Anomaly",
        label_port_climate_stress: "Port Climate Stress Score",
        label_climate_volatility: "Climate Volatility Index",
        label_esg_score: "ESG Score",
        label_climate_resilience: "Climate Resilience Score",
        label_green_packaging: "Green Packaging Score",
        label_climate_tail_prob: "Climate Tail Event Probability",
       
        placeholder_select: "Select option",
        placeholder_seller_name: "Enter company name",
        placeholder_seller_address: "Enter address",
        placeholder_seller_email: "email@example.com",
        placeholder_seller_phone: "+84 123 456 789",
        placeholder_seller_pic: "Enter person in charge",
        placeholder_buyer_name: "Enter company name",
        placeholder_buyer_address: "Enter address",
        placeholder_buyer_email: "email@example.com",
        placeholder_buyer_phone: "+84 123 456 789",
        placeholder_buyer_pic: "Enter person in charge",
        placeholder_packages: "0",
        placeholder_auto: "Auto-calculated",
       
        suffix_units: "units",
        suffix_days: "days",
       
        /* TRANSPORT MODE (11 OPTIONS) */
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
       
        /* CARGO TYPE (12 OPTIONS) */
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
        opt_ct_dg: "Dangerous Goods (DG)",
        opt_ct_pharma: "Pharmaceutical",
       
        /* ROUTE (GIỮ NGUYÊN) */
        opt_vn_us: "Vietnam → United States",
        opt_vn_eu: "Vietnam → Europe",
        opt_vn_cn: "Vietnam → China",
        opt_vn_sg: "Vietnam → Singapore",
        opt_domestic: "Domestic",
       
        /* INCOTERMS 2020 (11 ĐIỀU KIỆN) */
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
       
        /* CONTAINER TYPE (12 OPTIONS) */
        opt_cn_20ft: "20ft Standard",
        opt_cn_40ft: "40ft Standard",
        opt_cn_40hc: "40ft High Cube",
        opt_cn_45hc: "45ft High Cube",
        opt_cn_reefer: "Reefer Container",
        opt_cn_opentop: "Open-top",
        opt_cn_flatrack: "Flat-rack",
        opt_cn_isotank: "ISO Tank",
        opt_cn_bulk: "Bulk Container",
        opt_cn_pallet: "Palletized",
        opt_cn_wooden: "Wooden Crates",
        opt_cn_poly: "Polybags / Cartons",
       
        /* PACKAGING QUALITY (4 LEVELS) */
        opt_pk_poor: "Poor",
        opt_pk_medium: "Medium",
        opt_pk_good: "Good",
        opt_pk_excellent: "Excellent",
       
        /* PRIORITY PROFILE (4 LEVELS) */
        opt_pr_economy: "Economy",
        opt_pr_standard: "Standard",
        opt_pr_express: "Express",
        opt_pr_critical: "Critical",
       
        opt_country_vn: "Vietnam",
        opt_country_us: "United States",
        opt_country_cn: "China",
        opt_country_sg: "Singapore",
        opt_country_jp: "Japan",
        opt_country_kr: "South Korea",
        opt_country_th: "Thailand",
        opt_country_my: "Malaysia",
        opt_country_id: "Indonesia",
        opt_country_ph: "Philippines",
        opt_country_gb: "United Kingdom",
        opt_country_de: "Germany",
        opt_country_fr: "France",
        opt_country_au: "Australia",
        opt_country_other: "Other",
       
        opt_rt_direct: "Direct - Shortest route",
        opt_rt_standard: "Standard - Normal route",
        opt_rt_complex: "Complex - Multiple legs",
        opt_rt_hazardous: "Hazardous - High-risk areas",
       
        module_fuzzy_title: "Fuzzy AHP",
        module_fuzzy_desc: "Multi-criteria decision analysis",
        module_arima_title: "ARIMA Forecasting",
        module_arima_desc: "Time series prediction model",
        module_mc_title: "Monte Carlo",
        module_mc_desc: "Stochastic simulation engine",
        module_var_title: "VaR / CVaR",
        module_var_desc: "Extreme risk quantification",
       
        btn_reset: "Reset Form",
        btn_analyze: "Run Risk Analysis",
       
        error_required: "This field is required",
        error_positive: "Must be greater than 0",
        error_date_invalid: "Arrival must be after departure",
       
        confirm_reset: "Are you sure you want to reset all fields?",
        alert_success: "Risk analysis completed successfully!"
    },
    vi: {
        brand_title: "RISKCAST v12",
        brand_subtitle: "Nền Tảng Đánh Giá Rủi Ro Doanh Nghiệp",
        status_ready: "Hệ thống sẵn sàng",
        loading_text: "Đang khởi động công cụ rủi ro...",
       
        section1_title: "Thông Tin Vận Chuyển",
        section1_subtitle: "Dữ liệu nền để AI tối ưu lộ trình, thời gian và rủi ro theo từng khu vực vận chuyển.",
        section2_title: "Chi Tiết Lô Hàng",
        section2_subtitle: "Chỉ định số lượng, thời gian và giá trị",
        section3_title: "Mô-đun Thuật Toán",
        section3_subtitle: "Cấu hình công cụ phân tích rủi ro",
        section4_title: "Thông Tin Người Bán",
        section4_subtitle: "Seller Information",
        section5_title: "Thông Tin Người Mua",
        section5_subtitle: "Buyer Information",
        section6_title: "Thông Số Rủi Ro Nâng Cao",
        section6_subtitle: "Các yếu tố rủi ro chi tiết cho phân tích chính xác",
        section7_title: "Dữ Liệu Khí Hậu & ESG",
        section7_subtitle: "Thông số rủi ro khí hậu tùy chọn (tự động điền nếu để trống)",
       
        label_transport_mode: "Phương Thức Vận Chuyển",
        label_cargo_type: "Loại Hàng Hóa",
        label_route: "Tuyến Đường Thương Mại",
        label_carrier: "Hãng Tàu / Carrier",
        label_incoterm: "Điều Khoản Incoterm",
        label_container: "Loại Container",
        label_packaging: "Chất Lượng Đóng Gói",
        label_packages: "Số Lượng Kiện Hàng",
        label_etd: "ETD - Ngày Khởi Hành",
        label_eta: "ETA - Ngày Đến",
        label_transit_time: "Thời Gian Vận Chuyển",
        label_cargo_value: "Giá Trị Hàng Hóa",
        label_priority: "Hồ Sơ Ưu Tiên",
       
        label_seller_name: "Tên Công Ty",
        label_seller_address: "Địa Chỉ",
        label_seller_country: "Quốc Gia",
        label_seller_email: "Email",
        label_seller_phone: "Số Điện Thoại",
        label_seller_pic: "Người Phụ Trách",
        label_seller_size: "Quy Mô Công Ty",
        label_seller_esg: "Điểm ESG",
       
        label_buyer_name: "Tên Công Ty",
        label_buyer_address: "Địa Chỉ",
        label_buyer_country: "Quốc Gia",
        label_buyer_email: "Email",
        label_buyer_phone: "Số Điện Thoại",
        label_buyer_pic: "Người Phụ Trách",
        label_buyer_size: "Quy Mô Công Ty",
        label_buyer_esg: "Điểm ESG",
       
        label_distance: "Khoảng Cách Vận Chuyển",
        label_route_type: "Loại Tuyến Đường",
        label_carrier_rating: "Đánh Giá Nhà Vận Chuyển",
        label_weather_risk: "Rủi Ro Thời Tiết",
        label_port_risk: "Rủi Ro Cảng",
        label_priority_level: "Mức Độ Ưu Tiên",
        label_container_match: "Độ Phù Hợp Container",
        label_shipment_value: "Tổng Giá Trị Lô Hàng",
       
        label_enso_index: "Chỉ Số ENSO (El Niño/La Niña)",
        label_typhoon_freq: "Tần Suất Bão Theo Mùa",
        label_sst_anomaly: "Nhiệt Độ Bề Mặt Biển Bất Thường",
        label_port_climate_stress: "Điểm Áp Lực Khí Hậu Cảng",
        label_climate_volatility: "Chỉ Số Biến Động Khí Hậu",
        label_esg_score: "Điểm ESG",
        label_climate_resilience: "Điểm Khả Năng Chống Chịu Khí Hậu",
        label_green_packaging: "Điểm Đóng Gói Xanh",
        label_climate_tail_prob: "Xác Suất Sự Kiện Khí Hậu Cực Đoan",
       
        placeholder_select: "Chọn tùy chọn",
        placeholder_seller_name: "Nhập tên công ty",
        placeholder_seller_address: "Nhập địa chỉ",
        placeholder_seller_email: "email@example.com",
        placeholder_seller_phone: "+84 123 456 789",
        placeholder_seller_pic: "Nhập tên người phụ trách",
        placeholder_buyer_name: "Nhập tên công ty",
        placeholder_buyer_address: "Nhập địa chỉ",
        placeholder_buyer_email: "email@example.com",
        placeholder_buyer_phone: "+84 123 456 789",
        placeholder_buyer_pic: "Nhập tên người phụ trách",
        placeholder_packages: "0",
        placeholder_auto: "Tự động tính",
       
        suffix_units: "đơn vị",
        suffix_days: "ngày",
       
        /* TRANSPORT MODE (11 OPTIONS) */
        opt_tm_ocean_fcl: "Đường Biển — FCL (Nguyên container)",
        opt_tm_ocean_lcl: "Đường Biển — LCL (Ghép container)",
        opt_tm_air: "Vận Tải Hàng Không",
        opt_tm_rail: "Vận Tải Đường Sắt",
        opt_tm_road: "Đường Bộ — Xe Tải",
        opt_tm_multimodal: "Vận Tải Đa Phương Thức",
        opt_tm_courier: "Chuyển Phát Nhanh",
        opt_tm_inland: "Đường Thủy Nội Địa",
        opt_tm_pipeline: "Đường Ống",
        opt_tm_cross: "Đường Bộ Xuyên Biên Giới",
        opt_tm_lastmile: "Giao Hàng Chặng Cuối",
       
        /* CARGO TYPE (12 OPTIONS) */
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
        opt_ct_dg: "Hàng Nguy Hiểm (DG)",
        opt_ct_pharma: "Dược Phẩm",
       
        /* ROUTE (GIỮ NGUYÊN) */
        opt_vn_us: "Việt Nam → Hoa Kỳ",
        opt_vn_eu: "Việt Nam → Châu Âu",
        opt_vn_cn: "Việt Nam → Trung Quốc",
        opt_vn_sg: "Việt Nam → Singapore",
        opt_domestic: "Nội Địa",
       
        /* INCOTERMS 2020 (11 ĐIỀU KIỆN) */
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
       
        /* CONTAINER TYPE (12 OPTIONS) */
        opt_cn_20ft: "20ft Thường",
        opt_cn_40ft: "40ft Thường",
        opt_cn_40hc: "40ft Cao (High Cube)",
        opt_cn_45hc: "45ft Cao (High Cube)",
        opt_cn_reefer: "Container Lạnh (Reefer)",
        opt_cn_opentop: "Container Mở Nóc (Open-top)",
        opt_cn_flatrack: "Flat-rack (Sàn Phẳng)",
        opt_cn_isotank: "ISO Tank",
        opt_cn_bulk: "Container Chở Rời (Bulk)",
        opt_cn_pallet: "Hàng Xếp Pallet",
        opt_cn_wooden: "Thùng Gỗ",
        opt_cn_poly: "Bao PE / Carton",
       
        /* PACKAGING QUALITY (4 LEVELS) */
        opt_pk_poor: "Kém",
        opt_pk_medium: "Trung Bình",
        opt_pk_good: "Tốt",
        opt_pk_excellent: "Xuất Sắc",
       
        /* PRIORITY PROFILE (4 LEVELS) */
        opt_pr_economy: "Tiết Kiệm (Economy)",
        opt_pr_standard: "Tiêu Chuẩn (Standard)",
        opt_pr_express: "Hỏa Tốc (Express)",
        opt_pr_critical: "Cấp Bách (Critical)",
       
        opt_country_vn: "Việt Nam",
        opt_country_us: "Hoa Kỳ",
        opt_country_cn: "Trung Quốc",
        opt_country_sg: "Singapore",
        opt_country_jp: "Nhật Bản",
        opt_country_kr: "Hàn Quốc",
        opt_country_th: "Thái Lan",
        opt_country_my: "Malaysia",
        opt_country_id: "Indonesia",
        opt_country_ph: "Philippines",
        opt_country_gb: "Vương Quốc Anh",
        opt_country_de: "Đức",
        opt_country_fr: "Pháp",
        opt_country_au: "Úc",
        opt_country_other: "Khác",
       
        opt_rt_direct: "Trực Tiếp - Tuyến ngắn nhất",
        opt_rt_standard: "Tiêu Chuẩn - Tuyến thông thường",
        opt_rt_complex: "Phức Tạp - Nhiều chặng",
        opt_rt_hazardous: "Nguy Hiểm - Khu vực rủi ro cao",
       
        module_fuzzy_title: "Fuzzy AHP",
        module_fuzzy_desc: "Phân tích quyết định đa tiêu chí",
        module_arima_title: "Dự Báo ARIMA",
        module_arima_desc: "Mô hình dự đoán chuỗi thời gian",
        module_mc_title: "Monte Carlo",
        module_mc_desc: "Công cụ mô phỏng ngẫu nhiên",
        module_var_title: "VaR / CVaR",
        module_var_desc: "Định lượng rủi ro cực đoan",
       
        btn_reset: "Đặt Lại Biểu Mẫu",
        btn_analyze: "Chạy Phân Tích Rủi Ro",
       
        error_required: "Trường này là bắt buộc",
        error_positive: "Phải lớn hơn 0",
        error_date_invalid: "Ngày đến phải sau ngày khởi hành",
       
        confirm_reset: "Bạn có chắc chắn muốn đặt lại tất cả các trường?",
        alert_success: "Phân tích rủi ro hoàn tất thành công!",
        demo_btn: "Demo Case: Điện tử 50 tấn HCM→LA",
        progress_label: "Tiến Độ Hoàn Thành:"
    }
};
 
let currentLang = localStorage.getItem('riskcast_lang') || 'en';
const dropdownState = {};
 
document.addEventListener('DOMContentLoaded', function() {
    initializeLanguage();
    initializeDropdowns();
    initializeDateInputs();
    setupEventListeners();
    setupRealtimeValidation();
    
    // Re-initialize dropdowns after a short delay to ensure all elements are loaded
    setTimeout(() => {
        initializeDropdowns();
    }, 200);
    
    // Force re-initialize company size dropdowns after a longer delay to fix selection issues
    setTimeout(() => {
        const companySizeDropdowns = ['seller_size_dropdown', 'buyer_size_dropdown'];
        companySizeDropdowns.forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            if (dropdown) {
                const trigger = dropdown.querySelector('.dropdown-trigger');
                const options = dropdown.querySelectorAll('.dropdown-option');
                if (trigger) trigger.dataset.initialized = 'false';
                options.forEach(opt => opt.dataset.initialized = 'false');
                console.log(`🔄 Re-initializing ${dropdownId}`);
            }
        });
        initializeDropdowns();
    }, 500);
    
    // Initialize new features
    // Delay slider initialization to ensure all elements are rendered (especially for collapsed sections)
    // Slider displays are now handled by smart_input.js
    // setTimeout(() => {
    //     initializeSliderDisplays();
    // }, 200);
    initializeNewDropdowns();
    setupCollapsibleSection();
    setupAutoCalculation();
    
    // ==================== TÍNH NĂNG THÔNG MINH ====================
    // TÍNH NĂNG 1: Progress Sidebar + Header Percentage
    initializeProgressTracking();
    
    // TÍNH NĂNG 2: Smart Defaults & Auto-Fill
    initializeSmartDefaults();
    
    // TÍNH NĂNG 3: Conditional Visibility
    initializeConditionalVisibility();
    
    // TÍNH NĂNG 4: Auto Calculation nâng cao
    initializeAdvancedAutoCalc();
    
    // TÍNH NĂNG 5: Quick Demo Mode
    initializeDemoMode();
    
    // TÍNH NĂNG 6: Collapsible thông minh
    initializeSmartCollapsible();
    
    // TÍNH NĂNG 7: Realtime Validation + Tick xanh
    initializeRealtimeValidation();
    
    // TÍNH NĂNG 8: Loading Sequence (đã tích hợp vào runAnalysis)
    
    // TÍNH NĂNG 9: Mobile Perfect
    initializeMobileOptimization();
    
    // TÍNH NĂNG 10: Gọi tất cả khi change
    setupGlobalChangeListeners();
    
    // ==================== SMART INPUT SYSTEM INTEGRATION ====================
    // Initialize Smart Input after all other systems
    setTimeout(() => {
        console.log('🚀 Initializing Smart Input System...');
        
        // Populate transport modes when route changes
        const routeDropdown = document.getElementById('route_dropdown');
        if (routeDropdown) {
            const routeObserver = new MutationObserver(() => {
                const routeValue = getDropdownValue('route');
                if (routeValue) {
                    console.log('  - Route changed, updating transport modes:', routeValue);
                    populateTransportModes(routeValue);
                }
            });
            
            routeObserver.observe(routeDropdown, {
                attributes: true,
                subtree: true,
                childList: true
            });
        }
        
        // Populate detailed routes when transport mode changes
        const transportModeDropdown = document.getElementById('transport_mode_dropdown');
        if (transportModeDropdown) {
            transportModeDropdown.addEventListener('change', () => {
                const routeValue = getDropdownValue('route');
                const transportModeValue = getDropdownValue('transport_mode');
                if (routeValue && transportModeValue) {
                    console.log('  - Transport mode changed, updating detailed routes');
                    populateDetailedRoutes(routeValue, transportModeValue);
                }
            });
        }
        
        // Populate carriers when detailed route changes
        const detailedRouteDropdown = document.getElementById('detailed_route_dropdown');
        if (detailedRouteDropdown) {
            detailedRouteDropdown.addEventListener('change', () => {
                const routeValue = getDropdownValue('route');
                if (routeValue) {
                    console.log('  - Detailed route changed, updating carriers');
                    populateCarriersByRoute(routeValue);
                }
            });
        }
        
        // Update Smart Input when selections change
        ['route', 'cargo_type', 'container', 'carrier'].forEach(fieldId => {
            const dropdown = document.getElementById(fieldId + '_dropdown');
            if (dropdown) {
                dropdown.addEventListener('click', (e) => {
                    const option = e.target.closest('.dropdown-option');
                    if (option) {
                        setTimeout(() => updateSmartInputFeedback(), 100);
                    }
                });
            }
        });
        
        console.log('✅ Smart Input System initialized');
    }, 500);
    
    // Event listener cho form submit được gắn trong input.js
});
 
function initializeLanguage() {
    applyLanguage();
   
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang');
            setLang(lang);
        });
       
        if (btn.getAttribute('data-lang') === currentLang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}
 
function setLang(lang) {
    if (LANG[lang]) {
        currentLang = lang;
        localStorage.setItem('riskcast_lang', lang);
        applyLanguage();
       
        document.querySelectorAll('.lang-btn').forEach(btn => {
            if (btn.getAttribute('data-lang') === lang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}
 
function applyLanguage() {
    const translations = LANG[currentLang];
   
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const key = element.getAttribute('data-i18n');
        if (translations[key]) {
            if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
                element.placeholder = translations[key];
            } else {
                element.textContent = translations[key];
            }
        }
    });
   
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        if (translations[key]) {
            element.placeholder = translations[key];
        }
    });
   
    document.querySelectorAll('.dropdown-value.placeholder').forEach(element => {
        element.textContent = translations.placeholder_select;
    });
   
    Object.keys(dropdownState).forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (dropdown && dropdownState[dropdownId].selectedValue) {
            const selectedOption = dropdown.querySelector(`.dropdown-option[data-value="${dropdownState[dropdownId].selectedValue}"]`);
            if (selectedOption) {
                const key = selectedOption.getAttribute('data-i18n');
                if (translations[key]) {
                    const valueSpan = dropdown.querySelector('.dropdown-value');
                    valueSpan.textContent = translations[key];
                }
            }
        }
    });
}
 
/**
 * Helper function to setup dropdown listeners
 */
function setupDropdownListeners(dropdownId, trigger, options, menu) {
    if (!trigger || !options || options.length === 0) return;
    
    // Ensure pointer events are enabled
    trigger.style.pointerEvents = 'auto';
    trigger.style.cursor = 'pointer';
    trigger.style.userSelect = 'none';
    menu.style.pointerEvents = 'auto';
    
    // Setup trigger click listener
    trigger.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        console.log(`[${dropdownId}] Trigger clicked`);
        toggleDropdown(dropdownId);
    }, { capture: true });
   
    // Setup trigger keyboard listener
    trigger.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            e.stopPropagation();
            toggleDropdown(dropdownId);
        }
        handleDropdownKeyboard(e, dropdownId);
    });
   
    // Setup option listeners
    options.forEach((option, index) => {
        option.style.pointerEvents = 'auto';
        option.style.cursor = 'pointer';
        option.dataset.initialized = 'true';
        
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            const value = option.getAttribute('data-value');
            console.log(`[${dropdownId}] Option clicked: ${value} at index ${index}`);
            if (value) {
                selectOption(dropdownId, value, index);
            } else {
                console.warn(`Option at index ${index} in ${dropdownId} has no data-value`);
            }
        }, { capture: true });
       
        option.addEventListener('mouseenter', function() {
            clearFocusedOption(dropdownId);
            option.classList.add('focused');
            if (dropdownState[dropdownId]) {
                dropdownState[dropdownId].focusedIndex = index;
            }
        });
    });
    
    trigger.dataset.initialized = 'true';
}

function initializeDropdowns() {
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const dropdownId = dropdown.id;
        if (!dropdownId) return; // Skip if no ID
        
        const trigger = dropdown.querySelector('.dropdown-trigger');
        const menu = dropdown.querySelector('.dropdown-menu');
        let options = dropdown.querySelectorAll('.dropdown-option');
        const valueSpan = dropdown.querySelector('.dropdown-value');
        
        // CRITICAL FIX: Allow dropdowns with empty menus (like detailed_route_dropdown that populates dynamically)
        if (!trigger || !menu) {
            console.warn(`Dropdown ${dropdownId} is missing required elements (trigger or menu)`);
            return;
        }
        
        // Only warn if no options, but still initialize (for dynamically populated dropdowns)
        if (options.length === 0) {
            console.log(`Dropdown ${dropdownId} has no options yet (will be populated dynamically)`);
        } else {
            console.log(`✓ Initializing ${dropdownId} with ${options.length} options`);
        }
       
        // Initialize state if not exists
        if (!dropdownState[dropdownId]) {
            dropdownState[dropdownId] = {
                isOpen: false,
                selectedValue: null,
                selectedText: null,
                focusedIndex: -1
            };
        }
        
        // CRITICAL: Ensure all existing options have click handlers
        options.forEach((option, index) => {
            // Skip if already has listener (avoid duplicates)
            if (option.dataset.hasListener === 'true') {
                return;
            }
            
            // Ensure option is clickable
            option.style.setProperty('pointer-events', 'auto', 'important');
            option.style.setProperty('cursor', 'pointer', 'important');
            option.style.setProperty('z-index', '10004', 'important');
            option.style.setProperty('position', 'relative', 'important');
            
            // Add click handler
            option.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                const value = this.getAttribute('data-value');
                console.log(`[${dropdownId}] Option clicked: ${value} at index ${index}`);
                if (value) {
                    selectOption(dropdownId, value, index);
                }
            }, { capture: true });
            
            option.dataset.hasListener = 'true';
        });
       
        // Check if already initialized (avoid duplicate listeners)
        // For company size dropdowns, always re-initialize to ensure they work
        const isCompanySizeDropdown = dropdownId === 'seller_size_dropdown' || dropdownId === 'buyer_size_dropdown';
        
        if (trigger.dataset.initialized === 'true' && !isCompanySizeDropdown) {
            return;
        }
        
        // For company size dropdowns, force re-initialization by removing old listeners
        if (isCompanySizeDropdown && trigger.dataset.initialized === 'true') {
            // Remove initialization flag to allow re-initialization
            trigger.dataset.initialized = 'false';
            options.forEach(opt => opt.dataset.initialized = 'false');
        }
        
        // Ensure pointer events are enabled for all dropdowns
        trigger.style.pointerEvents = 'auto';
        trigger.style.cursor = 'pointer';
        trigger.style.userSelect = 'none';
        
        // Ensure menu is visible when active
        menu.style.pointerEvents = 'auto';
        
        trigger.dataset.initialized = 'true';
       
        // Remove any existing listeners first by cloning (clean slate)
        if (isCompanySizeDropdown) {
            const newTrigger = trigger.cloneNode(true);
            trigger.parentNode.replaceChild(newTrigger, trigger);
            const updatedTrigger = dropdown.querySelector('.dropdown-trigger');
            const updatedOptions = dropdown.querySelectorAll('.dropdown-option');
            
            // Setup listeners on fresh elements
            setupDropdownListeners(dropdownId, updatedTrigger, updatedOptions, menu);
            return;
        }
       
        // Setup listeners for regular dropdowns
        setupDropdownListeners(dropdownId, trigger, options, menu);
    });
   
    // Close dropdowns when clicking outside (only add once)
    if (!window.dropdownClickHandlerAdded) {
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.custom-dropdown')) {
                closeAllDropdowns();
            }
        });
        window.dropdownClickHandlerAdded = true;
    }
}
 
function toggleDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.warn(`Dropdown not found: ${dropdownId}`);
        return;
    }
    
    const state = dropdownState[dropdownId];
    if (!state) {
        console.warn(`Dropdown state not found: ${dropdownId}`);
        // Initialize state if missing
        dropdownState[dropdownId] = {
            isOpen: false,
            selectedValue: null,
            selectedText: null,
            focusedIndex: -1
        };
    }
   
    if (state.isOpen) {
        closeDropdown(dropdownId);
    } else {
        // CRITICAL FIX: Always close all other dropdowns before opening new one
        closeAllDropdowns(dropdownId);
        openDropdown(dropdownId);
    }
}
 
function openDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.warn(`Dropdown not found: ${dropdownId}`);
        return;
    }
    
    // CRITICAL FIX: Close ALL other dropdowns first - only one can be open at a time
    closeAllDropdowns(dropdownId);
    
    const state = dropdownState[dropdownId];
    if (!state) {
        console.warn(`Dropdown state not found: ${dropdownId}, creating new state`);
        dropdownState[dropdownId] = {
            isOpen: false,
            selectedValue: null,
            selectedText: null,
            focusedIndex: -1
        };
    }
    
    const currentState = dropdownState[dropdownId];
    
    // Clear validation error when opening dropdown
    const fieldId = dropdownId.replace('_dropdown', '');
    clearError(fieldId);
    
    // Remove error class from dropdown trigger
    const trigger = dropdown.querySelector('.dropdown-trigger');
    if (trigger) {
        trigger.classList.remove('error');
        trigger.style.borderColor = '';
    }
    
    // Ensure only this dropdown is active
    dropdown.classList.add('active');
    currentState.isOpen = true;
    
    // Show menu - Force display with high z-index
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
        // Check if menu has options
        const menuOptions = menu.querySelectorAll('.dropdown-option');
        
        console.log(`[${dropdownId}] Opening dropdown with ${menuOptions.length} options`);
        
        // If no options, show a message
        if (menuOptions.length === 0) {
            // Check if message already exists
            let noOptionsMsg = menu.querySelector('.no-options-message');
            if (!noOptionsMsg) {
                noOptionsMsg = document.createElement('div');
                noOptionsMsg.className = 'no-options-message';
                noOptionsMsg.style.cssText = 'padding: 12px 16px; color: rgba(255, 255, 255, 0.6); font-size: 14px; text-align: center; pointer-events: none;';
                
                // Set appropriate message based on dropdown
                if (dropdownId === 'transport_mode_dropdown') {
                    noOptionsMsg.textContent = 'Vui lòng chọn Tuyến Đường Thương Mại trước';
                } else if (dropdownId === 'detailed_route_dropdown') {
                    noOptionsMsg.textContent = 'Vui lòng chọn Phương Thức Vận Chuyển trước';
                } else if (dropdownId === 'carrier_dropdown' || dropdownId === 'pol_dropdown' || dropdownId === 'pod_dropdown') {
                    noOptionsMsg.textContent = 'Vui lòng chọn Route và Transport Mode trước';
                } else {
                    noOptionsMsg.textContent = 'Chưa có dữ liệu';
                }
                
                menu.appendChild(noOptionsMsg);
            }
        } else {
            // Remove message if options exist
            const existingMsg = menu.querySelector('.no-options-message');
            if (existingMsg) {
                existingMsg.remove();
            }
            
            // Ensure options are visible and clickable
            menuOptions.forEach((opt, index) => {
                // Force enable with maximum priority
                opt.style.setProperty('pointer-events', 'auto', 'important');
                opt.style.setProperty('z-index', '99999', 'important');
                opt.style.setProperty('cursor', 'pointer', 'important');
                opt.style.setProperty('display', 'block', 'important');
                opt.style.setProperty('visibility', 'visible', 'important');
                opt.style.setProperty('opacity', '1', 'important');
                opt.style.setProperty('position', 'relative', 'important');
                opt.style.setProperty('user-select', 'none', 'important');
                
                // Remove any blocking classes
                opt.classList.remove('disabled', 'locked', 'blocked');
                
                // Ensure option has click handler - Use multiple event types for maximum compatibility
                if (!opt.dataset.hasListener) {
                    // Create a unified click handler
                    const handleOptionClick = function(e) {
                        e.stopPropagation();
                        e.preventDefault();
                        const value = this.getAttribute('data-value');
                        console.log(`[${dropdownId}] Option clicked: ${value} at index ${index}`);
                        if (value) {
                            // Force enable one more time before selection
                            this.style.setProperty('pointer-events', 'auto', 'important');
                            this.style.setProperty('z-index', '99999', 'important');
                            selectOption(dropdownId, value, index);
                        }
                    };
                    
                    // Mouse click (primary)
                    opt.addEventListener('click', handleOptionClick, { capture: true, passive: false });
                    
                    // Touch events for mobile
                    opt.addEventListener('touchend', handleOptionClick, { capture: true, passive: false });
                    
                    // Mouse down as fallback
                    opt.addEventListener('mousedown', function(e) {
                        e.stopPropagation();
                        const value = this.getAttribute('data-value');
                        if (value) {
                            console.log(`[${dropdownId}] Option mousedown: ${value}`);
                            // Trigger click on mousedown as well
                            setTimeout(() => {
                                if (this.getAttribute('data-value') === value) {
                                    handleOptionClick.call(this, e);
                                }
                            }, 10);
                        }
                    }, { capture: true, passive: false });
                    
                    opt.dataset.hasListener = 'true';
                }
            });
        }
        
        // Force display menu with maximum priority
        menu.style.setProperty('display', 'block', 'important');
        menu.style.setProperty('visibility', 'visible', 'important');
        menu.style.setProperty('opacity', '1', 'important');
        menu.style.setProperty('z-index', '10003', 'important');
        menu.style.setProperty('pointer-events', 'auto', 'important');
        menu.style.setProperty('position', 'absolute', 'important');
        menu.style.setProperty('top', '100%', 'important');
        menu.style.setProperty('left', '0', 'important');
        menu.style.setProperty('right', '0', 'important');
        menu.style.setProperty('margin-top', '4px', 'important');
        menu.classList.add('active');
        
        console.log(`[${dropdownId}] Menu displayed with ${menuOptions.length} options`);
    } else {
        console.warn(`⚠️ Dropdown menu not found for: ${dropdownId}`);
    }
    
    console.log(`[${dropdownId}] Dropdown opened`);
   
    if (currentState.selectedValue) {
        const selectedOption = dropdown.querySelector(`.dropdown-option[data-value="${currentState.selectedValue}"]`);
        if (selectedOption) {
            selectedOption.scrollIntoView({ block: 'nearest' });
        }
    }
}
 
function closeDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return;
    
    const state = dropdownState[dropdownId];
    if (!state) return;
   
    dropdown.classList.remove('active');
    state.isOpen = false;
    state.focusedIndex = -1;
    clearFocusedOption(dropdownId);
    
    // CRITICAL FIX: Ensure menu is properly hidden to prevent ghost dropdowns
    const menu = dropdown.querySelector('.dropdown-menu');
    if (menu) {
        menu.style.display = 'none';
        menu.style.visibility = 'hidden';
        menu.style.opacity = '0';
    }
}
 
function closeAllDropdowns(exceptDropdownId = null) {
    // CRITICAL FIX: Close ALL dropdowns including those not in dropdownState
    document.querySelectorAll('.custom-dropdown.active').forEach(dropdown => {
        const dropdownId = dropdown.id;
        if (dropdownId && dropdownId !== exceptDropdownId) {
            closeDropdown(dropdownId);
        }
    });
    
    // Also close by removing active class directly (for dropdowns not in state)
    document.querySelectorAll('.custom-dropdown').forEach(dropdown => {
        const dropdownId = dropdown.id;
        if (dropdownId && dropdownId !== exceptDropdownId) {
            dropdown.classList.remove('active');
            const menu = dropdown.querySelector('.dropdown-menu');
            if (menu) {
                menu.style.display = 'none';
                menu.style.visibility = 'hidden';
                menu.style.opacity = '0';
                menu.classList.remove('active');
            }
        }
    });
    
    // Close all dropdown menus directly
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        if (menu.closest('.custom-dropdown')?.id !== exceptDropdownId) {
            menu.style.display = 'none';
            menu.style.visibility = 'hidden';
            menu.style.opacity = '0';
            menu.classList.remove('active');
        }
    });
}
 
function selectOption(dropdownId, value, index) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) {
        console.warn(`Dropdown not found: ${dropdownId}`);
        return;
    }
    
    const state = dropdownState[dropdownId];
    if (!state) {
        console.warn(`Dropdown state not found: ${dropdownId}`);
        return;
    }
    
    const valueSpan = dropdown.querySelector('.dropdown-value');
    const options = dropdown.querySelectorAll('.dropdown-option');
    const translations = LANG[currentLang];
   
    // Remove selected class from all options
    options.forEach(opt => opt.classList.remove('selected'));
    
    // Add selected class to chosen option
    if (options[index]) {
        options[index].classList.add('selected');
    }
   
    // Get display text
    const key = options[index]?.getAttribute('data-i18n');
    const text = translations[key] || options[index]?.textContent || value;
   
    // Update display
    if (valueSpan) {
        valueSpan.textContent = text.trim();
        valueSpan.classList.remove('placeholder');
    }
   
    // Update state
    state.selectedValue = value;
    state.selectedText = text.trim();
   
    // Write to hidden input
    const fieldName = dropdownId.replace('_dropdown', '');
    const hiddenInput = document.getElementById(fieldName + '_input');
    if (hiddenInput) {
        hiddenInput.value = value;
        console.log(`✓ Updated ${fieldName}_input with value: ${value}`);
    } else {
        console.warn(`✗ Hidden input not found: ${fieldName}_input for dropdown ${dropdownId}`);
    }
    
    // Close dropdown after selection
    closeDropdown(dropdownId);
        
        // Update summary section when dropdown changes
        if (typeof updateInputSummary === 'function') {
            setTimeout(() => {
                console.log('🔄 Updating summary after dropdown change:', dropdownId);
                updateInputSummary();
            }, 150);
        }
   
    // Special handling for route selection - populate transport modes
    if (dropdownId === 'route_dropdown') {
        console.log('📍 Route selected:', value);
            
            // Show transport mode group immediately
            const transportModeGroup = document.getElementById('transport_mode_group');
            if (transportModeGroup) {
                transportModeGroup.style.setProperty('display', 'grid', 'important');
                transportModeGroup.style.setProperty('visibility', 'visible', 'important');
                transportModeGroup.style.setProperty('opacity', '1', 'important');
            }
            
        // Call populateTransportModes immediately
        setTimeout(() => {
            populateTransportModes(value);
        }, 100);
            
        // Hide dependent fields (will be shown when populated)
            // Keep fields visible (they are now shown by default)
            // Don't hide them anymore
    }
    
    // Special handling for transport mode selection - populate detailed routes
    if (dropdownId === 'transport_mode_dropdown') {
        const routeValue = getDropdownValue('route');
        if (routeValue) {
            populateDetailedRoutes(routeValue, value);
        }
            // Show detailed route group immediately
            const detailedRouteGroup = document.getElementById('detailed_route_group');
            if (detailedRouteGroup) {
                detailedRouteGroup.style.setProperty('display', 'grid', 'important');
            }
    }
    
    // Special handling for detailed route selection - populate carriers
    if (dropdownId === 'detailed_route_dropdown') {
        const routeValue = getDropdownValue('route');
        if (routeValue) {
            // Ensure carrier group is shown when detailed route is selected
            const carrierGroup = document.getElementById('carrier_group');
            if (carrierGroup) {
                carrierGroup.style.setProperty('display', 'grid', 'important');
                carrierGroup.style.setProperty('visibility', 'visible', 'important');
                carrierGroup.style.setProperty('opacity', '1', 'important');
                console.log('✅ Carrier group shown after detailed route selection');
            }
            populateCarriersByRoute(routeValue);
        }
    }
    
    // Special handling for carrier selection - show rating
    if (dropdownId === 'carrier_dropdown') {
        displayCarrierRating(value);
    }
    
    // Special handling for priority selection - update preview and ensure value is displayed
    if (dropdownId === 'priority_dropdown') {
        // Ensure dropdown shows selected value
        const priorityDropdown = document.getElementById('priority_dropdown');
        const valueSpan = priorityDropdown?.querySelector('.dropdown-value');
        if (valueSpan && state.selectedText) {
            valueSpan.textContent = state.selectedText;
            valueSpan.classList.remove('placeholder');
        }
        setTimeout(() => updatePriorityWeightsDisplay(), 100);
    }
    
    // Smart Input System: Real-time feedback
    if (dropdownId === 'container_dropdown' || dropdownId === 'carrier_dropdown' || 
        dropdownId === 'cargo_type_dropdown' || dropdownId === 'route_dropdown') {
        setTimeout(() => {
            if (window.smartInputClass && typeof updateSmartInputFeedback === 'function') {
                updateSmartInputFeedback();
            }
            // Auto-update container match when cargo or container changes
            if (dropdownId === 'cargo_type_dropdown' || dropdownId === 'container_dropdown') {
                updateContainerMatch();
            }
        }, 150);
    }
    
    // Update summary panel
    if (typeof updateInputSummary === 'function') {
        setTimeout(updateInputSummary, 200);
    }
   
    // Clear validation error after selection
    const fieldId = dropdownId.replace('_dropdown', '');
    clearError(fieldId);
    
    // Remove error class from dropdown trigger
    const dropdownEl = document.getElementById(dropdownId);
    if (dropdownEl) {
        const trigger = dropdownEl.querySelector('.dropdown-trigger');
        if (trigger) {
            trigger.classList.remove('error');
            trigger.style.borderColor = '';
            trigger.style.boxShadow = '';
        }
    }
   
    closeDropdown(dropdownId);
}
 
function clearFocusedOption(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.querySelectorAll('.dropdown-option').forEach(opt => {
        opt.classList.remove('focused');
    });
}
 
function handleDropdownKeyboard(e, dropdownId) {
    const state = dropdownState[dropdownId];
    const dropdown = document.getElementById(dropdownId);
    const options = Array.from(dropdown.querySelectorAll('.dropdown-option'));
   
    switch(e.key) {
        case 'Enter':
        case ' ':
            e.preventDefault();
            if (!state.isOpen) {
                openDropdown(dropdownId);
            } else if (state.focusedIndex >= 0) {
                const focusedOption = options[state.focusedIndex];
                selectOption(dropdownId, focusedOption.getAttribute('data-value'), state.focusedIndex);
            }
            break;
           
        case 'Escape':
            e.preventDefault();
            closeDropdown(dropdownId);
            break;
           
        case 'ArrowDown':
            e.preventDefault();
            if (!state.isOpen) {
                openDropdown(dropdownId);
                state.focusedIndex = 0;
            } else {
                state.focusedIndex = Math.min(state.focusedIndex + 1, options.length - 1);
            }
            updateFocusedOption(dropdownId);
            break;
           
        case 'ArrowUp':
            e.preventDefault();
            if (state.isOpen) {
                state.focusedIndex = Math.max(state.focusedIndex - 1, 0);
                updateFocusedOption(dropdownId);
            }
            break;
           
        case 'Home':
            e.preventDefault();
            if (state.isOpen) {
                state.focusedIndex = 0;
                updateFocusedOption(dropdownId);
            }
            break;
           
        case 'End':
            e.preventDefault();
            if (state.isOpen) {
                state.focusedIndex = options.length - 1;
                updateFocusedOption(dropdownId);
            }
            break;
    }
}
 
function updateFocusedOption(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    const state = dropdownState[dropdownId];
    const options = dropdown.querySelectorAll('.dropdown-option');
   
    clearFocusedOption(dropdownId);
   
    if (state.focusedIndex >= 0 && state.focusedIndex < options.length) {
        options[state.focusedIndex].classList.add('focused');
        options[state.focusedIndex].scrollIntoView({ block: 'nearest' });
    }
}
 
function getDropdownValue(dropdownId) {
    const fullId = dropdownId.endsWith('_dropdown') ? dropdownId : dropdownId + '_dropdown';
    return dropdownState[fullId]?.selectedValue || null;
}

// Helper function to hide fields
function hideField(fieldId) {
    const field = document.getElementById(fieldId);
    if (field) {
        field.style.display = 'none';
        // Reset values
        const dropdown = field.querySelector('.custom-dropdown');
        if (dropdown) {
            const valueSpan = dropdown.querySelector('.dropdown-value');
            if (valueSpan) {
                valueSpan.textContent = valueSpan.classList.contains('placeholder') ? valueSpan.textContent : 'Chưa chọn';
                valueSpan.classList.add('placeholder');
            }
        }
    }
}

// ==================== TRANSPORT MODE MANAGEMENT ====================
function populateTransportModes(tradeRouteKey) {
    console.log('🚚 Populating transport modes for route:', tradeRouteKey);
    
    const transportModeGroup = document.getElementById('transport_mode_group');
    const transportModeMenu = document.getElementById('transport_mode_menu');
    const transportModeInput = document.getElementById('transport_mode_input');
    
    if (!transportModeGroup || !transportModeMenu) {
        console.warn('⚠️ Transport mode elements not found');
        return;
    }
    
    // Check if LOGISTICS_DATA is loaded
    if (!window.LOGISTICS_DATA) {
        console.warn('⚠️ LOGISTICS_DATA not loaded yet, retrying...');
        setTimeout(() => populateTransportModes(tradeRouteKey), 500);
        return;
    }
    
    // Get route data
    const logisticsRouteKey = window.LOGISTICS_DATA.mapRouteFromHTML(tradeRouteKey);
    console.log('  - Mapped route key:', logisticsRouteKey, 'from HTML key:', tradeRouteKey);
    
    const routeData = window.LOGISTICS_DATA.getRoute(logisticsRouteKey);
    
    if (!routeData) {
        console.error('  ❌ Route data not found for key:', logisticsRouteKey);
        transportModeGroup.style.display = 'none';
        if (transportModeInput) transportModeInput.value = '';
        return;
    }
    
    if (!routeData.transport_modes || routeData.transport_modes.length === 0) {
        console.warn('  ⚠️ No transport modes found for this route');
        transportModeGroup.style.display = 'none';
        if (transportModeInput) transportModeInput.value = '';
        return;
    }
    
    // Clear existing options first
    transportModeMenu.innerHTML = '';
    
    console.log(`  - Found ${routeData.transport_modes.length} transport modes`);
    
    // Show the transport mode group (use grid to match form-group style)
    // Force display with !important to override any CSS
    transportModeGroup.style.setProperty('display', 'grid', 'important');
    transportModeGroup.style.setProperty('visibility', 'visible', 'important');
    transportModeGroup.style.setProperty('opacity', '1', 'important');
    console.log('  ✅ Transport mode group displayed with display: grid (important)');
    
    // Double check it's visible
    setTimeout(() => {
        const computedStyle = window.getComputedStyle(transportModeGroup);
        console.log('  🔍 Computed display style:', computedStyle.display);
        if (computedStyle.display === 'none') {
            console.error('  ❌ Group is still hidden! Forcing visibility...');
            transportModeGroup.style.setProperty('display', 'grid', 'important');
        }
    }, 50);
        
        // Get current transport mode selection BEFORE creating options
        const currentTransportMode = getDropdownValue('transport_mode');
        const transportValueSpan = document.querySelector('#transport_mode_dropdown .dropdown-value');
        const wasTransportModeSelected = currentTransportMode && transportValueSpan && !transportValueSpan.classList.contains('placeholder');
        
        // Check if current transport mode is still valid for new route
        let shouldKeepSelection = false;
        let validModeData = null;
        if (wasTransportModeSelected && currentTransportMode) {
            validModeData = routeData.transport_modes.find(mode => mode.value === currentTransportMode);
            if (validModeData) {
                shouldKeepSelection = true;
                console.log('  ✓ Current transport mode is still valid, keeping selection:', currentTransportMode);
            } else {
                console.log('  ⚠️ Current transport mode is not valid for new route, resetting');
            }
        }
    
    // Create options
    routeData.transport_modes.forEach((mode, index) => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        option.setAttribute('data-value', mode.value);
        option.setAttribute('role', 'option');
            
            // Mark as selected if we're keeping the selection
            if (shouldKeepSelection && mode.value === currentTransportMode) {
                option.classList.add('selected');
            }
        
        // Create option content
        const isRecommended = mode.default || mode.share >= 30;
        option.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">
                        ${mode.label || mode.label_vi || mode.value}
                        ${isRecommended ? '<span style="margin-left: 8px; padding: 2px 6px; background: rgba(0,255,136,0.2); color: #00ff88; border-radius: 4px; font-size: 10px;">Đề xuất</span>' : ''}
                    </div>
                    <div style="font-size: 11px; color: var(--text-tertiary);">
                        ⏱️ ${mode.days || mode.hours || 'N/A'} • ${mode.description || ''}
                    </div>
                </div>
                <div style="text-align: right; font-size: 11px; color: var(--text-tertiary); margin-left: 12px;">
                    ${mode.share ? `${mode.share}%` : ''}
                </div>
            </div>
        `;
        
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption('transport_mode_dropdown', mode.value, index);
        });
        
        transportModeMenu.appendChild(option);
    });
    
        // Only reset selection if transport mode is not valid for new route
        if (shouldKeepSelection && validModeData) {
            // Keep the current selection
            if (transportModeInput) transportModeInput.value = currentTransportMode;
            if (transportValueSpan) {
                // Rebuild display text
                const isRecommended = validModeData.default || validModeData.share >= 30;
                let displayText = validModeData.label || validModeData.label_vi || validModeData.value;
                if (isRecommended) {
                    displayText += ' ⚙️ Đề xuất';
                }
                if (validModeData.share) {
                    displayText += ` • ${validModeData.share}%`;
                }
                transportValueSpan.textContent = displayText;
                transportValueSpan.classList.remove('placeholder');
            }
            console.log('  ✅ Transport mode selection preserved');
        } else {
    // Reset selection
    if (transportModeInput) transportModeInput.value = '';
    if (transportValueSpan) {
        transportValueSpan.textContent = 'Chọn phương thức vận chuyển';
        transportValueSpan.classList.add('placeholder');
            }
    }
    
    console.log('  ✅ Transport modes populated successfully');
}

// ==================== DETAILED ROUTE MANAGEMENT ====================
function populateDetailedRoutes(tradeRouteKey, transportModeValue = null) {
    console.log('🛣️ Populating detailed routes for:', tradeRouteKey, 'transport mode:', transportModeValue);
    
    const detailedRouteGroup = document.getElementById('detailed_route_group');
    const detailedRouteMenu = document.getElementById('detailed_route_menu');
    const detailedRouteInput = document.getElementById('detailed_route_input');
    
    if (!detailedRouteGroup || !detailedRouteMenu) {
        console.warn('⚠️ Detailed route elements not found');
        return;
    }
    
    // Require transport mode to be selected first
    if (!transportModeValue) {
        const currentTransportMode = getDropdownValue('transport_mode');
        if (!currentTransportMode) {
            detailedRouteGroup.style.display = 'none';
            if (detailedRouteInput) detailedRouteInput.value = '';
            console.log('  - Transport mode not selected yet');
            return;
        }
        transportModeValue = currentTransportMode;
    }
    
    // Check if LOGISTICS_DATA is loaded
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.getDetailedRoutes) {
        console.warn('⚠️ LOGISTICS_DATA not loaded yet, retrying...');
        setTimeout(() => populateDetailedRoutes(tradeRouteKey, transportModeValue), 500);
        return;
    }
    
    // Get route data and find transport mode
    const logisticsRouteKey = window.LOGISTICS_DATA.mapRouteFromHTML(tradeRouteKey);
    const routeData = window.LOGISTICS_DATA.getRoute(logisticsRouteKey);
    
    if (!routeData || !routeData.transport_modes) {
        detailedRouteGroup.style.display = 'none';
        if (detailedRouteInput) detailedRouteInput.value = '';
        console.log('  - No route data found');
        return;
    }
    
    // Find the selected transport mode
    const selectedTransportMode = routeData.transport_modes.find(mode => mode.value === transportModeValue);
    
    if (!selectedTransportMode || !selectedTransportMode.routes || selectedTransportMode.routes.length === 0) {
        // Fallback: Try to get from detailedRoutes (new structure)
        const detailedRoutes = window.LOGISTICS_DATA.getDetailedRoutes ? window.LOGISTICS_DATA.getDetailedRoutes(tradeRouteKey) : [];
        
        if (!detailedRoutes || detailedRoutes.length === 0) {
            detailedRouteGroup.style.display = 'none';
            if (detailedRouteInput) detailedRouteInput.value = '';
            console.log('  - No detailed routes found for this transport mode');
            return;
        }
        
        // Use detailedRoutes structure
        detailedRouteGroup.style.setProperty('display', 'grid', 'important');
        detailedRouteGroup.style.setProperty('visibility', 'visible', 'important');
        detailedRouteGroup.style.setProperty('opacity', '1', 'important');
        detailedRouteMenu.innerHTML = '';
        
        detailedRoutes.forEach((route, index) => {
            const option = document.createElement('div');
            option.className = 'dropdown-option';
            option.setAttribute('data-value', route.id);
            option.setAttribute('role', 'option');
            
            option.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                    <div style="flex: 1;">
                        <div style="font-weight: 600; margin-bottom: 2px;">${route.name}</div>
                        <div style="font-size: 11px; color: var(--text-tertiary);">
                            ⏱️ ${route.transitTime} • ${route.surcharge}
                        </div>
                    </div>
                    <div style="text-align: right; font-size: 11px; color: var(--text-tertiary); margin-left: 12px;">
                        ${route.usagePercent}
                    </div>
                </div>
            `;
            
            option.addEventListener('click', (e) => {
                e.stopPropagation();
                selectOption('detailed_route_dropdown', route.id, index);
                displayRouteDetails(route);
            });
            
            detailedRouteMenu.appendChild(option);
        });
        
        console.log(`  - Found ${detailedRoutes.length} detailed routes (from new structure)`);
        return;
    }
    
    // Use routes from transport mode
    const routes = selectedTransportMode.routes;
    
    // Clear existing options first
    detailedRouteMenu.innerHTML = '';
    
    console.log(`  - Found ${routes.length} detailed routes for transport mode: ${transportModeValue}`);
    
    // Show the detailed route group (use grid to match form-group style)
    detailedRouteGroup.style.setProperty('display', 'grid', 'important');
    detailedRouteGroup.style.setProperty('visibility', 'visible', 'important');
    detailedRouteGroup.style.setProperty('opacity', '1', 'important');
    console.log('  ✅ Detailed route group displayed with display: grid (important)');
    
    // Create options from transport mode routes
    routes.forEach((route, index) => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        const routeId = `${tradeRouteKey}_${transportModeValue}_${index}`;
        option.setAttribute('data-value', routeId);
        option.setAttribute('role', 'option');
        
        // Format route name
        const routeName = `${route.pol} (${route.pol_code}) → ${route.pod} (${route.pod_code})`;
        const transitTime = route.days ? `${route.days} ngày` : route.hours ? `${route.hours} giờ` : 'N/A';
        
        option.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">${routeName}</div>
                    <div style="font-size: 11px; color: var(--text-tertiary);">
                        ⏱️ ${transitTime} • ${route.cost || 'N/A'}
                    </div>
                </div>
                <div style="text-align: right; font-size: 11px; color: var(--text-tertiary); margin-left: 12px;">
                    ${route.km ? `${route.km} km` : ''}
                </div>
            </div>
        `;
        
        // Create route detail object for displayRouteDetails
        const routeDetail = {
            name: routeName,
            transitTime: transitTime,
            surcharge: route.cost || 'N/A',
            climateRisk: selectedTransportMode.risk_level === 'high' ? 'Cao' : selectedTransportMode.risk_level === 'medium' ? 'Trung bình' : 'Thấp',
            conflictRisk: 'Thấp', // Default, can be enhanced
            usagePercent: `${selectedTransportMode.share || 0}%`,
            note: selectedTransportMode.description || ''
        };
        
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption('detailed_route_dropdown', routeId, index);
            displayRouteDetails(routeDetail);
        });
        
        detailedRouteMenu.appendChild(option);
    });
    
    // Reset selection
    if (detailedRouteInput) detailedRouteInput.value = '';
    const routeValueSpan = document.querySelector('#detailed_route_dropdown .dropdown-value');
    if (routeValueSpan) {
        routeValueSpan.textContent = 'Chọn tuyến vận chuyển';
        routeValueSpan.classList.add('placeholder');
    }
    
    // Hide details panel initially
    const detailsPanel = document.getElementById('route_details_panel');
    if (detailsPanel) {
        detailsPanel.style.display = 'none';
    }
    
    console.log('  ✅ Detailed routes populated successfully');
}

function displayRouteDetails(route) {
    console.log('📋 Displaying route details:', route);
    
    const detailsPanel = document.getElementById('route_details_panel');
    if (!detailsPanel) return;
    
    // Update detail values
    const transitEl = document.getElementById('route_detail_transit');
    const surchargeEl = document.getElementById('route_detail_surcharge');
    const climateEl = document.getElementById('route_detail_climate');
    const conflictEl = document.getElementById('route_detail_conflict');
    const usageEl = document.getElementById('route_detail_usage');
    const noteEl = document.getElementById('route_detail_note');
    
    if (transitEl) transitEl.textContent = route.transitTime;
    if (surchargeEl) surchargeEl.textContent = route.surcharge;
    if (climateEl) {
        climateEl.textContent = route.climateRisk;
        // Color code based on risk level
        if (route.climateRisk.includes('Cao') || route.climateRisk.includes('cao')) {
            climateEl.style.color = '#EF4444';
        } else if (route.climateRisk.includes('Trung bình')) {
            climateEl.style.color = '#FBBF24';
        } else {
            climateEl.style.color = '#10B981';
        }
    }
    if (conflictEl) {
        conflictEl.textContent = route.conflictRisk;
        // Color code based on risk level
        if (route.conflictRisk.includes('Rất cao') || route.conflictRisk.includes('Cao')) {
            conflictEl.style.color = '#EF4444';
        } else if (route.conflictRisk.includes('Trung bình')) {
            conflictEl.style.color = '#FBBF24';
        } else {
            conflictEl.style.color = '#10B981';
        }
    }
    if (usageEl) usageEl.textContent = route.usagePercent;
    if (noteEl) noteEl.textContent = route.note;
    
    // Show panel with animation
    detailsPanel.style.display = 'block';
    detailsPanel.style.animation = 'slideDown 0.3s ease';
    
    console.log('  ✅ Route details displayed');
}

// ==================== CARRIER MANAGEMENT WITH SMART INPUT ====================
function populateCarriersByRoute(routeKey) {
    console.log('🚢 Populating carriers for route:', routeKey);
    
    const carrierGroup = document.getElementById('carrier_group');
    
    // Check if detailed route is selected (optional - carriers can be shown based on route only)
    const detailedRouteValue = getDropdownValue('detailed_route');
    if (!detailedRouteValue) {
        // Don't hide, just don't show yet - will be shown when detailed route is selected
        console.log('  - Detailed route not selected yet, carriers will be shown when route is selected');
    }
    
    // Show carrier group when route is available (use grid to match form-group style)
    if (carrierGroup && routeKey) {
        carrierGroup.style.setProperty('display', 'grid', 'important');
        carrierGroup.style.setProperty('visibility', 'visible', 'important');
        carrierGroup.style.setProperty('opacity', '1', 'important');
        console.log('  ✅ Carrier group displayed with display: grid (important)');
    }
    
    if (!window.LOGISTICS_DATA) {
        console.warn('⚠ LOGISTICS_DATA not loaded yet, retrying...');
        setTimeout(() => populateCarriersByRoute(routeKey), 500);
        return;
    }

    // Convert HTML route value to logistics key (e.g., "domestic" -> "domestic_vn")
    const logisticsRouteKey = window.LOGISTICS_DATA.mapRouteFromHTML(routeKey);
    
    // Use getCarrierRatings() for new data structure with ontime, price, note
    const carriers = window.LOGISTICS_DATA.getCarrierRatings(logisticsRouteKey) || window.LOGISTICS_DATA.getCarriersByRoute(logisticsRouteKey);
    const carrierDropdown = document.getElementById('carrier_dropdown');
    const carrierMenu = document.getElementById('carrier_dropdown_menu') || carrierDropdown?.querySelector('.dropdown-menu');
    const carrierInput = document.getElementById('carrier_input');
    const carrierRatingInfo = document.getElementById('carrier_rating_info');
    const carrierNote = document.getElementById('carrier_note');
    
    if (!carrierMenu) {
        console.error('❌ Carrier menu not found');
        console.log('Debug info:', {
            carrierDropdown: !!carrierDropdown,
            carrierMenuById: !!document.getElementById('carrier_dropdown_menu'),
            carrierMenuByQuery: !!carrierDropdown?.querySelector('.dropdown-menu')
        });
        return;
    }
    
    console.log(`✓ Carrier menu found, populating ${carriers.length} carriers...`);

    // Clear existing options
    carrierMenu.innerHTML = '';
    
    if (!carriers || carriers.length === 0) {
        carrierMenu.innerHTML = '<div class="dropdown-option" style="color: var(--text-tertiary); pointer-events: none;">Không có hãng tàu cho tuyến này</div>';
        if (carrierInput) carrierInput.value = '';
        if (carrierRatingInfo) carrierRatingInfo.style.display = 'none';
        if (carrierNote) carrierNote.style.display = 'none';
        console.log('  - No carriers found for this route');
        return;
    }

    console.log(`  - Found ${carriers.length} carriers`);

    // Sort carriers by rating (highest first)
    const sortedCarriers = [...carriers].sort((a, b) => b.rating - a.rating);

    // Create options with Smart Input styling
    sortedCarriers.forEach((carrier, index) => {
        const option = document.createElement('div');
        const carrierId = `carrier-${carrier.name.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '')}`;
        option.id = carrierId;
        option.className = 'dropdown-option carrier-item';
        option.setAttribute('data-value', carrier.name);
        option.setAttribute('data-carrier-name', carrier.name);
        option.setAttribute('role', 'option');
        
        // Determine status for styling
        const status = carrier.rating >= 4.4 ? 'excellent' : carrier.rating >= 4.2 ? 'warning' : 'bad';
        
        // Create option content with rating
        const stars = '⭐'.repeat(Math.floor(carrier.rating));
        const ratingColor = carrier.rating >= 4.5 ? '#10B981' : 
                          carrier.rating >= 4.0 ? '#3B82F6' : '#FBBF24';
        
        option.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; width: 100%; position: relative;">
                <div style="flex: 1;">
                    <div style="font-weight: 600; margin-bottom: 2px;">${carrier.name}</div>
                    <div style="font-size: 11px; color: var(--text-tertiary);">
                        On-time: ${carrier.ontime}% • ${carrier.price}
                    </div>
                </div>
                <div style="text-align: right; display: flex; align-items: center; gap: 8px;">
                    <span class="rating-badge status-${status}" style="padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: 600; background: ${ratingColor}; color: white;">
                        ${carrier.rating.toFixed(1)}⭐
                    </span>
                    <div style="font-size: 10px; color: var(--text-tertiary);">
                        ${carrier.votes ? carrier.votes.toLocaleString() + ' reviews' : 'Verified'}
                    </div>
                </div>
            </div>
        `;
        
        option.addEventListener('click', (e) => {
            e.stopPropagation();
            selectOption('carrier_dropdown', carrier.name, index);
            displayCarrierRating(carrier.name);
            // Update smart input feedback
            if (window.smartInputClass) {
                setTimeout(() => {
                    window.smartInputClass.updateUIFeedback({
                        carrier: carrier.name,
                        route: routeKey
                    });
                }, 100);
            }
        });
        
        carrierMenu.appendChild(option);
    });

    console.log(`  ✅ Successfully populated ${carriers.length} carriers into menu`);
    console.log(`     Menu now has ${carrierMenu.children.length} children`);
    
    // Ensure carrier menu is visible when dropdown is active
    if (carrierDropdown) {
        const menu = carrierDropdown.querySelector('.dropdown-menu') || carrierMenu;
        if (menu) {
            menu.style.setProperty('display', 'block', 'important');
            menu.style.setProperty('visibility', 'visible', 'important');
            menu.style.setProperty('opacity', '1', 'important');
            menu.style.setProperty('z-index', '10003', 'important');
        }
    }

    // Reset carrier selection
    if (carrierInput) carrierInput.value = '';
    const carrierValueSpan = document.querySelector('#carrier_dropdown .dropdown-value');
    if (carrierValueSpan) {
        carrierValueSpan.textContent = 'Chọn hãng tàu';
        carrierValueSpan.classList.add('placeholder');
    }
    if (carrierRatingInfo) carrierRatingInfo.style.display = 'none';
    if (carrierNote) carrierNote.style.display = 'none';
    
    // Reset carrier rating in summary
    updateSummaryCarrierRating(null, null);
    
    // Initialize dropdown state if not exists
    if (!dropdownState['carrier_dropdown']) {
        dropdownState['carrier_dropdown'] = {
            isOpen: false,
            selectedValue: null,
            selectedText: null,
            focusedIndex: -1
        };
    }
}

function displayCarrierRating(carrierName) {
    if (!window.LOGISTICS_DATA) return;

    const routeKey = getDropdownValue('route');
    if (!routeKey) return;

    // Convert HTML route value to logistics key
    const logisticsRouteKey = window.LOGISTICS_DATA.mapRouteFromHTML(routeKey);
    
    // Use getCarrierRatings() for new data structure
    const carriers = window.LOGISTICS_DATA.getCarrierRatings(logisticsRouteKey) || window.LOGISTICS_DATA.getCarriersByRoute(logisticsRouteKey);
    const carrier = carriers.find(c => c.name === carrierName);
    
    if (!carrier) return;

    console.log('📊 Displaying carrier rating:', carrier);

    const carrierRatingInfo = document.getElementById('carrier_rating_info');
    const carrierRatingStarsDisplay = document.getElementById('carrier_rating_stars_display');
    const carrierRatingVotes = document.getElementById('carrier_rating_votes');
    const carrierNote = document.getElementById('carrier_note');
    
    if (!carrierRatingInfo || !carrierRatingStarsDisplay || !carrierRatingVotes) return;

    // Display stars
    const fullStars = Math.floor(carrier.rating);
    const hasHalfStar = carrier.rating % 1 >= 0.5;
    const ratingColor = carrier.rating >= 4.5 ? '#10B981' : 
                       carrier.rating >= 4.0 ? '#3B82F6' : '#FBBF24';
    
    let starsHTML = '';
    for (let i = 0; i < fullStars; i++) {
        starsHTML += `<span style="color: ${ratingColor};">⭐</span>`;
    }
    if (hasHalfStar) {
        starsHTML += `<span style="color: ${ratingColor};">½⭐</span>`;
    }
    
    carrierRatingStarsDisplay.innerHTML = `${carrier.rating.toFixed(1)} ${starsHTML}`;
    carrierRatingVotes.textContent = carrier.votes ? `(${carrier.votes.toLocaleString()} reviews)` : '';
    carrierRatingInfo.style.display = 'inline-block';
    
    // Display note with animation
    if (carrierNote && carrier.note) {
        carrierNote.textContent = `💡 ${carrier.note}`;
        carrierNote.style.display = 'block';
        carrierNote.style.animation = 'slideDown 0.3s ease';
    }
    
    // Update carrier rating hidden input (auto-calculated, not user input)
    const carrierRatingInput = document.getElementById('carrier_rating');
    if (carrierRatingInput) {
        carrierRatingInput.value = carrier.rating;
        console.log('  ✅ Carrier rating auto-updated to:', carrier.rating);
    }
    
    // Update summary carrier section immediately
    updateSummaryCarrierRating(carrier.rating, carrierName);
    
    console.log('  ✅ Carrier rating displayed');
}

// Helper function to update carrier rating in summary section
function updateSummaryCarrierRating(rating, carrierName) {
    // === GUARD: Check if input-summary-container exists ===
    const hasSummary = document.getElementById('input-summary-container');
    if (!hasSummary) {
        // Silently skip if summary container doesn't exist
        return;
    }
    // ====================================================
    
    const summaryContainer = document.getElementById('summary_section') || document.getElementById('input-summary-section') || document.getElementById('summaryGrid') || document.getElementById('inputSummaryGrid');
    if (!summaryContainer) {
        return;
    }
    
    // Update carrier name in summary
    const summaryCarrierName = document.getElementById('input-summary-carrier');
    if (summaryCarrierName) {
        summaryCarrierName.textContent = carrierName || 'Chưa chọn';
    }
    
    // Only update rating if carrier is selected
    if (!carrierName || carrierName === 'Chưa chọn' || !rating) {
        const summaryRatingValue = document.getElementById('input-summary-carrier-rating-value');
        const summaryRatingStars = document.getElementById('input-summary-carrier-rating-stars');
        
        if (summaryRatingValue) {
            summaryRatingValue.textContent = '--';
        }
        if (summaryRatingStars) {
            const stars = summaryRatingStars.querySelectorAll('.summary-star');
            stars.forEach(star => {
                star.classList.remove('filled');
                star.textContent = '☆';
            });
        }
        console.log('  ⚠️ Carrier not selected, rating hidden');
        return;
    }
    
    // Update carrier rating value in summary
    const summaryRatingValue = document.getElementById('input-summary-carrier-rating-value');
    if (summaryRatingValue) {
        summaryRatingValue.textContent = rating.toFixed(1);
    }
    
    // Update carrier rating stars in summary
    const summaryRatingStars = document.getElementById('input-summary-carrier-rating-stars');
    if (summaryRatingStars) {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 >= 0.5;
        const stars = summaryRatingStars.querySelectorAll('.summary-star');
        
        stars.forEach((star, index) => {
            if (index < fullStars) {
                star.classList.add('filled');
                star.textContent = '★';
                star.style.color = '#10B981';
            } else if (index === fullStars && hasHalfStar) {
                star.classList.add('filled');
                star.textContent = '☆';
                star.style.color = '#10B981';
            } else {
                star.classList.remove('filled');
                star.textContent = '☆';
                star.style.color = 'rgba(255, 255, 255, 0.3)';
            }
        });
    }
    
    console.log('  ✅ Summary carrier rating updated:', rating);
}

// ==================== AUTO-UPDATE CONTAINER MATCH ====================
function updateContainerMatch() {
    const cargoType = getDropdownValue('cargo_type');
    const containerType = getDropdownValue('container');
    
    if (!cargoType || !containerType) {
        console.log('  - Container match: Waiting for cargo type and container selection');
        return;
    }
    
    // Use Smart Input System to get compatibility score
    if (!window.smartInputClass) {
        console.warn('  ⚠️ Smart Input System not loaded yet');
        return;
    }
    
    const compatibility = window.smartInputClass.getCompatibilityScore(cargoType, containerType);
    const containerMatchInput = document.getElementById('container_match');
    
    if (containerMatchInput && compatibility.score > 0) {
        containerMatchInput.value = compatibility.score.toFixed(1);
        console.log('  ✅ Container match auto-updated to:', compatibility.score, 'for', cargoType, '+', containerType);
        
        // Update summary display if exists
        const summaryContainerMatch = document.getElementById('summary-container-match');
        if (summaryContainerMatch) {
            // Format: show as integer if whole number, otherwise show 1 decimal
            const formattedScore = compatibility.score % 1 === 0 
                ? compatibility.score.toFixed(0) 
                : compatibility.score.toFixed(1);
            const scoreValue = `${formattedScore}/10`;
            summaryContainerMatch.textContent = scoreValue;
            applyPlaceholderClass(summaryContainerMatch, scoreValue);
        }
        
        // Also update input summary container match
        const inputSummaryContainerMatch = document.getElementById('input-summary-container-match');
        if (inputSummaryContainerMatch) {
            const formattedScore = compatibility.score % 1 === 0 
                ? compatibility.score.toFixed(0) 
                : compatibility.score.toFixed(1);
            const scoreValue = `${formattedScore}/10`;
            inputSummaryContainerMatch.textContent = scoreValue;
            applyPlaceholderClass(inputSummaryContainerMatch, scoreValue);
        }
    }
}

const PRIORITY_WEIGHT_MAPPING = {
    economy: {
        speed: 20,
        cost: 60,
        risk: 20,
        description: 'Ưu tiên chi phí thấp, chấp nhận thời gian lâu hơn'
    },
    standard: {
        speed: 40,
        cost: 40,
        risk: 20,
        description: 'Cân bằng giữa chi phí, thời gian và rủi ro'
    },
    express: {
        speed: 70,
        cost: 20,
        risk: 10,
        description: 'Ưu tiên tốc độ, chấp nhận chi phí cao hơn'
    },
    critical: {
        speed: 80,
        cost: 10,
        risk: 10,
        description: 'Giao hàng cấp bách, tối thiểu hóa rủi ro trễ'
    }
};

function getPriorityWeights(profile) {
    return PRIORITY_WEIGHT_MAPPING[profile] || PRIORITY_WEIGHT_MAPPING['standard'];
}

function updatePriorityWeightsDisplay() {
    const priorityHidden = document.getElementById('priority_input');
    const profile = priorityHidden?.value || getDropdownValue('priority') || 'standard';
    const weights = getPriorityWeights(profile);

    const speedEl = document.getElementById('priority_speed_display');
    const costEl = document.getElementById('priority_cost_display');
    const riskEl = document.getElementById('priority_risk_display');
    const descEl = document.getElementById('priority_description');
    const previewBox = document.getElementById('priority_preview_box');
    const selectedBadge = document.getElementById('priority_selected_badge');
    
    // Get selected priority name and ensure dropdown displays it
    const priorityDropdown = document.getElementById('priority_dropdown');
    const selectedOption = priorityDropdown?.querySelector('.dropdown-option.selected');
    const valueSpan = priorityDropdown?.querySelector('.dropdown-value');
    let priorityName = selectedOption?.textContent?.trim() || profile;
    
    // Map profile value to display name if needed
    const priorityNames = {
        'economy': 'Economy',
        'standard': 'Standard',
        'express': 'Express',
        'critical': 'Critical'
    };
    if (!selectedOption && priorityNames[profile]) {
        priorityName = priorityNames[profile];
    }
    
    // Ensure dropdown value is displayed
    if (valueSpan && priorityName && priorityName !== 'standard') {
        valueSpan.textContent = priorityName;
        valueSpan.classList.remove('placeholder');
    }

    if (speedEl) {
        speedEl.textContent = weights.speed + '%';
        // Add animation
        speedEl.style.transform = 'scale(1.1)';
        setTimeout(() => { speedEl.style.transform = 'scale(1)'; }, 200);
    }
    if (costEl) {
        costEl.textContent = weights.cost + '%';
        costEl.style.transform = 'scale(1.1)';
        setTimeout(() => { costEl.style.transform = 'scale(1)'; }, 200);
    }
    if (riskEl) {
        riskEl.textContent = weights.risk + '%';
        riskEl.style.transform = 'scale(1.1)';
        setTimeout(() => { riskEl.style.transform = 'scale(1)'; }, 200);
    }
    if (descEl) {
        descEl.textContent = weights.description;
    }
    
    // Show preview box with animation
    if (previewBox) {
        previewBox.style.opacity = '1';
        previewBox.style.borderColor = 'rgba(0, 255, 136, 0.5)';
        previewBox.style.background = 'rgba(0, 255, 136, 0.1)';
    }
    
    // Show selected badge
    if (selectedBadge) {
        selectedBadge.textContent = priorityName;
        selectedBadge.style.display = 'inline-block';
    }
}

window.getPriorityWeights = getPriorityWeights;
 
function initializeDateInputs() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 30);
   
    const etdInput = document.getElementById('etd');
    const etaInput = document.getElementById('eta');
   
    etdInput.value = formatDate(today);
    etaInput.value = formatDate(tomorrow);
   
    calculateTransitTime();
}
 
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}
 
function setupEventListeners() {
    const etdInput = document.getElementById('etd');
    const etaInput = document.getElementById('eta');
    
    console.log('[setupEventListeners] Setting up ETD/ETA listeners');
    console.log('[setupEventListeners] ETD input:', etdInput, 'ETA input:', etaInput);
    
    if (etdInput) {
        etdInput.addEventListener('change', function() {
            console.log('[ETD changed] Value:', this.value);
            calculateTransitTime();
        });
        etdInput.addEventListener('input', function() {
            console.log('[ETD input] Value:', this.value);
            calculateTransitTime();
        });
    } else {
        console.warn('[setupEventListeners] ETD input not found!');
    }
    
    if (etaInput) {
        etaInput.addEventListener('change', function() {
            console.log('[ETA changed] Value:', this.value);
            calculateTransitTime();
        });
        etaInput.addEventListener('input', function() {
            console.log('[ETA input] Value:', this.value);
            calculateTransitTime();
        });
    } else {
        console.warn('[setupEventListeners] ETA input not found!');
    }
   
    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach(input => {
        input.addEventListener('input', () => clearError(input.id));
        input.addEventListener('change', () => clearError(input.id));
    });
    
    // Calculate transit time on page load if dates already exist
    setTimeout(() => {
        console.log('[setupEventListeners] Running initial calculation...');
        calculateTransitTime();
    }, 200);
    
    // Also calculate after a longer delay to ensure all scripts are loaded
    setTimeout(() => {
        console.log('[setupEventListeners] Running delayed calculation...');
        calculateTransitTime();
    }, 1000);
}
 
function setupRealtimeValidation() {
    const numberInputs = ['packages', 'cargo_value'];
    numberInputs.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener('input', function() {
            if (this.value && this.value < 0) {
                this.value = Math.abs(this.value);
            }
        });
    });
   
    const cargoValue = document.getElementById('cargo_value');
    cargoValue.addEventListener('blur', function() {
        if (this.value) {
            // Round to nearest integer since step is 1
            this.value = Math.round(parseFloat(this.value));
        }
    });
}
 
function calculateTransitTime() {
    console.log('[calculateTransitTime] Starting calculation...');
    const etdInput = document.getElementById('etd');
    const etaInput = document.getElementById('eta');
    
    if (!etdInput || !etaInput) {
        console.warn('[calculateTransitTime] ETD or ETA input not found');
        return;
    }
    
    const etd = etdInput.value;
    const eta = etaInput.value;
    
    console.log('[calculateTransitTime] ETD:', etd, 'ETA:', eta);
   
    if (etd && eta) {
        // Parse dates - handle both YYYY-MM-DD (from date input) and DD/MM/YYYY formats
        let startDate, endDate;
        
        if (etd.includes('/')) {
            // DD/MM/YYYY format
            const [day, month, year] = etd.split('/');
            startDate = new Date(year, month - 1, day);
        } else {
            // YYYY-MM-DD format
            startDate = new Date(etd);
        }
        
        if (eta.includes('/')) {
            // DD/MM/YYYY format
            const [day, month, year] = eta.split('/');
            endDate = new Date(year, month - 1, day);
        } else {
            // YYYY-MM-DD format
            endDate = new Date(eta);
        }
        
        console.log('[calculateTransitTime] Parsed dates - Start:', startDate, 'End:', endDate);
        
        // Check if dates are valid
        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
            console.error('[calculateTransitTime] Invalid date format');
            return;
        }
        
        if (endDate <= startDate) {
            console.warn('[calculateTransitTime] ETA must be after ETD');
            showError('eta', LANG[currentLang].error_date_invalid);
            // Clear display if dates are invalid
            const transitDisplay = document.getElementById('transit_time_display');
            const transitInput = document.getElementById('transit_time');
            if (transitDisplay) transitDisplay.value = '';
            if (transitInput) transitInput.value = '';
            return;
        }
        
        const diffTime = Math.abs(endDate - startDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        console.log('[calculateTransitTime] Calculated days:', diffDays);
       
        // Update hidden input for form submission
        const transitInput = document.getElementById('transit_time');
        if (transitInput) {
            transitInput.value = diffDays;
            console.log('[calculateTransitTime] Updated hidden input:', diffDays);
        } else {
            console.warn('[calculateTransitTime] transit_time input not found');
        }
       
        // Update display input to show the calculated days with neon styling
        const transitDisplay = document.getElementById('transit_time_display');
        if (transitDisplay) {
            // Display only the number (no "ngày" suffix - it's shown separately)
            transitDisplay.value = diffDays;
            console.log('[calculateTransitTime] Updated display:', diffDays);
            
            // Apply balanced, professional styling
            transitDisplay.style.fontSize = '24px';
            transitDisplay.style.fontWeight = '700';
            transitDisplay.style.color = '#00ff9d';
            transitDisplay.style.textShadow = '0 0 12px rgba(0, 255, 157, 0.6), 0 0 20px rgba(0, 255, 157, 0.4)';
            transitDisplay.style.background = 'transparent';
            transitDisplay.style.border = 'none';
            transitDisplay.style.padding = '0';
            transitDisplay.style.textAlign = 'center';
            transitDisplay.style.lineHeight = '1.2';
            
            // Add pulse animation for feedback
            transitDisplay.style.animation = 'pulseNeon 0.5s ease';
            setTimeout(() => {
                transitDisplay.style.animation = '';
            }, 500);
        } else {
            console.warn('[calculateTransitTime] transit_time_display input not found');
        }
       
        clearError('eta');
        clearError('transit_time');
        
        console.log(`✓ Transit time calculated: ${diffDays} days`);
    } else {
        console.log('[calculateTransitTime] Missing ETD or ETA');
        // Clear display if dates are missing
        const transitDisplay = document.getElementById('transit_time_display');
        const transitInput = document.getElementById('transit_time');
        if (transitDisplay) transitDisplay.value = '';
        if (transitInput) transitInput.value = '';
    }
}
 
function showError(fieldId, message) {
    const dropdown = document.getElementById(fieldId + '_dropdown');
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '_error');
   
    if (dropdown) {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        trigger.classList.add('error');
    } else if (field) {
        field.classList.add('error');
    }
   
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.classList.add('active');
    }
}
 
function clearError(fieldId) {
    const dropdown = document.getElementById(fieldId + '_dropdown');
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + '_error');
   
    if (dropdown) {
        const trigger = dropdown.querySelector('.dropdown-trigger');
        trigger.classList.remove('error');
    } else if (field) {
        field.classList.remove('error');
    }
   
    if (errorElement) {
        errorElement.textContent = '';
        errorElement.classList.remove('active');
    }
}
 
function clearAllErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.classList.remove('active');
    });
   
    document.querySelectorAll('.form-input').forEach(el => {
        el.classList.remove('error');
    });
   
    document.querySelectorAll('.dropdown-trigger').forEach(el => {
        el.classList.remove('error');
    });
}
 
function validateForm() {
    let isValid = true;
    clearAllErrors();
    
    // REQUIRED: ETD, ETA must exist and ETD < ETA
    const etd = document.getElementById('etd')?.value;
    const eta = document.getElementById('eta')?.value;
    
    if (!etd) {
        showError('etd', 'ETD là bắt buộc');
        isValid = false;
    }
    
    if (!eta) {
        showError('eta', 'ETA là bắt buộc');
        isValid = false;
    }
    
    if (etd && eta && new Date(eta) <= new Date(etd)) {
        showError('eta', 'ETA phải sau ETD');
        isValid = false;
    }
    
    // Transit time must be auto-calculated
    const transitTime = document.getElementById('transit_time')?.value;
    if (!transitTime || transitTime === '0') {
        showError('transit_time', 'Thời gian vận chuyển chưa được tính. Vui lòng chọn ETD và ETA.');
        isValid = false;
    }
    
    // REQUIRED: Route, Transport Mode - Check from hidden inputs
    const routeInput = document.getElementById('route_input');
    const transportModeInput = document.getElementById('transport_mode_input');
    
    if (!routeInput || !routeInput.value) {
        // Also check dropdown value as fallback
        const routeValue = getDropdownValue('route') || SmartInputState?.selectedRoute;
        if (!routeValue) {
            showError('route', 'Vui lòng chọn tuyến đường');
            isValid = false;
        } else {
            // Update hidden input if dropdown has value
            if (routeInput) routeInput.value = routeValue;
        }
    }
    
    if (!transportModeInput || !transportModeInput.value) {
        // Also check dropdown value as fallback
        const transportValue = getDropdownValue('transport_mode') || SmartInputState?.selectedTransportMode;
        if (!transportValue) {
            showError('transport_mode', 'Vui lòng chọn phương thức vận tải');
            isValid = false;
        } else {
            // Update hidden input if dropdown has value
            if (transportModeInput) transportModeInput.value = transportValue;
        }
    }
    
    return isValid;
}

// Original validateForm function (if exists)
function validateFormOriginal() {
    let isValid = true;
    clearAllErrors();
   
    const requiredDropdowns = [
        'transport_mode',
        'cargo_type',
        'route',
        'incoterm',
        'container',
        'packaging',
        'priority'
    ];
   
    requiredDropdowns.forEach(fieldId => {
        const hiddenInput = document.getElementById(fieldId + '_input');
        const value = hiddenInput ? hiddenInput.value : getDropdownValue(fieldId);
        if (!value) {
            showError(fieldId, LANG[currentLang].error_required);
            isValid = false;
        }
    });
   
    const requiredInputs = [
        { id: 'packages', label: LANG[currentLang].label_packages },
        { id: 'etd', label: LANG[currentLang].label_etd },
        { id: 'eta', label: LANG[currentLang].label_eta },
        { id: 'cargo_value', label: LANG[currentLang].label_cargo_value }
    ];
   
    requiredInputs.forEach(field => {
        const input = document.getElementById(field.id);
        if (!input.value || input.value === '') {
            showError(field.id, LANG[currentLang].error_required);
            isValid = false;
        }
    });
   
    const packages = document.getElementById('packages').value;
    if (packages && packages <= 0) {
        showError('packages', LANG[currentLang].error_positive);
        isValid = false;
    }
   
    const cargoValue = document.getElementById('cargo_value').value;
    if (cargoValue && cargoValue <= 0) {
        showError('cargo_value', LANG[currentLang].error_positive);
        isValid = false;
    }
    
    // Validate ETD < ETA
    const etdValue = document.getElementById('etd')?.value;
    const etaValue = document.getElementById('eta')?.value;
    if (etdValue && etaValue) {
        const etdDate = new Date(etdValue);
        const etaDate = new Date(etaValue);
        if (etaDate <= etdDate) {
            showError('eta', LANG[currentLang].error_date_invalid || 'ETA phải sau ETD');
            isValid = false;
        }
    }
    
    // Validate transit time is auto-calculated
    const transitTimeValue = document.getElementById('transit_time')?.value;
    if (!transitTimeValue || transitTimeValue === '0' || transitTimeValue === '') {
        const transitDisplay = document.getElementById('transit_time_display');
        if (transitDisplay) {
            showError('transit_time', 'Thời gian vận chuyển chưa được tính. Vui lòng chọn ETD và ETA hợp lệ.');
        }
        isValid = false;
    }

    // ==================== VALIDATE CLIMATE FIELDS ====================
    const climateFields = [
        { id: 'enso_index', min: -2.0, max: 2.0, label: 'ENSO Index' },
        { id: 'typhoon_frequency', min: 0, max: 1, label: 'Typhoon Frequency' },
        { id: 'sst_anomaly', min: -3, max: 3, label: 'SST Anomaly' },
        { id: 'climate_tail_event_probability', min: 0, max: 1, label: 'Climate Tail Probability' }
    ];

    climateFields.forEach(field => {
        const input = document.getElementById(field.id);
        if (input && input.value !== '') {
            const value = parseFloat(input.value);
            if (isNaN(value) || value < field.min || value > field.max) {
                showError(field.id, `${field.label} phải từ ${field.min} đến ${field.max}`);
                isValid = false;
            }
        }
    });
   
    return isValid;
}
 
function resetForm() {
    if (confirm(LANG[currentLang].confirm_reset)) {
        document.getElementById('risk_form').reset();
        clearAllErrors();
       
        Object.keys(dropdownState).forEach(dropdownId => {
            const dropdown = document.getElementById(dropdownId);
            const valueSpan = dropdown.querySelector('.dropdown-value');
            const options = dropdown.querySelectorAll('.dropdown-option');
           
            options.forEach(opt => opt.classList.remove('selected'));
            valueSpan.textContent = LANG[currentLang].placeholder_select;
            valueSpan.classList.add('placeholder');
           
            dropdownState[dropdownId].selectedValue = null;
            dropdownState[dropdownId].selectedText = null;
        });
       
        initializeDateInputs();
    }
}
    
    // Helper functions to extract origin/destination from route
    function extractOrigin(route) {
        if (!route) return 'LAX';
        const parts = route.split('_');
        if (parts.length >= 2) {
            const originPart = parts[0];
            if (originPart.includes('VN')) return 'VNSGN';
            if (originPart.includes('US')) return 'USLAX';
            if (originPart.includes('CN')) return 'CNSHA';
            return originPart.slice(-3);
        }
        return 'LAX';
    }
    
    function extractDestination(route) {
        if (!route) return 'JFK';
        const parts = route.split('_');
        if (parts.length >= 2) {
            const destPart = parts[1];
            if (destPart.includes('US')) return 'USJFK';
            if (destPart.includes('EU')) return 'EUDEP';
            if (destPart.includes('CN')) return 'CNSHA';
            return destPart.slice(-3);
        }
        return 'JFK';
    }
 
// Hàm runAnalysis() mới - gọi FastAPI endpoint /api/run_risk
async function runAnalysis() {
    console.log('✓ runAnalysis() called');
    
    const isValid = validateForm();
    console.log('  - Form validation result:', isValid);
    
    if (!isValid) {
        console.warn('✗ Form validation failed');
        const firstError = document.querySelector('.form-input.error, .dropdown-trigger.error');
        if (firstError) {
            console.log('  - Scrolling to first error');
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            console.warn('  - No error element found to scroll to');
        }
        return;
    }
    
    console.log('✓ Form validation passed, proceeding with API call');

    // ===== ENSURE HIDDEN INPUTS ARE POPULATED =====
    // Double-check hidden inputs are populated from dropdowns (in case selectOption didn't fire)
    try {
        const dropdownFields = ['transport_mode', 'cargo_type', 'route', 'incoterm', 'container', 'packaging', 'priority', 'seller_country', 'buyer_country', 'route_type', 'seller_size', 'buyer_size', 'carrier'];
        dropdownFields.forEach(field => {
            const hiddenInput = document.getElementById(field + '_input');
            if (hiddenInput && !hiddenInput.value) {
                const value = getDropdownValue(field);
                if (value) {
                    hiddenInput.value = value;
                }
            }
        });
        console.log('✓ Hidden inputs verified');
    } catch (err) {
        console.warn('⚠ Error verifying hidden inputs:', err);
    }
    // ===== KẾT THÚC VERIFY HIDDEN INPUTS =====

    const loader = document.getElementById('loadingOverlay');
    const loaderText = loader?.querySelector('.loader-text');
    
    // TÍNH NĂNG 8: Loading Sequence siêu chuyên nghiệp
    if (loader) {
        loader.classList.add('active');
    }

    // Gom dữ liệu theo Shipment model - READ FROM HIDDEN INPUTS
    // CRITICAL: Ensure all required fields have values
    const transportModeInput = document.getElementById('transport_mode_input');
    const routeInput = document.getElementById('route_input');
    const cargoTypeInput = document.getElementById('cargo_type_input');
    const incotermInput = document.getElementById('incoterm_input');
    const containerInput = document.getElementById('container_input');
    const packagingInput = document.getElementById('packaging_input');
    const priorityInput = document.getElementById('priority_input');
    
    // Validate required fields before sending
    if (!transportModeInput || !transportModeInput.value) {
        showError('transport_mode', 'Vui lòng chọn phương thức vận tải');
        return;
    }
    if (!routeInput || !routeInput.value) {
        showError('route', 'Vui lòng chọn tuyến đường');
        return;
    }
    
    const payload = {
        transport_mode: transportModeInput.value,
        cargo_type: cargoTypeInput?.value || 'general',
        route: routeInput.value,
        incoterm: incotermInput?.value || '',
        container: containerInput?.value || '',
        packaging: packagingInput?.value || '',
        priority: priorityInput?.value || 'standard',

        packages: Number(document.getElementById('packages')?.value || 0),
        etd: document.getElementById('etd')?.value || '',
        eta: document.getElementById('eta')?.value || '',
        transit_time: Number(document.getElementById('transit_time')?.value || 0),
        cargo_value: Number(document.getElementById('cargo_value')?.value || 0),

        use_fuzzy: document.getElementById('use_fuzzy')?.checked || false,
        use_forecast: document.getElementById('use_forecast')?.checked || false,
        use_mc: document.getElementById('use_mc')?.checked || false,
        use_var: document.getElementById('use_var')?.checked || false,

        // Advanced Risk Parameters (Section 06)
        distance: parseFloat(document.getElementById('distance')?.value) || 5000,
        route_type: document.getElementById('route_type_input')?.value || 'standard',
        carrier: document.getElementById('carrier_input')?.value || '',
        carrier_rating: parseFloat(document.getElementById('carrier_rating')?.value) || 3.0,
        weather_risk: parseFloat(document.getElementById('weather_risk')?.value) || 5.0,
        port_risk: parseFloat(document.getElementById('port_risk')?.value) || 4.0,
        container_match: parseFloat(document.getElementById('container_match')?.value) || 8.0,
        shipment_value: parseFloat(document.getElementById('shipment_value')?.value) || 
                       (parseFloat(document.getElementById('cargo_value')?.value) * 1.1) || 100000,

        // Climate & ESG Data (Section 07 - Optional)
        ENSO_index: parseFloat(document.getElementById('enso_index')?.value) || 0.0,
        typhoon_frequency: parseFloat(document.getElementById('typhoon_frequency')?.value) || 0.5,
        sst_anomaly: parseFloat(document.getElementById('sst_anomaly')?.value) || 0.0,
        port_climate_stress: parseFloat(document.getElementById('port_climate_stress')?.value) || 5.0,
        climate_volatility_index: parseFloat(document.getElementById('climate_volatility_index')?.value) || 5.0,
        ESG_score: parseFloat(document.getElementById('esg_score')?.value) || 50.0,
        climate_resilience: parseFloat(document.getElementById('climate_resilience')?.value) || 5.0,
        green_packaging: parseFloat(document.getElementById('green_packaging')?.value) || 5.0,
        climate_tail_event_probability: parseFloat(document.getElementById('climate_tail_event_probability')?.value) || 0.05,

        // seller/buyer gửi theo dạng object đúng schema Shipment (Enhanced)
        seller: {
            name: document.getElementById('seller_name')?.value || '',
            address: document.getElementById('seller_address')?.value || '',
            country: document.getElementById('seller_country_input')?.value || '',
            email: document.getElementById('seller_email')?.value || '',
            phone: document.getElementById('seller_phone')?.value || '',
            pic: document.getElementById('seller_pic')?.value || '',
            size: document.getElementById('seller_size_input')?.value || 'Medium',
            esg: parseFloat(document.getElementById('seller_esg')?.value) || 50
        },
        buyer: {
            name: document.getElementById('buyer_name')?.value || '',
            address: document.getElementById('buyer_address')?.value || '',
            country: document.getElementById('buyer_country_input')?.value || '',
            email: document.getElementById('buyer_email')?.value || '',
            phone: document.getElementById('buyer_phone')?.value || '',
            pic: document.getElementById('buyer_pic')?.value || '',
            size: document.getElementById('buyer_size_input')?.value || 'Medium',
            esg: parseFloat(document.getElementById('buyer_esg')?.value) || 50
        },

        // priority profile cho engine
        priority_profile: document.getElementById('priority_input').value,
        priority_weights: (function() {
            const profile = document.getElementById('priority_input').value || 'standard';
            const weights = getPriorityWeights(profile) || { speed: 40, cost: 40, risk: 20 };
            return {
                speed: weights.speed || 40,
                cost: weights.cost || 40,
                risk: weights.risk || 20
            };
        })()
    };

    try {
        // TÍNH NĂNG 8: Loading Sequence siêu chuyên nghiệp
        const loadingSteps = [
            { text: 'Khởi tạo Fuzzy AHP...', delay: 800 },
            { text: 'Chạy Monte Carlo 10.000 lần...', delay: 1200 },
            { text: 'Tính VaR 99.5% & CVaR...', delay: 1000 },
            { text: 'Đang tạo báo cáo PDF...', delay: 600 },
            { text: 'Hoàn thành! Đang chuyển kết quả...', delay: 400 }
        ];
        
        for (const step of loadingSteps) {
            if (loaderText) {
                loaderText.textContent = step.text;
            }
            await new Promise(resolve => setTimeout(resolve, step.delay));
        }
        
        console.log('✓ Sending request to /api/run_risk');
        console.log('PAYLOAD:', JSON.stringify(payload, null, 2));
        
        // Validate payload before sending
        const missingFields = [];
        if (!payload.transport_mode) missingFields.push('Phương thức vận tải');
        if (!payload.route) missingFields.push('Tuyến đường');
        if (!payload.etd) missingFields.push('ETD');
        if (!payload.eta) missingFields.push('ETA');
        if (!payload.cargo_value || payload.cargo_value === 0) missingFields.push('Giá trị hàng hóa');
        
        if (missingFields.length > 0) {
            console.error('✗ Missing required fields:', missingFields);
            alert(`Vui lòng điền đầy đủ thông tin bắt buộc:\n- ${missingFields.join('\n- ')}`);
            if (loader) loader.classList.remove('active');
            return;
        }
        
        // Verify payload structure
        console.log('✓ Payload validation passed');
        console.log('  - transport_mode:', payload.transport_mode);
        console.log('  - route:', payload.route);
        console.log('  - etd:', payload.etd);
        console.log('  - eta:', payload.eta);
        console.log('  - cargo_value:', payload.cargo_value);
        console.log('  - seller:', payload.seller ? 'present' : 'missing');
        console.log('  - buyer:', payload.buyer ? 'present' : 'missing');
        
        const res = await fetch('/api/run_risk', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log('✓ API response received');
        console.log('  - Status:', res.status);
        console.log('  - OK:', res.ok);
        console.log('  - Headers:', res.headers);

        if (!res.ok) {
            let errorMessage = `HTTP ${res.status}`;
            try {
                const errorData = await res.json();
                errorMessage = errorData.detail || errorData.message || errorMessage;
                console.error('✗ API error details:', errorData);
            } catch (e) {
                const txt = await res.text();
                console.error('✗ API error text:', txt);
                errorMessage = txt || errorMessage;
            }
            alert(`Lỗi từ server: ${errorMessage}`);
            if (loader) loader.classList.remove('active');
            return;
        }

        let data;
        try {
            data = await res.json();
            console.log('✓ API response data:', data);
        } catch (e) {
            console.error('✗ Failed to parse JSON response:', e);
            alert('Lỗi: Không thể đọc phản hồi từ server');
            if (loader) loader.classList.remove('active');
            return;
        }
        
        // Save full result including shipment data
        // Use data.result if available, otherwise use data itself
        const resultData = data.result || data;
        if (resultData) {
            // Add shipment data from form to result
            const fullResult = {
                ...resultData,
                shipment: {
                    route: document.getElementById('route_input')?.value || '',
                    origin: extractOrigin(document.getElementById('route_input')?.value || ''),
                    destination: extractDestination(document.getElementById('route_input')?.value || ''),
                    eta: document.getElementById('eta')?.value || '',
                    etd: document.getElementById('etd')?.value || '',
                    transport_mode: document.getElementById('transport_mode_input')?.value || '',
                    cargo_type: document.getElementById('cargo_type_input')?.value || '',
                    cargo_value: document.getElementById('cargo_value')?.value || 0,
                    shipment_id: `FX-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`
                }
            };
            localStorage.setItem('last_result', JSON.stringify(fullResult));
            console.log('✓ Result saved to localStorage with shipment data');
            console.log('  - Result keys:', Object.keys(fullResult));
        } else {
            console.warn('⚠️ No result data in API response');
        }

        const redirectUrl = data.redirect_url || '/results';
        console.log('✓ Redirecting to:', redirectUrl);
        
        // Đảm bảo redirect được thực hiện
        setTimeout(() => {
            console.log('  - Executing redirect now...');
            try {
                window.location.href = redirectUrl;
            } catch (err) {
                console.error('✗ Redirect error:', err);
                // Fallback: thử window.location.replace
                window.location.replace(redirectUrl);
            }
        }, 100);
        
    } catch (err) {
        console.error('✗ Fetch error:', err);
        console.error('  - Error details:', err.message, err.stack);
        alert('Không thể kết nối đến API phân tích rủi ro: ' + err.message);
        if (loader) loader.classList.remove('active');
    }
}

// ==================== SLIDER REAL-TIME UPDATE ====================
function initializeSliderDisplays() {
    const sliderConfigs = [
        { id: 'carrier_rating', display: 'carrier_rating_display', format: (v) => `${parseFloat(v).toFixed(1)} ⭐` },
        { id: 'weather_risk', display: 'weather_risk_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` },
        { id: 'port_risk', display: 'port_risk_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` },
        { id: 'priority_level', display: 'priority_level_display', format: (v) => `${parseInt(v)}/10` },
        { id: 'container_match', display: 'container_match_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` },
        { id: 'port_climate_stress', display: 'port_climate_stress_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` },
        { id: 'climate_volatility_index', display: 'climate_volatility_index_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` },
        { id: 'climate_resilience', display: 'climate_resilience_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` },
        { id: 'green_packaging', display: 'green_packaging_display', format: (v) => `${parseFloat(v).toFixed(1)}/10` }
    ];

    sliderConfigs.forEach(config => {
        const slider = document.getElementById(config.id);
        const display = document.getElementById(config.display);
        
        // Skip if slider doesn't exist or is not a range slider
        if (!slider || slider.type !== 'range') {
            // Silently skip - element may have been removed during refactor
            return;
        }
        
        // Skip if display element doesn't exist
        if (!display) {
            // Silently skip - display element may not be needed for this slider
            return;
        }
        
        // Both elements exist, initialize them
        // Set initial value
        display.textContent = config.format(slider.value);
        
        // Update on input AND change
        slider.addEventListener('input', function() {
            display.textContent = config.format(this.value);
        });
        slider.addEventListener('change', function() {
            display.textContent = config.format(this.value);
        });
    });
}


// ==================== NEW DROPDOWNS INITIALIZATION ====================
function initializeNewDropdowns() {
    // route_type_dropdown is disabled - no longer used
    const newDropdowns = ['seller_size_dropdown', 'buyer_size_dropdown', 'priority_dropdown'];
    
    newDropdowns.forEach(dropdownId => {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) {
            console.warn(`⚠️ Dropdown not found: ${dropdownId}`);
            return;
        }

        const trigger = dropdown.querySelector('.dropdown-trigger');
        const options = dropdown.querySelectorAll('.dropdown-option');
        const menu = dropdown.querySelector('.dropdown-menu');
        const valueSpan = dropdown.querySelector('.dropdown-value');
        const hiddenInput = document.getElementById(dropdownId.replace('_dropdown', '_input'));

        if (!trigger) {
            console.warn(`⚠️ Dropdown trigger not found: ${dropdownId}`);
            return;
        }
        
        if (!menu) {
            console.warn(`⚠️ Dropdown menu not found: ${dropdownId}`);
            return;
        }
        
        if (options.length === 0) {
            console.warn(`⚠️ No options found in dropdown: ${dropdownId}`);
            return;
        }
        
        console.log(`✓ Initializing ${dropdownId} with ${options.length} options`);

        // Initialize state
        if (!dropdownState[dropdownId]) {
            dropdownState[dropdownId] = {
                isOpen: false,
                selectedValue: null,
                selectedText: null,
                focusedIndex: -1
            };
        }

        // Check if there's a pre-selected option
        const preSelected = dropdown.querySelector('.dropdown-option.selected');
        if (preSelected) {
            const value = preSelected.getAttribute('data-value');
            const text = preSelected.textContent.trim();
            if (valueSpan) {
                valueSpan.textContent = text;
                valueSpan.classList.remove('placeholder');
            }
            dropdownState[dropdownId].selectedValue = value;
            dropdownState[dropdownId].selectedText = text;
            if (hiddenInput) hiddenInput.value = value;
        }

        // Remove existing listeners to avoid duplicates
        const newTrigger = trigger.cloneNode(true);
        trigger.parentNode.replaceChild(newTrigger, trigger);
        const newTriggerElement = dropdown.querySelector('.dropdown-trigger');

        // Bind events
        newTriggerElement.addEventListener('click', (e) => {
            e.stopPropagation();
            e.preventDefault();
            console.log(`🖱️ Clicked dropdown: ${dropdownId}`);
            toggleDropdown(dropdownId);
        });

        // Also support keyboard
        newTriggerElement.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleDropdown(dropdownId);
            }
        });

        // Bind option clicks - Get fresh options after cloning
        const freshOptions = dropdown.querySelectorAll('.dropdown-option');
        freshOptions.forEach((option, index) => {
            // Remove existing listeners by cloning
            const newOption = option.cloneNode(true);
            option.parentNode.replaceChild(newOption, option);
            const newOptionElement = dropdown.querySelectorAll('.dropdown-option')[index];

            newOptionElement.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();
                const value = newOptionElement.getAttribute('data-value');
                const text = newOptionElement.textContent.trim();
                
                console.log(`✅ Selected option: ${value} - ${text}`);
                
                // Update UI - Use fresh query
                const allOptions = dropdown.querySelectorAll('.dropdown-option');
                allOptions.forEach(opt => opt.classList.remove('selected'));
                newOptionElement.classList.add('selected');
                if (valueSpan) {
                    valueSpan.textContent = text;
                    valueSpan.classList.remove('placeholder');
                }
                
                // Update state
                dropdownState[dropdownId].selectedValue = value;
                dropdownState[dropdownId].selectedText = text;
                
                // Update hidden input
                if (hiddenInput) {
                    hiddenInput.value = value;
                    console.log(`✓ Updated hidden input: ${hiddenInput.id} = ${value}`);
                }
                
                closeDropdown(dropdownId);
                    
                    // Update summary section when dropdown changes
                    if (typeof updateInputSummary === 'function') {
                        setTimeout(() => {
                            updateInputSummary();
                        }, 100);
                    }
                if (dropdownId === 'priority_dropdown') {
                    updatePriorityWeightsDisplay();
                }
            });

            // Hover effect
            newOptionElement.addEventListener('mouseenter', () => {
                newOptionElement.style.background = 'rgba(0, 255, 136, 0.1)';
            });
            newOptionElement.addEventListener('mouseleave', () => {
                if (!newOptionElement.classList.contains('selected')) {
                    newOptionElement.style.background = '';
                }
            });
        });

        console.log(`✅ Initialized dropdown: ${dropdownId} with ${options.length} options`);
    });
    
    // Initialize priority preview display
    setTimeout(() => {
        updatePriorityWeightsDisplay();
        // Also check if priority is already selected on page load
        const priorityValue = getDropdownValue('priority');
        if (priorityValue) {
            updatePriorityWeightsDisplay();
        }
    }, 300);
}

// ==================== COLLAPSIBLE SECTION ====================
function setupCollapsibleSection() {
    const section = document.getElementById('climate-esg');
    if (!section) return;

    const header = section.querySelector('.section-header');
    const content = section.querySelector('.section-content');
    
    if (!header || !content) return;

    header.addEventListener('click', () => {
        section.classList.toggle('expanded');
        content.classList.toggle('collapsed');
    });
}

function toggleSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) {
        console.warn('⚠️ Section not found:', sectionId);
        return;
    }
    
    const content = section.querySelector('.section-content');
    if (!content) {
        console.warn('⚠️ Section content not found for:', sectionId);
        return;
    }
    
    // Toggle display
    const isHidden = content.style.display === 'none' || 
                   window.getComputedStyle(content).display === 'none';
    
    if (isHidden) {
        content.style.display = '';
        content.classList.remove('collapsed');
        section.classList.add('expanded');
    } else {
        content.style.display = 'none';
        content.classList.add('collapsed');
        section.classList.remove('expanded');
    }
    
    // Update icon rotation
    const icon = section.querySelector('.collapse-icon');
    if (icon) {
        if (isHidden) {
            icon.style.transform = 'rotate(180deg)';
        } else {
            icon.style.transform = 'rotate(0deg)';
        }
    }
    
    console.log(`✓ Section ${sectionId} toggled:`, isHidden ? 'expanded' : 'collapsed');
}

// Enhanced section validation when switching
function validateSectionBeforeSwitch(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return true;
    
    const requiredFields = section.querySelectorAll('input[required], select[required], textarea[required]');
    let allValid = true;
    const missingFields = [];
    
    requiredFields.forEach(field => {
        const value = field.value ? field.value.trim() : '';
        if (!value) {
            allValid = false;
            const label = field.closest('.form-group')?.querySelector('label')?.textContent || 
                         field.getAttribute('placeholder') || 
                         field.getAttribute('name') || 
                         'Trường này';
            missingFields.push(label);
            
            // Highlight field
            field.classList.add('error');
            field.style.animation = 'fieldShake 0.4s ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 400);
        }
    });
    
    if (!allValid && missingFields.length > 0) {
        // Show notification
        const message = `Vui lòng điền đầy đủ: ${missingFields.slice(0, 3).join(', ')}${missingFields.length > 3 ? '...' : ''}`;
        showNotification(message, 'warning');
        
        // Scroll to first error
        const firstError = section.querySelector('.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            firstError.focus();
        }
    }
    
    return allValid;
}

// Make it global
window.toggleSection = toggleSection;
window.validateSectionBeforeSwitch = validateSectionBeforeSwitch;

// ==================== AUTO CALCULATION ====================
function setupAutoCalculation() {
    const cargoValueInput = document.getElementById('cargo_value');
    const shipmentValueInput = document.getElementById('shipment_value');
    
    if (cargoValueInput && shipmentValueInput) {
        cargoValueInput.addEventListener('change', function() {
            if (!shipmentValueInput.value) {
                // Auto-fill as 110% of cargo value if empty
                shipmentValueInput.value = Math.round(this.value * 1.1);
            }
        });
    }
}

// ==================== VALIDATION ====================
function validateAdvancedFields() {
    let isValid = true;

    // Distance validation
    const distance = document.getElementById('distance');
    if (distance) {
        const val = parseFloat(distance.value);
        if (val < 100 || val > 50000) {
            showError('distance', 'Khoảng cách phải từ 100-50,000 km');
            isValid = false;
        } else {
            clearError('distance');
        }
    }

    // Route type validation
    const routeType = document.getElementById('route_type_input');
    if (!routeType?.value) {
        showError('route_type', 'Vui lòng chọn loại tuyến đường');
        isValid = false;
    } else {
        clearError('route_type');
    }

    return isValid;
}

// Integrate with existing validateForm
const originalValidateForm = window.validateForm;
window.validateForm = function() {
    const originalValid = originalValidateForm ? originalValidateForm() : true;
    const advancedValid = validateAdvancedFields();
    return originalValid && advancedValid;
};

// ==================== ENHANCED FORM DATA COLLECTION ====================
// This will be called from runAnalysis to collect all form data
function collectEnhancedFormData() {
    const baseData = {
        // Existing fields will be collected by existing code
    };

    // Add new advanced parameters
    const advancedData = {
        distance: parseFloat(document.getElementById('distance')?.value) || 5000,
        route_type: document.getElementById('route_type_input')?.value || 'standard',
        carrier: document.getElementById('carrier_input')?.value || '',
        carrier_rating: parseFloat(document.getElementById('carrier_rating')?.value) || 3.0,
        weather_risk: parseFloat(document.getElementById('weather_risk')?.value) || 5.0,
        port_risk: parseFloat(document.getElementById('port_risk')?.value) || 4.0,
        priority: parseInt(document.getElementById('priority_level')?.value) || 5,
        container_match: parseFloat(document.getElementById('container_match')?.value) || 8.0,
        shipment_value: parseFloat(document.getElementById('shipment_value')?.value) || 
                       (parseFloat(document.getElementById('cargo_value')?.value) * 1.1) || 100000
    };

    // Add climate data (optional)
    const climateData = {
        ENSO_index: parseFloat(document.getElementById('enso_index')?.value) || 0.0,
        typhoon_frequency: parseFloat(document.getElementById('typhoon_frequency')?.value) || 0.5,
        sst_anomaly: parseFloat(document.getElementById('sst_anomaly')?.value) || 0.0,
        port_climate_stress: parseFloat(document.getElementById('port_climate_stress')?.value) || 5.0,
        climate_volatility_index: parseFloat(document.getElementById('climate_volatility_index')?.value) || 5.0,
        ESG_score: parseFloat(document.getElementById('esg_score')?.value) || 50.0,
        climate_resilience_score: parseFloat(document.getElementById('climate_resilience')?.value) || 5.0,
        green_packaging_score: parseFloat(document.getElementById('green_packaging')?.value) || 5.0
    };

    // Enhance seller/buyer data
    const sellerData = {
        name: document.getElementById('seller_name')?.value || '',
        country: document.getElementById('seller_country_input')?.value || '',
        address: document.getElementById('seller_address')?.value || '',
        email: document.getElementById('seller_email')?.value || '',
        phone: document.getElementById('seller_phone')?.value || '',
        pic: document.getElementById('seller_pic')?.value || '',
        size: document.getElementById('seller_size_input')?.value || 'Medium',
        esg: parseFloat(document.getElementById('seller_esg')?.value) || 50
    };

    const buyerData = {
        name: document.getElementById('buyer_name')?.value || '',
        country: document.getElementById('buyer_country_input')?.value || '',
        address: document.getElementById('buyer_address')?.value || '',
        email: document.getElementById('buyer_email')?.value || '',
        phone: document.getElementById('buyer_phone')?.value || '',
        pic: document.getElementById('buyer_pic')?.value || '',
        size: document.getElementById('buyer_size_input')?.value || 'Medium',
        esg: parseFloat(document.getElementById('buyer_esg')?.value) || 50
    };

    return {
        ...baseData,
        ...advancedData,
        ...climateData,
        seller: sellerData,
        buyer: buyerData
    };
}

// ==================== TÍNH NĂNG 1: PROGRESS SIDEBAR + HEADER PERCENTAGE ====================
function initializeProgressTracking() {
    // DEPRECATED: This function is now replaced by initializeSmartProgressTracking()
    // in smart_progress_tracker.js which provides:
    // - 100% completion check (not 80%)
    // - Starts at 0%
    // - Navigation warnings
    // - Better UI
    
    // If smart progress tracker is loaded, use it instead
    if (typeof initializeSmartProgressTracking === 'function') {
        console.log('✓ Using Smart Progress Tracker v2.0');
        return; // Let the new tracker handle everything
    }
    
    // Fallback to old logic if new tracker not loaded
    function calculateSectionProgress(sectionId) {
        const section = document.getElementById(sectionId);
        if (!section) return 0;
        
        const allFields = section.querySelectorAll('input:not([type="hidden"]), select, .custom-dropdown, textarea');
        const filledFields = Array.from(allFields).filter(field => {
            if (field.tagName === 'INPUT' && field.type !== 'checkbox') {
                return field.value && field.value.trim() !== '';
            }
            if (field.classList.contains('custom-dropdown')) {
                const hiddenInput = document.getElementById(field.id.replace('_dropdown', '_input'));
                return hiddenInput && hiddenInput.value;
            }
            if (field.tagName === 'SELECT') {
                return field.value;
            }
            return false;
        });
        
        return allFields.length > 0 ? (filledFields.length / allFields.length) * 100 : 0;
    }
    
    // Track completed sections to show notifications
    const completedSectionsTracker = new Set();
    let allSectionsCompleted = false;
    
    window.updateProgress = function() {
            // 5 main sections
            const mainSections = [
                { id: 'shipping-info', name: 'Thông Tin Vận Chuyển' },
                { id: 'cargo-details', name: 'Chi Tiết Hàng Hóa' },
                { id: 'seller-info', name: 'Thông Tin Người Bán' },
                { id: 'buyer-info', name: 'Thông Tin Người Mua' },
                { id: 'algorithm-modules', name: 'Mô-đun Thuật Toán' }
            ];
            
            let completedSections = 0;
            let totalProgress = 0;
            
            mainSections.forEach((section, index) => {
                const progress = calculateSectionProgress(section.id);
            totalProgress += progress;
                
                // Check if section is completed (>= 80%)
                const isCompleted = progress >= 80;
                const wasCompleted = completedSectionsTracker.has(section.id);
                
                if (isCompleted) {
                    completedSections++;
                    // Show notification if just completed
                    if (!wasCompleted) {
                        completedSectionsTracker.add(section.id);
                        showSectionCompletionNotification(section.name);
                    }
                } else {
                    // Remove from tracker if no longer completed
                    if (wasCompleted) {
                        completedSectionsTracker.delete(section.id);
                    }
                }
                
                // Update progress section fill (header)
                const sectionElement = document.querySelector(`.progress-section[data-section="${section.id}"]`);
                const sectionFill = sectionElement?.querySelector('.progress-section-fill');
                const sectionIndicator = sectionElement?.querySelector('.progress-section-indicator');
                
                // Update sticky progress bar
                const stickySectionElement = document.querySelector('#sticky-progress-bar .progress-section[data-section="' + section.id + '"]');
                const stickySectionFill = stickySectionElement?.querySelector('.progress-section-fill');
                const stickySectionIndicator = stickySectionElement?.querySelector('.progress-section-indicator');
                
                // Update header progress bar
                if (sectionFill) {
                    sectionFill.style.width = progress + '%';
                    
                    // Add completion animation
                    if (isCompleted && !sectionElement.classList.contains('completed')) {
                        sectionElement.classList.add('completed');
                        sectionFill.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
                        sectionFill.style.animation = 'pulseComplete 0.6s ease';
                        
                        // Add checkmark
                        if (sectionIndicator) {
                            sectionIndicator.innerHTML = '✓';
                            sectionIndicator.style.color = '#10B981';
                            sectionIndicator.style.fontSize = '14px';
                            sectionIndicator.style.fontWeight = '700';
                        }
                    } else if (!isCompleted) {
                        sectionElement.classList.remove('completed');
                        sectionFill.style.boxShadow = '';
                        sectionFill.style.animation = '';
                        
                        if (sectionIndicator) {
                            sectionIndicator.innerHTML = String(index + 1).padStart(2, '0');
                            sectionIndicator.style.color = progress > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)';
                            sectionIndicator.style.fontSize = '10px';
                            sectionIndicator.style.fontWeight = '500';
                        }
                    }
                }
                
                // Update sticky progress bar
                if (stickySectionFill) {
                    stickySectionFill.style.width = progress + '%';
                    
                    if (isCompleted && !stickySectionElement.classList.contains('completed')) {
                        stickySectionElement.classList.add('completed');
                        stickySectionFill.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
                        stickySectionFill.style.animation = 'pulseComplete 0.6s ease';
                        
                        if (stickySectionIndicator) {
                            stickySectionIndicator.innerHTML = '✓';
                            stickySectionIndicator.style.color = '#10B981';
                            stickySectionIndicator.style.fontSize = '14px';
                            stickySectionIndicator.style.fontWeight = '700';
                        }
                    } else if (!isCompleted) {
                        stickySectionElement.classList.remove('completed');
                        stickySectionFill.style.boxShadow = '';
                        stickySectionFill.style.animation = '';
                        
                        if (stickySectionIndicator) {
                            stickySectionIndicator.innerHTML = String(index + 1).padStart(2, '0');
                            stickySectionIndicator.style.color = progress > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.5)';
                            stickySectionIndicator.style.fontSize = '11px';
                            stickySectionIndicator.style.fontWeight = '600';
                        }
                    }
                }
            
            // Update section number color if >70%
                const sectionNumber = document.querySelector(`#${section.id} .section-number, #${section.id} .section-number-badge`);
                if (sectionNumber) {
                    if (progress >= 80) {
                        sectionNumber.style.background = '#10B981';
                sectionNumber.style.color = '#000';
                sectionNumber.style.fontWeight = '900';
                        sectionNumber.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.6)';
                    } else if (progress >= 50) {
                        sectionNumber.style.background = 'rgba(16, 185, 129, 0.5)';
                        sectionNumber.style.color = '#fff';
                        sectionNumber.style.fontWeight = '700';
                        sectionNumber.style.boxShadow = '';
                    } else {
                sectionNumber.style.background = '';
                sectionNumber.style.color = '';
                sectionNumber.style.fontWeight = '';
                        sectionNumber.style.boxShadow = '';
                    }
            }
        });
        
            const overallProgress = totalProgress / mainSections.length;
            
            // Update header progress
            const progressText = document.getElementById('header_progress_text');
            const sectionsText = document.getElementById('progress-sections-text');
            
            if (progressText) {
                progressText.textContent = Math.round(overallProgress) + '%';
            }
            
            if (sectionsText) {
                sectionsText.textContent = `${completedSections}/5 phần đã hoàn thành`;
                if (completedSections === 5) {
                    sectionsText.style.color = '#10B981';
                    sectionsText.style.fontWeight = '700';
                } else {
                    sectionsText.style.color = 'rgba(255,255,255,0.6)';
                    sectionsText.style.fontWeight = '500';
                }
            }
            
            // Update sticky progress bar
            const stickyProgressText = document.getElementById('sticky-progress-text');
            const stickySectionsText = document.getElementById('sticky-progress-sections-text');
            
            if (stickyProgressText) {
                stickyProgressText.textContent = Math.round(overallProgress) + '%';
            }
            
            if (stickySectionsText) {
                stickySectionsText.textContent = `${completedSections}/5 phần đã hoàn thành`;
                if (completedSections === 5) {
                    stickySectionsText.style.color = '#10B981';
                    stickySectionsText.style.fontWeight = '700';
                } else {
                    stickySectionsText.style.color = 'rgba(255,255,255,0.7)';
                    stickySectionsText.style.fontWeight = '500';
                }
            }
            
            // Show "Ready to Analyze" notification when all sections completed
            if (completedSections === 5 && !allSectionsCompleted) {
                allSectionsCompleted = true;
                showReadyToAnalyzeNotification();
            } else if (completedSections < 5 && allSectionsCompleted) {
                allSectionsCompleted = false;
            }
    };
    
    // Show section completion notification
    function showSectionCompletionNotification(sectionName) {
        const container = document.getElementById('progress-notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = 'progress-notification completed';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">✓</div>
                <div class="notification-text">
                    <div class="notification-title">Đã hoàn thành!</div>
                    <div class="notification-message">Phần "${sectionName}" đã được nhập đầy đủ</div>
                </div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'notificationSlideDown 0.3s reverse forwards';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
    
    // Show "Ready to Analyze" notification
    function showReadyToAnalyzeNotification() {
        const container = document.getElementById('progress-notification-container');
        if (!container) return;
        
        const notification = document.createElement('div');
        notification.className = 'progress-notification ready';
        notification.innerHTML = `
            <div class="notification-content">
                <div class="notification-icon">🚀</div>
                <div class="notification-text">
                    <div class="notification-title">Sẵn Sàng Phân Tích!</div>
                    <div class="notification-message">Tất cả thông tin đã được nhập đầy đủ. Bạn có thể chạy phân tích ngay bây giờ.</div>
                </div>
            </div>
        `;
        
        container.appendChild(notification);
        
        // Remove after 5 seconds
        setTimeout(() => {
            notification.style.animation = 'notificationSlideDown 0.3s reverse forwards';
            setTimeout(() => notification.remove(), 5000);
        }, 5000);
    }
    
    // Show/hide sticky progress bar on scroll
    let lastScrollTop = 0;
    let stickyBarVisible = false;
    
    function handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        const stickyBar = document.getElementById('sticky-progress-bar');
        
        if (!stickyBar) return;
        
        // Show sticky bar when scrolled down past header (about 200px)
        if (scrollTop > 200 && !stickyBarVisible) {
            stickyBar.style.display = 'block';
            stickyBarVisible = true;
        } else if (scrollTop <= 200 && stickyBarVisible) {
            stickyBar.style.display = 'none';
            stickyBarVisible = false;
        }
        
        lastScrollTop = scrollTop;
    }
    
    // Close button handler
    function setupStickyProgressBar() {
        const closeBtn = document.getElementById('close-progress-bar');
        const stickyBar = document.getElementById('sticky-progress-bar');
        
        if (closeBtn && stickyBar) {
            closeBtn.addEventListener('click', () => {
                stickyBar.classList.add('hidden');
                setTimeout(() => {
                    stickyBar.style.display = 'none';
                }, 300);
            });
        }
        
        // Show on scroll
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Check initial state
    }
    
    let progressUpdateScheduled = false;
    window.scheduleProgressUpdate = function() {
        if (progressUpdateScheduled) return;
        progressUpdateScheduled = true;
        
        const runner = () => {
            progressUpdateScheduled = false;
            if (typeof window.updateProgress === 'function') {
                window.updateProgress();
            }
        };
        
        if (window.requestAnimationFrame) {
            window.requestAnimationFrame(runner);
        } else {
            setTimeout(runner, 16);
        }
    };

    // Update on any change
    updateProgress();
    
    // Setup sticky progress bar
    setupStickyProgressBar();
}

// ==================== TÍNH NĂNG 2: SMART DEFAULTS & AUTO-FILL ====================
function initializeSmartDefaults() {
    function autoSelect(dropdownId, value) {
        const dropdown = document.getElementById(dropdownId + '_dropdown');
        if (!dropdown) return;
        
        const option = dropdown.querySelector(`[data-value="${value}"]`);
        if (option) {
            const index = Array.from(dropdown.querySelectorAll('.dropdown-option')).indexOf(option);
            selectOption(dropdownId + '_dropdown', value, index);
        }
    }
    
    function setSlider(id, value) {
        const slider = document.getElementById(id);
        if (slider) {
            slider.value = value;
            slider.dispatchEvent(new Event('input', { bubbles: true }));
            slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    
    function setValue(id, value) {
        const input = document.getElementById(id);
        if (input) {
            input.value = value;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
        }
    }
    
    window.applySmartDefaults = function() {
        const mode = getDropdownValue('transport_mode');
        const cargo = getDropdownValue('cargo_type');
        const route = getDropdownValue('route');
        
        if (mode === 'ocean_fcl') {
            autoSelect('container', '40ft_highcube');
            autoSelect('incoterm', 'fob');
            autoSelect('packaging', 'excellent');
            autoSelect('priority', 'standard');
        }
        if (mode === 'air_freight') {
            autoSelect('container', 'palletized');
            autoSelect('incoterm', 'cip');
            autoSelect('priority', 'express');
        }
        if (cargo === 'electronics' || cargo === 'fragile' || cargo === 'pharma') {
            setSlider('container_match', 9.5);
            autoSelect('packaging', 'excellent');
        }
        if (route === 'vn_us') {
            setValue('distance', 15200);
            setSlider('weather_risk', 6.8);
        }
        if (route === 'domestic') {
            setValue('distance', 1200);
            setSlider('weather_risk', 3.5);
        }
    };
}

// ==================== TÍNH NĂNG 3: CONDITIONAL VISIBILITY ====================
function initializeConditionalVisibility() {
    window.toggleContainerField = function() {
        const mode = getDropdownValue('transport_mode');
        const containerGroup = document.querySelector('#container_dropdown')?.closest('.form-group');
        if (!containerGroup) return;
        
        if (['air_freight', 'courier_express', 'last_mile'].includes(mode)) {
            containerGroup.style.display = 'none';
        } else {
            containerGroup.style.display = 'block';
        }
    };
}

// ==================== TÍNH NĂNG 4: AUTO CALCULATION NÂNG CAO ====================
function initializeAdvancedAutoCalc() {
    window.smartAutoCalc = function() {
        const cargo = parseFloat(document.getElementById('cargo_value')?.value) || 0;
        const shipment = document.getElementById('shipment_value');
        if (cargo > 0 && shipment && !shipment.value) {
            shipment.value = Math.round(cargo * 1.15);
            shipment.dispatchEvent(new Event('input', { bubbles: true }));
        }
    };
}

// ==================== TÍNH NĂNG 5: QUICK DEMO MODE ====================
function initializeDemoMode() {
    const demoBtn = document.getElementById('demo_btn');
    if (!demoBtn) return;
    
    demoBtn.addEventListener('click', function() {
        if (!confirm('Bạn có muốn điền form mẫu Demo Case: Điện tử 50 tấn HCM→LA?')) return;
        
        // Transport & Route
        setTimeout(() => selectOption('transport_mode_dropdown', 'ocean_fcl', 0), 100);
        setTimeout(() => selectOption('route_dropdown', 'vn_us', 0), 200);
        setTimeout(() => selectOption('cargo_type_dropdown', 'electronics', 1), 300);
        setTimeout(() => selectOption('incoterm_dropdown', 'fob', 3), 400);
        setTimeout(() => selectOption('container_dropdown', '40ft_highcube', 2), 500);
        setTimeout(() => selectOption('packaging_dropdown', 'excellent', 3), 600);
        setTimeout(() => selectOption('priority_dropdown', 'standard', 1), 700);
        
        // Cargo Details
        setTimeout(() => {
            document.getElementById('packages').value = 50;
            document.getElementById('cargo_value').value = 2500000;
            document.getElementById('shipment_value').value = 2875000;
            
            const today = new Date();
            const etd = new Date(today);
            etd.setDate(etd.getDate() + 7);
            const eta = new Date(etd);
            eta.setDate(eta.getDate() + 25);
            
            document.getElementById('etd').value = etd.toISOString().split('T')[0];
            document.getElementById('eta').value = eta.toISOString().split('T')[0];
            calculateTransitTime();
        }, 800);
        
        // Advanced Parameters
        setTimeout(() => {
            document.getElementById('distance').value = 15200;
            const routeTypeDropdown = document.getElementById('route_type_dropdown');
            if (!routeTypeDropdown) {
                console.warn('route_type_dropdown not found — skipping initialization');
            } else {
                selectOption('route_type_dropdown', 'standard', 1);
            }
            document.getElementById('carrier_rating').value = 4.8;
            document.getElementById('carrier_rating').dispatchEvent(new Event('input'));
            document.getElementById('weather_risk').value = 6.2;
            document.getElementById('weather_risk').dispatchEvent(new Event('input'));
            document.getElementById('port_risk').value = 5.5;
            document.getElementById('port_risk').dispatchEvent(new Event('input'));
            document.getElementById('container_match').value = 9.5;
            document.getElementById('container_match').dispatchEvent(new Event('input'));
            document.getElementById('priority_level').value = 6;
            document.getElementById('priority_level').dispatchEvent(new Event('input'));
        }, 900);
        
        // Seller Info
        setTimeout(() => {
            document.getElementById('seller_name').value = 'Vietnam Electronics Manufacturing Co., Ltd.';
            selectOption('seller_country_dropdown', 'vn', 0);
            document.getElementById('seller_email').value = 'sales@vnem.vn';
            document.getElementById('seller_phone').value = '+84 28 1234 5678';
            document.getElementById('seller_address').value = '123 Industrial Zone, Ho Chi Minh City, Vietnam';
            document.getElementById('seller_pic').value = 'Nguyen Van A';
            selectOption('seller_size_dropdown', 'Large', 2);
            document.getElementById('seller_esg').value = 82;
        }, 1000);
        
        // Buyer Info
        setTimeout(() => {
            document.getElementById('buyer_name').value = 'American Tech Distributors Inc.';
            selectOption('buyer_country_dropdown', 'us', 1);
            document.getElementById('buyer_email').value = 'procurement@atdi.com';
            document.getElementById('buyer_phone').value = '+1 213 555 0123';
            document.getElementById('buyer_address').value = '456 Commerce Blvd, Los Angeles, CA 90001, USA';
            document.getElementById('buyer_pic').value = 'John Smith';
            selectOption('buyer_size_dropdown', 'Large', 2);
            document.getElementById('buyer_esg').value = 88;
        }, 1100);
        
        // Climate & ESG
        setTimeout(() => {
            document.getElementById('enso_index').value = 0.5;
            document.getElementById('typhoon_frequency').value = 0.7;
            document.getElementById('sst_anomaly').value = 0.3;
            document.getElementById('port_climate_stress').value = 6.0;
            document.getElementById('port_climate_stress').dispatchEvent(new Event('input'));
            document.getElementById('climate_volatility_index').value = 55;
            document.getElementById('climate_volatility_index').dispatchEvent(new Event('input'));
            document.getElementById('esg_score').value = 75;
            document.getElementById('climate_resilience').value = 7.0;
            document.getElementById('climate_resilience').dispatchEvent(new Event('input'));
            document.getElementById('green_packaging').value = 85;
            document.getElementById('green_packaging').dispatchEvent(new Event('input'));
            const tailField = document.getElementById('climate_tail_event_probability');
            if (tailField) tailField.value = 0.08;
        }, 1200);
        
        setTimeout(() => {
            alert('✓ Demo Case đã được điền thành công!');
            if (typeof updateProgress === 'function') updateProgress();
        }, 1500);
    });
}

// ==================== TÍNH NĂNG 6: COLLAPSIBLE THÔNG MINH ====================
function initializeSmartCollapsible() {
    // Section 06 & 07 mặc định thu gọn
    const climateSection = document.getElementById('climate-esg');
    const algorithmSection = document.getElementById('algorithm-modules');
    
    if (climateSection) {
        const content = climateSection.querySelector('.section-content');
        if (content) {
            content.classList.add('collapsed');
        }
    }
    
    // Hover header → glow + mũi tên xoay mượt
    document.querySelectorAll('.section-header').forEach(header => {
        header.style.transition = 'all 0.3s ease';
        header.addEventListener('mouseenter', function() {
            this.style.boxShadow = '0 0 20px rgba(0, 255, 136, 0.3)';
            const icon = this.querySelector('.collapse-icon');
            if (icon) {
                icon.style.transform = 'rotate(180deg)';
            }
        });
        header.addEventListener('mouseleave', function() {
            this.style.boxShadow = '';
            const icon = this.querySelector('.collapse-icon');
            if (icon) {
                icon.style.transform = '';
            }
        });
    });
}

// ==================== TÍNH NĂNG 7: REALTIME VALIDATION + TICK XANH (UPGRADED) ====================
function initializeRealtimeValidation() {
    // Debounce function để tránh validate quá nhiều
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Tạo validation tick với animation đẹp
    function createValidationTick(field) {
        const formGroup = field.closest('.form-group') || field.closest('.input-group') || field.parentElement;
        if (!formGroup) return null;
        
        let tickContainer = formGroup.querySelector('.validation-tick-container');
        if (!tickContainer) {
            tickContainer = document.createElement('div');
            tickContainer.className = 'validation-tick-container';
            formGroup.appendChild(tickContainer);
        }
        
        let tick = tickContainer.querySelector('.validation-tick');
        if (!tick) {
            tick = document.createElement('span');
            tick.className = 'validation-tick';
            tick.innerHTML = '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M13.5 4.5L6 12L2.5 8.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
            tickContainer.appendChild(tick);
        }
        
        return tick;
    }
    
    // Tạo error message với animation
    function createErrorMessage(field, message) {
        const formGroup = field.closest('.form-group') || field.closest('.input-group') || field.parentElement;
        if (!formGroup) return null;
        
        let errorMsg = formGroup.querySelector('.error-message-realtime');
        if (!errorMsg) {
            errorMsg = document.createElement('div');
            errorMsg.className = 'error-message-realtime';
            formGroup.appendChild(errorMsg);
        }
        
        errorMsg.textContent = message;
        return errorMsg;
    }
    
    // Validate field với feedback tức thì
    function validateField(field, immediate = false) {
        const value = field.value ? field.value.trim() : '';
        const isRequired = field.hasAttribute('required');
        const fieldType = field.type || field.tagName.toLowerCase();
        
        // Remove previous states
        field.classList.remove('error', 'valid', 'validating');
        
        // Nếu field đang empty và không required, không validate
        if (!isRequired && !value) {
            const tick = field.parentElement?.querySelector('.validation-tick');
            const errorMsg = field.parentElement?.querySelector('.error-message-realtime');
            if (tick) tick.classList.remove('show');
            if (errorMsg) errorMsg.classList.remove('show');
            return true;
        }
        
        // Nếu required và empty
        if (isRequired && !value) {
            field.classList.add('error');
            field.classList.remove('valid');
            
            // Show error message
            const errorMsg = createErrorMessage(field, 'Trường này là bắt buộc');
            if (errorMsg) {
                errorMsg.classList.add('show');
            }
            
            // Hide tick
            const tick = field.parentElement?.querySelector('.validation-tick');
            if (tick) tick.classList.remove('show');
            
            // Shake animation
            field.style.animation = 'fieldShake 0.4s ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 400);
            
            return false;
        }
        
        // Validate theo type
        let isValid = true;
        let errorMessage = '';
        
        if (fieldType === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Email không hợp lệ';
            }
        }
        
        if (fieldType === 'number' && value) {
            const num = parseFloat(value);
            const min = field.getAttribute('min');
            const max = field.getAttribute('max');
            
            if (isNaN(num)) {
                isValid = false;
                errorMessage = 'Vui lòng nhập số hợp lệ';
            } else if (min && num < parseFloat(min)) {
                isValid = false;
                errorMessage = `Giá trị tối thiểu là ${min}`;
            } else if (max && num > parseFloat(max)) {
                isValid = false;
                errorMessage = `Giá trị tối đa là ${max}`;
            }
        }
        
        if (field.id === 'etd' || field.id === 'eta') {
            // Date validation
            if (value) {
                const date = new Date(value);
                if (isNaN(date.getTime())) {
                    isValid = false;
                    errorMessage = 'Ngày không hợp lệ';
                }
            }
        }
        
        // Show result
        if (isValid && value) {
            field.classList.add('valid');
            field.classList.remove('error');
            
            // Show tick với animation
            const tick = createValidationTick(field);
            if (tick) {
                setTimeout(() => {
                    tick.classList.add('show');
                }, immediate ? 0 : 100);
            }
            
            // Hide error message
            const errorMsg = field.parentElement?.querySelector('.error-message-realtime');
            if (errorMsg) {
                errorMsg.classList.remove('show');
            }
            
            // Success pulse animation
            field.style.animation = 'fieldSuccess 0.3s ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 300);
        } else if (!isValid) {
            field.classList.add('error');
            field.classList.remove('valid');
            
            // Show error message
            const errorMsg = createErrorMessage(field, errorMessage || 'Giá trị không hợp lệ');
            if (errorMsg) {
                errorMsg.classList.add('show');
            }
            
            // Hide tick
            const tick = field.parentElement?.querySelector('.validation-tick');
            if (tick) tick.classList.remove('show');
            
            // Shake animation
            field.style.animation = 'fieldShake 0.4s ease';
            setTimeout(() => {
                field.style.animation = '';
            }, 400);
        }
        
        return isValid;
    }
    
    // Debounced validation cho input events
    const debouncedValidate = debounce((field) => {
        validateField(field, false);
    }, 300);
    
    // Setup validation cho tất cả fields
    const allFields = document.querySelectorAll('input:not([type="hidden"]):not([type="submit"]):not([type="button"]), select, textarea');
    
    allFields.forEach(field => {
        // Real-time validation khi đang nhập
        field.addEventListener('input', (e) => {
            field.classList.add('validating');
            debouncedValidate(field);
        });
        
        // Immediate validation khi blur
        field.addEventListener('blur', () => {
            validateField(field, true);
        });
        
        // Validate ngay khi focus (nếu đã có giá trị)
        field.addEventListener('focus', () => {
            if (field.value) {
                validateField(field, false);
            }
        });
    });
    
    // Add enhanced styles và animations
    const style = document.createElement('style');
    style.textContent = `
        /* Validation Tick Container */
        .validation-tick-container {
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 10;
            pointer-events: none;
        }
        
        .validation-tick {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: linear-gradient(135deg, #00ff88 0%, #00cc99 100%);
            color: #0a0a0b;
            opacity: 0;
            transform: scale(0);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
        
        .validation-tick.show {
            opacity: 1;
            transform: scale(1);
        }
        
        .validation-tick svg {
            width: 12px;
            height: 12px;
        }
        
        /* Error Message */
        .error-message-realtime {
            position: absolute;
            bottom: -22px;
            left: 0;
            font-size: 12px;
            color: #ff4444;
            background: rgba(255, 68, 68, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            opacity: 0;
            transform: translateY(-5px);
            transition: all 0.3s ease;
            pointer-events: none;
            z-index: 100;
            white-space: nowrap;
        }
        
        .error-message-realtime.show {
            opacity: 1;
            transform: translateY(0);
        }
        
        /* Field States */
        .form-input.valid,
        input.valid,
        select.valid,
        textarea.valid {
            border-color: #00ff88 !important;
            background: rgba(0, 255, 136, 0.05) !important;
            box-shadow: 0 0 0 3px rgba(0, 255, 136, 0.1) !important;
        }
        
        .form-input.error,
        input.error,
        select.error,
        textarea.error {
            border-color: #ff4444 !important;
            background: rgba(255, 68, 68, 0.05) !important;
            box-shadow: 0 0 0 3px rgba(255, 68, 68, 0.1) !important;
        }
        
        .form-input.validating,
        input.validating,
        select.validating,
        textarea.validating {
            border-color: #00ffc3 !important;
            box-shadow: 0 0 0 3px rgba(0, 255, 195, 0.1) !important;
        }
        
        /* Animations */
        @keyframes fieldShake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
            20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        
        @keyframes fieldSuccess {
            0% { transform: scale(1); }
            50% { transform: scale(1.02); }
            100% { transform: scale(1); }
        }
        
        /* Form Group với relative positioning cho error message */
        .form-group,
        .input-group {
            position: relative;
            margin-bottom: 24px;
        }
        
        /* Input với padding-right để tránh overlap với tick */
        .form-input:not([type="checkbox"]):not([type="radio"]),
        input:not([type="checkbox"]):not([type="radio"]),
        select,
        textarea {
            padding-right: 40px !important;
        }
    `;
    document.head.appendChild(style);
    
    console.log('✓ Enhanced Real-time Validation initialized');
}

// ==================== TÍNH NĂNG 9: MOBILE PERFECT ====================
function initializeMobileOptimization() {
    function checkMobile() {
        const isMobile = window.innerWidth < 768;
        const runBtn = document.getElementById('run_risk') || document.querySelector('.btn-primary') || document.querySelector('button[onclick*="runAnalysis"]');
        
        if (isMobile) {
            // Grid 1 cột
            document.querySelectorAll('.form-grid').forEach(grid => {
                grid.style.gridTemplateColumns = '1fr';
            });
            
            // Tất cả section thu gọn trừ 01 & 02
            const sectionIds = ['shipping-info', 'cargo-details', 'seller-info', 'buyer-info', 'advanced-params', 'climate-esg', 'algorithm-modules'];
            sectionIds.forEach((sectionId, index) => {
                if (index > 1) {
                    const sectionEl = document.getElementById(sectionId);
                    if (sectionEl) {
                        const content = sectionEl.querySelector('.section-content, .form-grid, .modules-grid');
                        if (content) {
                            const originalDisplay = window.getComputedStyle(content).display;
                            if (originalDisplay !== 'none') {
                                content.setAttribute('data-original-display', originalDisplay);
                                content.style.display = 'none';
                                content.classList.add('collapsed');
                            }
                        }
                    }
                }
            });
            
            // Nút RUN fixed bottom
            if (runBtn) {
                runBtn.style.cssText = 'position: fixed; bottom: 0; left: 0; right: 0; width: 100%; z-index: 1000; border-radius: 0; padding: 16px; font-size: 18px; box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.5);';
            }
        } else {
            // Reset desktop
            document.querySelectorAll('.form-grid').forEach(grid => {
                grid.style.gridTemplateColumns = '';
            });
            document.querySelectorAll('[data-original-display]').forEach(el => {
                const originalDisplay = el.getAttribute('data-original-display');
                el.style.display = originalDisplay || '';
                el.removeAttribute('data-original-display');
                el.classList.remove('collapsed');
            });
            if (runBtn) {
                runBtn.style.cssText = '';
            }
        }
    }
    
    window.addEventListener('resize', checkMobile);
    checkMobile();
}

// ==================== TÍNH NĂNG 10: GỌI TẤT CẢ KHI CHANGE ====================
function setupGlobalChangeListeners() {
    document.addEventListener('change', function(e) {
        const target = e.target;
        if (!target) return;
        const id = target.id || '';
        
        const dropdownInputs = [
            'transport_mode_input',
            'cargo_type_input',
            'route_input',
            'incoterm_input',
            'container_input',
            'packaging_input',
            'priority_input'
        ];
        
        if (dropdownInputs.includes(id)) {
            if (window.applySmartDefaults) applySmartDefaults();
        }
        
        if (id === 'transport_mode_input') {
            if (window.toggleContainerField) toggleContainerField();
        }
        
        if (id === 'cargo_value' || id === 'shipment_value') {
            if (window.smartAutoCalc) smartAutoCalc();
        }
        
        if (typeof scheduleProgressUpdate === 'function') scheduleProgressUpdate();
            
            // Update summary section when any field changes
            if (typeof updateInputSummary === 'function') {
                setTimeout(() => {
                    updateInputSummary();
                }, 100);
            }
    });
    
    document.addEventListener('input', function(e) {
        const target = e.target;
        if (target && (target.id === 'cargo_value' || target.id === 'shipment_value')) {
            if (window.smartAutoCalc) smartAutoCalc();
        }
        if (typeof scheduleProgressUpdate === 'function') scheduleProgressUpdate();
            
            // Update summary section when any input changes
            if (typeof updateInputSummary === 'function') {
                setTimeout(() => {
                    updateInputSummary();
                }, 100);
            }
    });
}

// ==================== SMART INPUT HELPER FUNCTIONS ====================
function updateSmartInputFeedback() {
    if (!window.smartInputClass) {
        console.warn('⚠ Smart Input not loaded yet');
        return;
    }
    
    const selection = {
        route: getDropdownValue('route'),
        cargo: getDropdownValue('cargo_type'),
        container: getDropdownValue('container'),
        carrier: getDropdownValue('carrier')
    };
    
    console.log('📊 Updating Smart Input feedback:', selection);
    window.smartInputClass.updateUIFeedback(selection);
    
    // Auto-update container match when cargo or container changes
    updateContainerMatch();
}

// ==================== INPUT SUMMARY PANEL UPDATER ====================
// Helper function to auto-apply placeholder class based on value
function applyPlaceholderClass(element, value) {
    if (!element) return;
    const isPlaceholder = !value || value === '--' || value.includes('Chưa') || value.trim() === '';
    if (isPlaceholder) {
        element.classList.add('placeholder');
    } else {
        element.classList.remove('placeholder');
    }
    // Remove inline color styles to let CSS handle it
    element.style.color = '';
}

// Helper function to update summary values
function updateSummaryValue(id, value) {
    const summary = document.getElementById('summary_section') || document.getElementById('summaryGrid') || document.getElementById('inputSummaryGrid');
    if (!summary) {
        console.warn('Summary section not found, skipping update');
        return;
    }
    
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || '--';
        applyPlaceholderClass(el, value);
    }
        
        // Also update input summary section (for summary at bottom of input page)
        const inputSummaryId = 'input-' + id;
        const inputSummaryEl = document.getElementById(inputSummaryId);
        if (inputSummaryEl) {
            inputSummaryEl.textContent = value || '--';
            applyPlaceholderClass(inputSummaryEl, value);
            // Removed verbose logging to reduce console spam
        }
        // Silently skip if element not found - no warning needed
}

// Helper function to update text without warning spam
function updateText(id, value) {
    const el = document.getElementById(id);
    if (!el) {
        // Silently return - no warning spam
        return;
    }
    el.textContent = value ?? 'N/A';
}

function updateInputSummary() {
    // === GUARD: Check if input-summary-container exists ===
    const hasSummary = document.getElementById('input-summary-container');
    if (!hasSummary) {
        // Check if we're on input page - disable entirely if so
        if (window.location.pathname.includes('/input')) {
            // Silently skip on input page - no warnings needed
            return;
        }
        // For other pages, log once but don't spam
        if (!window.__summaryWarningLogged) {
            console.warn('[Input Summary] No summary container found — skipping summary updates on this page.');
            window.__summaryWarningLogged = true;
        }
        return; // stop summary logic
    }
    // ====================================================
    
    // Check if summary section exists (for input page)
    const summaryContainer = document.getElementById('summary_section') || document.getElementById('input-summary-section') || document.getElementById('summaryGrid') || document.getElementById('inputSummaryGrid');
    if (!summaryContainer) {
        // Summary section doesn't exist, skip update
        return;
    }
    
    // Get translations
    const translations = LANG[currentLang] || LANG['en'];
    
    // ===== SECTION 1: SHIPPING INFORMATION =====
    // Route
    const routeValue = getDropdownValue('route');
    const routeText = routeValue ? (document.querySelector(`#route_dropdown [data-value="${routeValue}"]`)?.textContent?.trim() || routeValue) : 'Chưa chọn';
    updateSummaryValue('summary-route', routeText);
    
    // Transport Mode - Simplified format: only show "Đường biển - FCL"
    const transportModeValue = getDropdownValue('transport_mode');
    let transportModeText = 'Chưa chọn';
    if (transportModeValue) {
        // Get mode label from logistics data or dropdown
        const modeOption = document.querySelector(`#transport_mode_dropdown [data-value="${transportModeValue}"]`);
        if (modeOption) {
            // Extract just the label (first line), remove "Đề xuất", days, description
            const fullText = modeOption.textContent?.trim() || '';
            // Split by newline and get first part, remove "Đề xuất" badge if exists
            const lines = fullText.split('\n');
            const firstLine = lines[0]?.trim() || fullText;
            // Remove "Đề xuất" and any emoji/icons
            transportModeText = firstLine.replace(/\s*Đề xuất\s*/gi, '')
                                          .replace(/\s*[⚙️🔧]\s*Đề xuất\s*/gi, '')
                                          .trim();
        } else {
            // Fallback: format from value
            const modeLabels = {
                'ocean_fcl': 'Đường biển - FCL',
                'ocean_lcl': 'Đường biển - LCL',
                'air_general': 'Hàng không - General',
                'road_ftl': 'Đường bộ - FTL',
                'rail_container': 'Đường sắt - Container'
            };
            transportModeText = modeLabels[transportModeValue] || transportModeValue;
        }
    }
    updateSummaryValue('summary-transport-mode', transportModeText);
    
    // Also update input summary transport mode
    const inputSummaryTransportMode = document.getElementById('input-summary-transport-mode');
    if (inputSummaryTransportMode) {
        inputSummaryTransportMode.textContent = transportModeText;
        applyPlaceholderClass(inputSummaryTransportMode, transportModeText);
    }
    
    // POL - Get from hidden input or dropdown value
    const polInput = document.getElementById('pol_input');
    const polValue = polInput?.value || getDropdownValue('pol') || '';
    const polDropdownValue = document.querySelector('#pol_dropdown .dropdown-value');
    const polText = polDropdownValue && !polDropdownValue.classList.contains('placeholder') 
        ? polDropdownValue.textContent.trim() 
        : (polValue || 'Chưa chọn');
    updateSummaryValue('summary-pol', polText);
    
    // POD - Get from hidden input or dropdown value
    const podInput = document.getElementById('pod_input');
    const podValue = podInput?.value || getDropdownValue('pod') || '';
    const podDropdownValue = document.querySelector('#pod_dropdown .dropdown-value');
    const podText = podDropdownValue && !podDropdownValue.classList.contains('placeholder')
        ? podDropdownValue.textContent.trim()
        : (podValue || 'Chưa chọn');
    updateSummaryValue('summary-pod', podText);
    
    // POL/POD Combined (for new dashboard) - Extract codes
    if (polValue && podValue && polText !== 'Chưa chọn' && podText !== 'Chưa chọn') {
        // Try to extract port codes from text (format: "Port Name (CODE)" or just "CODE")
        let polCode = polValue;
        let podCode = podValue;
        
        // Check if text contains code in parentheses
        const polMatch = polText.match(/\(([^)]+)\)/);
        if (polMatch) polCode = polMatch[1];
        
        const podMatch = podText.match(/\(([^)]+)\)/);
        if (podMatch) podCode = podMatch[1];
        
        // If no parentheses, try to use the value directly as code
        if (polCode === polValue && polValue.length <= 6) {
            // Likely a code
        } else if (polCode === polValue) {
            // Use first part or abbreviation
            polCode = polValue.split(' ')[0].substring(0, 6).toUpperCase();
        }
        
        if (podCode === podValue && podValue.length <= 6) {
            // Likely a code
        } else if (podCode === podValue) {
            podCode = podValue.split(' ')[0].substring(0, 6).toUpperCase();
        }
        
        updateSummaryValue('summary-pol-pod', `${polCode} → ${podCode}`);
        const noteEl = document.getElementById('summary-pol-pod-note');
        if (noteEl) {
            noteEl.textContent = `${polText} → ${podText}`;
            noteEl.style.display = 'block';
        }
    } else {
        updateSummaryValue('summary-pol-pod', 'Chưa chọn');
        const noteEl = document.getElementById('summary-pol-pod-note');
        if (noteEl) {
            noteEl.textContent = '';
            noteEl.style.display = 'none';
        }
    }
    
    // Distance
    const distance = document.getElementById('distance')?.value || '';
    updateSummaryValue('summary-distance', distance ? `${parseFloat(distance).toLocaleString()} km` : '-- km');
    
    // Transit Time
    const transitTime = document.getElementById('transit_time')?.value || document.getElementById('transit_time_display')?.value || '';
    updateSummaryValue('summary-transit-time', transitTime ? `${transitTime} ngày` : '-- ngày');
    
        // Transit Time Highlight (for new dashboard and input summary)
    const transitTimeHighlight = document.getElementById('summary-transit-time-highlight');
    if (transitTimeHighlight) {
        const transitValue = transitTime ? `${transitTime} ngày` : '-- ngày';
        transitTimeHighlight.textContent = transitValue;
        applyPlaceholderClass(transitTimeHighlight, transitValue);
    }
        const inputTransitTimeHighlight = document.getElementById('input-summary-transit-time-highlight');
        if (inputTransitTimeHighlight) {
            const transitValue = transitTime ? `${transitTime} ngày` : '-- ngày';
            inputTransitTimeHighlight.textContent = transitValue;
            applyPlaceholderClass(inputTransitTimeHighlight, transitValue);
        }
    
    // ===== SECTION 2: CARGO & CONTAINER =====
    // Cargo Type
    const cargoValue = getDropdownValue('cargo_type');
    const cargoText = cargoValue ? (document.querySelector(`#cargo_type_dropdown [data-value="${cargoValue}"]`)?.textContent?.trim() || cargoValue) : 'Chưa chọn';
    updateSummaryValue('summary-cargo', cargoText);
    
    // Container
    const containerValue = getDropdownValue('container');
    const containerText = containerValue ? (document.querySelector(`#container_dropdown [data-value="${containerValue}"]`)?.textContent?.trim() || containerValue) : 'Chưa chọn';
    updateSummaryValue('summary-container', containerText);
    
    // Container Note (from suggestion)
    const containerSuggestion = document.getElementById('container-suggestion');
    const containerNoteEl = document.getElementById('summary-container-note');
    if (containerNoteEl && containerSuggestion && containerSuggestion.style.display !== 'none') {
        const noteText = containerSuggestion.querySelector('.suggestion-content')?.textContent?.trim();
        if (noteText) {
            containerNoteEl.textContent = noteText.substring(0, 60) + (noteText.length > 60 ? '...' : '');
            containerNoteEl.style.display = 'block';
        } else {
            containerNoteEl.style.display = 'none';
        }
    } else if (containerNoteEl) {
        containerNoteEl.style.display = 'none';
    }
    
    // Incoterm
    const incotermValue = getDropdownValue('incoterm');
    const incotermText = incotermValue ? (document.querySelector(`#incoterm_dropdown [data-value="${incotermValue}"]`)?.textContent?.trim() || incotermValue) : 'Chưa chọn';
    updateSummaryValue('summary-incoterm', incotermText);
    
    // Packaging
    const packagingValue = getDropdownValue('packaging');
    const packagingText = packagingValue ? (document.querySelector(`#packaging_dropdown [data-value="${packagingValue}"]`)?.textContent?.trim() || packagingValue) : 'Chưa chọn';
    updateSummaryValue('summary-packaging', packagingText);
    
    // Priority
    const priorityValue = getDropdownValue('priority');
    const priorityText = priorityValue ? (document.querySelector(`#priority_dropdown [data-value="${priorityValue}"]`)?.textContent?.trim() || priorityValue) : 'Chưa chọn';
    updateSummaryValue('summary-priority', priorityText);
    
    // Priority Note (from preview)
    const priorityPreview = document.getElementById('priority-preview');
    const priorityNoteEl = document.getElementById('summary-priority-note');
    if (priorityNoteEl && priorityPreview && priorityPreview.textContent) {
        const previewText = priorityPreview.textContent.trim();
        if (previewText && previewText !== 'Chưa chọn') {
            priorityNoteEl.textContent = previewText.substring(0, 60) + (previewText.length > 60 ? '...' : '');
            priorityNoteEl.style.display = 'block';
        } else {
            priorityNoteEl.style.display = 'none';
        }
    } else if (priorityNoteEl) {
        priorityNoteEl.style.display = 'none';
    }
    
    // Container Match
    const containerMatch = parseFloat(document.getElementById('container_match')?.value || '8.0');
    // Format: show as integer if whole number, otherwise show 1 decimal
    const formattedMatch = containerMatch % 1 === 0 
        ? containerMatch.toFixed(0) 
        : containerMatch.toFixed(1);
    updateSummaryValue('summary-container-match', `${formattedMatch}/10`);
    
    // Also update input summary container match
    const inputSummaryContainerMatch = document.getElementById('input-summary-container-match');
    if (inputSummaryContainerMatch) {
        inputSummaryContainerMatch.textContent = `${formattedMatch}/10`;
        applyPlaceholderClass(inputSummaryContainerMatch, `${formattedMatch}/10`);
    }
    
    // ===== SECTION 3: CARRIER =====
    // Carrier
    const carrierValue = getDropdownValue('carrier');
    updateSummaryValue('summary-carrier', carrierValue || 'Chưa chọn');
    
    // Update input summary carrier name
    const inputSummaryCarrierName = document.getElementById('input-summary-carrier');
    if (inputSummaryCarrierName) {
        inputSummaryCarrierName.textContent = carrierValue || 'Chưa chọn';
        applyPlaceholderClass(inputSummaryCarrierName, carrierValue || 'Chưa chọn');
    }
    
        // Carrier Logo (for new dashboard and input summary)
    const carrierLogo = document.getElementById('summary-carrier-logo');
    if (carrierLogo && carrierValue) {
        carrierLogo.textContent = carrierValue.substring(0, 2).toUpperCase();
    } else if (carrierLogo) {
        carrierLogo.textContent = '--';
    }
        const inputCarrierLogo = document.getElementById('input-summary-carrier-logo');
        if (inputCarrierLogo && carrierValue) {
            inputCarrierLogo.textContent = carrierValue.substring(0, 2).toUpperCase();
        } else if (inputCarrierLogo) {
            inputCarrierLogo.textContent = '--';
        }
    
    // Carrier Note - Don't show suggestion content in summary, just show carrier name
    // The suggestion card should be simplified separately if needed
    const carrierNoteEl = document.getElementById('summary-carrier-note');
    if (carrierNoteEl) {
        carrierNoteEl.style.display = 'none';
    }
    
    // Carrier Rating - Get from logistics data if carrier is selected
    let carrierRating = null;
    if (carrierValue && window.LOGISTICS_DATA) {
        // Get rating directly from logistics data for accuracy
        const routeKey = getDropdownValue('route');
        if (routeKey) {
            const logisticsRouteKey = window.LOGISTICS_DATA.mapRouteFromHTML(routeKey);
            const carriers = window.LOGISTICS_DATA.getCarrierRatings(logisticsRouteKey) || window.LOGISTICS_DATA.getCarriersByRoute(logisticsRouteKey);
            const carrier = carriers.find(c => c.name === carrierValue);
            
            if (carrier && carrier.rating) {
                carrierRating = carrier.rating;
                // Update hidden input to keep it in sync
                const carrierRatingInput = document.getElementById('carrier_rating');
                if (carrierRatingInput) {
                    carrierRatingInput.value = carrierRating;
                }
            }
        }
    }
    
    // Fallback to hidden input if logistics data not available
    if (!carrierRating && carrierValue) {
        carrierRating = parseFloat(document.getElementById('carrier_rating')?.value);
        if (isNaN(carrierRating)) carrierRating = null;
    }
    
    if (carrierRating && carrierValue) {
        const rating = parseFloat(carrierRating);
        const ratingStars = '⭐'.repeat(Math.floor(rating));
        updateSummaryValue('summary-carrier-rating', `${rating.toFixed(1)} ${ratingStars}`);
        
        // Carrier Rating Stars (for new dashboard and input summary)
        const ratingWrapper = document.getElementById('summary-carrier-rating-wrapper');
        if (ratingWrapper) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            let starsHTML = '';
            for (let i = 0; i < 5; i++) {
                if (i < fullStars) {
                    starsHTML += '<svg class="star" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/></svg>';
                } else if (i === fullStars && hasHalfStar) {
                    starsHTML += '<svg class="star" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor" opacity="0.5"/></svg>';
                } else {
                    starsHTML += '<svg class="star empty" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/></svg>';
                }
            }
            const starRatingEl = ratingWrapper.querySelector('.star-rating');
            const ratingValueEl = ratingWrapper.querySelector('.rating-value');
            if (starRatingEl) starRatingEl.innerHTML = starsHTML;
            if (ratingValueEl) ratingValueEl.textContent = rating.toFixed(1);
        }
            
        // Update input summary carrier rating with correct stars
        const inputRatingStars = document.getElementById('input-summary-carrier-rating-stars');
        const inputRatingValue = document.getElementById('input-summary-carrier-rating-value');
        if (inputRatingStars || inputRatingValue) {
            const fullStars = Math.floor(rating);
            const hasHalfStar = rating % 1 >= 0.5;
            if (inputRatingStars) {
                const stars = inputRatingStars.querySelectorAll('.summary-star');
                stars.forEach((star, index) => {
                    if (index < fullStars) {
                        star.classList.add('filled');
                        star.textContent = '★';
                        star.style.color = '#10B981';
                    } else if (index === fullStars && hasHalfStar) {
                        star.classList.add('filled');
                        star.textContent = '☆';
                        star.style.color = '#10B981';
                    } else {
                        star.classList.remove('filled');
                        star.textContent = '☆';
                        star.style.color = 'rgba(255, 255, 255, 0.3)';
                    }
                });
            }
            if (inputRatingValue) {
                inputRatingValue.textContent = rating.toFixed(1);
                applyPlaceholderClass(inputRatingValue, rating.toFixed(1));
            }
        }
    } else {
        // Carrier not selected - hide or show placeholder rating
        const inputRatingStars = document.getElementById('input-summary-carrier-rating-stars');
        const inputRatingValue = document.getElementById('input-summary-carrier-rating-value');
        
        if (inputRatingStars) {
            const stars = inputRatingStars.querySelectorAll('.summary-star');
            stars.forEach(star => {
                star.classList.remove('filled');
                star.textContent = '☆';
                star.style.color = 'rgba(255, 255, 255, 0.3)';
            });
        }
        if (inputRatingValue) {
            inputRatingValue.textContent = '--';
            applyPlaceholderClass(inputRatingValue, '--');
        }
    }
    
    // ===== SECTION 4: SHIPMENT DETAILS =====
    // Packages
    const packages = document.getElementById('packages')?.value || '';
    updateSummaryValue('summary-packages', packages ? `${parseFloat(packages).toLocaleString()} đơn vị` : '-- đơn vị');
    
    // Cargo Value
    const cargoValueInput = document.getElementById('cargo_value')?.value || '';
    updateSummaryValue('summary-cargo-value', cargoValueInput ? `$${parseFloat(cargoValueInput).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})} USD` : '-- USD');
    
    // ETD
    const etd = document.getElementById('etd')?.value || '';
    updateSummaryValue('summary-etd', etd ? new Date(etd).toLocaleDateString('vi-VN') : '--');
    
    // ETA
    const eta = document.getElementById('eta')?.value || '';
    updateSummaryValue('summary-eta', eta ? new Date(eta).toLocaleDateString('vi-VN') : '--');
    
    // Shipment Month
    const shipmentMonth = document.getElementById('shipment-month')?.value || '';
    if (shipmentMonth) {
        const [year, month] = shipmentMonth.split('-');
        const monthNames = ['Tháng Một', 'Tháng Hai', 'Tháng Ba', 'Tháng Tư', 'Tháng Năm', 'Tháng Sáu', 
                           'Tháng Bảy', 'Tháng Tám', 'Tháng Chín', 'Tháng Mười', 'Tháng Mười Một', 'Tháng Mười Hai'];
        updateSummaryValue('summary-shipment-month', `${monthNames[parseInt(month) - 1]} ${year}`);
    } else {
        updateSummaryValue('summary-shipment-month', '--');
    }
    
    // ===== SECTION 5: PARTIES =====
    // Seller
    const sellerName = document.getElementById('seller_name')?.value || '';
    updateSummaryValue('summary-seller', sellerName || 'Chưa nhập');
    
    const sellerCountry = getDropdownValue('seller_country');
    const sellerEmail = document.getElementById('seller_email')?.value || '';
    const sellerPhone = document.getElementById('seller_phone')?.value || '';
    const sellerDetailsEl = document.getElementById('summary-seller-details');
    if (sellerDetailsEl && (sellerCountry || sellerEmail || sellerPhone)) {
        const details = [];
        if (sellerCountry) details.push(sellerCountry);
        if (sellerEmail) details.push(sellerEmail);
        if (sellerPhone) details.push(sellerPhone);
        sellerDetailsEl.textContent = details.join(' • ');
        sellerDetailsEl.style.display = 'block';
    } else if (sellerDetailsEl) {
        sellerDetailsEl.style.display = 'none';
    }
    
    // Buyer
    const buyerName = document.getElementById('buyer_name')?.value || '';
    updateSummaryValue('summary-buyer', buyerName || 'Chưa nhập');
    
    const buyerCountry = getDropdownValue('buyer_country');
    const buyerEmail = document.getElementById('buyer_email')?.value || '';
    const buyerPhone = document.getElementById('buyer_phone')?.value || '';
    const buyerDetailsEl = document.getElementById('summary-buyer-details');
    if (buyerDetailsEl && (buyerCountry || buyerEmail || buyerPhone)) {
        const details = [];
        if (buyerCountry) details.push(buyerCountry);
        if (buyerEmail) details.push(buyerEmail);
        if (buyerPhone) details.push(buyerPhone);
        buyerDetailsEl.textContent = details.join(' • ');
        buyerDetailsEl.style.display = 'block';
    } else if (buyerDetailsEl) {
        buyerDetailsEl.style.display = 'none';
    }
    
    // ===== SECTION 6: CLIMATE & ESG =====
    // ENSO
    const ensoValue = document.getElementById('enso-value')?.textContent || '';
    updateSummaryValue('summary-enso', ensoValue || '--');
    
    // Storms
    const stormValue = document.getElementById('storm-value')?.textContent || '';
    updateSummaryValue('summary-storms', stormValue || '--');
    
    // Climate Stress
    const climateStress = document.getElementById('climate-stress-value')?.textContent || document.getElementById('climate-stress-slider')?.value || '';
    updateSummaryValue('summary-climate-stress', climateStress ? `${climateStress}/10` : '--/10');
    
    // ESG Score
    const esgScore = document.getElementById('esg_score')?.value || document.getElementById('seller_esg')?.value || '';
    updateSummaryValue('summary-esg', esgScore ? `${esgScore}/100` : '--');
    
    // Container Match and Carrier Rating are auto-calculated from selections (not user input)
    // Auto-update container match based on current selections
    updateContainerMatch();
    
    // Update status indicator
    const statusIndicator = document.getElementById('summary-status-indicator');
    if (statusIndicator) {
        const statusDot = statusIndicator.querySelector('.status-dot');
        const statusText = statusIndicator.querySelector('span:last-child');
        if (statusDot && statusText) {
            statusDot.style.background = '#00d4aa';
            statusText.textContent = 'Đã cập nhật';
        }
    }
}

// Update summary on any form change
function setupSummaryUpdater() {
    const form = document.getElementById('risk_form');
    if (!form) return;
    
    // === GUARD: Check if input-summary-container exists ===
    const hasSummary = document.getElementById('input-summary-container');
    if (!hasSummary) {
        // Check if we're on input page - disable entirely if so
        if (window.location.pathname.includes('/input')) {
            // Silently skip on input page - no warnings needed
            return;
        }
        // For other pages, log once but don't spam
        if (!window.__summaryWarningLogged) {
            console.warn('[Input Summary] No summary container found — skipping setupSummaryUpdater()');
            window.__summaryWarningLogged = true;
        }
        return;
    }
    // ====================================================
    
    // Check if summary section exists before setting up updater
    const summaryContainer = document.getElementById('summary_section') || document.getElementById('input-summary-section') || document.getElementById('summaryGrid') || document.getElementById('inputSummaryGrid');
    if (!summaryContainer) {
        return;
    }
    
    // Update on input/change events
    form.addEventListener('input', () => {
        setTimeout(updateInputSummary, 100);
    });
    
    form.addEventListener('change', () => {
        setTimeout(updateInputSummary, 100);
    });
    
    // Initial update
    setTimeout(updateInputSummary, 500);
}

// Call setup after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupSummaryUpdater);
} else {
    setTimeout(setupSummaryUpdater, 100);
}

// ====================================================
// FINAL CHECK: Re-enable all inputs
// ====================================================
function reEnableAllInputs() {
    // CRITICAL: Force enable all form inputs with maximum priority
    const allInputs = document.querySelectorAll('input, select, textarea, button, .dropdown-trigger, .dropdown-menu, .dropdown-option, .custom-dropdown, .form-input, .date-input, .form-select');
    
    allInputs.forEach(el => {
        // Remove all blocking attributes
        el.disabled = false;
        if (!el.id || (!el.id.includes('display') && !el.id.includes('transit_time_display'))) {
            el.readOnly = false;
            el.removeAttribute('readonly');
        }
        
        // Force enable with maximum priority
        el.style.setProperty('pointer-events', 'auto', 'important');
        el.style.setProperty('z-index', '99999', 'important');
        el.style.setProperty('position', 'relative', 'important');
        el.style.setProperty('opacity', '1', 'important');
        el.style.setProperty('cursor', el.type === 'range' ? 'pointer' : (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' ? 'text' : 'pointer'), 'important');
        
        // Remove blocking classes
        el.classList.remove('disabled', 'readonly', 'locked', 'blocked');
        
        // Ensure tabindex is enabled
        if (el.tabIndex < 0 && !el.classList.contains('dropdown-menu')) {
            el.tabIndex = 0;
        }
    });
    
    // Force enable all form sections
    document.querySelectorAll('.form-section, .enterprise-section-card, #section-transport, #shipping-info, .step-content, .collapsible-section').forEach(sec => {
        sec.style.setProperty('pointer-events', 'auto', 'important');
        sec.style.setProperty('opacity', '1', 'important');
        sec.style.setProperty('z-index', '1', 'important');
        sec.classList.remove('disabled', 'locked');
    });
    
    // Remove ALL blocking overlays (except active modals)
    document.querySelectorAll('.overlay, .backdrop, .mask, [class*="overlay"], [class*="backdrop"], .loading-overlay, #loadingOverlay, .form-backdrop, #overlay').forEach(el => {
        if (!el.classList.contains('active') && !el.closest('.modal') && !el.closest('.ai-chat-popup') && !el.closest('#ai-panel')) {
            el.style.setProperty('pointer-events', 'none', 'important');
            el.style.setProperty('z-index', '-1', 'important');
            el.style.setProperty('display', 'none', 'important');
            el.style.setProperty('opacity', '0', 'important');
            el.style.setProperty('visibility', 'hidden', 'important');
        }
    });
    
    // Remove any full-coverage blocking divs
    document.querySelectorAll('div').forEach(div => {
        const style = window.getComputedStyle(div);
        const hasFullCoverage = (style.width === '100%' || style.width === '100vw') && 
                               (style.height === '100%' || style.height === '100vh');
        const highZIndex = parseInt(style.zIndex) > 1000;
        
        if (hasFullCoverage && highZIndex && 
            !div.closest('.form-section') && 
            !div.closest('.enterprise-section-card') &&
            !div.closest('.dropdown-menu') &&
            !div.closest('.modal') &&
            !div.closest('.ai-chat-popup') &&
            !div.classList.contains('form-section') &&
            !div.classList.contains('enterprise-section-card')) {
            div.style.setProperty('pointer-events', 'none', 'important');
            div.style.setProperty('z-index', '0', 'important');
        }
    });
    
    console.log('✅ All inputs and dropdowns re-enabled with maximum priority');
}

// CRITICAL: Add click/focus listeners to force enable inputs when user interacts
function addInputForceEnableListeners() {
    // Add click listener to all inputs
    document.addEventListener('click', function(e) {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA' || target.classList.contains('dropdown-trigger'))) {
            // Force enable this specific input
            target.style.setProperty('pointer-events', 'auto', 'important');
            target.style.setProperty('z-index', '99999', 'important');
            target.style.setProperty('position', 'relative', 'important');
            target.disabled = false;
            if (!target.id || (!target.id.includes('display') && !target.id.includes('transit_time_display'))) {
                target.readOnly = false;
                target.removeAttribute('readonly');
            }
            target.classList.remove('disabled', 'readonly', 'locked');
            
            // Remove any overlays that might be blocking
            const overlays = document.querySelectorAll('.overlay, .backdrop, [class*="overlay"], [class*="backdrop"]');
            overlays.forEach(overlay => {
                if (!overlay.classList.contains('active') && !overlay.closest('.modal') && !overlay.closest('.ai-chat-popup')) {
                    overlay.style.setProperty('pointer-events', 'none', 'important');
                    overlay.style.setProperty('z-index', '-1', 'important');
                }
            });
        }
    }, true); // Use capture phase to ensure we catch the event first
    
    // Add focus listener
    document.addEventListener('focusin', function(e) {
        const target = e.target;
        if (target && (target.tagName === 'INPUT' || target.tagName === 'SELECT' || target.tagName === 'TEXTAREA')) {
            target.style.setProperty('pointer-events', 'auto', 'important');
            target.style.setProperty('z-index', '99999', 'important');
            target.style.setProperty('position', 'relative', 'important');
        }
    }, true);
}

// Run after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        // Add force enable listeners first
        addInputForceEnableListeners();
        setTimeout(reEnableAllInputs, 500);
        
        // Force unlock all form sections
        setTimeout(() => {
            // Unlock all form sections
            document.querySelectorAll('.form-section, #section-transport, #shipping-info').forEach(sec => {
                sec.style.pointerEvents = 'auto';
                sec.style.opacity = '1';
                sec.classList.remove('disabled', 'locked');
            });
            
            // Remove any blocking overlays
            document.querySelectorAll('#overlay, .backdrop-blocking, .form-backdrop, .loading-overlay, #loadingOverlay, #aiChatBackdrop, #blocker, #input-overlay, #smart-input-backdrop').forEach(el => {
                if (!el.classList.contains('active')) {
                    el.style.display = 'none';
                    el.style.pointerEvents = 'none';
                    el.style.opacity = '0';
                    el.style.visibility = 'hidden';
                    el.style.zIndex = '-1';
                }
            });
            
            // Remove any blocking divs with full coverage
            document.querySelectorAll('div').forEach(div => {
                const style = window.getComputedStyle(div);
                const hasFullCoverage = (style.width === '100%' || style.width === '100vw') && 
                                       (style.height === '100%' || style.height === '100vh');
                const highZIndex = parseInt(style.zIndex) > 1000;
                
                if (hasFullCoverage && highZIndex && 
                    !div.closest('.form-section') && 
                    !div.closest('.enterprise-section-card') &&
                    !div.closest('.dropdown-menu') &&
                    !div.classList.contains('form-section') &&
                    !div.classList.contains('enterprise-section-card')) {
                    div.style.pointerEvents = 'none';
                    div.style.zIndex = '0';
                    console.log('⚠️ Removed blocking div:', div.id || div.className);
                }
            });
            
            console.log("🔥 Force unlock all input sections");
        }, 500);
    });
} else {
    // Add force enable listeners immediately
    addInputForceEnableListeners();
    setTimeout(reEnableAllInputs, 500);
    
    // Force unlock all form sections
    setTimeout(() => {
        // Unlock all form sections
        document.querySelectorAll('.form-section, #section-transport, #shipping-info').forEach(sec => {
            sec.style.pointerEvents = 'auto';
            sec.style.opacity = '1';
            sec.classList.remove('disabled', 'locked');
        });
        
        // Remove any blocking overlays
        document.querySelectorAll('#overlay, .backdrop-blocking, .form-backdrop, .loading-overlay, #loadingOverlay, #aiChatBackdrop, #blocker, #input-overlay, #smart-input-backdrop').forEach(el => {
            if (!el.classList.contains('active')) {
                el.style.display = 'none';
                el.style.pointerEvents = 'none';
                el.style.opacity = '0';
                el.style.visibility = 'hidden';
                el.style.zIndex = '-1';
            }
        });
        
        // Remove any blocking divs with full coverage
        document.querySelectorAll('div').forEach(div => {
            const style = window.getComputedStyle(div);
            const hasFullCoverage = (style.width === '100%' || style.width === '100vw') && 
                                   (style.height === '100%' || style.height === '100vh');
            const highZIndex = parseInt(style.zIndex) > 1000;
            
            if (hasFullCoverage && highZIndex && 
                !div.closest('.form-section') && 
                !div.closest('.enterprise-section-card') &&
                !div.closest('.dropdown-menu') &&
                !div.classList.contains('form-section') &&
                !div.classList.contains('enterprise-section-card')) {
                div.style.pointerEvents = 'none';
                div.style.zIndex = '0';
                console.log('⚠️ Removed blocking div:', div.id || div.className);
            }
        });
        
        console.log("🔥 Force unlock all input sections");
    }, 500);
}

window.resetForm = resetForm;
window.runAnalysis = runAnalysis;
window.setLang = setLang;
window.getDropdownValue = getDropdownValue;
window.toggleSection = toggleSection;
window.collectEnhancedFormData = collectEnhancedFormData;
window.updateSmartInputFeedback = updateSmartInputFeedback;
window.updateInputSummary = updateInputSummary;