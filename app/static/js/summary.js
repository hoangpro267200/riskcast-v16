/**
 * ============================================================
 * SUMMARY.JS - Tóm Tắt Thông Tin Script
 * ============================================================
 * Populates summary section with data from input form
 */

(function() {
    'use strict';

    class SummaryPage {
        constructor() {
            this.data = null;
            this.init();
        }

        async init() {
            await this.loadData();
            this.populateData();
            this.setupAnimations();
        }

        async loadData() {
            try {
                // Try localStorage first (from input.html)
                const lastResult = localStorage.getItem('last_result');
                if (lastResult) {
                    const result = JSON.parse(lastResult);
                    this.data = this.extractSummaryData(result);
                    console.log('✓ Summary data loaded from localStorage');
                    return;
                }

                // Try API
                const response = await fetch('/api/get_last_result');
                if (response.ok) {
                    const apiData = await response.json();
                    if (apiData && !apiData.error) {
                        this.data = this.extractSummaryData(apiData);
                        console.log('✓ Summary data loaded from API');
                        return;
                    }
                }
            } catch (error) {
                console.warn('Failed to load summary data:', error);
            }

            // Default empty data
            this.data = this.getDefaultData();
        }

        extractSummaryData(result) {
            const shipment = result.shipment || {};
            const route = shipment.route || result.route || '';
            
            // Extract origin/destination from route
            let origin = shipment.origin || '';
            let destination = shipment.destination || '';
            if (!origin || !destination) {
                const parts = route.split('_');
                if (parts.length >= 2) {
                    origin = this.extractPortCode(parts[0]);
                    destination = this.extractPortCode(parts[1]);
                }
            }

            // Get route label
            const routeLabel = this.getRouteLabel(route);

            // Get transport mode label
            const transportMode = shipment.transport_mode || result.transport_mode || '';
            const transportModeLabel = this.getTransportModeLabel(transportMode);

            // Get cargo type label
            const cargoType = shipment.cargo_type || result.cargo_type || '';
            const cargoTypeLabel = this.getCargoTypeLabel(cargoType);

            // Get container type
            const container = result.container || shipment.container || '';
            const containerLabel = this.getContainerLabel(container);

            // Get incoterm
            const incoterm = result.incoterm || shipment.incoterm || '';
            const incotermLabel = this.getIncotermLabel(incoterm);

            // Get packaging
            const packaging = result.packaging || shipment.packaging || '';
            const packagingLabel = this.getPackagingLabel(packaging);

            // Calculate distance
            const distance = result.distance || shipment.distance || 0;
            const distanceKm = distance > 0 ? `${distance.toLocaleString()} km` : '-- km';

            // Get transit time
            const transitTime = result.transit_time || shipment.transit_time || 0;
            const transitTimeDays = transitTime > 0 ? `${transitTime} ngày` : '-- ngày';

            // Get carrier info
            const carrier = result.carrier || shipment.carrier || '';
            const carrierRating = result.carrier_rating || shipment.carrier_rating || 3.0;

            // Get packages
            const packages = result.packages || shipment.packages || 0;
            const packagesValue = packages > 0 ? `${packages} đơn vị` : '-- đơn vị';

            // Get cargo value
            const cargoValue = shipment.cargo_value || result.cargo_value || 0;
            const cargoValueUsd = cargoValue > 0 ? `$${cargoValue.toLocaleString()} USD` : '-- USD';

            // Get dates
            const etd = shipment.etd || result.etd || '';
            const eta = shipment.eta || result.eta || '';
            const etdFormatted = etd ? this.formatDate(etd) : '--';
            const etaFormatted = eta ? this.formatDate(eta) : '--';

            // Get container match
            const containerMatch = result.container_match || shipment.container_match || 0;
            const containerMatchValue = containerMatch > 0 ? `${containerMatch.toFixed(1)}/10` : '--/10';

            // Get seller/buyer
            const seller = result.seller_country || shipment.seller_country || '';
            const buyer = result.buyer_country || shipment.buyer_country || '';
            const sellerLabel = seller ? this.getCountryLabel(seller) : 'Chưa nhập';
            const buyerLabel = buyer ? this.getCountryLabel(buyer) : 'Chưa nhập';

            // Get weather/ESG data
            const enso = result.ENSO_index || result.enso_index || 0;
            const ensoLabel = this.getEnsoLabel(enso);
            const typhoonFreq = result.typhoon_frequency || 0;
            const storms = typhoonFreq > 0.3 ? `${Math.ceil(typhoonFreq * 10)} cơn bão dự kiến` : '--';
            const climateStress = result.port_climate_stress || result.climate_volatility_index || 0;
            const climateStressValue = climateStress > 0 ? `${climateStress.toFixed(1)}/10` : '--/10';
            const esgScore = result.ESG_score || result.esg_score || 0;
            const esgScoreValue = esgScore > 0 ? `${Math.round(esgScore)}/100` : '--/100';

            return {
                transport: {
                    route: routeLabel || 'Chưa chọn',
                    method: transportModeLabel || 'Chưa chọn',
                    polPod: origin && destination ? `${origin} / ${destination}` : 'Chưa chọn',
                    distance: distanceKm,
                    duration: transitTimeDays
                },
                container: {
                    cargoType: cargoTypeLabel || 'Chưa chọn',
                    containerType: containerLabel || 'Chưa chọn',
                    incoterm: incotermLabel || 'Chưa chọn',
                    packagingQuality: packagingLabel || 'Chưa chọn',
                    compatibility: containerMatchValue
                },
                carrier: {
                    name: carrier || 'Chưa chọn',
                    rating: carrierRating,
                    logo: carrier ? carrier.substring(0, 2).toUpperCase() : '--'
                },
                milestones: {
                    quantity: packagesValue,
                    value: cargoValueUsd,
                    etd: etdFormatted,
                    eta: etaFormatted,
                    transitTime: transitTimeDays
                },
                parties: {
                    seller: sellerLabel,
                    buyer: buyerLabel
                },
                weather: {
                    enso: ensoLabel,
                    storms: storms,
                    climatePressure: climateStressValue,
                    esgScore: esgScoreValue
                }
            };
        }

        getDefaultData() {
            return {
                transport: {
                    route: 'Chưa chọn',
                    method: 'Chưa chọn',
                    polPod: 'Chưa chọn',
                    distance: '-- km',
                    duration: '-- ngày'
                },
                container: {
                    cargoType: 'Chưa chọn',
                    containerType: 'Chưa chọn',
                    incoterm: 'Chưa chọn',
                    packagingQuality: 'Chưa chọn',
                    compatibility: '--/10'
                },
                carrier: {
                    name: 'Chưa chọn',
                    rating: 3.0,
                    logo: '--'
                },
                milestones: {
                    quantity: '-- đơn vị',
                    value: '-- USD',
                    etd: '--',
                    eta: '--',
                    transitTime: '-- ngày'
                },
                parties: {
                    seller: 'Chưa nhập',
                    buyer: 'Chưa nhập'
                },
                weather: {
                    enso: '--',
                    storms: '--',
                    climatePressure: '--/10',
                    esgScore: '--/100'
                }
            };
        }

        populateData() {
            if (!this.data) return;

            // Transport Overview
            this.updateField('#summary-route', this.data.transport.route);
            this.updateField('#summary-transport-mode', this.data.transport.method);
            this.updateField('#summary-pol-pod', this.data.transport.polPod);
            this.updateField('#summary-distance', this.data.transport.distance);
            this.updateField('#summary-transit-time', this.data.transport.duration);
            this.updateField('#summary-transit-time-highlight', this.data.transport.duration);

            // Container & Cargo
            this.updateField('#summary-cargo', this.data.container.cargoType);
            this.updateField('#summary-container', this.data.container.containerType);
            this.updateField('#summary-incoterm', this.data.container.incoterm);
            this.updateField('#summary-packaging', this.data.container.packagingQuality);
            this.updateField('#summary-container-match', this.data.container.compatibility);

            // Carrier
            this.updateField('#summary-carrier', this.data.carrier.name);
            this.updateField('#summary-carrier-logo', this.data.carrier.logo);
            this.updateField('#summary-carrier-rating-value', this.data.carrier.rating.toFixed(1));
            this.updateStars('#summary-carrier-rating-stars', this.data.carrier.rating);

            // Milestones
            this.updateField('#summary-packages', this.data.milestones.quantity);
            this.updateField('#summary-cargo-value', this.data.milestones.value);
            this.updateField('#summary-etd', this.data.milestones.etd);
            this.updateField('#summary-eta', this.data.milestones.eta);

            // Parties
            this.updateField('#summary-seller', this.data.parties.seller);
            this.updateField('#summary-buyer', this.data.parties.buyer);

            // Weather & ESG
            this.updateField('#summary-enso', this.data.weather.enso);
            this.updateField('#summary-storms', this.data.weather.storms);
            this.updateField('#summary-climate-stress', this.data.weather.climatePressure);
            this.updateField('#summary-esg', this.data.weather.esgScore);
        }

        updateField(selector, value) {
            const element = document.querySelector(selector);
            if (element) {
                element.textContent = value;
                this.animateValueChange(element);
            }
        }

        updateStars(selector, rating) {
            const container = document.querySelector(selector);
            if (!container) return;

            const stars = container.querySelectorAll('.summary-star');
            const filledCount = Math.round(rating);

            stars.forEach((star, index) => {
                if (index < filledCount) {
                    star.classList.add('filled');
                } else {
                    star.classList.remove('filled');
                }
            });
        }

        animateValueChange(element) {
            element.style.transition = 'none';
            element.style.transform = 'scale(1.1)';
            element.style.color = 'var(--accent-green)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.3s ease';
                element.style.transform = 'scale(1)';
                element.style.color = '';
            }, 100);
        }

        setupAnimations() {
            const observer = new IntersectionObserver(
                (entries) => {
                    entries.forEach(entry => {
                        if (entry.isIntersecting) {
                            entry.target.style.animationPlayState = 'running';
                        }
                    });
                },
                { threshold: 0.1 }
            );

            document.querySelectorAll('.summary-info-card').forEach(card => {
                observer.observe(card);
            });
        }

        // Helper methods
        extractPortCode(routePart) {
            const portMap = {
                'VN': 'SGN', 'VNSGN': 'SGN', 'VNHPH': 'HPH',
                'US': 'LAX', 'USLAX': 'LAX', 'USNYC': 'NYC', 'USJFK': 'JFK',
                'CN': 'SHA', 'CNSHA': 'SHA', 'CNPEK': 'PEK',
                'EU': 'DEP', 'EUDEP': 'DEP', 'EULON': 'LON'
            };
            return portMap[routePart] || (routePart.length >= 3 ? routePart.slice(-3) : routePart);
        }

        getRouteLabel(route) {
            if (!route) return 'Chưa chọn';
            const routeMap = {
                'vn_us': 'Việt Nam → Hoa Kỳ',
                'vn_eu': 'Việt Nam → Châu Âu',
                'vn_cn': 'Việt Nam → Trung Quốc',
                'us_vn': 'Hoa Kỳ → Việt Nam',
                'eu_vn': 'Châu Âu → Việt Nam',
                'cn_vn': 'Trung Quốc → Việt Nam'
            };
            return routeMap[route.toLowerCase()] || route;
        }

        getTransportModeLabel(mode) {
            if (!mode) return 'Chưa chọn';
            const modeMap = {
                'ocean_fcl': 'Đường Biển - FCL',
                'ocean_lcl': 'Đường Biển - LCL',
                'air': 'Đường Hàng Không',
                'road': 'Đường Bộ',
                'rail': 'Đường Sắt'
            };
            return modeMap[mode.toLowerCase()] || mode;
        }

        getCargoTypeLabel(type) {
            if (!type) return 'Chưa chọn';
            const typeMap = {
                'electronics': 'Điện Tử',
                'textiles': 'Dệt May',
                'furniture': 'Nội Thất',
                'food': 'Thực Phẩm',
                'machinery': 'Máy Móc',
                'general': 'Hàng Tổng Hợp'
            };
            return typeMap[type.toLowerCase()] || type;
        }

        getContainerLabel(container) {
            if (!container) return 'Chưa chọn';
            const containerMap = {
                '20ft': '20ft Standard',
                '40ft': '40ft Standard',
                '40hc': '40ft High Cube',
                '45ft': '45ft',
                'reefer': 'Reefer',
                'open_top': 'Open Top',
                'flat_rack': 'Flat Rack'
            };
            return containerMap[container.toLowerCase()] || container;
        }

        getIncotermLabel(incoterm) {
            if (!incoterm) return 'Chưa chọn';
            return incoterm.toUpperCase();
        }

        getPackagingLabel(packaging) {
            if (!packaging) return 'Chưa chọn';
            const packagingMap = {
                'standard': 'Tiêu Chuẩn',
                'premium': 'Cao Cấp',
                'basic': 'Cơ Bản'
            };
            return packagingMap[packaging.toLowerCase()] || packaging;
        }

        getCountryLabel(country) {
            if (!country) return 'Chưa nhập';
            const countryMap = {
                'VN': 'Việt Nam',
                'US': 'Hoa Kỳ',
                'CN': 'Trung Quốc',
                'EU': 'Châu Âu'
            };
            return countryMap[country.toUpperCase()] || country;
        }

        getEnsoLabel(enso) {
            if (enso < -0.5) return 'La Niña (ONI: ' + enso.toFixed(1) + ')';
            if (enso > 0.5) return 'El Niño (ONI: ' + enso.toFixed(1) + ')';
            return 'Neutral (ONI: ' + enso.toFixed(1) + ')';
        }

        formatDate(dateString) {
            if (!dateString) return '--';
            try {
                const date = new Date(dateString);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();
                return `${day}/${month}/${year}`;
            } catch (e) {
                return dateString;
            }
        }
    }

    // Initialize when DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
        if (document.querySelector('.summary-section')) {
            window.summaryPage = new SummaryPage();
        }
    });

    // Export for use in other scripts
    window.SummaryPage = SummaryPage;

})();





