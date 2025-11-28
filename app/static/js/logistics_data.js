/**
 * ============================================================
 * LOGISTICS_DATA.JS - RISKCAST v13.0 (ULTRA DETAILED)
 * ============================================================
 * 
 * Chứa toàn bộ dữ liệu logistics thực tế từ Việt Nam:
 * - 10 routes chính từ VN
 * - Phân loại chi tiết theo container, cargo type, road, rail
 * - Risk levels cho từng mode
 * - Cost estimates
 * - Transit times
 * 
 * Data được thu thập từ:
 * - Vietnam Logistics Association
 * - Maersk, MSC, CMA CGM shipping lines
 * - Industry reports 2024-2025
 * ============================================================
 */

// Export to window for global access
const LOGISTICS_DATA = {
    /**
     * ========================================
     * PART 1: TRANSPORT MODE CLASSIFICATIONS
     * ========================================
     */
    transportModeTypes: {
        // ===== OCEAN FREIGHT =====
        ocean: {
            fcl: {
                value: 'ocean_fcl',
                label: 'FCL (Full Container Load)',
                label_vi: 'Đường Biển — FCL (Nguyên Container)',
                description: 'Nguyên container (20ft, 40ft, 40HC, 45ft, Reefer, Open Top, Flat Rack)',
                suitable_for: 'Lô hàng từ 15 m³ trở lên, hàng giá trị cao, hàng nhạy cảm',
                risk_level: 'low',
                risk_score: 2.5,
                share_global: 85
            },
            lcl: {
                value: 'ocean_lcl',
                label: 'LCL (Less than Container Load)',
                label_vi: 'Đường Biển — LCL (Hàng Lẻ Ghép)',
                description: 'Hàng lẻ, ghép chung container với nhiều shipper khác',
                suitable_for: 'Lô hàng nhỏ (< 15 m³), muốn tiết kiệm chi phí',
                risk_level: 'medium',
                risk_score: 5.0,
                share_global: 10
            },
            break_bulk: {
                value: 'ocean_break_bulk',
                label: 'Break Bulk (Hàng rời, hàng xá)',
                label_vi: 'Hàng Rời Không Container',
                description: 'Thép cuộn, gỗ xẻ, máy móc siêu trường siêu trọng, turbine, cánh quạt gió',
                suitable_for: 'Hàng dự án, hàng siêu nặng, siêu dài, siêu cao',
                risk_level: 'high',
                risk_score: 7.5,
                share_global: 3
            },
            ro_ro: {
                value: 'ocean_ro_ro',
                label: 'Ro-Ro (Roll-on/Roll-off)',
                label_vi: 'Tàu Chở Xe (Ro-Ro)',
                description: 'Xe tải, xe hơi, xe công trình tự lăn lên/từ tàu',
                suitable_for: 'Xe ô tô, xe máy, xe tải, máy công trình có bánh lốp',
                risk_level: 'medium',
                risk_score: 4.5,
                share_global: 1
            },
            bulk: {
                value: 'ocean_bulk',
                label: 'Bulk (Hàng rời khô/ướt)',
                label_vi: 'Tàu Chở Hàng Rời',
                description: 'Than, quặng, xi măng, ngũ cốc, dầu cọ, hóa chất lỏng',
                suitable_for: 'Hàng hóa nguyên liệu số lượng cực lớn (hàng chục nghìn tấn)',
                risk_level: 'medium',
                risk_score: 5.5,
                share_global: 1
            },
            reefer: {
                value: 'ocean_reefer',
                label: 'Reefer (Hàng lạnh)',
                label_vi: 'Container Lạnh',
                description: 'Container lạnh hoặc tàu lạnh chuyên dụng (-25°C đến +25°C)',
                suitable_for: 'Hàng đông lạnh, hoa quả, thịt, thủy sản, dược phẩm',
                risk_level: 'low',
                risk_score: 3.0,
                share_global: 0
            }
        },
        
        // ===== AIR FREIGHT =====
        air: {
            general: {
                value: 'air_general',
                label: 'General Cargo',
                label_vi: 'Hàng Không — Hàng Thông Thường',
                description: 'Hàng khô bình thường, đóng thùng carton, pallet, bao',
                suitable_for: 'Quần áo, điện thoại, linh kiện điện tử, mỹ phẩm, tài liệu, mẫu hàng',
                risk_level: 'very_low',
                risk_score: 1.5
            },
            dg: {
                value: 'air_dg',
                label: 'Dangerous Goods — DG',
                label_vi: 'Hàng Không — Hàng Nguy Hiểm',
                description: 'Hàng thuộc 9 class nguy hiểm (pin lithium, hóa chất, chất lỏng dễ cháy)',
                suitable_for: 'Pin lithium >160Wh, nước hoa, bình xịt, keo 502, bật lửa',
                risk_level: 'high',
                risk_score: 8.0
            },
            perishable: {
                value: 'air_perishable',
                label: 'Perishable Cargo',
                label_vi: 'Hàng Không — Hàng Dễ Hư',
                description: 'Hoa tươi, trái cây tươi, thủy hải sản tươi sống, vaccine',
                suitable_for: 'Cần đi nhanh trong 24–72h, giữ lạnh nhẹ hoặc giữ tươi',
                risk_level: 'medium',
                risk_score: 4.0
            },
            pharma: {
                value: 'air_pharma',
                label: 'Temperature Controlled / Pharma',
                label_vi: 'Hàng Không — Dược Phẩm',
                description: 'Hàng cần kiểm soát nhiệt độ nghiêm ngặt +2°C đến +8°C',
                suitable_for: 'Dược phẩm, vaccine, insulin, mẫu máu, chế phẩm sinh học',
                risk_level: 'medium',
                risk_score: 4.5
            }
        },
        
        // ===== ROAD FREIGHT =====
        road: {
            ftl: {
                value: 'road_ftl',
                label: 'FTL — Full Truck Load',
                label_vi: 'Đường Bộ — Thuê Nguyên Xe',
                description: 'Thuê nguyên xe tải (0.5 tấn → 30 tấn)',
                suitable_for: 'Lô hàng từ 2–3 tấn trở lên, muốn đi nhanh, an toàn cao',
                risk_level: 'low',
                risk_score: 3.0
            },
            ltl: {
                value: 'road_ltl',
                label: 'LTL — Less than Truck Load',
                label_vi: 'Đường Bộ — Hàng Lẻ Ghép Xe',
                description: 'Hàng lẻ ghép chung xe tải với nhiều shipper khác',
                suitable_for: 'Lô nhỏ dưới 2 tấn, đi nội địa hoặc VN–Lào–Campuchia–Thái Lan',
                risk_level: 'medium',
                risk_score: 5.5
            },
            container_road: {
                value: 'road_container',
                label: 'Container đường bộ',
                label_vi: 'Kéo Container Đường Bộ',
                description: 'Kéo container 20\'/40\' bằng moóc từ cảng/cửa khẩu về kho',
                suitable_for: 'Hàng nhập khẩu từ cảng về ICD, kho CFS',
                risk_level: 'low',
                risk_score: 2.5
            },
            reefer_truck: {
                value: 'road_reefer',
                label: 'Reefer Truck',
                label_vi: 'Xe Tải Lạnh',
                description: 'Xe tải lạnh hoặc gắn thùng lạnh (0–5°C, -18°C)',
                suitable_for: 'Thủy hải sản, thịt, sữa, kem, trái cây, vaccine, hoa tươi',
                risk_level: 'low',
                risk_score: 3.5
            },
            heavy_truck: {
                value: 'road_heavy',
                label: 'Heavy / Oversized Truck',
                label_vi: 'Xe Siêu Trường Siêu Trọng',
                description: 'Xe đầu kéo + rơ-moóc lùn, thùy lục chở hàng quá khổ',
                suitable_for: 'Máy móc công nghiệp, turbine, cột bê tông, cần cẩu',
                risk_level: 'high',
                risk_score: 7.0
            },
            tank_truck: {
                value: 'road_tank',
                label: 'Tank Truck',
                label_vi: 'Xe Bồn',
                description: 'Chở chất lỏng: xăng dầu, hóa chất, rượu, nước tương',
                suitable_for: 'Hàng lỏng số lượng lớn',
                risk_level: 'medium',
                risk_score: 6.0
            },
            regular_truck: {
                value: 'road_regular',
                label: 'Regular Truck',
                label_vi: 'Xe Tải Mui Bạt Thông Dụng',
                description: 'Từ 1.5 tấn → 18–20 tấn, phổ biến nhất nội địa VN',
                suitable_for: 'Đồ gỗ, gạch, xi măng, thạch cao, hàng tiêu dụng',
                risk_level: 'low',
                risk_score: 3.5
            },
            express: {
                value: 'road_express',
                label: 'Express Delivery',
                label_vi: 'Chuyển Phát Nhanh',
                description: 'Grab, AhaMove, Giao Hàng Nhanh (< 50kg)',
                suitable_for: 'Tài liệu, hàng mẫu, hàng Shopee/Lazada/Tiki',
                risk_level: 'low',
                risk_score: 2.0
            }
        },
        
        // ===== RAIL FREIGHT =====
        rail: {
            container: {
                value: 'rail_container',
                label: 'Rail Container (FCL/LCL)',
                label_vi: 'Đường Sắt — Container',
                description: 'Container 20\'/40\'/40HC chạy trên toa phẳng',
                suitable_for: 'VN–TQ (Hà Nội ⇄ Nam Ninh, Lào Cai ⇄ Hà Khẩu), VN–EU',
                risk_level: 'low',
                risk_score: 3.0
            },
            bulk_wagon: {
                value: 'rail_bulk',
                label: 'Bulk Wagon',
                label_vi: 'Toa Xe Hàng Rời',
                description: 'Toa hở/kín chở quặng, than, xi măng, gạo, phân bón',
                suitable_for: 'Nội địa VN (Bắc–Nam), VN–TQ',
                risk_level: 'low',
                risk_score: 3.5
            },
            reefer_wagon: {
                value: 'rail_reefer',
                label: 'Reefer Wagon',
                label_vi: 'Toa Xe Lạnh',
                description: 'Toa lạnh chuyên dụng hoặc container lạnh gắn lên toa',
                suitable_for: 'Thủy sản đông lạnh, trái cây, bia, sữa từ Trung–Tây Nguyên ra Bắc',
                risk_level: 'low',
                risk_score: 3.5
            },
            lcl_rail: {
                value: 'rail_lcl',
                label: 'LCL Rail',
                label_vi: 'Hàng Lẻ Ghép Toa',
                description: 'Ghép chung toa với nhiều shipper (rẻ hơn container 20–30%)',
                suitable_for: 'Nội địa + VN–TQ',
                risk_level: 'medium',
                risk_score: 5.0
            },
            heavy_rail: {
                value: 'rail_heavy',
                label: 'Heavy Rail (Schnabel)',
                label_vi: 'Toa Xe Siêu Trường Siêu Trọng',
                description: 'Toa lùn, toa Schnabel chở turbine, máy biến áp',
                suitable_for: 'Hàng dự án (nhà máy điện, metro)',
                risk_level: 'high',
                risk_score: 7.5
            },
            passenger_freight: {
                value: 'rail_passenger',
                label: 'Passenger + Freight',
                label_vi: 'Hành Khách Kết Hợp Chở Hàng',
                description: 'Gắn toa hàng vào tàu khách Thống Nhất (SG–HN)',
                suitable_for: 'Hàng nhẹ, giá rẻ nội địa Bắc–Nam (< 3–5 tấn/toa)',
                risk_level: 'medium',
                risk_score: 4.5
            },
            china_europe: {
                value: 'rail_china_europe',
                label: 'China Railway Express',
                label_vi: 'Tàu Liên Vận VN–TQ–EU',
                description: 'Container transit qua TQ đi Kazakhstan, Nga, Ba Lan, Đức',
                suitable_for: 'Điện tử, máy móc, đồ nội thất từ VN đi châu Âu (15–22 ngày)',
                risk_level: 'low',
                risk_score: 4.0
            }
        }
    },

    /**
     * ========================================
     * PART 2: ROUTES DATA (10 ROUTES CHÍNH)
     * ========================================
     */
    routes: {
        // ===== 1. VIETNAM → CHINA =====
        'vn_cn': {
            name: 'Vietnam → China',
            name_vi: 'Việt Nam → Trung Quốc',
            flag: '🇻🇳 → 🇨🇳',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    label_en: 'Ocean Freight — FCL',
                    days: '4-10',
                    share: 45,
                    default: true,
                    risk_level: 'low',
                    risk_score: 2.5,
                    description: 'Container riêng, rủi ro thấp nhất',
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Shenzhen', pod_code: 'CNSZN', days: 7, km: 1200, cost: '$950-1,250 (20\') / $1,300-1,600 (40\')' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Shanghai', pod_code: 'CNSHA', days: 10, km: 2400, cost: '$1,400-1,700' },
                        { pol: 'Sài Gòn', pol_code: 'SGN', pod: 'Guangzhou', pod_code: 'CNCAN', days: 5, km: 1100, cost: '$780-1,050' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Ningbo', pod_code: 'CNNGB', days: 8, km: 1800, cost: '$1,300-1,600' },
                        { pol: 'Đà Nẵng', pol_code: 'DAD', pod: 'Xiamen', pod_code: 'CNXMN', days: 4, km: 900, cost: '$1,000-1,300' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '6-14',
                    share: 20,
                    risk_level: 'medium',
                    risk_score: 5.0,
                    description: 'Hàng ghép, tiết kiệm chi phí',
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Shenzhen', pod_code: 'CNSZN', days: 9, km: 1200, cost: '$65-95/m³' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Shanghai', pod_code: 'CNSHA', days: 12, km: 2400, cost: '$65-95/m³' },
                        { pol: 'Sài Gòn', pol_code: 'SGN', pod: 'Ningbo', pod_code: 'CNNGB', days: 8, km: 1600, cost: '$65-95/m³' }
                    ]
                },
                {
                    value: 'road_ftl',
                    label: 'Đường Bộ — FTL',
                    days: '1-5',
                    share: 15,
                    risk_level: 'low',
                    risk_score: 3.0,
                    description: 'Xe tải riêng, nhanh',
                    routes: [
                        { pol: 'Hữu Nghị (Border)', pol_code: 'HN', pod: 'Nam Ninh', pod_code: 'NN', days: 2, km: 450, cost: '$800-1,200' },
                        { pol: 'Móng Cái (Border)', pol_code: 'MC', pod: 'Đông Hưng', pod_code: 'DH', days: 1, km: 220, cost: '$500-800' },
                        { pol: 'Lào Cai (Border)', pol_code: 'LC', pod: 'Hà Khẩu', pod_code: 'HK', days: 1, km: 380, cost: '$700-1,000' }
                    ]
                },
                {
                    value: 'road_ltl',
                    label: 'Đường Bộ — LTL',
                    days: '2-7',
                    share: 5,
                    risk_level: 'medium',
                    risk_score: 5.5,
                    description: 'Hàng ghép xe, tiết kiệm',
                    routes: [
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'Nam Ninh', pod_code: 'NN', days: 3, km: 450, cost: '$0.3-0.5/kg' }
                    ]
                },
                {
                    value: 'rail_container',
                    label: 'Đường Sắt — Container',
                    days: '2-5',
                    share: 8,
                    risk_level: 'low',
                    risk_score: 3.0,
                    description: 'Chi phí thấp, ổn định',
                    routes: [
                        { pol: 'Yên Viên (Rail)', pol_code: 'YV', pod: 'Nam Ninh', pod_code: 'NN', days: 3, km: 2100, cost: '$900-1,300' },
                        { pol: 'Lào Cai (Rail)', pol_code: 'LC', pod: 'Hà Khẩu', pod_code: 'HK', days: 2, km: 380, cost: '$500-800' }
                    ]
                },
                {
                    value: 'rail_lcl',
                    label: 'Đường Sắt — LCL',
                    days: '3-7',
                    share: 2,
                    risk_level: 'medium',
                    risk_score: 5.0,
                    description: 'Rẻ hơn container 20-30%',
                    routes: [
                        { pol: 'Yên Viên', pol_code: 'YV', pod: 'Nam Ninh', pod_code: 'NN', days: 4, km: 2100, cost: '$60-90/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '2-5',
                    share: 4,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    description: 'Nhanh nhất',
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Quảng Châu (CAN)', pod_code: 'CAN', hours: 2, km: 1800, cost: '$4.5-6.5/kg' },
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Hong Kong (HKG)', pod_code: 'HKG', hours: 2, km: 1100, cost: '$5.0-7.0/kg' }
                    ]
                },
                {
                    value: 'air_express',
                    label: 'Express (DHL/FedEx)',
                    hours: '24-48',
                    share: 1,
                    risk_level: 'very_low',
                    risk_score: 1.0,
                    description: 'Door-to-door, siêu nhanh',
                    routes: [
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'Bắc Kinh', pod_code: 'PEK', hours: 24, km: 2400, cost: '$8-12/kg' }
                    ]
                }
            ]
        },
        
        // ===== 2. VIETNAM → UNITED STATES =====
        'vn_us': {
            name: 'Vietnam → United States',
            name_vi: 'Việt Nam → Hoa Kỳ',
            flag: '🇻🇳 → 🇺🇸',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '15-45',
                    share: 85,
                    default: true,
                    risk_level: 'low',
                    risk_score: 3.0,
                    description: 'Phương thức chủ đạo, rủi ro thấp',
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Long Beach (LA)', pod_code: 'USLGB', days: 18, km: 12600, cost: '$4,800-6,200' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Los Angeles (LA)', pod_code: 'USLAX', days: 18, km: 12600, cost: '$4,800-6,200' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'New York (NY)', pod_code: 'USNYC', days: 35, km: 15600, cost: '$7,500-9,000' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Long Beach (LA)', pod_code: 'USLGB', days: 20, km: 15500, cost: '$4,900-6,100' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Seattle', pod_code: 'USSEA', days: 20, km: 13800, cost: '$2,900-3,600' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '18-50',
                    share: 11,
                    risk_level: 'medium',
                    risk_score: 5.5,
                    description: 'Hàng ghép, thời gian lâu hơn',
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Long Beach (LA)', pod_code: 'USLGB', days: 22, km: 12600, cost: '$180-250/m³' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'New York (NY)', pod_code: 'USNYC', days: 40, km: 15600, cost: '$220-300/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '16-22',
                    share: 4,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    description: 'Nhanh nhất, hàng giá trị cao',
                    routes: [
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Los Angeles (LAX)', pod_code: 'LAX', hours: 16, km: 12400, cost: '$4.2-6.0/kg' },
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'JFK New York', pod_code: 'JFK', hours: 20, km: 14800, cost: '$6.0-8.5/kg' },
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'San Francisco (SFO)', pod_code: 'SFO', hours: 17, km: 13200, cost: '$5.8-8.2/kg' }
                    ]
                }
            ]
        },
        
        // ===== 3. VIETNAM → SOUTH KOREA =====
        'vn_kr': {
            name: 'Vietnam → South Korea',
            name_vi: 'Việt Nam → Hàn Quốc',
            flag: '🇻🇳 → 🇰🇷',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '4-7',
                    share: 75,
                    default: true,
                    risk_level: 'low',
                    risk_score: 2.5,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Busan', pod_code: 'KRPUS', days: 6, km: 3300, cost: '$950-1,300' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Incheon', pod_code: 'KRINC', days: 5, km: 3100, cost: '$1,300-1,700' },
                        { pol: 'Đà Nẵng', pol_code: 'DAD', pod: 'Busan', pod_code: 'KRPUS', days: 5, km: 3000, cost: '$1,350-1,750' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '6-10',
                    share: 13,
                    risk_level: 'medium',
                    risk_score: 5.0,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Busan', pod_code: 'KRPUS', days: 8, km: 3300, cost: '$110-160/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '4-5',
                    share: 12,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Incheon (ICN)', pod_code: 'ICN', hours: 4, km: 3000, cost: '$3.5-5.5/kg' },
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Incheon (ICN)', pod_code: 'ICN', hours: 5, km: 3500, cost: '$3.8-5.8/kg' }
                    ]
                }
            ]
        },
        
        // ===== 4. VIETNAM → JAPAN =====
        'vn_jp': {
            name: 'Vietnam → Japan',
            name_vi: 'Việt Nam → Nhật Bản',
            flag: '🇻🇳 → 🇯🇵',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '7-12',
                    share: 80,
                    default: true,
                    risk_level: 'low',
                    risk_score: 2.5,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Yokohama', pod_code: 'JPYOK', days: 10, km: 4400, cost: '$1,400-1,800' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Osaka', pod_code: 'JPOSA', days: 8, km: 4200, cost: '$1,500-1,900' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Tokyo', pod_code: 'JPTYO', days: 9, km: 4500, cost: '$1,650-2,050' },
                        { pol: 'Đà Nẵng', pol_code: 'DAD', pod: 'Kobe', pod_code: 'JPUKB', days: 8, km: 4100, cost: '$1,550-1,950' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '9-15',
                    share: 13,
                    risk_level: 'medium',
                    risk_score: 5.0,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Yokohama', pod_code: 'JPYOK', days: 12, km: 4400, cost: '$130-180/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '5-7',
                    share: 7,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Narita (NRT)', pod_code: 'NRT', hours: 5, km: 4300, cost: '$4.0-6.0/kg' },
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Kansai (KIX)', pod_code: 'KIX', hours: 5, km: 4200, cost: '$4.2-6.2/kg' }
                    ]
                }
            ]
        },
        
        // ===== 5. VIETNAM → EU (NETHERLANDS/GERMANY) =====
        'vn_eu': {
            name: 'Vietnam → Europe (NL/DE)',
            name_vi: 'Việt Nam → Châu Âu',
            flag: '🇻🇳 → 🇪🇺',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '32-38',
                    share: 93,
                    default: true,
                    risk_level: 'low',
                    risk_score: 3.5,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Rotterdam', pod_code: 'NLRTM', days: 35, km: 15800, cost: '$6,500-8,200' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Hamburg', pod_code: 'DEHAM', days: 36, km: 16200, cost: '$6,600-8,400' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Bremerhaven', pod_code: 'DEBRV', days: 38, km: 16500, cost: '$6,600-8,400' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Antwerp', pod_code: 'BEANR', days: 35, km: 15900, cost: '$6,600-8,400' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '35-42',
                    share: 5,
                    risk_level: 'medium',
                    risk_score: 5.5,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Rotterdam', pod_code: 'NLRTM', days: 38, km: 15800, cost: '$200-280/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '14-16',
                    share: 1.5,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    routes: [
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Amsterdam (AMS)', pod_code: 'AMS', hours: 14, km: 9800, cost: '$6.5-9.0/kg' },
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Frankfurt (FRA)', pod_code: 'FRA', hours: 14, km: 9900, cost: '$6.8-9.2/kg' }
                    ]
                },
                {
                    value: 'rail_china_europe',
                    label: 'Đường Sắt (Liên vận VN-TQ-EU)',
                    days: '18-25',
                    share: 0.5,
                    risk_level: 'medium',
                    risk_score: 4.0,
                    description: 'Tuyến mới 2025, qua TQ-Kazakhstan',
                    routes: [
                        { pol: 'Hà Nội (Rail)', pol_code: 'HAN', pod: 'Rotterdam', pod_code: 'NLRTM', days: 22, km: 14000, cost: '$4,800-6,200' },
                        { pol: 'Hà Nội (Rail)', pol_code: 'HAN', pod: 'Hamburg', pod_code: 'DEHAM', days: 23, km: 14200, cost: '$2,900-3,600' }
                    ]
                }
            ]
        },
        
        // ===== 6. VIETNAM → HONG KONG =====
        'vn_hk': {
            name: 'Vietnam → Hong Kong',
            name_vi: 'Việt Nam → Hồng Kông',
            flag: '🇻🇳 → 🇭🇰',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '1-3',
                    share: 60,
                    default: true,
                    risk_level: 'low',
                    risk_score: 2.0,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Hong Kong', pod_code: 'HKHKG', days: 2, km: 900, cost: '$650-900' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Hong Kong', pod_code: 'HKHKG', days: 3, km: 1200, cost: '$900-1,200' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '3-5',
                    share: 10,
                    risk_level: 'medium',
                    risk_score: 4.5,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Hong Kong', pod_code: 'HKHKG', days: 3, km: 900, cost: '$70-100/m³' }
                    ]
                },
                {
                    value: 'road_ftl',
                    label: 'Đường Bộ — FTL',
                    days: '2-4',
                    share: 15,
                    risk_level: 'low',
                    risk_score: 3.0,
                    routes: [
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'Hong Kong (qua Shenzhen)', pod_code: 'HKG', days: 3, km: 1600, cost: '$1,000-1,400' }
                    ]
                },
                {
                    value: 'rail_container',
                    label: 'Đường Sắt — Container',
                    days: '2-4',
                    share: 10,
                    risk_level: 'low',
                    risk_score: 3.0,
                    routes: [
                        { pol: 'Yên Viên (Rail)', pol_code: 'YV', pod: 'Shenzhen', pod_code: 'SZN', days: 3, km: 2000, cost: '$800-1,200' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '2',
                    share: 5,
                    risk_level: 'very_low',
                    risk_score: 1.0,
                    routes: [
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Hong Kong (HKG)', pod_code: 'HKG', hours: 2, km: 1100, cost: '$3.0-5.0/kg' }
                    ]
                }
            ]
        },
        
        // ===== 7. VIETNAM → INDIA =====
        'vn_in': {
            name: 'Vietnam → India',
            name_vi: 'Việt Nam → Ấn Độ',
            flag: '🇻🇳 → 🇮🇳',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '7-14',
                    share: 95,
                    default: true,
                    risk_level: 'low',
                    risk_score: 3.0,
                    routes: [
                        { pol: 'Chu Lai', pol_code: 'CLA', pod: 'Chennai', pod_code: 'INMAA', days: 10, km: 4300, cost: '$1,300-1,800' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Mumbai', pod_code: 'INBOM', days: 12, km: 4700, cost: '$1,300-1,800' },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Kolkata', pod_code: 'INCCU', days: 8, km: 3800, cost: '$1,400-1,900' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '10-18',
                    share: 4,
                    risk_level: 'medium',
                    risk_score: 5.0,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Mumbai', pod_code: 'INBOM', days: 14, km: 4700, cost: '$120-170/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '5-7',
                    share: 1,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Delhi (DEL)', pod_code: 'DEL', hours: 5, km: 4000, cost: '$4.5-6.5/kg' },
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Mumbai (BOM)', pod_code: 'BOM', hours: 6, km: 4600, cost: '$4.8-6.8/kg' }
                    ]
                }
            ]
        },
        
        // ===== 8. VIETNAM → THAILAND =====
        'vn_th': {
            name: 'Vietnam → Thailand',
            name_vi: 'Việt Nam → Thái Lan',
            flag: '🇻🇳 → 🇹🇭',
            transport_modes: [
                {
                    value: 'road_ftl',
                    label: 'Đường Bộ — FTL',
                    hours: '16-36',
                    share: 60,
                    default: true,
                    risk_level: 'low',
                    risk_score: 3.5,
                    routes: [
                        { pol: 'TP.HCM', pol_code: 'SGN', pod: 'Bangkok (qua Mộc Bài)', pod_code: 'BKK', hours: 24, km: 900, cost: '$950-1,350' },
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'Bangkok (qua Lào)', pod_code: 'BKK', hours: 36, km: 1400, cost: '$1,100-1,500' }
                    ]
                },
                {
                    value: 'road_ltl',
                    label: 'Đường Bộ — LTL',
                    hours: '24-48',
                    share: 15,
                    risk_level: 'medium',
                    risk_score: 5.5,
                    routes: [
                        { pol: 'TP.HCM', pol_code: 'SGN', pod: 'Bangkok', pod_code: 'BKK', hours: 30, km: 900, cost: '$0.4-0.7/kg' }
                    ]
                },
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '5-8',
                    share: 20,
                    risk_level: 'low',
                    risk_score: 2.5,
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Laem Chabang', pod_code: 'THLCH', days: 6, km: 900, cost: '$850-1,200' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '1.5',
                    share: 5,
                    risk_level: 'very_low',
                    risk_score: 1.0,
                    routes: [
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Bangkok (BKK)', pod_code: 'BKK', hours: 1.5, km: 750, cost: '$2.5-4.5/kg' }
                    ]
                }
            ]
        },
        
        // ===== 9. VIETNAM → TAIWAN =====
        'vn_tw': {
            name: 'Vietnam → Taiwan',
            name_vi: 'Việt Nam → Đài Loan',
            flag: '🇻🇳 → 🇹🇼',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '2-5',
                    share: 85,
                    default: true,
                    risk_level: 'low',
                    risk_score: 2.0,
                    routes: [
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Kaohsiung', pod_code: 'TWKHH', days: 3, km: 1900, cost: '$950-1,300' },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Keelung', pod_code: 'TWKEL', days: 4, km: 2100, cost: '$1,300-1,700' },
                        { pol: 'Đà Nẵng', pol_code: 'DAD', pod: 'Taichung', pod_code: 'TWTXG', days: 3, km: 1800, cost: '$1,250-1,650' }
                    ]
                },
                {
                    value: 'ocean_lcl',
                    label: 'Đường Biển — LCL',
                    days: '4-7',
                    share: 5,
                    risk_level: 'medium',
                    risk_score: 4.5,
                    routes: [
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Kaohsiung', pod_code: 'TWKHH', days: 5, km: 1900, cost: '$90-130/m³' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '3-4',
                    share: 10,
                    risk_level: 'very_low',
                    risk_score: 1.5,
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Đào Viên (TPE)', pod_code: 'TPE', hours: 3, km: 1900, cost: '$3.5-5.5/kg' },
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Cao Hùng (KHH)', pod_code: 'KHH', hours: 3, km: 2000, cost: '$3.8-5.8/kg' }
                    ]
                }
            ]
        },
        
        // ===== 10. DOMESTIC (NỘI ĐỊA) =====
        'domestic': {
            name: 'Domestic Vietnam',
            name_vi: 'Nội Địa Việt Nam',
            flag: '🇻🇳 Nội Địa',
            transport_modes: [
                {
                    value: 'road_ftl',
                    label: 'Đường Bộ — FTL',
                    days: '1-3',
                    share: 85,
                    default: true,
                    risk_level: 'low',
                    risk_score: 3.0,
                    routes: [
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'TP. Hồ Chí Minh', pod_code: 'SGN', days: 2, km: 1700, cost: '$1,400-1,800' },
                        { pol: 'TP. Hồ Chí Minh', pol_code: 'SGN', pod: 'Đà Nẵng', pod_code: 'DAD', days: 1, km: 900, cost: '$700-1,000' },
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'Hải Phòng', pod_code: 'HPH', hours: 3, km: 120, cost: '$150-250' }
                    ]
                },
                {
                    value: 'road_ltl',
                    label: 'Đường Bộ — LTL',
                    days: '2-4',
                    share: 10,
                    risk_level: 'medium',
                    risk_score: 5.0,
                    routes: [
                        { pol: 'Hà Nội', pol_code: 'HAN', pod: 'TP. Hồ Chí Minh', pod_code: 'SGN', days: 3, km: 1700, cost: '$0.3-0.5/kg' }
                    ]
                },
                {
                    value: 'rail_container',
                    label: 'Đường Sắt — Container',
                    days: '2-4',
                    share: 3,
                    risk_level: 'low',
                    risk_score: 3.5,
                    routes: [
                        { pol: 'Hà Nội (Ga Yên Viên)', pol_code: 'YV', pod: 'TP.HCM (Ga Sài Gòn)', pod_code: 'SGN', days: 3, km: 1700, cost: '$1,100-1,500' }
                    ]
                },
                {
                    value: 'air_general',
                    label: 'Hàng Không — General',
                    hours: '2',
                    share: 2,
                    risk_level: 'very_low',
                    risk_score: 1.0,
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Tân Sơn Nhất (SGN)', pod_code: 'SGN', hours: 2, km: 1170, cost: '$2.0-4.0/kg' }
                    ]
                }
            ]
        }
    },
    
    /**
     * ========================================
     * PART 3: CARRIER DATA BY ROUTE
     * ========================================
     */
    carriersByRoute: {
        'vn_cn': [
            { name: 'Maersk', rating: 4.8, votes: 28420, color: '#10B981', note: 'Lịch ổn định 92%, tracking tốt, giá hợp lý; hơi nhiều phụ phí nếu tắc Shenzhen.', services: ['FCL', 'LCL', 'feeder'] },
            { name: 'MSC', rating: 4.6, votes: 31250, color: '#10B981', note: 'Nhiều chuyến, giá thấp, mạnh LCL; đôi lúc tắc Shanghai mùa cao điểm.', services: ['FCL', 'LCL'] },
            { name: 'COSCO/OOCL', rating: 4.5, votes: 26500, color: '#3B82F6', note: 'Giá tốt nhất, nối transit TQ mạnh; road-border đôi lúc chậm thủ tục.', services: ['FCL', 'bulk'] },
            { name: 'Evergreen', rating: 4.4, votes: 22340, color: '#3B82F6', note: 'Nhanh từ HPH/Ningbo, ổn định; phù hợp hàng điện tử.', services: ['FCL'] },
            { name: 'Wan Hai', rating: 4.3, votes: 6540, color: '#3B82F6', note: 'Rẻ, linh hoạt nội Á; ít slot mùa Tết.', services: ['FCL', 'LCL'] }
        ],
        'vn_us': [
            { name: 'Maersk', rating: 4.7, votes: 28420, color: '#10B981', note: 'On-time cao dù tắc cảng, tracking mạnh; Q4 thường +2–4 ngày.', services: ['FCL', 'LCL'] },
            { name: 'MSC', rating: 4.6, votes: 31250, color: '#10B981', note: 'Giá cạnh tranh, nhiều chuyến; thủ tục NY đôi lúc chậm.', services: ['FCL', 'LCL'] },
            { name: 'CMA CGM', rating: 4.5, votes: 18760, color: '#3B82F6', note: 'Nhanh từ Cái Mép, tốt hàng DG; ít phụ phí.', services: ['FCL', 'LCL'] },
            { name: 'ONE', rating: 4.4, votes: 15680, color: '#3B82F6', note: 'Ổn định, mạnh Seattle; tracking realtime tốt.', services: ['FCL'] },
            { name: 'Evergreen', rating: 4.3, votes: 22340, color: '#3B82F6', note: 'Giá hợp lý, phù hợp East Coast; LA đôi khi tắc.', services: ['FCL', 'LCL'] }
        ],
        'vn_kr': [
            { name: 'HMM', rating: 4.7, votes: 9870, color: '#10B981', note: 'Nhanh nhất (5 ngày), on-time 93%; tracking chính xác.', services: ['FCL', 'LCL'] },
            { name: 'Maersk', rating: 4.6, votes: 28420, color: '#10B981', note: 'Schedule tốt, ít delay; giá ổn định.', services: ['FCL'] },
            { name: 'Evergreen', rating: 4.5, votes: 22340, color: '#3B82F6', note: 'Giá rẻ, hợp Incheon; tốt cho điện tử.', services: ['FCL', 'LCL'] },
            { name: 'Yang Ming', rating: 4.4, votes: 8760, color: '#3B82F6', note: 'Cạnh tranh, nhưng ít chuyến từ Đà Nẵng.', services: ['FCL'] }
        ],
        'vn_jp': [
            { name: 'NYK', rating: 4.8, votes: 11200, color: '#10B981', note: 'On-time 94%, dịch vụ chuẩn Nhật; giá cao nhưng đáng.', services: ['FCL', 'LCL'] },
            { name: 'K Line', rating: 4.6, votes: 9800, color: '#10B981', note: 'Nhanh cho Kobe, ít hư hỏng; giá cao hơn mặt bằng.', services: ['FCL'] },
            { name: 'Maersk', rating: 4.5, votes: 28420, color: '#3B82F6', note: 'Rẻ hơn các hãng Nhật; tracking tốt.', services: ['FCL', 'LCL'] },
            { name: 'MOL', rating: 4.4, votes: 8900, color: '#3B82F6', note: 'Tốt cho Osaka; phụ phí hơi cao.', services: ['FCL'] }
        ],
        'vn_eu': [
            { name: 'Maersk', rating: 4.7, votes: 28420, color: '#10B981', note: 'Ổn dù reroute, tracking EU mạnh; đáng tin nhất tuyến EU.', services: ['FCL', 'LCL'] },
            { name: 'MSC', rating: 4.6, votes: 31250, color: '#10B981', note: 'Giá tốt, nhiều chuyến; Hamburg hay bị delay.', services: ['FCL'] },
            { name: 'CMA CGM', rating: 4.5, votes: 18760, color: '#3B82F6', note: 'Tốt cho reefer, on-time ổn định.', services: ['FCL', 'LCL'] },
            { name: 'Hapag-Lloyd', rating: 4.4, votes: 13450, color: '#3B82F6', note: 'Mạnh heavy cargo; Suez ảnh hưởng nhiều.', services: ['FCL'] }
        ],
        'vn_hk': [
            { name: 'OOCL', rating: 4.6, votes: 15200, color: '#10B981', note: 'Rất nhanh (2 ngày), on-time cao.', services: ['FCL', 'LCL'] },
            { name: 'Maersk', rating: 4.5, votes: 28420, color: '#3B82F6', note: 'Ổn định, tracking tốt; giá trung bình.', services: ['FCL'] },
            { name: 'COSCO/OOCL', rating: 4.4, votes: 26500, color: '#3B82F6', note: 'Rẻ nhất tuyến HK; phù hợp LCL.', services: ['FCL', 'LCL'] }
        ],
        'vn_in': [
            { name: 'Maersk', rating: 4.5, votes: 28420, color: '#3B82F6', note: 'Nhanh, ít delay; hợp Chennai.', services: ['FCL', 'LCL'] },
            { name: 'MSC', rating: 4.4, votes: 31250, color: '#3B82F6', note: 'Giá rẻ Mumbai; thủ tục Ấn hơi chậm.', services: ['FCL'] },
            { name: 'Evergreen', rating: 4.3, votes: 22340, color: '#3B82F6', note: 'Tốt cho Kolkata; mạnh hàng dệt.', services: ['FCL', 'LCL'] }
        ],
        'vn_th': [
            { name: 'RCL', rating: 4.6, votes: 3210, color: '#10B981', note: 'Rất nhanh, kết nối road linh hoạt.', services: ['FCL', 'LCL'] },
            { name: 'Maersk', rating: 4.5, votes: 28420, color: '#3B82F6', note: 'Tích hợp tốt vào Bangkok; giá ổn.', services: ['FCL'] },
            { name: 'Wan Hai', rating: 4.4, votes: 6540, color: '#3B82F6', note: 'Rẻ, phù hợp intra-Asia.', services: ['FCL', 'LCL'] }
        ],
        'vn_tw': [
            { name: 'Evergreen', rating: 4.7, votes: 22340, color: '#10B981', note: 'Nhanh nhất, on-time 93%; tracking chuẩn Taiwan.', services: ['FCL', 'LCL'] },
            { name: 'Yang Ming', rating: 4.6, votes: 8760, color: '#10B981', note: 'Ổn cho Taichung; mạnh hàng điện tử.', services: ['FCL'] },
            { name: 'Wan Hai', rating: 4.5, votes: 6540, color: '#3B82F6', note: 'Rẻ, ít delay; linh hoạt.', services: ['FCL', 'LCL'] }
        ],
        'domestic': [
            { name: 'ViettelPost', rating: 4.6, votes: 125000, color: '#10B981', note: 'Nhanh, mạng lưới rộng; ổn cho HN–SGN.', services: ['Road LTL', 'FTL'] },
            { name: 'Vietnam Airlines', rating: 4.5, votes: 45000, color: '#3B82F6', note: 'An toàn, đúng giờ; chi phí cao.', services: ['Air general'] },
            { name: 'Giao Hàng Nhanh (GHN)', rating: 4.4, votes: 89000, color: '#3B82F6', note: 'Tốt e-com, tracking app mạnh.', services: ['Road express'] },
            { name: 'Vietnam Railway', rating: 4.3, votes: 12000, color: '#3B82F6', note: 'Rẻ Bắc–Nam; hơi chậm.', services: ['Rail container'] }
        ]
    },
    
    /**
     * Get carriers for a specific route
     */
    getCarriersByRoute: function(routeKey) {
        return this.carriersByRoute[routeKey] || [];
    },
    
    /**
     * ========================================
     * PART 4: HELPER FUNCTIONS
     * ========================================
     */
    
    /**
     * Get all available routes
     */
    getAllRoutes: function() {
        return Object.keys(this.routes);
    },
    
    /**
     * Get route data by key
     */
    getRoute: function(routeKey) {
        return this.routes[routeKey] || null;
    },
    
    /**
     * Get transport modes for a route
     */
    getTransportModes: function(routeKey) {
        const route = this.getRoute(routeKey);
        return route ? route.transport_modes : [];
    },
    
    /**
     * Get risk level color
     */
    getRiskColor: function(riskLevel) {
        const colors = {
            'very_low': '#00ffc3',
            'low': '#3b82f6',
            'medium': '#fbbf24',
            'high': '#f87171',
            'very_high': '#ef4444'
        };
        return colors[riskLevel] || '#71717a';
    },
    
    /**
     * Get risk label in Vietnamese
     */
    getRiskLabel: function(riskLevel) {
        const labels = {
            'very_low': 'Rất Thấp',
            'low': 'Thấp',
            'medium': 'Trung Bình',
            'high': 'Cao',
            'very_high': 'Rất Cao'
        };
        return labels[riskLevel] || 'N/A';
    },
    
    /**
     * Calculate distance between ports
     */
    calculateDistance: function(polCode, podCode, routeKey) {
        const route = this.getRoute(routeKey);
        if (!route) return null;
        
        for (const mode of route.transport_modes) {
            if (mode.routes) {
                const matchingRoute = mode.routes.find(r => 
                    r.pol_code === polCode && r.pod_code === podCode
                );
                if (matchingRoute) return matchingRoute.km;
            }
        }
        return null;
    },
    
    /**
     * ========================================
     * PART 5: CONTAINER COMPATIBILITY SCORES
     * ========================================
     * Container Compatibility Score (0-10)
     */
    containerCompatibility: {
        // Hàng Hóa Thông Thường
        "thong_thuong": {
            "20ft": 9.8, "40ft": 10.0, "40hc": 9.9, "45hc": 9.5, 
            "reefer": 4.0, "opentop": 6.0, "flatrack": 5.0, 
            "isotank": 1.0, "bulk": 3.0
        },
        
        // Điện Tử
        "dien_tu": {
            "20ft": 10.0, "40ft": 9.8, "40hc": 9.9, "45hc": 9.7, 
            "reefer": 7.0, "opentop": 2.0, "flatrack": 3.0, 
            "isotank": 1.0, "bulk": 1.0
        },
        
        // Thực Phẩm & Đồ Uống (khô)
        "thuc_pham_do_uong": {
            "20ft": 9.5, "40ft": 10.0, "40hc": 9.8, "45hc": 9.0, 
            "reefer": 8.5, "opentop": 7.0, "flatrack": 4.0, 
            "isotank": 2.0, "bulk": 6.0
        },
        
        // May Mặc / Dệt May
        "may_mac_det_may": {
            "20ft": 8.0, "40ft": 9.0, "40hc": 10.0, "45hc": 9.8, 
            "reefer": 3.0, "opentop": 5.0, "flatrack": 6.0, 
            "isotank": 1.0, "bulk": 2.0
        },
        
        // Nông Sản
        "nong_san": {
            "20ft": 9.0, "40ft": 9.5, "40hc": 9.2, "45hc": 8.0, 
            "reefer": 6.0, "opentop": 8.5, "flatrack": 7.0, 
            "isotank": 1.0, "bulk": 9.0
        },
        
        // Hàng Lạnh / Đông Lạnh
        "hang_lanh_dong_lanh": {
            "20ft": 3.0, "40ft": 3.5, "40hc": 4.0, "45hc": 2.0, 
            "reefer": 10.0, "opentop": 1.0, "flatrack": 1.0, 
            "isotank": 2.0, "bulk": 1.0
        },
        
        // Hóa Chất (không DG)
        "hoa_chat": {
            "20ft": 7.0, "40ft": 8.0, "40hc": 7.5, "45hc": 6.0, 
            "reefer": 4.0, "opentop": 5.0, "flatrack": 6.0, 
            "isotank": 10.0, "bulk": 8.0
        },
        
        // Máy Móc Thiết Bị
        "may_moc_thiet_bi": {
            "20ft": 7.5, "40ft": 8.5, "40hc": 8.0, "45hc": 7.0, 
            "reefer": 2.0, "opentop": 9.5, "flatrack": 10.0, 
            "isotank": 1.0, "bulk": 3.0
        },
        
        // Hàng Dễ Vỡ
        "hang_de_vo": {
            "20ft": 9.8, "40ft": 9.5, "40hc": 9.0, "45hc": 8.0, 
            "reefer": 6.0, "opentop": 3.0, "flatrack": 4.0, 
            "isotank": 1.0, "bulk": 1.0
        },
        
        // Linh Kiện Ô Tô
        "linh_kien_o_to": {
            "20ft": 8.5, "40ft": 9.5, "40hc": 9.8, "45hc": 9.0, 
            "reefer": 3.0, "opentop": 7.0, "flatrack": 8.5, 
            "isotank": 1.0, "bulk": 2.0
        },
        
        // Hàng Nguy Hiểm (DG)
        "hang_nguy_hiem_dg": {
            "20ft": 8.0, "40ft": 8.5, "40hc": 8.0, "45hc": 6.0, 
            "reefer": 5.0, "opentop": 4.0, "flatrack": 7.0, 
            "isotank": 9.5, "bulk": 3.0
        },
        
        // Dược Phẩm
        "duoc_pham": {
            "20ft": 4.0, "40ft": 4.5, "40hc": 5.0, "45hc": 3.0, 
            "reefer": 10.0, "opentop": 1.0, "flatrack": 1.0, 
            "isotank": 2.0, "bulk": 1.0
        }
    },
    
    /**
     * ========================================
     * PART 6: CARRIER RATINGS BY ROUTE
     * ========================================
     */
    carrierRatings: {
        "vn_cn": [
            { name: "Maersk", rating: 4.8, ontime: 92, price: "$950-1,300", note: "Schedule hàng tuần ổn định, giá cạnh tranh, tracking tốt" },
            { name: "MSC", rating: 4.6, ontime: 88, price: "$900-1,200", note: "Nhiều chuyến/tuần, giá thấp, mạnh LCL ghép" },
            { name: "COSCO", rating: 4.5, ontime: 90, price: "$800-1,100", note: "Rẻ nhất, tích hợp tốt với TQ transit" },
            { name: "Evergreen", rating: 4.4, ontime: 89, price: "$850-1,200", note: "Schedule từ HPH/Ningbo nhanh, ổn định" },
            { name: "Wan Hai", rating: 4.3, ontime: 85, price: "$700-1,000", note: "Giá địa phương rẻ, mạnh nội Á" }
        ],
        
        "vn_us": [
            { name: "Maersk", rating: 4.7, ontime: 90, price: "$4,800-6,200", note: "On-time 90% dù tắc LB, tracking AI tốt" },
            { name: "MSC", rating: 4.6, ontime: 87, price: "$4,700-6,000", note: "Giá cạnh tranh, nhiều chuyến/tuần" },
            { name: "CMA CGM", rating: 4.5, ontime: 88, price: "$4,800-6,100", note: "Mạnh direct từ CMP, nhanh cho hàng DG" },
            { name: "ONE", rating: 4.4, ontime: 89, price: "$4,900-6,200", note: "Ổn cho Seattle, tracking realtime" },
            { name: "Evergreen", rating: 4.3, ontime: 86, price: "$4,700-6,000", note: "Tốt cho East Coast" }
        ],
        
        "vn_kr": [
            { name: "HMM", rating: 4.7, ontime: 93, price: "$950-1,300", note: "Nhanh nhất (5 ngày), tracking Hàn chuẩn" },
            { name: "Maersk", rating: 4.6, ontime: 90, price: "$1,000-1,400", note: "Schedule hàng tuần, ổn định" },
            { name: "Evergreen", rating: 4.5, ontime: 88, price: "$950-1,300", note: "Giá rẻ, phù hợp hàng điện tử" },
            { name: "Yang Ming", rating: 4.4, ontime: 87, price: "$1,100-1,500", note: "Cạnh tranh nhưng ít chuyến từ DAD" }
        ],
        
        "vn_jp": [
            { name: "NYK", rating: 4.8, ontime: 94, price: "$1,400-1,800", note: "Chính xác, dịch vụ Nhật cao cấp" },
            { name: "K Line", rating: 4.6, ontime: 91, price: "$1,500-1,900", note: "Nhanh cho Kobe, ít hư hỏng" },
            { name: "Maersk", rating: 4.5, ontime: 89, price: "$1,400-1,800", note: "Rẻ hơn, tracking tốt" },
            { name: "MOL", rating: 4.4, ontime: 88, price: "$1,550-1,950", note: "Ổn cho Osaka" }
        ],
        
        "vn_eu": [
            { name: "Maersk", rating: 4.7, ontime: 88, price: "$6,500-8,200", note: "Đáng tin Rotterdam, tracking EU chuẩn" },
            { name: "MSC", rating: 4.6, ontime: 86, price: "$6,400-8,000", note: "Nhiều chuyến Antwerp" },
            { name: "CMA CGM", rating: 4.5, ontime: 87, price: "$6,500-8,200", note: "Mạnh Bremerhaven, tốt cho reefer" },
            { name: "Hapag-Lloyd", rating: 4.4, ontime: 85, price: "$6,600-8,400", note: "Chuyên heavy cargo" }
        ],
        
        "vn_hk": [
            { name: "OOCL", rating: 4.6, ontime: 92, price: "$650-900", note: "Nhanh 2 ngày, transit tốt" },
            { name: "Maersk", rating: 4.5, ontime: 90, price: "$700-950", note: "Ổn định, tracking realtime" },
            { name: "COSCO", rating: 4.4, ontime: 88, price: "$600-850", note: "Rẻ nhất, phù hợp LCL ghép" }
        ],
        
        "vn_in": [
            { name: "Maersk", rating: 4.5, ontime: 87, price: "$1,300-1,800", note: "Nhanh Chennai, ít delay" },
            { name: "MSC", rating: 4.4, ontime: 85, price: "$1,200-1,700", note: "Rẻ Mumbai" },
            { name: "Evergreen", rating: 4.3, ontime: 86, price: "$1,300-1,800", note: "Tốt cho Kolkata" }
        ],
        
        "vn_th": [
            { name: "RCL", rating: 4.6, ontime: 91, price: "$850-1,200", note: "Nhanh LCB, linh hoạt road" },
            { name: "Maersk", rating: 4.5, ontime: 89, price: "$900-1,300", note: "Tích hợp road BKK tốt" },
            { name: "Wan Hai", rating: 4.4, ontime: 87, price: "$800-1,100", note: "Mạnh intra-Asia" }
        ],
        
        "vn_tw": [
            { name: "Evergreen", rating: 4.7, ontime: 93, price: "$950-1,300", note: "Nhanh KHH, tracking Đài chuẩn" },
            { name: "Yang Ming", rating: 4.6, ontime: 90, price: "$1,000-1,400", note: "Ổn Taichung" },
            { name: "Wan Hai", rating: 4.5, ontime: 88, price: "$900-1,200", note: "Linh hoạt, ít delay" }
        ],
        
        "domestic_vn": [
            { name: "ViettelPost", rating: 4.6, ontime: 90, price: "$0.3-0.5/kg", note: "Mạng lưới rộng, nhanh HN-SGN" },
            { name: "Vietnam Airlines", rating: 4.5, ontime: 88, price: "$2-4/kg", note: "An toàn nhưng đắt" },
            { name: "GHN", rating: 4.4, ontime: 85, price: "$0.2-0.4/kg", note: "Tốt e-com, tracking app hay" },
            { name: "Vietnam Railway", rating: 4.3, ontime: 82, price: "$1,100-1,500", note: "Rẻ Bắc-Nam nhưng chậm" }
        ]
    },
    
    /**
     * ========================================
     * PART 7: CONTAINER TYPE DESCRIPTIONS
     * ========================================
     */
    containerDescriptions: {
        "20ft": "Container khô 20 feet tiêu chuẩn - phù hợp hàng nhỏ, hàng nặng, dễ xếp dỡ",
        "40ft": "Container khô 40 feet tiêu chuẩn - tối ưu chi phí/khối, phổ biến nhất",
        "40hc": "Container cao 40 feet - tối ưu cho hàng nhẹ, cồng kềnh (dệt may, nội thất)",
        "45hc": "Container cao 45 feet - thể tích lớn nhất, phù hợp hàng thể tích cao",
        "reefer": "Container lạnh - chỉ dùng cho hàng đông lạnh, dược phẩm (phụ phí cao)",
        "opentop": "Container nóc mở - dùng cho hàng quá cao hoặc cần cẩu từ trên xuống",
        "flatrack": "Flat rack - không thành bên, dùng cho máy móc, thiết bị quá khổ",
        "isotank": "Iso tank - container chứa chất lỏng (hóa chất, dầu mỡ)",
        "bulk": "Bulk carrier - vận chuyển rời (gạo, than, quặng) - không container"
    },
    
    /**
     * Get container compatibility score
     */
    getContainerCompatibility: function(cargoType, containerType) {
        if (!this.containerCompatibility[cargoType]) return 0;
        return this.containerCompatibility[cargoType][containerType] || 0;
    },
    
    /**
     * Get carrier ratings for a route
     */
    getCarrierRatings: function(routeKey) {
        return this.carrierRatings[routeKey] || [];
    },
    
    /**
     * Get container description
     */
    getContainerDescription: function(containerType) {
        return this.containerDescriptions[containerType] || "Không có mô tả";
    },
    
    /**
     * ========================================
     * MAPPING FUNCTIONS: HTML Values <-> Logistics Keys
     * ========================================
     */
    
    /**
     * Convert HTML cargo type value to logistics key
     * HTML: "general", "electronics", "food_bev", etc.
     * Logistics: "thong_thuong", "dien_tu", "thuc_pham_do_uong", etc.
     */
    mapCargoTypeFromHTML: function(htmlValue) {
        const mapping = {
            'general': 'thong_thuong',
            'electronics': 'dien_tu',
            'food_bev': 'thuc_pham_do_uong',
            'garments': 'may_mac_det_may',
            'agriculture': 'nong_san',
            'refrigerated': 'hang_lanh_dong_lanh',
            'chemicals': 'hoa_chat',
            'machinery': 'may_moc_thiet_bi',
            'fragile': 'hang_de_vo',
            'auto_parts': 'linh_kien_o_to',
            'dg': 'hang_nguy_hiem_dg',
            'pharma': 'duoc_pham'
        };
        return mapping[htmlValue] || htmlValue; // Return original if not found
    },
    
    /**
     * Convert HTML container type value to logistics key
     * HTML: "20ft_standard", "40ft_standard", "40ft_highcube", etc.
     * Logistics: "20ft", "40ft", "40hc", "45hc", etc.
     */
    mapContainerTypeFromHTML: function(htmlValue) {
        const mapping = {
            '20ft_standard': '20ft',
            '40ft_standard': '40ft',
            '40ft_highcube': '40hc',
            '45ft_highcube': '45hc',
            'reefer': 'reefer',
            'open_top': 'opentop',
            'flat_rack': 'flatrack',
            'iso_tank': 'isotank',
            'bulk_container': 'bulk',
            'palletized': '20ft', // Default to 20ft for palletized
            'wooden_crates': '20ft' // Default to 20ft for wooden crates
        };
        return mapping[htmlValue] || htmlValue; // Return original if not found
    },
    
    /**
     * Convert logistics cargo key to HTML value (reverse mapping)
     */
    mapCargoTypeToHTML: function(logisticsKey) {
        const mapping = {
            'thong_thuong': 'general',
            'dien_tu': 'electronics',
            'thuc_pham_do_uong': 'food_bev',
            'may_mac_det_may': 'garments',
            'nong_san': 'agriculture',
            'hang_lanh_dong_lanh': 'refrigerated',
            'hoa_chat': 'chemicals',
            'may_moc_thiet_bi': 'machinery',
            'hang_de_vo': 'fragile',
            'linh_kien_o_to': 'auto_parts',
            'hang_nguy_hiem_dg': 'dg',
            'duoc_pham': 'pharma'
        };
        return mapping[logisticsKey] || logisticsKey;
    },
    
    /**
     * Convert logistics container key to HTML value (reverse mapping)
     */
    mapContainerTypeToHTML: function(logisticsKey) {
        const mapping = {
            '20ft': '20ft_standard',
            '40ft': '40ft_standard',
            '40hc': '40ft_highcube',
            '45hc': '45ft_highcube',
            'reefer': 'reefer',
            'opentop': 'open_top',
            'flatrack': 'flat_rack',
            'isotank': 'iso_tank',
            'bulk': 'bulk_container'
        };
        return mapping[logisticsKey] || logisticsKey;
    },
    
    /**
     * Convert HTML route value to logistics key
     * HTML: "domestic" -> Logistics: "domestic_vn"
     */
    mapRouteFromHTML: function(htmlValue) {
        if (htmlValue === 'domestic') {
            return 'domestic_vn';
        }
        return htmlValue; // Most routes match directly
    },
    
    /**
     * Convert logistics route key to HTML value (reverse mapping)
     */
    mapRouteToHTML: function(logisticsKey) {
        if (logisticsKey === 'domestic_vn') {
            return 'domestic';
        }
        return logisticsKey;
    },
    
    /**
     * ========================================
     * DETAILED ROUTE OPTIONS BY TRADE ROUTE
     * ========================================
     * Chi tiết các tuyến vận chuyển cho từng tuyến đường thương mại
     */
    detailedRoutes: {
        'vn_cn': [
            {
                id: 'vn_cn_direct_sea',
                name: 'Direct Sea (Cái Mép → Shenzhen)',
                transitTime: '4–7',
                surcharge: '+$200–400/40\' (BAF)',
                climateRisk: 'Thấp (typhoon cuối mùa)',
                conflictRisk: 'Thấp',
                usagePercent: '60% (Maersk, COSCO)',
                note: 'Ổn định nhất, 50% volume FCL'
            },
            {
                id: 'vn_cn_road_border',
                name: 'Road Border (Lào Cai → Hà Khẩu)',
                transitTime: '1–3',
                surcharge: '+$100–300 (customs)',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '25% (trucks)',
                note: 'Nhanh cho hàng lẻ, tăng 20% do rail chậm'
            },
            {
                id: 'vn_cn_rail',
                name: 'Rail (Yên Viên → Nam Ninh)',
                transitTime: '2–5',
                surcharge: '+$150–250 (rail fee)',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '10% (China Railway)',
                note: 'Rẻ hơn biển 30%, tăng mạnh 2025'
            },
            {
                id: 'vn_cn_feeder_hk',
                name: 'Feeder via HK (Cái Mép → HK → Shanghai)',
                transitTime: '7–10',
                surcharge: '+$300–500 (transit)',
                climateRisk: 'Trung bình',
                conflictRisk: 'Thấp',
                usagePercent: '5% (OOCL)',
                note: 'Dùng khi direct full, ít dùng do tắc HK'
            }
        ],
        'vn_us': [
            {
                id: 'vn_us_west_coast',
                name: 'West Coast Direct (Cái Mép → LA/Long Beach)',
                transitTime: '18–22',
                surcharge: '+$1,500–2,500/40\' (PSS + BAF)',
                climateRisk: 'Cao (La Niña bão)',
                conflictRisk: 'Thấp',
                usagePercent: '70% (MSC, CMA)',
                note: '85% đi Pacific direct, tắc LA cao'
            },
            {
                id: 'vn_us_east_coast_panama',
                name: 'East Coast via Panama (Cái Mép → NY via Panama)',
                transitTime: '35–40',
                surcharge: '+$2,000–3,000 (Panama fee)',
                climateRisk: 'Trung bình',
                conflictRisk: 'Thấp',
                usagePercent: '20% (Maersk)',
                note: 'Tăng 10% do drought Panama, phụ phí +$40/TEU'
            },
            {
                id: 'vn_us_transpacific_feeder',
                name: 'Trans-Pacific Feeder (HPH → Shanghai → NY)',
                transitTime: '25–30',
                surcharge: '+$1,000–1,800 (transshipment)',
                climateRisk: 'Cao',
                conflictRisk: 'Thấp',
                usagePercent: '8% (COSCO)',
                note: 'Dùng khi direct full, reroute do trade war'
            },
            {
                id: 'vn_us_air',
                name: 'Air Express (SGN → LAX)',
                transitTime: '2–5',
                surcharge: '+$4.5–6.5/kg',
                climateRisk: 'Không',
                conflictRisk: 'Không',
                usagePercent: '2% (FedEx)',
                note: 'Chỉ cho high-value, tăng do tariffs'
            }
        ],
        'vn_kr': [
            {
                id: 'vn_kr_direct_sea',
                name: 'Direct Sea (Cái Mép → Busan)',
                transitTime: '4–6',
                surcharge: '+$200–400/40\' (BAF)',
                climateRisk: 'Trung bình (typhoon)',
                conflictRisk: 'Thấp',
                usagePercent: '85% (HMM, Evergreen)',
                note: '90% direct, ổn định cao'
            },
            {
                id: 'vn_kr_feeder_hk',
                name: 'Feeder via HK (HPH → HK → Incheon)',
                transitTime: '6–8',
                surcharge: '+$300–500 (transit)',
                climateRisk: 'Trung bình',
                conflictRisk: 'Thấp',
                usagePercent: '10% (OOCL)',
                note: 'Dùng khi direct full, ít tắc'
            },
            {
                id: 'vn_kr_air',
                name: 'Air (HAN → ICN)',
                transitTime: '1–2',
                surcharge: '+$3.5–5.5/kg',
                climateRisk: 'Không',
                conflictRisk: 'Không',
                usagePercent: '5% (Korean Air)',
                note: 'Cho electronics, tăng 15% 2025'
            }
        ],
        'vn_jp': [
            {
                id: 'vn_jp_direct_sea',
                name: 'Direct Sea (Cái Mép → Yokohama)',
                transitTime: '7–10',
                surcharge: '+$300–500/40\' (BAF)',
                climateRisk: 'Cao (typhoon cuối mùa)',
                conflictRisk: 'Thấp',
                usagePercent: '80% (NYK, MOL)',
                note: '95% direct, ít biến động'
            },
            {
                id: 'vn_jp_feeder_busan',
                name: 'Feeder via Busan (HPH → Busan → Osaka)',
                transitTime: '9–12',
                surcharge: '+$400–600 (transit)',
                climateRisk: 'Cao',
                conflictRisk: 'Thấp',
                usagePercent: '15% (Evergreen)',
                note: 'Dùng cho volume nhỏ, ổn định'
            },
            {
                id: 'vn_jp_air',
                name: 'Air (SGN → NRT)',
                transitTime: '1–2',
                surcharge: '+$4.0–6.0/kg',
                climateRisk: 'Không',
                conflictRisk: 'Không',
                usagePercent: '5% (Vietnam Airlines)',
                note: 'Cho pharma/high-value'
            }
        ],
        'vn_eu': [
            {
                id: 'vn_eu_cape_good_hope',
                name: 'Cape of Good Hope (qua Nam Phi)',
                transitTime: '42–48',
                surcharge: '+$2,200–3,800/40\'',
                climateRisk: 'Thấp',
                conflictRisk: 'Không',
                usagePercent: '75% (Maersk, MSC, CMA)',
                note: 'An toàn nhất, chậm nhất, chiếm đa số do Red Sea'
            },
            {
                id: 'vn_eu_red_sea_suez',
                name: 'Red Sea + Suez (trực tiếp)',
                transitTime: '32–38',
                surcharge: '+$800–1,500 + war risk',
                climateRisk: 'Trung bình',
                conflictRisk: 'Rất cao (Houthi)',
                usagePercent: '5% (ZIM)',
                note: 'Gần như đóng cửa, rủi ro cao'
            },
            {
                id: 'vn_eu_trans_siberia',
                name: 'Trans-Siberia Rail (VN–TQ–EU)',
                transitTime: '18–25',
                surcharge: '$4,800–6,500/40\'',
                climateRisk: 'Thấp',
                conflictRisk: 'Trung bình (Ukraine)',
                usagePercent: '8%',
                note: 'Tăng mạnh 2025, rẻ hơn biển'
            },
            {
                id: 'vn_eu_hybrid_sea_rail',
                name: 'Hybrid Sea+Rail (Cái Mép → TQ → Rail)',
                transitTime: '28–35',
                surcharge: '$5,500–7,200',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '10% (Evergreen, ONE)',
                note: 'Đang hot, cân bằng'
            },
            {
                id: 'vn_eu_air',
                name: 'Air (SGN → AMS/FRA)',
                transitTime: '1–2',
                surcharge: '$6.5–9.0/kg',
                climateRisk: 'Không',
                conflictRisk: 'Không',
                usagePercent: '2%',
                note: 'Chỉ cho sample/pharma'
            }
        ],
        'vn_hk': [
            {
                id: 'vn_hk_direct_feeder',
                name: 'Direct Feeder (Cái Mép → HK)',
                transitTime: '1–3',
                surcharge: '+$100–200/40\' (BAF)',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '70% (OOCL, Maersk)',
                note: 'Siêu nhanh, ổn định'
            },
            {
                id: 'vn_hk_via_shenzhen',
                name: 'Via Shenzhen (HPH → Shenzhen → HK)',
                transitTime: '3–5',
                surcharge: '+$200–300 (transit)',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '20% (COSCO)',
                note: 'Dùng khi direct full'
            },
            {
                id: 'vn_hk_road_rail',
                name: 'Road/Rail (HAN → HK via Shenzhen)',
                transitTime: '2–4',
                surcharge: '+$150–250',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '10%',
                note: 'Cho hàng lẻ, linh hoạt'
            }
        ],
        'vn_in': [
            {
                id: 'vn_in_direct_sea',
                name: 'Direct Sea (Cái Mép → Mumbai)',
                transitTime: '10–14',
                surcharge: '+$500–800/40\' (BAF)',
                climateRisk: 'Trung bình (monsoon)',
                conflictRisk: 'Thấp',
                usagePercent: '80% (Maersk, MSC)',
                note: 'Ổn định, tăng 10% do trade war'
            },
            {
                id: 'vn_in_via_singapore',
                name: 'Via Singapore (HPH → Singapore → Chennai)',
                transitTime: '12–16',
                surcharge: '+$600–900 (transit)',
                climateRisk: 'Trung bình',
                conflictRisk: 'Thấp',
                usagePercent: '15% (Evergreen)',
                note: 'Dùng khi direct tắc'
            },
            {
                id: 'vn_in_air',
                name: 'Air (SGN → BOM)',
                transitTime: '1–2',
                surcharge: '$4.5–6.5/kg',
                climateRisk: 'Không',
                conflictRisk: 'Không',
                usagePercent: '5%',
                note: 'Cho high-value'
            }
        ],
        'vn_th': [
            {
                id: 'vn_th_road',
                name: 'Road (SGN → Bangkok via Mộc Bài)',
                transitTime: '1–2',
                surcharge: '+$100–200 (customs)',
                climateRisk: 'Thấp (mưa mùa)',
                conflictRisk: 'Thấp',
                usagePercent: '65% (trucks)',
                note: 'Nhanh nhất, 80% volume'
            },
            {
                id: 'vn_th_sea',
                name: 'Sea (Cái Mép → Laem Chabang)',
                transitTime: '5–8',
                surcharge: '+$300–500/40\'',
                climateRisk: 'Thấp',
                conflictRisk: 'Thấp',
                usagePercent: '30% (RCL, Wan Hai)',
                note: 'Dùng cho container lớn'
            },
            {
                id: 'vn_th_air',
                name: 'Air (SGN → BKK)',
                transitTime: '1 giờ',
                surcharge: '$2.5–4.5/kg',
                climateRisk: 'Không',
                conflictRisk: 'Không',
                usagePercent: '5%',
                note: 'Cho urgent'
            }
        ],
        'vn_tw': [
            {
                id: 'vn_tw_direct_sea',
                name: 'Direct Sea (HPH → Kaohsiung)',
                transitTime: '2–5',
                surcharge: '+$200–400/40\' (BAF)',
                climateRisk: 'Trung bình (typhoon)',
                conflictRisk: 'Cao (Taiwan Strait)',
                usagePercent: '85% (Evergreen, Yang Ming)',
                note: '90% direct, rủi ro cao do tension'
            },
            {
                id: 'vn_tw_feeder_hk',
                name: 'Feeder via HK (Cái Mép → HK → Keelung)',
                transitTime: '4–6',
                surcharge: '+$300–500',
                climateRisk: 'Trung bình',
                conflictRisk: 'Cao',
                usagePercent: '10% (OOCL)',
                note: 'Dùng khi direct full'
            },
            {
                id: 'vn_tw_air',
                name: 'Air (HAN → TPE)',
                transitTime: '1–2',
                surcharge: '$3.5–5.5/kg',
                climateRisk: 'Không',
                conflictRisk: 'Cao',
                usagePercent: '5%',
                note: 'Tăng do war risk Strait'
            }
        ],
        'domestic': [
            {
                id: 'domestic_road',
                name: 'Road HN → SGN',
                transitTime: '2–3',
                surcharge: '+$100–200 (tolls)',
                climateRisk: 'Thấp (mưa miền Trung)',
                conflictRisk: 'Không',
                usagePercent: '80% (trucks)',
                note: 'Phổ biến nhất, tắc cao tốc'
            },
            {
                id: 'domestic_rail',
                name: 'Rail Yên Viên → SGN',
                transitTime: '3–4',
                surcharge: '+$150–250 (rail fee)',
                climateRisk: 'Thấp',
                conflictRisk: 'Không',
                usagePercent: '15%',
                note: 'Rẻ hơn road 20%, tăng 10% 2025'
            },
            {
                id: 'domestic_sea',
                name: 'Sea Nội Địa (HPH → Cái Mép)',
                transitTime: '5–7',
                surcharge: '+$300–500/40\'',
                climateRisk: 'Thấp',
                conflictRisk: 'Không',
                usagePercent: '5%',
                note: 'Dùng cho bulk, ít tắc'
            }
        ]
    },
    
    /**
     * Get detailed routes for a trade route
     */
    getDetailedRoutes: function(tradeRouteKey) {
        // Map HTML route to logistics key
        const logisticsKey = this.mapRouteFromHTML(tradeRouteKey);
        return this.detailedRoutes[logisticsKey] || this.detailedRoutes[tradeRouteKey] || [];
    }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.LOGISTICS_DATA = LOGISTICS_DATA;
    console.log('✅ LOGISTICS_DATA loaded successfully');
    console.log(`   - ${Object.keys(LOGISTICS_DATA.routes).length} routes available`);
    console.log(`   - ${Object.keys(LOGISTICS_DATA.transportModeTypes).length} transport mode categories`);
}
