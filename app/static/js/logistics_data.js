/**
 * ============================================================
 * LOGISTICS DATA - RISKCAST v12.5
 * ============================================================
 * 
 * Chứa toàn bộ dữ liệu logistics thực tế từ Việt Nam:
 * - Routes (tuyến đường)
 * - Ports (cảng biển)
 * - Transit times (thời gian vận chuyển)
 * - Market share data (thị phần)
 * - Distance data (khoảng cách)
 * 
 * Data được thu thập từ các nguồn:
 * - Vietnam Logistics Association
 * - Port authorities
 * - Shipping lines (Maersk, MSC, CMA CGM)
 * - Industry reports 2024-2025
 * ============================================================
 */

const LOGISTICS_DATA = {
    /**
     * ROUTES DATA - Tuyến đường và phương thức vận tải
     * Key format: "seller_country_buyer_country"
     */
    routes: {
        // VIETNAM → UNITED STATES
        'vn_us': {
            name: 'Vietnam → United States',
            name_vi: 'Việt Nam → Hoa Kỳ',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    label_en: 'Ocean Freight — FCL',
                    days: '15-45',
                    share: 96,
                    default: true,
                    description: 'Phương thức phổ biến nhất, chiếm 96% thị phần',
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Long Beach', pod_code: 'USLGB', days: 18, km: 12600 },
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'New York', pod_code: 'USNYC', days: 35, km: 15600 }
                    ]
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    label_en: 'Air Freight',
                    hours: '16-22',
                    share: 4,
                    default: false,
                    description: 'Nhanh nhưng chi phí cao, phù hợp hàng giá trị cao',
                    routes: [
                        { pol: 'Tân Sơn Nhất (SGN)', pol_code: 'SGN', pod: 'Los Angeles (LAX)', pod_code: 'LAX', hours: 16, km: 12400 },
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'JFK New York', pod_code: 'JFK', hours: 20, km: 14800 }
                    ]
                }
            ],
            distance_km: 15200
        },

        // VIETNAM → CHINA
        'vn_cn': {
            name: 'Vietnam → China',
            name_vi: 'Việt Nam → Trung Quốc',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '4-10',
                    share: 65,
                    default: true,
                    description: 'Phổ biến cho hàng hóa số lượng lớn',
                    routes: [
                        { pol: 'Cái Mép - Thị Vải', pol_code: 'CMP', pod: 'Shenzhen', pod_code: 'CNSZN', days: 7, km: 1200 },
                        { pol: 'Hải Phòng', pol_code: 'HPH', pod: 'Shanghai', pod_code: 'CNSHA', days: 10, km: 2400 }
                    ]
                },
                {
                    value: 'road_truck',
                    label: 'Đường Bộ — Xe Tải',
                    days: '1-5',
                    share: 20,
                    default: false,
                    description: 'Nhanh, phù hợp hàng nhỏ lẻ',
                    routes: [
                        { pol: 'Hữu Nghị', pol_code: 'HN', pod: 'Nam Ninh', pod_code: 'NN', days: 2, km: 450 },
                        { pol: 'Móng Cái', pol_code: 'MC', pod: 'Đông Hưng', pod_code: 'DH', days: 1, km: 220 }
                    ]
                },
                {
                    value: 'rail_freight',
                    label: 'Đường Sắt',
                    days: '2-5',
                    share: 10,
                    default: false,
                    routes: [
                        { pol: 'Yên Viên', pol_code: 'YV', pod: 'Nam Ninh', pod_code: 'NN', days: 3, km: 2100 }
                    ]
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '2-5',
                    share: 5,
                    default: false,
                    description: 'Rất nhanh, phù hợp hàng khẩn cấp',
                    routes: [
                        { pol: 'Nội Bài (HAN)', pol_code: 'HAN', pod: 'Quảng Châu (CAN)', pod_code: 'CAN', hours: 2, km: 1800 }
                    ]
                }
            ],
            distance_km: 1200,
            common_routes: [
                {
                    pol: 'Hải Phòng',
                    pol_code: 'HPH',
                    pod: 'Shenzhen',
                    pod_code: 'CNSZN',
                    days: 7,
                    distance_km: 1200
                },
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Shanghai',
                    pod_code: 'CNSHA',
                    days: 10,
                    distance_km: 1800
                },
                {
                    pol: 'Sài Gòn',
                    pol_code: 'SGN',
                    pod: 'Guangzhou',
                    pod_code: 'CNCAN',
                    days: 5,
                    distance_km: 1100
                }
            ]
        },

        // VIETNAM → SOUTH KOREA
        'vn_kr': {
            name: 'Vietnam → South Korea',
            name_vi: 'Việt Nam → Hàn Quốc',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '4-7',
                    share: 88,
                    default: true,
                    description: 'Chiếm 85-90% thị phần, rất phổ biến'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '4-5',
                    share: 12,
                    default: false,
                    description: 'Nhanh, phù hợp hàng điện tử'
                }
            ],
            distance_km: 3300,
            common_routes: [
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Busan',
                    pod_code: 'KRPUS',
                    days: 6,
                    distance_km: 3300
                },
                {
                    pol: 'Hải Phòng',
                    pol_code: 'HPH',
                    pod: 'Incheon',
                    pod_code: 'KRINC',
                    days: 5,
                    distance_km: 3100
                }
            ]
        },

        // VIETNAM → JAPAN
        'vn_jp': {
            name: 'Vietnam → Japan',
            name_vi: 'Việt Nam → Nhật Bản',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '7-12',
                    share: 93,
                    default: true,
                    description: 'Chiếm 93% thị phần, tuyến đường ổn định'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '5-7',
                    share: 7,
                    default: false,
                    description: 'Nhanh, phù hợp hàng giá trị cao'
                }
            ],
            distance_km: 4400,
            common_routes: [
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Yokohama',
                    pod_code: 'JPYOK',
                    days: 10,
                    distance_km: 4400
                },
                {
                    pol: 'Hải Phòng',
                    pol_code: 'HPH',
                    pod: 'Osaka',
                    pod_code: 'JPOSA',
                    days: 8,
                    distance_km: 4200
                },
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Tokyo',
                    pod_code: 'JPTYO',
                    days: 9,
                    distance_km: 4500
                }
            ]
        },

        // VIETNAM → EU (NETHERLANDS/GERMANY)
        'vn_eu': {
            name: 'Vietnam → Europe',
            name_vi: 'Việt Nam → Châu Âu',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '32-38',
                    share: 98,
                    default: true,
                    description: 'Chiếm 98% thị phần, tuyến đường chính'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '14-16',
                    share: 1.5,
                    default: false,
                    description: 'Rất nhanh nhưng chi phí rất cao'
                },
                {
                    value: 'rail_freight',
                    label: 'Đường Sắt (mới 2025)',
                    days: '18-25',
                    share: 0.5,
                    default: false,
                    description: 'Tuyến đường sắt xuyên Á mới, đang phát triển'
                }
            ],
            distance_km: 15800,
            common_routes: [
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Rotterdam',
                    pod_code: 'NLRTM',
                    days: 35,
                    distance_km: 15800
                },
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Hamburg',
                    pod_code: 'DEHAM',
                    days: 36,
                    distance_km: 16200
                },
                {
                    pol: 'Hải Phòng',
                    pol_code: 'HPH',
                    pod: 'Bremerhaven',
                    pod_code: 'DEBRV',
                    days: 38,
                    distance_km: 16500
                }
            ]
        },

        // VIETNAM → HONG KONG
        'vn_hk': {
            name: 'Vietnam → Hong Kong',
            name_vi: 'Việt Nam → Hồng Kông',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '1-3',
                    share: 70,
                    default: true,
                    description: 'Rất gần, thời gian ngắn'
                },
                {
                    value: 'road_truck',
                    label: 'Đường Bộ — Xe Tải',
                    days: '2-4',
                    share: 15,
                    default: false,
                    description: 'Qua biên giới Trung Quốc'
                },
                {
                    value: 'rail_freight',
                    label: 'Đường Sắt',
                    days: '2-4',
                    share: 10,
                    default: false,
                    description: 'Tuyến đường sắt qua Trung Quốc'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '2',
                    share: 5,
                    default: false,
                    description: 'Rất nhanh, chỉ 2 giờ'
                }
            ],
            distance_km: 900,
            common_routes: [
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Hong Kong',
                    pod_code: 'HKHKG',
                    days: 2,
                    distance_km: 900
                }
            ]
        },

        // VIETNAM → INDIA
        'vn_in': {
            name: 'Vietnam → India',
            name_vi: 'Việt Nam → Ấn Độ',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '7-14',
                    share: 100,
                    default: true,
                    description: 'Chiếm 100% thị phần, không có lựa chọn khác'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '5-7',
                    share: 0,
                    default: false,
                    description: 'Rất ít sử dụng do chi phí cao'
                }
            ],
            distance_km: 4300,
            common_routes: [
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Chennai',
                    pod_code: 'INMAA',
                    days: 10,
                    distance_km: 4300
                },
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Mumbai',
                    pod_code: 'INBOM',
                    days: 12,
                    distance_km: 4500
                }
            ]
        },

        // VIETNAM → THAILAND
        'vn_th': {
            name: 'Vietnam → Thailand',
            name_vi: 'Việt Nam → Thái Lan',
            transport_modes: [
                {
                    value: 'road_truck',
                    label: 'Đường Bộ — Xe Tải',
                    hours: '16-36',
                    share: 75,
                    default: true,
                    description: 'Rất phổ biến, qua biên giới Lào/Campuchia'
                },
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '5-8',
                    share: 20,
                    default: false,
                    description: 'Qua vịnh Thái Lan'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '1.5',
                    share: 5,
                    default: false,
                    description: 'Rất nhanh, chỉ 1.5 giờ'
                }
            ],
            distance_km: 900,
            common_routes: [
                {
                    pol: 'Sài Gòn',
                    pol_code: 'SGN',
                    pod: 'Laem Chabang',
                    pod_code: 'THLCH',
                    days: 6,
                    distance_km: 900
                },
                {
                    pol: 'Hải Phòng',
                    pol_code: 'HPH',
                    pod: 'Bangkok (Road)',
                    pod_code: 'THBKK',
                    hours: 24,
                    distance_km: 1200
                }
            ]
        },

        // VIETNAM → TAIWAN
        'vn_tw': {
            name: 'Vietnam → Taiwan',
            name_vi: 'Việt Nam → Đài Loan',
            transport_modes: [
                {
                    value: 'ocean_fcl',
                    label: 'Đường Biển — FCL',
                    days: '2-5',
                    share: 90,
                    default: true,
                    description: 'Phổ biến nhất, tuyến đường ngắn'
                },
                {
                    value: 'air_freight',
                    label: 'Hàng Không',
                    hours: '3-4',
                    share: 10,
                    default: false,
                    description: 'Nhanh, phù hợp hàng giá trị cao'
                }
            ],
            distance_km: 1900,
            common_routes: [
                {
                    pol: 'Cái Mép - Thị Vải',
                    pol_code: 'CMP',
                    pod: 'Kaohsiung',
                    pod_code: 'TWKHH',
                    days: 3,
                    distance_km: 1900
                }
            ]
        },

        // DOMESTIC (Nội địa)
        'domestic': {
            name: 'Domestic',
            name_vi: 'Nội Địa',
            transport_modes: [
                {
                    value: 'road_truck',
                    label: 'Đường Bộ — Xe Tải',
                    days: '1-3',
                    share: 95,
                    default: true,
                    description: 'Phương thức chính cho vận tải nội địa'
                },
                {
                    value: 'rail_freight',
                    label: 'Đường Sắt',
                    days: '2-4',
                    share: 5,
                    default: false,
                    description: 'Phù hợp hàng số lượng lớn'
                }
            ],
            distance_km: 1200,
            common_routes: [
                {
                    pol: 'Hà Nội',
                    pol_code: 'HAN',
                    pod: 'TP. Hồ Chí Minh',
                    pod_code: 'SGN',
                    days: 2,
                    distance_km: 1700
                },
                {
                    pol: 'TP. Hồ Chí Minh',
                    pol_code: 'SGN',
                    pod: 'Đà Nẵng',
                    pod_code: 'DAD',
                    days: 1,
                    distance_km: 900
                }
            ]
        }
    },

    /**
     * PORTS DATA - Danh sách cảng biển
     * Phân loại theo quốc gia và loại cảng
     */
    ports: {
        // Cảng Việt Nam (POL - Port of Loading)
        vn: [
            {
                code: 'CMP',
                name: 'Cái Mép - Thị Vải',
                name_en: 'Cai Mep - Thi Vai',
                type: 'sea',
                location: 'Bà Rịa - Vũng Tàu',
                description: 'Cảng lớn nhất Việt Nam, xử lý 70% hàng xuất khẩu',
                icon: '🚢'
            },
            {
                code: 'HPH',
                name: 'Hải Phòng',
                name_en: 'Hai Phong',
                type: 'sea',
                location: 'Miền Bắc',
                description: 'Cảng chính miền Bắc, phục vụ khu vực Hà Nội',
                icon: '🚢'
            },
            {
                code: 'SGN',
                name: 'Sài Gòn',
                name_en: 'Saigon',
                type: 'sea',
                location: 'TP. Hồ Chí Minh',
                description: 'Cảng nội địa, phục vụ khu vực phía Nam',
                icon: '🚢'
            },
            {
                code: 'DAD',
                name: 'Chu Lai',
                name_en: 'Chu Lai',
                type: 'sea',
                location: 'Quảng Nam',
                description: 'Cảng miền Trung, đang phát triển',
                icon: '🚢'
            }
        ],

        // Cảng Trung Quốc (POD - Port of Discharge)
        cn: [
            {
                code: 'CNSZN',
                name: 'Shenzhen',
                name_en: 'Shenzhen',
                type: 'sea',
                location: 'Guangdong',
                description: 'Cảng lớn nhất thế giới, xử lý 30 triệu TEU/năm',
                icon: '🚢'
            },
            {
                code: 'CNSHA',
                name: 'Shanghai',
                name_en: 'Shanghai',
                type: 'sea',
                location: 'Shanghai',
                description: 'Cảng lớn thứ 2 thế giới',
                icon: '🚢'
            },
            {
                code: 'CNCAN',
                name: 'Guangzhou',
                name_en: 'Guangzhou',
                type: 'sea',
                location: 'Guangdong',
                description: 'Cảng chính vùng Pearl River Delta',
                icon: '🚢'
            },
            {
                code: 'CNHKG',
                name: 'Hong Kong',
                name_en: 'Hong Kong',
                type: 'sea',
                location: 'Hong Kong',
                description: 'Trung tâm logistics châu Á',
                icon: '🚢'
            }
        ],

        // Cảng Mỹ
        us: [
            {
                code: 'USLGB',
                name: 'Long Beach',
                name_en: 'Long Beach',
                type: 'sea',
                location: 'California (West Coast)',
                description: 'Cảng lớn nhất bờ Tây, xử lý 40% hàng từ châu Á',
                icon: '🚢'
            },
            {
                code: 'USNYC',
                name: 'New York',
                name_en: 'New York',
                type: 'sea',
                location: 'New York (East Coast)',
                description: 'Cảng lớn nhất bờ Đông',
                icon: '🚢'
            },
            {
                code: 'USLAX',
                name: 'Los Angeles',
                name_en: 'Los Angeles',
                type: 'airport',
                location: 'California',
                description: 'Sân bay lớn nhất cho hàng không',
                icon: '✈️'
            }
        ],

        // Cảng Hàn Quốc
        kr: [
            {
                code: 'KRPUS',
                name: 'Busan',
                name_en: 'Busan',
                type: 'sea',
                location: 'Busan',
                description: 'Cảng lớn nhất Hàn Quốc, top 5 thế giới',
                icon: '🚢'
            },
            {
                code: 'KRINC',
                name: 'Incheon',
                name_en: 'Incheon',
                type: 'sea',
                location: 'Incheon',
                description: 'Cảng phục vụ khu vực Seoul',
                icon: '🚢'
            }
        ],

        // Cảng Nhật Bản
        jp: [
            {
                code: 'JPYOK',
                name: 'Yokohama',
                name_en: 'Yokohama',
                type: 'sea',
                location: 'Tokyo Bay',
                description: 'Cảng chính vùng Tokyo',
                icon: '🚢'
            },
            {
                code: 'JPOSA',
                name: 'Osaka',
                name_en: 'Osaka',
                type: 'sea',
                location: 'Osaka',
                description: 'Cảng lớn thứ 2 Nhật Bản',
                icon: '🚢'
            },
            {
                code: 'JPTYO',
                name: 'Tokyo',
                name_en: 'Tokyo',
                type: 'sea',
                location: 'Tokyo',
                description: 'Cảng thủ đô',
                icon: '🚢'
            }
        ],

        // Cảng EU
        eu: [
            {
                code: 'NLRTM',
                name: 'Rotterdam',
                name_en: 'Rotterdam',
                type: 'sea',
                location: 'Netherlands',
                description: 'Cảng lớn nhất châu Âu',
                icon: '🚢'
            },
            {
                code: 'DEHAM',
                name: 'Hamburg',
                name_en: 'Hamburg',
                type: 'sea',
                location: 'Germany',
                description: 'Cảng lớn nhất Đức',
                icon: '🚢'
            },
            {
                code: 'DEBRV',
                name: 'Bremerhaven',
                name_en: 'Bremerhaven',
                type: 'sea',
                location: 'Germany',
                description: 'Cảng chính miền Bắc Đức',
                icon: '🚢'
            }
        ],

        // Cảng Ấn Độ
        in: [
            {
                code: 'INMAA',
                name: 'Chennai',
                name_en: 'Chennai',
                type: 'sea',
                location: 'Tamil Nadu',
                description: 'Cảng chính miền Nam Ấn Độ',
                icon: '🚢'
            },
            {
                code: 'INBOM',
                name: 'Mumbai',
                name_en: 'Mumbai',
                type: 'sea',
                location: 'Maharashtra',
                description: 'Cảng lớn nhất Ấn Độ',
                icon: '🚢'
            }
        ],

        // Cảng Thái Lan
        th: [
            {
                code: 'THLCH',
                name: 'Laem Chabang',
                name_en: 'Laem Chabang',
                type: 'sea',
                location: 'Bangkok',
                description: 'Cảng lớn nhất Thái Lan',
                icon: '🚢'
            }
        ],

        // Cảng Đài Loan
        tw: [
            {
                code: 'TWKHH',
                name: 'Kaohsiung',
                name_en: 'Kaohsiung',
                type: 'sea',
                location: 'Kaohsiung',
                description: 'Cảng lớn nhất Đài Loan',
                icon: '🚢'
            }
        ]
    },

    /**
     * CONTAINER RECOMMENDATIONS - Gợi ý container theo loại hàng
     */
    container_recommendations: {
        electronics: {
            recommended: '40ft_highcube',
            reason: 'Phù hợp 95% với hàng điện tử, tận dụng không gian tốt',
            alternatives: ['40ft_standard', '45ft_highcube']
        },
        refrigerated: {
            recommended: 'reefer',
            reason: 'Yêu cầu điện lạnh liên tục, nhiệt độ kiểm soát',
            warning: '⚠️ Yêu cầu điện lạnh liên tục, chi phí cao hơn 30-40%',
            alternatives: []
        },
        machinery: {
            recommended: 'flat_rack',
            reason: 'Phù hợp cho máy móc cồng kềnh, dễ xếp dỡ',
            alternatives: ['open_top', '40ft_standard']
        },
        garments: {
            recommended: '40ft_standard',
            reason: 'Phù hợp 90% với hàng may mặc, dễ đóng gói',
            alternatives: ['20ft_standard', '40ft_highcube']
        },
        food_bev: {
            recommended: 'reefer',
            reason: 'Yêu cầu nhiệt độ kiểm soát',
            warning: '⚠️ Cần chứng nhận vệ sinh an toàn thực phẩm',
            alternatives: ['40ft_standard']
        },
        chemicals: {
            recommended: 'iso_tank',
            reason: 'Chuyên dụng cho hóa chất lỏng',
            warning: '⚠️ Yêu cầu giấy phép đặc biệt (MSDS, IMO)',
            alternatives: ['20ft_standard']
        },
        dg: {
            recommended: '20ft_standard',
            reason: 'Hàng nguy hiểm, yêu cầu container chuyên dụng',
            warning: '⚠️ Yêu cầu giấy phép đặc biệt (MSDS, IMO, UN Classification)',
            alternatives: []
        }
    },

    /**
     * INCOTERM RECOMMENDATIONS - Gợi ý Incoterm theo phương thức vận tải
     */
    incoterm_recommendations: {
        ocean_fcl: {
            recommended: 'fob',
            reason: 'Phổ biến nhất cho FCL, chiếm 75% giao dịch',
            alternatives: ['cif', 'cfr']
        },
        ocean_lcl: {
            recommended: 'fca',
            reason: 'Phù hợp với LCL, linh hoạt hơn',
            alternatives: ['fob', 'cif']
        },
        air_freight: {
            recommended: 'cip',
            reason: 'Phổ biến cho hàng không, bảo hiểm bao gồm',
            alternatives: ['fca', 'dap']
        },
        road_truck: {
            recommended: 'fca',
            reason: 'Phù hợp vận tải đường bộ',
            alternatives: ['fob', 'dap']
        }
    },

    /**
     * TRANSIT TIME ESTIMATES - Ước tính thời gian vận chuyển
     * Format: days từ POL đến POD
     */
    transit_times: {
        'vn_us': {
            ocean_fcl: 25, // ngày trung bình
            air_freight: 1 // ngày (16-22 giờ)
        },
        'vn_cn': {
            ocean_fcl: 7,
            road_truck: 3,
            rail_freight: 4,
            air_freight: 0.2 // 2-5 giờ
        },
        'vn_kr': {
            ocean_fcl: 6,
            air_freight: 0.2 // 4-5 giờ
        },
        'vn_jp': {
            ocean_fcl: 10,
            air_freight: 0.3 // 5-7 giờ
        },
        'vn_eu': {
            ocean_fcl: 35,
            air_freight: 0.7 // 14-16 giờ
        },
        'vn_hk': {
            ocean_fcl: 2,
            road_truck: 3,
            rail_freight: 3,
            air_freight: 0.08 // 2 giờ
        },
        'vn_in': {
            ocean_fcl: 10,
            air_freight: 0.3 // 5-7 giờ
        },
        'vn_th': {
            road_truck: 1, // 16-36 giờ
            ocean_fcl: 6,
            air_freight: 0.06 // 1.5 giờ
        },
        'vn_tw': {
            ocean_fcl: 3,
            air_freight: 0.15 // 3-4 giờ
        },
        'domestic': {
            road_truck: 2,
            rail_freight: 3
        }
    },

    /**
     * DISTANCE CALCULATOR - Tính khoảng cách giữa các cảng
     */
    calculateDistance: function(polCode, podCode) {
        // Simplified distance calculation
        // In production, use actual port coordinates and calculate great circle distance
        
        const portDistances = {
            'CMP_USLGB': 15200,
            'CMP_USNYC': 16500,
            'HPH_USLGB': 15500,
            'CMP_CNSZN': 1200,
            'CMP_CNSHA': 1800,
            'SGN_CNCAN': 1100,
            'CMP_KRPUS': 3300,
            'HPH_KRINC': 3100,
            'CMP_JPYOK': 4400,
            'HPH_JPOSA': 4200,
            'CMP_JPTYO': 4500,
            'CMP_NLRTM': 15800,
            'CMP_DEHAM': 16200,
            'HPH_DEBRV': 16500,
            'CMP_INMAA': 4300,
            'CMP_INBOM': 4500,
            'SGN_THLCH': 900,
            'CMP_TWKHH': 1900
        };

        const key = `${polCode}_${podCode}`;
        return portDistances[key] || null;
    }
};

// Export for use in other scripts
if (typeof window !== 'undefined') {
    window.LOGISTICS_DATA = LOGISTICS_DATA;
}

