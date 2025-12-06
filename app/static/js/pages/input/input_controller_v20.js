/**
 * ========================================================================
 * RISKCAST v20.2 Input Controller - FULL LOGIC RESTORATION & NEW FEATURES
 * Complete integration of v19 logic with v20 VisionOS design + Priority + Auto-Fill Demo
 * ========================================================================
 */

class RiskcastInputControllerV20 {
    constructor() {
        // Form data store (upgraded to international standard)
        this.formData = {
            // Transport
            tradeLane: '',
            mode: '',
            shipmentType: '',
            priority: 'balanced',
            serviceRoute: '',
            serviceRouteData: null,
            carrier: '',
            pol: '',
            pod: '',
            containerType: '',
            etd: '',
            schedule: '',
            transitDays: null,
            seasonality: null,
            eta: '',
            reliability: null,
            
            // Cargo (International Standard)
            cargo: {
                cargoType: '',
                hsCode: '',
                packingType: '',
                packageCount: null,
                weights: {
                    grossKg: null,
                    netKg: null
                },
                volumeCbm: null,
                stackable: true,
                loadabilityIssues: false,
                insurance: {
                    valueUsd: null,
                    coverageType: ''
                },
                sensitivity: 'standard',
                temperatureRange: {
                    minC: null,
                    maxC: null
                },
                dangerousGoods: {
                    isDG: false,
                    unNumber: '',
                    dgClass: '',
                    packingGroup: ''
                },
                description: '',
                specialHandling: ''
            },
            
            // Incoterm (single unified system)
            incoterm: '',
            incotermLocation: '',
            sellerResponsibilities: {},
            buyerResponsibilities: {},
            
            // Seller (Risk-Oriented)
            seller: {
                companyName: '',
                country: { name: '', iso2: '' },
                city: '',
                address: '',
                contactPerson: '',
                contactRole: '',
                email: '',
                phone: '',
                businessType: '',
                taxId: ''
            },
            
            // Buyer (Risk-Oriented)
            buyer: {
                companyName: '',
                country: { name: '', iso2: '' },
                city: '',
                address: '',
                contactPerson: '',
                contactRole: '',
                email: '',
                phone: '',
                businessType: '',
                taxId: ''
            },
            
            // Modules
            modules: {
                esg: false,
                weather: false,
                portCongestion: false,
                carrier: false,
                market: false,
                insurance: false
            }
        };
        
        // UI state
        this.activeDropdown = null;
        this.activeSuggest = null;
        this.uploadedFile = null;
        
        // Logistics data reference
        this.logisticsData = null;
        
        // Available POL/POD from selected route
        this.availablePOL = [];
        this.availablePOD = [];
        
        // Ports database for auto-suggest
        this.portDatabase = [
            { code: 'LAX', name: 'Los Angeles', country: 'US' },
            { code: 'LGB', name: 'Long Beach', country: 'US' },
            { code: 'VNSGN', name: 'Sai Gon (HCMC)', country: 'VN' },
            { code: 'CMIT', name: 'Cai Mep', country: 'VN' },
            { code: 'CNSHA', name: 'Shanghai', country: 'CN' },
            { code: 'VNHPH', name: 'Hai Phong', country: 'VN' },
            { code: 'NLRTM', name: 'Rotterdam', country: 'NL' },
            { code: 'SGSIN', name: 'Singapore', country: 'SG' },
            { code: 'HKHKG', name: 'Hong Kong', country: 'HK' },
            { code: 'DEHAM', name: 'Hamburg', country: 'DE' },
            { code: 'USNYC', name: 'New York', country: 'US' },
            { code: 'JPTYO', name: 'Tokyo', country: 'JP' },
            { code: 'KRPUS', name: 'Busan', country: 'KR' },
            { code: 'AEDXB', name: 'Dubai', country: 'AE' },
            { code: 'GBLON', name: 'London', country: 'GB' },
            { code: 'USOAK', name: 'Oakland', country: 'US' },
            { code: 'USSEA', name: 'Seattle', country: 'US' }
        ];
        
        // Countries for auto-suggest
        this.countries = [
            'USA', 'China', 'Germany', 'Japan', 'United Kingdom',
            'France', 'Netherlands', 'Singapore', 'South Korea', 'Vietnam',
            'India', 'Thailand', 'Malaysia', 'Indonesia', 'UAE', 'Belgium',
            'Italy', 'Spain', 'Australia', 'Brazil', 'Canada', 'Mexico'
        ];
        
        // Incoterms 2020 Standard
        this.incoterms = ['EXW', 'FCA', 'FAS', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'];
    }
    
    /**
     * Initialize the controller
     */
    init() {
        console.log('🔥 RISKCAST v20.3 Controller initializing...');
        
        this.loadLogisticsData();
        this.initTheme();
        this.initSidebar();
        this.initNavigation();
        this.initFormPanelGlow();
        this.initDropdowns();
        this.initAutoSuggest();
        this.initPillGroups();
        this.initPriority();
        this.initModuleCards();
        this.initUploadZone();
        this.initInputHandlers();
        this.initButtons();
        this.initAutoFillDemo();
        this.initParticles();
        this.initSectionAnimations();
        this.initTransportV20();
        this.initCargoV20(); // NEW: Cargo international standard
        this.initSellerBuyerV20(); // NEW: Seller/Buyer with countries & incoterms
        this.initConditionalFields(); // NEW: Conditional fields (temp, DG)
        
        console.log('🔥 RISKCAST v20.3 Controller ready ✓');
    }
    
    /**
     * Load Logistics Data from window.LOGISTICS_DATA
     */
    loadLogisticsData() {
        if (typeof window !== 'undefined' && window.LOGISTICS_DATA) {
            this.logisticsData = window.LOGISTICS_DATA;
            console.log('✅ LOGISTICS_DATA loaded');
            return true;
        } else {
            console.warn('⚠️ LOGISTICS_DATA not available. Retrying...');
            setTimeout(() => {
                if (typeof window !== 'undefined' && window.LOGISTICS_DATA) {
                    this.logisticsData = window.LOGISTICS_DATA;
                    console.log('✅ LOGISTICS_DATA loaded on retry');
                    this.loadTradeLanes();
                }
            }, 500);
            return false;
        }
    }
    
    /**
     * Initialize Transport v20 dynamic fields
     */
    initTransportV20() {
        let retryCount = 0;
        const maxRetries = 20;
        
        const checkAndInit = () => {
            if (typeof window !== 'undefined' && window.LOGISTICS_DATA) {
                this.logisticsData = window.LOGISTICS_DATA;
                console.log('✅ Initializing Transport v20.3 fields');
                
                setTimeout(() => {
                    this.loadTradeLanes();
                    this.loadCarriers();
                    this.loadIncoterms();
                    
                    // If trade lane and mode are already set, load dependent fields
                    if (this.formData.tradeLane) {
                        this.loadModes();
                        this.loadPOL();
                        this.loadPOD();
                        
                        if (this.formData.mode) {
                            this.loadShipmentTypes();
                            this.loadContainerTypes();
                            
                            if (this.formData.shipmentType) {
                                this.loadServiceRoutes();
                                console.log('🔥 Auto-loaded service routes from existing state');
                            }
                        }
                    } else {
                        // Show helpful message in service route dropdown if nothing is selected
                        this.loadServiceRoutes();
                    }
                }, 100);
            } else if (retryCount < maxRetries) {
                retryCount++;
                setTimeout(checkAndInit, 100);
            } else {
                console.error('❌ LOGISTICS_DATA not available after max retries');
            }
        };
        
        checkAndInit();
    }
    
    /**
     * Load Trade Lanes
     */
    loadTradeLanes() {
        const menu = document.getElementById('tradeLane-menu');
        if (!menu || !this.logisticsData) {
            console.warn('⚠️ Cannot load trade lanes');
            return;
        }
        
        menu.innerHTML = '';
        
        const routes = this.logisticsData.routes || {};
        const tradeLanes = Object.keys(routes).map(key => {
            const route = routes[key];
            return {
                id: key,
                name: route.name || key,
                name_vi: route.name_vi || route.name || key,
                flag: route.flag || ''
            };
        });
        
        tradeLanes.forEach(lane => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', lane.id);
            btn.innerHTML = `${lane.flag} <strong>${lane.name}</strong>`;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectTradeLane(lane.id, lane.name);
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`🔥 Loaded ${tradeLanes.length} trade lanes`);
    }
    
    /**
     * Select Trade Lane
     */
    selectTradeLane(value, label) {
        this.formData.tradeLane = value;
        
        // Update UI
        this.updateDropdownSelection('tradeLane', value, label);
        
        // Clear dependent fields
        this.formData.mode = '';
        this.formData.shipmentType = '';
        this.formData.serviceRoute = '';
        this.formData.carrier = '';
        
        // Reload dependent dropdowns
        setTimeout(() => {
            this.loadModes();
            this.loadPOL();
            this.loadPOD();
        }, 50);
        
        console.log('🔥 Trade lane selected:', value);
        this.onFormDataChange();
    }
    
    /**
     * Load Modes based on selected trade lane
     */
    loadModes() {
        const menu = document.getElementById('mode-menu');
        if (!menu || !this.logisticsData || !this.formData.tradeLane) return;
        
        menu.innerHTML = '';
        
        const route = this.logisticsData.getRoute(this.formData.tradeLane);
        if (!route || !route.transport_modes) return;
        
        // Extract unique mode categories
        const modeMap = new Map();
        route.transport_modes.forEach(mode => {
            let category = 'SEA';
            let icon = 'ship';
            let label = 'Sea Freight';
            
            if (mode.value.startsWith('air')) {
                category = 'AIR';
                icon = 'plane';
                label = 'Air Freight';
            } else if (mode.value.startsWith('road')) {
                category = 'ROAD';
                icon = 'truck';
                label = 'Road Transport';
            } else if (mode.value.startsWith('rail')) {
                category = 'RAIL';
                icon = 'train';
                label = 'Rail Transport';
            }
            
            if (!modeMap.has(category)) {
                modeMap.set(category, { label, icon });
            }
        });
        
        modeMap.forEach((data, category) => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', category);
            btn.innerHTML = `<i data-lucide="${data.icon}"></i> ${data.label}`;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectMode(category, data.label);
            });
            
            menu.appendChild(btn);
        });
        
        // Reinit icons
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        console.log(`🔥 Loaded ${modeMap.size} modes`);
    }
    
    /**
     * Select Mode
     */
    selectMode(value, label) {
        this.formData.mode = value;
        
        // Update UI
        this.updateDropdownSelection('mode', value, label);
        
        // Clear dependent fields
        this.formData.shipmentType = '';
        this.formData.serviceRoute = '';
        this.formData.carrier = '';
        
        // Clear carrier dropdown display
        this.updateDropdownSelection('carrier', '', 'Select carrier');
        
        // Load shipment types and service routes
        setTimeout(() => {
            this.loadShipmentTypes();
            this.loadServiceRoutes();
            this.loadContainerTypes();
            this.loadCarriers(); // Load carriers filtered by new mode
            this.loadPOL();
            this.loadPOD();
        }, 50);
        
        console.log('🔥 Mode selected:', value);
        this.onFormDataChange();
    }
    
    /**
     * Load Shipment Types
     */
    loadShipmentTypes() {
        const menu = document.getElementById('shipmentType-menu');
        if (!menu || !this.logisticsData || !this.formData.tradeLane || !this.formData.mode) return;
        
        menu.innerHTML = '';
        
        const route = this.logisticsData.getRoute(this.formData.tradeLane);
        if (!route || !route.transport_modes) return;
        
        const modePrefix = {
            'SEA': 'ocean',
            'AIR': 'air',
            'ROAD': 'road',
            'RAIL': 'rail'
        }[this.formData.mode];
        
        if (!modePrefix) return;
        
        const matchingModes = route.transport_modes.filter(mode => 
            mode.value.startsWith(modePrefix)
        );
        
        matchingModes.forEach(mode => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', mode.value);
            btn.textContent = mode.label || mode.value;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectShipmentType(mode.value, mode.label);
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`🔥 Loaded ${matchingModes.length} shipment types`);
    }
    
    /**
     * Select Shipment Type
     */
    selectShipmentType(value, label) {
        this.formData.shipmentType = value;
        
        // Update UI
        this.updateDropdownSelection('shipmentType', value, label || value);
        
        // Reload service routes with current filters
        setTimeout(() => {
            this.loadServiceRoutes();
        }, 50);
        
        console.log('🔥 Shipment type selected:', value);
        this.onFormDataChange();
    }
    
    /**
     * NEW: Initialize Priority Selection (4 modes: Fastest, Balanced, Cheapest, Most Reliable)
     */
    initPriority() {
        const priorityGroup = document.querySelector('.rc-pill-group[data-field="priority"]');
        if (!priorityGroup) return;
        
        const pills = priorityGroup.querySelectorAll('.rc-pill');
        
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const value = pill.getAttribute('data-value');
                
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                
                this.formData.priority = value;
                
                console.log(`🔥 Priority selected: ${value} (4-mode system)`);
                
                // Reload service routes with new priority filter
                if (this.formData.tradeLane && this.formData.mode) {
                    this.loadServiceRoutes();
                }
                
                this.onFormDataChange();
            });
        });
        
        console.log('🔥 Priority selection initialized ✓ (4 modes: fastest, balanced, cheapest, reliable)');
    }
    
    /**
     * Load Service Routes with PRIORITY FILTERING (4 modes)
     */
    loadServiceRoutes() {
        const menu = document.getElementById('serviceRoute-menu');
        if (!menu || !this.logisticsData || !this.formData.tradeLane || !this.formData.mode) {
            console.warn('⚠️ Cannot load service routes:', {
                hasMenu: !!menu,
                hasData: !!this.logisticsData,
                tradeLane: this.formData.tradeLane,
                mode: this.formData.mode
            });
            
            // Show helpful message in the dropdown
            if (menu) {
                if (!this.formData.tradeLane && !this.formData.mode) {
                    menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6;">⚠️ Please select <strong>Trade Lane</strong> and <strong>Mode</strong> first.</div>';
                } else if (!this.formData.tradeLane) {
                    menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6;">⚠️ Please select <strong>Trade Lane</strong> first.</div>';
                } else if (!this.formData.mode) {
                    menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6;">⚠️ Please select <strong>Mode of Transport</strong> first.</div>';
                }
            }
            return;
        }
        
        menu.innerHTML = '';
        
        // Use normalized service routes from logistics_data
        let allRoutes = this.logisticsData.getServiceRoutes(
            this.formData.tradeLane,
            this.formData.mode
        );
        
        if (!allRoutes || allRoutes.length === 0) {
            console.warn('⚠️ No service routes returned from getServiceRoutes');
            return;
        }
        
        // Filter by shipment type if selected
        if (this.formData.shipmentType) {
            allRoutes = allRoutes.filter(r => 
                !r.shipmentType || r.shipmentType === this.formData.shipmentType
            );
        }
        
        // APPLY PRIORITY SORTING (4 modes)
        const priority = this.formData.priority || 'balanced';
        if (priority === 'fastest') {
            // Sort by transit time (shortest first)
            allRoutes.sort((a, b) => (a.transit_days || 999) - (b.transit_days || 999));
        } else if (priority === 'cheapest') {
            // Sort by cost (lowest first)
            allRoutes.sort((a, b) => (a.cost || 999999) - (b.cost || 999999));
        } else if (priority === 'reliable') {
            // Sort by reliability (highest first) - NEW MODE
            allRoutes.sort((a, b) => (b.reliability || 0) - (a.reliability || 0));
        } else if (priority === 'balanced') {
            // Balanced: use composite score
            allRoutes = allRoutes.map(r => ({
                ...r,
                _compositeScore: this.calculatePriorityScore(r, 'balanced')
            }));
            allRoutes.sort((a, b) => b._compositeScore - a._compositeScore);
        }
        
        // Render routes (mark first as recommended)
        allRoutes.forEach((r, index) => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            if (index === 0) {
                btn.classList.add('rc-recommended');
            }
            btn.setAttribute('data-value', r.route_id);
            
            btn.innerHTML = `
                <div style="display: flex; flex-direction: column; gap: 4px;">
                    <div><strong>${r.route_name || 'Route'}</strong>${index === 0 ? ' <span style="color: var(--rc-neon-primary); font-size: 0.75rem;">✓ RECOMMENDED</span>' : ''}</div>
                    <div style="font-size: 0.875rem; opacity: 0.7;">
                        ${r.pol} → ${r.pod} • ${r.carrier || 'Carrier'} • ${r.transit_days || 0}d
                        • ${r.reliability}% reliable • Cost: ${(r.cost || 0).toFixed(0)}
                    </div>
                </div>
            `;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectServiceRoute(r);
            });
            
            menu.appendChild(btn);
        });
        
        if (allRoutes.length === 0) {
            menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6;">⚠️ No routes available. Please select Trade Lane, Mode, and Shipment Type first.</div>';
        } else {
            console.log(`🔥 Loaded ${allRoutes.length} service routes (priority: ${priority}, 4-mode system)`);
        }
    }
    
    /**
     * Calculate priority score for balanced mode
     */
    calculatePriorityScore(route, priority) {
        const transit = route.transit_days || 15;
        const cost = route.cost || 1000;
        const reliability = route.reliability || 80;
        
        // Normalize to 0-100 scale (higher is better)
        const speedScore = Math.max(0, 100 - transit * 2);
        const costScore = Math.max(0, 100 - (cost - 1000) / 10);
        const reliabilityScore = reliability;
        
        if (priority === 'balanced') {
            return (speedScore + costScore + reliabilityScore) / 3;
        }
        
        return reliabilityScore;
    }
    
    /**
     * Calculate route cost (simulated based on transit time and distance)
     */
    calculateRouteCost(route) {
        const baseRate = 1000; // USD base
        const transitDays = route.transit_days || 15;
        const reliabilityFactor = (route.reliability || 80) / 100;
        
        // Simulate cost: faster = more expensive, higher reliability = slightly more
        const cost = baseRate + (transitDays * 50) + (reliabilityFactor * 200);
        return Math.round(cost);
    }
    
    /**
     * Select Service Route and AUTO-FILL fields (FIXED)
     */
    selectServiceRoute(routeData) {
        this.formData.serviceRoute = routeData.route_id;
        this.formData.serviceRouteData = routeData;
        
        // Build human-readable label
        const label = `${routeData.pol} → ${routeData.pod} • ${routeData.carrier || 'Carrier'} • ${routeData.transit_days || 0}d`;
        
        // Update UI - FIXED: ensure dropdown value is updated
        this.updateDropdownSelection('serviceRoute', routeData.route_id, label);
        
        // Clear previous POL/POD values (user can select from new route's ports)
        const polInput = document.querySelector('#pol .rc-input');
        const podInput = document.querySelector('#pod .rc-input');
        if (polInput) polInput.value = '';
        if (podInput) podInput.value = '';
        this.formData.pol = '';
        this.formData.pod = '';
        
        // AUTO-FILL derived fields
        this.autoFillFromRoute(routeData);
        
        // Update POL/POD dropdowns with new route's ports
        this.loadPOL();
        this.loadPOD();
        
        console.log('🔥 Service route selected:', routeData.route_id, label);
        console.log('🔥 POL/POD cleared and updated for new route');
        this.onFormDataChange();
    }
    
    /**
     * AUTO-FILL fields from selected route
     * NOTE: POL/POD are NOT auto-filled, only dropdown options are updated
     */
    autoFillFromRoute(route) {
        console.log('🔥 Auto-filling from route:', route);
        
        // Transit Time
        if (route.transit_days) {
            const transitInput = document.getElementById('transitDays');
            if (transitInput) {
                transitInput.value = route.transit_days;
                this.formData.transitDays = route.transit_days;
            }
        }
        
        // Schedule
        if (route.schedule) {
            const scheduleInput = document.getElementById('schedule');
            if (scheduleInput) {
                scheduleInput.value = route.schedule;
                this.formData.schedule = route.schedule;
            }
        }
        
        // Reliability
        if (route.reliability) {
            const reliabilityInput = document.getElementById('reliabilityScore');
            if (reliabilityInput) {
                reliabilityInput.value = route.reliability + '%';
                this.formData.reliability = route.reliability;
            }
        }
        
        // Seasonality
        if (route.seasonality) {
            this.formData.seasonality = route.seasonality;
        }
        
        // Carrier
        if (route.carrier) {
            this.formData.carrier = route.carrier;
            this.updateDropdownSelection('carrier', route.carrier, route.carrier);
        }
        
        // Calculate ETA if ETD is set
        if (this.formData.etd && route.transit_days) {
            this.calculateETA();
        }
        
        console.log('✅ Auto-fill complete (POL/POD cleared for user selection)');
    }
    
    /**
     * Load Carriers filtered by mode
     */
    loadCarriers() {
        const menu = document.getElementById('carrier-menu');
        if (!menu) return;
        
        menu.innerHTML = '';
        
        // Get carriers for selected mode
        const mode = this.formData.mode;
        const carrierList = window.CARRIER_BY_MODE?.[mode] || [];
        
        if (carrierList.length === 0) {
            menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6; font-size: 0.875rem;">Select mode first</div>';
            console.log('⚠️ No carriers available - mode not selected');
            return;
        }
        
        carrierList.forEach(carrier => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', carrier);
            btn.textContent = carrier;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.formData.carrier = carrier;
                this.updateDropdownSelection('carrier', carrier, carrier);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`🔥 Loaded ${carrierList.length} carriers for mode: ${mode}`);
    }
    
    /**
     * Load Incoterms 2020
     */
    loadIncoterms() {
        const menu = document.getElementById('incoterm-menu');
        if (!menu) return;
        
        menu.innerHTML = '';
        
        this.incoterms.forEach(term => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', term);
            btn.textContent = term;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.selectIncoterm(term);
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`🔥 Loaded ${this.incoterms.length} Incoterms 2020`);
        
        // Bind incoterm location input
        const locationInput = document.getElementById('incotermLocation');
        if (locationInput) {
            locationInput.addEventListener('input', (e) => {
                this.formData.incotermLocation = e.target.value;
                this.onFormDataChange();
            });
        }
    }
    
    /**
     * Select Incoterm and auto-split responsibilities
     */
    selectIncoterm(term) {
        this.formData.incoterm = term;
        this.updateDropdownSelection('incoterm', term, term);
        this.applyIncotermLogic(term);
        this.onFormDataChange();
        
        console.log(`🔥 Incoterm selected: ${term}`);
    }
    
    /**
     * Apply Incoterm logic - auto-split seller/buyer responsibilities
     */
    applyIncotermLogic(term) {
        const rules = {
            EXW: {
                seller: ['Packing & labeling at origin'],
                buyer: ['All transport', 'Export clearance', 'Import clearance', 'Delivery to destination']
            },
            FCA: {
                seller: ['Packing & labeling', 'Export clearance', 'Delivery to carrier at named place'],
                buyer: ['Main carriage', 'Import clearance', 'Delivery from carrier']
            },
            FAS: {
                seller: ['Packing', 'Export clearance', 'Delivery alongside vessel at POL'],
                buyer: ['Loading onto vessel', 'Ocean freight', 'Import clearance', 'Delivery']
            },
            FOB: {
                seller: ['Packing', 'Export clearance', 'Trucking to POL', 'Terminal charges at POL', 'Loading onto vessel'],
                buyer: ['Ocean freight', 'Insurance', 'Destination terminal charges', 'Import clearance', 'Delivery']
            },
            CFR: {
                seller: ['Packing', 'Export clearance', 'Trucking to POL', 'Terminal charges at POL', 'Loading', 'Ocean freight'],
                buyer: ['Insurance', 'Destination terminal charges', 'Import clearance', 'Delivery']
            },
            CIF: {
                seller: ['Packing', 'Export clearance', 'Trucking to POL', 'Terminal charges at POL', 'Loading', 'Ocean freight', 'Marine insurance'],
                buyer: ['Destination terminal charges', 'Import clearance', 'Delivery to final destination']
            },
            CPT: {
                seller: ['Packing', 'Export clearance', 'Main carriage to named destination'],
                buyer: ['Insurance', 'Import clearance', 'Final delivery']
            },
            CIP: {
                seller: ['Packing', 'Export clearance', 'Main carriage to named destination', 'Cargo insurance'],
                buyer: ['Import clearance', 'Final delivery']
            },
            DAP: {
                seller: ['Packing', 'Export clearance', 'All transport to named destination', 'Unloading risk'],
                buyer: ['Import clearance', 'Import duties & taxes']
            },
            DPU: {
                seller: ['Packing', 'Export clearance', 'All transport', 'Unloading at named place'],
                buyer: ['Import clearance', 'Import duties & taxes', 'Final delivery']
            },
            DDP: {
                seller: ['Packing', 'Export clearance', 'All transport', 'Import clearance', 'Import duties & taxes', 'Delivery to final destination'],
                buyer: ['Unloading at destination']
            }
        };
        
        const rule = rules[term] || { seller: [], buyer: [] };
        this.formData.sellerResponsibilities = rule.seller;
        this.formData.buyerResponsibilities = rule.buyer;
        
        console.log(`✅ Incoterm logic applied: ${term}`, rule);
    }
    
    /**
     * Extract POL/POD ports from selected trade lane & mode
     */
    extractPortsFromRoute() {
        if (!this.logisticsData || !this.formData.tradeLane || !this.formData.mode) {
            this.availablePOL = [];
            this.availablePOD = [];
            console.log('⚠️ Cannot extract ports: missing trade lane or mode');
            return;
        }
        
        const route = this.logisticsData.getRoute(this.formData.tradeLane);
        if (!route || !route.transport_modes) {
            this.availablePOL = [];
            this.availablePOD = [];
            return;
        }
        
        const modePrefix = {
            'SEA': 'ocean',
            'AIR': 'air',
            'ROAD': 'road',
            'RAIL': 'rail'
        }[this.formData.mode];
        
        if (!modePrefix) return;
        
        const polSet = new Set();
        const podSet = new Set();
        
        // Extract all POL/POD from matching transport modes
        route.transport_modes
            .filter(m => m.value.startsWith(modePrefix))
            .forEach(mode => {
                if (mode.routes) {
                    mode.routes.forEach(r => {
                        if (r.pol) polSet.add(r.pol);
                        if (r.pod) podSet.add(r.pod);
                    });
                }
            });
        
        this.availablePOL = Array.from(polSet).sort();
        this.availablePOD = Array.from(podSet).sort();
        
        console.log(`🔥 Extracted ports from route: ${this.availablePOL.length} POL, ${this.availablePOD.length} POD`);
    }
    
    /**
     * Load POL (Port of Loading) - populate dropdown
     */
    loadPOL() {
        const menu = document.getElementById('pol-menu');
        if (!menu) return;
        
        // Extract ports from current route selection
        this.extractPortsFromRoute();
        
        menu.innerHTML = '';
        
        // Use extracted ports if available, otherwise show message
        if (this.availablePOL.length > 0) {
            this.availablePOL.forEach(portName => {
                const item = document.createElement('div');
                item.className = 'rc-suggest-item';
                item.setAttribute('data-value', portName);
                item.innerHTML = `<strong>${portName}</strong>`;
                item.addEventListener('click', () => {
                    this.selectPOL(portName, portName);
                });
                menu.appendChild(item);
            });
            console.log(`🔥 Loaded ${this.availablePOL.length} POL ports`);
        } else {
            menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6; font-size: 0.875rem;">Select Trade Lane & Mode first</div>';
        }
    }
    
    /**
     * Load POD (Port of Discharge) - populate dropdown
     */
    loadPOD() {
        const menu = document.getElementById('pod-menu');
        if (!menu) return;
        
        // Extract ports from current route selection
        this.extractPortsFromRoute();
        
        menu.innerHTML = '';
        
        // Use extracted ports if available, otherwise show message
        if (this.availablePOD.length > 0) {
            this.availablePOD.forEach(portName => {
                const item = document.createElement('div');
                item.className = 'rc-suggest-item';
                item.setAttribute('data-value', portName);
                item.innerHTML = `<strong>${portName}</strong>`;
                item.addEventListener('click', () => {
                    this.selectPOD(portName, portName);
                });
                menu.appendChild(item);
            });
            console.log(`🔥 Loaded ${this.availablePOD.length} POD ports`);
        } else {
            menu.innerHTML = '<div style="padding: 1rem; text-align: center; opacity: 0.6; font-size: 0.875rem;">Select Trade Lane & Mode first</div>';
        }
    }
    
    /**
     * Select POL
     */
    selectPOL(code, name) {
        this.formData.pol = code;
        
        // Update input
        const input = document.querySelector('#pol .rc-input');
        if (input) input.value = name;
        
        // Hide menu
        const menu = document.getElementById('pol-menu');
        if (menu) menu.classList.remove('active');
        
        console.log('🔥 POL selected:', code);
        this.onFormDataChange();
    }
    
    /**
     * Select POD
     */
    selectPOD(code, name) {
        this.formData.pod = code;
        
        // Update input
        const input = document.querySelector('#pod .rc-input');
        if (input) input.value = name;
        
        // Hide menu
        const menu = document.getElementById('pod-menu');
        if (menu) menu.classList.remove('active');
        
        console.log('🔥 POD selected:', code);
        this.onFormDataChange();
    }
    
    /**
     * Load Container Types
     */
    loadContainerTypes() {
        if (typeof CONTAINER_TYPES_BY_MODE === 'undefined') return;
        
        const mode = this.formData.mode ? this.formData.mode.toLowerCase() : 'sea';
        const types = CONTAINER_TYPES_BY_MODE[mode] || CONTAINER_TYPES_BY_MODE['sea'] || [];
        
        const menu = document.getElementById('containerType-menu');
        if (!menu) return;
        
        menu.innerHTML = '';
        
        types.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', type.value);
            btn.textContent = type.label;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.formData.containerType = type.value;
                this.updateDropdownSelection('containerType', type.value, type.label);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`🔥 Loaded ${types.length} container types`);
    }
    
    /**
     * Calculate ETA from ETD + Transit Days
     */
    calculateETA() {
        const etdInput = document.getElementById('etd');
        const transitInput = document.getElementById('transitDays');
        const etaInput = document.getElementById('eta');
        
        if (!etdInput || !transitInput || !etaInput) return;
        
        const etd = etdInput.value;
        const transit = parseInt(transitInput.value);
        
        if (!etd || !transit) return;
        
        const etdDate = new Date(etd);
        const etaDate = new Date(etdDate);
        etaDate.setDate(etaDate.getDate() + transit);
        
        etaInput.value = etaDate.toISOString().split('T')[0];
        this.formData.eta = etaInput.value;
        
        console.log('🔥 ETA calculated:', this.formData.eta);
    }
    
    /**
     * UPDATE DROPDOWN SELECTION HELPER
     */
    updateDropdownSelection(dropdownId, value, label) {
        const dropdown = document.getElementById(dropdownId);
        if (!dropdown) return;
        
        // Update dataset
        dropdown.dataset.value = value;
        
        // Update label
        const valueSpan = dropdown.querySelector('.rc-dropdown-value');
        if (valueSpan) {
            valueSpan.textContent = label;
        }
        
        // Close dropdown
        dropdown.classList.remove('active');
        
        console.log(`✅ Updated dropdown ${dropdownId} to: ${label}`);
    }
    
    /**
     * NEW: Auto-Fill Demo Mode
     */
    initAutoFillDemo() {
        const demoBtn = document.getElementById('rc-auto-demo');
        if (!demoBtn) return;
        
        demoBtn.addEventListener('click', () => {
            if (demoBtn.disabled) return;
            demoBtn.disabled = true;
            this.runAutoFillDemo();
            setTimeout(() => { demoBtn.disabled = false; }, 1500);
        });
        
        console.log('🔥 Auto-Fill Demo button initialized ✓');
    }
    
    /**
     * Generate realistic date (offset from today)
     */
    generateRealisticDate(minOffset, maxOffset) {
        const d = new Date();
        const offset = minOffset + Math.floor(Math.random() * (maxOffset - minOffset + 1));
        d.setDate(d.getDate() + offset);
        return d.toISOString().split('T')[0];
    }
    
    /**
     * Auto-fill Cargo Section with realistic data
     */
    autoFillCargoDemo(tradeKey) {
        // Cargo Type
        const cargoMenu = document.getElementById('cargoType-menu');
        if (cargoMenu && cargoMenu.children.length > 0) {
            cargoMenu.children[0].click();
        }
        
        // Packing Type
        const packingMenu = document.getElementById('packingType-menu');
        if (packingMenu && packingMenu.children.length > 0) {
            packingMenu.children[0].click();
        }
        
        // Insurance Coverage
        const insMenu = document.getElementById('insuranceCoverage-menu');
        if (insMenu && insMenu.children.length > 0) {
            insMenu.children[0].click();
        }
        
        // Basic numeric fields
        const fields = {
            hsCode: '850440',
            packageCount: '800',
            grossWeight: '15000',
            netWeight: '14200',
            volumeCbm: '68.5',
            insuranceValue: tradeKey === 'vn_us' ? '250000' : '120000',
            cargoDescription: 'Electronics – mixed cartons on pallets'
        };
        
        Object.entries(fields).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        // Stackable = true
        const stackGroup = document.getElementById('stackableGroup');
        if (stackGroup) {
            const yes = stackGroup.querySelector('.rc-pill[data-value="true"]');
            if (yes) yes.click();
        }
        
        // Sensitivity = standard
        const sensGroup = document.getElementById('sensitivityGroup');
        if (sensGroup) {
            const pill = sensGroup.querySelector('.rc-pill[data-value="standard"]');
            if (pill) pill.click();
        }
        
        // DG = false
        const dgGroup = document.getElementById('dgGroup');
        if (dgGroup) {
            const no = dgGroup.querySelector('.rc-pill[data-value="false"]');
            if (no) no.click();
        }
    }
    
    /**
     * Auto-fill Seller & Buyer Section with realistic data
     */
    autoFillPartyDemo(tradeKey) {
        const mapBuyerISO = {
            vn_us: 'US',
            vn_eu: 'NL',
            vn_kr: 'KR',
            vn_jp: 'JP',
            vn_cn: 'CN',
            vn_hk: 'HK',
            vn_tw: 'TW',
            vn_in: 'IN',
            vn_th: 'TH',
            domestic: 'VN'
        };
        
        const sellerISO = 'VN';
        const buyerISO = mapBuyerISO[tradeKey] || 'US';
        
        const findCountryLabel = (iso2) => {
            if (!this.logisticsData || !this.logisticsData.countries) return null;
            const c = this.logisticsData.countries.find(c => c.iso2 === iso2);
            return c ? `${c.emoji} ${c.name}` : null;
        };
        
        // Seller country dropdown
        const sellerMenu = document.getElementById('sellerCountry-menu');
        if (sellerMenu) {
            const btn = Array.from(sellerMenu.children).find(
                el => el.getAttribute('data-value') === sellerISO
            );
            if (btn) btn.click();
        }
        
        // Buyer country dropdown
        const buyerMenu = document.getElementById('buyerCountry-menu');
        if (buyerMenu) {
            const btn = Array.from(buyerMenu.children).find(
                el => el.getAttribute('data-value') === buyerISO
            );
            if (btn) btn.click();
        }
        
        // Business type dropdowns
        const sellerBizMenu = document.getElementById('sellerBusinessType-menu');
        if (sellerBizMenu && sellerBizMenu.children.length > 0) {
            sellerBizMenu.children[0].click();
        }
        const buyerBizMenu = document.getElementById('buyerBusinessType-menu');
        if (buyerBizMenu && buyerBizMenu.children.length > 0) {
            buyerBizMenu.children[0].click();
        }
        
        // Seller text inputs
        const mapSeller = {
            sellerCompany: 'VN Tech Components Co., Ltd.',
            sellerCity: 'Ho Chi Minh City',
            sellerAddress: 'Lot A2, Hi-Tech Park, District 9',
            sellerContact: 'Nguyen Minh Anh',
            sellerContactRole: 'Export Manager',
            sellerEmail: 'export@vn-components.com',
            sellerPhone: '+84 28 1234 5678',
            sellerTaxId: '0312345678'
        };
        
        Object.entries(mapSeller).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
        
        // Buyer text inputs
        const buyerCity = buyerISO === 'US' ? 'Los Angeles' :
                          buyerISO === 'NL' ? 'Rotterdam' :
                          buyerISO === 'JP' ? 'Tokyo' : 'Global City';
        
        const mapBuyer = {
            buyerCompany: 'Global Retail Distribution Inc.',
            buyerCity,
            buyerAddress: 'Distribution Center, Industrial Zone',
            buyerContact: 'Sarah Johnson',
            buyerContactRole: 'Logistics Director',
            buyerEmail: 'logistics@global-retail.com',
            buyerPhone: '+1 310 555 0199',
            buyerTaxId: 'US-99-1234567'
        };
        
        Object.entries(mapBuyer).forEach(([id, value]) => {
            const el = document.getElementById(id);
            if (el) {
                el.value = value;
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
        });
    }
    
    /**
     * Run Auto-Fill Demo with realistic data (v20.8 - FULL FORM)
     */
    runAutoFillDemo() {
        console.log('🔥 Auto-Fill Demo v20.8 starting (FULL FORM)...');
        
        // Guard
        if (!this.logisticsData) {
            this.showToast('Loading logistics data... Please wait', 'info');
            setTimeout(() => this.runAutoFillDemo(), 800);
            return;
        }
        
        const routes = this.logisticsData.routes;
        const laneKeys = Object.keys(routes);
        
        // 1. Weighted random trade lanes
        const weighted = [
            'vn_us', 'vn_us', 'vn_us',
            'vn_cn', 'vn_cn',
            'vn_eu', 'vn_eu',
            'vn_kr', 'vn_jp', 'vn_hk', 'vn_tw', 'vn_in', 'vn_th', 'domestic',
            ...laneKeys
        ];
        const tradeKey = weighted[Math.floor(Math.random() * weighted.length)];
        const lane = routes[tradeKey];
        
        // 2. Select trade lane
        this.selectTradeLane(tradeKey, lane.name);
        
        // 3. Select mode (weighted)
        setTimeout(() => {
            const modePool = ['SEA', 'SEA', 'SEA', 'SEA', 'AIR', 'AIR', 'ROAD', 'RAIL'];
            const mode = modePool[Math.floor(Math.random() * modePool.length)];
            const modeLabel = {
                SEA: 'Sea Freight',
                AIR: 'Air Freight',
                ROAD: 'Road Transport',
                RAIL: 'Rail Transport'
            }[mode];
            this.selectMode(mode, modeLabel);
        }, 150);
        
        // 4. Select shipment type
        setTimeout(() => {
            const menu = document.getElementById('shipmentType-menu');
            if (menu && menu.children.length > 0) {
                const index = Math.random() > 0.7 ? Math.floor(Math.random() * menu.children.length) : 0;
                menu.children[index].click();
            }
            this.loadServiceRoutes();
        }, 300);
        
        // 5. Select service route
        setTimeout(() => {
            const menu = document.getElementById('serviceRoute-menu');
            if (menu && menu.children.length > 0) {
                const index = Math.random() > 0.7 ? Math.floor(Math.random() * menu.children.length) : 0;
                menu.children[index].click();
            }
        }, 450);
        
        // 6. Set priority
        setTimeout(() => {
            const weights = ['balanced', 'balanced', 'balanced', 'fastest', 'cheapest', 'reliable'];
            const value = weights[Math.floor(Math.random() * weights.length)];
            this.formData.priority = value;
            
            const pills = document.querySelectorAll('.rc-pill-group[data-field="priority"] .rc-pill');
            pills.forEach(p => p.classList.remove('active'));
            const pick = document.querySelector(`.rc-pill[data-value="${value}"]`);
            if (pick) pick.classList.add('active');
        }, 600);
        
        // 7. Container type
        setTimeout(() => {
            this.loadContainerTypes();
            setTimeout(() => {
                const menu = document.getElementById('containerType-menu');
                if (menu && menu.children.length > 0) {
                    const index = Math.random() > 0.7 ? Math.floor(Math.random() * menu.children.length) : 0;
                    menu.children[index].click();
                }
            }, 50);
        }, 650);
        
        // 8. ETD + ETA
        setTimeout(() => {
            const etd = this.generateRealisticDate(2, 6);
            const etdInput = document.getElementById('etd');
            if (etdInput) {
                etdInput.value = etd;
                this.formData.etd = etd;
            }
            this.calculateETA();
        }, 750);
        
        // 9. Incoterm
        setTimeout(() => {
            const incoterms = ['FOB', 'CIF', 'EXW', 'DDP', 'FCA'];
            const randomIncoterm = incoterms[Math.floor(Math.random() * incoterms.length)];
            this.selectIncoterm(randomIncoterm);
            
            // Incoterm location
            const locationInput = document.getElementById('incotermLocation');
            if (locationInput) {
                const locations = ['Shanghai', 'Los Angeles', 'Rotterdam', 'Singapore', 'Hamburg'];
                locationInput.value = locations[Math.floor(Math.random() * locations.length)];
                this.formData.incotermLocation = locationInput.value;
            }
        }, 750);
        
        // 10. POL/POD from service route
        setTimeout(() => {
            if (this.formData.serviceRouteData) {
                const routeData = this.formData.serviceRouteData;
                this.selectPOL(routeData.pol_code || routeData.pol, routeData.pol);
                this.selectPOD(routeData.pod_code || routeData.pod, routeData.pod);
            }
        }, 850);
        
        // 11. Cargo section
        setTimeout(() => {
            this.autoFillCargoDemo(tradeKey);
        }, 950);
        
        // 12. Seller & Buyer section
        setTimeout(() => {
            this.autoFillPartyDemo(tradeKey);
        }, 1050);
        
        // 13. Final touches
        setTimeout(() => {
            this.onFormDataChange();
            this.showToast('Demo shipment loaded successfully', 'success');
            
            const form = document.querySelector('.rc-form-panel');
            if (form) {
                form.classList.add('rc-demo-pulse');
                setTimeout(() => form.classList.remove('rc-demo-pulse'), 1600);
            }
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
            console.log('✨ Auto-Fill Demo v20.8 completed (FULL FORM).');
        }, 1350);
    }
    
    /**
     * Theme Management
     */
    initTheme() {
        const themeToggle = document.getElementById('rc-theme-toggle');
        const html = document.documentElement;
        
        const savedTheme = localStorage.getItem('rc-theme') || 'dark';
        html.classList.remove('rc-theme-dark', 'rc-theme-light');
        html.classList.add(`rc-theme-${savedTheme}`);
        
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const isDark = html.classList.contains('rc-theme-dark');
                const newTheme = isDark ? 'light' : 'dark';
                
                html.classList.remove('rc-theme-dark', 'rc-theme-light');
                html.classList.add(`rc-theme-${newTheme}`);
                
                localStorage.setItem('rc-theme', newTheme);
                
                if (typeof lucide !== 'undefined') {
                    lucide.createIcons();
                }
            });
        }
    }
    
    /**
     * Sidebar Collapse/Expand
     */
    initSidebar() {
        const sidebar = document.getElementById('rc-sidebar');
        const sidebarToggle = document.getElementById('rc-sidebar-toggle');
        
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                sidebar.classList.toggle('open');
            });
        }
        
        document.addEventListener('click', (e) => {
            if (window.innerWidth <= 1024) {
                if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target)) {
                    sidebar.classList.remove('open');
                }
            }
        });
    }
    
    /**
     * Navigation Scroll Spy
     */
    initNavigation() {
        const navItems = document.querySelectorAll('.rc-nav-item');
        const sections = document.querySelectorAll('.rc-form-panel');
        
        navItems.forEach(item => {
            item.addEventListener('click', (e) => {
                e.preventDefault();
                const sectionId = item.getAttribute('href');
                const section = document.querySelector(sectionId);
                
                if (section) {
                    const headerHeight = 70;
                    const offset = 100;
                    const targetPosition = section.offsetTop - headerHeight - offset;
                    
                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                    
                    navItems.forEach(nav => nav.classList.remove('active'));
                    item.classList.add('active');
                    
                    if (window.innerWidth <= 1024) {
                        document.getElementById('rc-sidebar').classList.remove('open');
                    }
                }
            });
        });
        
        // Scroll spy
        const observerOptions = {
            root: null,
            rootMargin: '-100px 0px -50%',
            threshold: 0
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    navItems.forEach(item => {
                        item.classList.remove('active');
                        if (item.getAttribute('href') === `#${sectionId}`) {
                            item.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);
        
        sections.forEach(section => observer.observe(section));
    }
    
    /**
     * Form Panel Luxurious Glow Effect
     */
    initFormPanelGlow() {
        const panels = document.querySelectorAll('.rc-form-panel');
        
        panels.forEach(panel => {
            let isHovering = false;
            
            panel.addEventListener('pointerenter', () => {
                isHovering = true;
                panel.classList.add('hovering');
            });
            
            panel.addEventListener('pointerleave', () => {
                isHovering = false;
                panel.classList.remove('hovering');
                panel.style.setProperty('--pointer-x', '-500px');
                panel.style.setProperty('--pointer-y', '-500px');
            });
            
            panel.addEventListener('pointermove', (e) => {
                if (!isHovering) return;
                
                const rect = panel.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                panel.style.setProperty('--pointer-x', `${x}px`);
                panel.style.setProperty('--pointer-y', `${y}px`);
            });
        });
        
        console.log('🔥 Panel glow effect initialized ✓');
    }
    
    /**
     * Dropdown System
     */
    initDropdowns() {
        const dropdowns = document.querySelectorAll('.rc-dropdown-v20');
        
        console.log(`🔥 Found ${dropdowns.length} dropdowns`);
        
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.rc-dropdown-trigger');
            if (!trigger) return;
            
            trigger.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleDropdown(dropdown);
            });
            
            // Search functionality
            const searchInput = dropdown.querySelector('.rc-search-input');
            if (searchInput) {
                searchInput.addEventListener('input', (e) => {
                    const query = e.target.value.toLowerCase();
                    const items = dropdown.querySelectorAll('.rc-dropdown-item');
                    
                    items.forEach(item => {
                        const text = item.textContent.toLowerCase();
                        item.style.display = text.includes(query) ? '' : 'none';
                    });
                });
            }
        });
        
        // Close dropdown when clicking outside
        document.addEventListener('click', () => {
            if (this.activeDropdown) {
                this.closeDropdown(this.activeDropdown);
            }
        });
        
        console.log('🔥 Dropdowns initialized ✓');
    }
    
    toggleDropdown(dropdown) {
        if (this.activeDropdown && this.activeDropdown !== dropdown) {
            this.closeDropdown(this.activeDropdown);
        }
        
        if (dropdown.classList.contains('active')) {
            this.closeDropdown(dropdown);
        } else {
            dropdown.classList.add('active');
            this.activeDropdown = dropdown;
            
            const searchInput = dropdown.querySelector('.rc-search-input');
            if (searchInput) {
                setTimeout(() => searchInput.focus(), 100);
            }
        }
    }
    
    closeDropdown(dropdown) {
        dropdown.classList.remove('active');
        if (this.activeDropdown === dropdown) {
            this.activeDropdown = null;
        }
    }
    
    /**
     * Auto-Suggest for Ports and Countries
     */
    initAutoSuggest() {
        const autosuggestFields = document.querySelectorAll('.rc-autosuggest');
        
        autosuggestFields.forEach(field => {
            const input = field.querySelector('.rc-input');
            const menu = field.querySelector('.rc-suggest-menu');
            const fieldName = field.getAttribute('data-field');
            
            if (!input || !menu) return;
            
            input.addEventListener('input', (e) => {
                const query = e.target.value.trim();
                
                if (query.length < 1) {
                    menu.classList.remove('active');
                    return;
                }
                
                const results = this.getSuggestions(query, fieldName);
                
                if (results.length > 0) {
                    this.renderSuggestions(menu, results, query, fieldName, input);
                    menu.classList.add('active');
                    this.activeSuggest = field;
                } else {
                    menu.classList.remove('active');
                }
            });
            
            input.addEventListener('focus', () => {
                const query = input.value.trim();
                
                // For POL/POD: show all available ports on focus (if route is selected)
                if ((fieldName === 'pol' || fieldName === 'pod') && query.length === 0) {
                    // Show all ports from route
                    if (fieldName === 'pol' && this.availablePOL.length > 0) {
                        menu.classList.add('active');
                        return;
                    } else if (fieldName === 'pod' && this.availablePOD.length > 0) {
                        menu.classList.add('active');
                        return;
                    }
                }
                
                if (query.length >= 1) {
                    const results = this.getSuggestions(query, fieldName);
                    if (results.length > 0) {
                        this.renderSuggestions(menu, results, query, fieldName, input);
                        menu.classList.add('active');
                    }
                }
            });
        });
        
        // Close suggest menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.activeSuggest && !this.activeSuggest.contains(e.target)) {
                const menu = this.activeSuggest.querySelector('.rc-suggest-menu');
                menu.classList.remove('active');
                this.activeSuggest = null;
            }
        });
        
        console.log('🔥 Auto-suggest initialized ✓');
    }
    
    getSuggestions(query, fieldName) {
        query = query.toLowerCase();
        
        if (fieldName === 'pol') {
            // Search in available POL from route, or fallback to manual typing
            if (this.availablePOL.length > 0) {
                return this.availablePOL
                    .filter(port => port.toLowerCase().includes(query))
                    .slice(0, 15)
                    .map(port => ({ name: port, code: port }));
            } else {
                // Fallback: search in full port database
                return this.portDatabase.filter(port => 
                    port.code.toLowerCase().includes(query) ||
                    port.name.toLowerCase().includes(query) ||
                    port.country.toLowerCase().includes(query)
                ).slice(0, 10);
            }
        }
        
        if (fieldName === 'pod') {
            // Search in available POD from route, or fallback to manual typing
            if (this.availablePOD.length > 0) {
                return this.availablePOD
                    .filter(port => port.toLowerCase().includes(query))
                    .slice(0, 15)
                    .map(port => ({ name: port, code: port }));
            } else {
                // Fallback: search in full port database
                return this.portDatabase.filter(port => 
                    port.code.toLowerCase().includes(query) ||
                    port.name.toLowerCase().includes(query) ||
                    port.country.toLowerCase().includes(query)
                ).slice(0, 10);
            }
        }
        
        if (fieldName === 'sellerCountry' || fieldName === 'buyerCountry') {
            return this.countries.filter(country =>
                country.toLowerCase().includes(query)
            ).slice(0, 10);
        }
        
        return [];
    }
    
    renderSuggestions(menu, results, query, fieldName, input) {
        const isPort = fieldName === 'pol' || fieldName === 'pod';
        
        menu.innerHTML = results.map(result => {
            if (isPort) {
                const code = result.code;
                const name = result.name;
                const country = result.country;
                const codeMatch = this.highlightMatch(code, query);
                const nameMatch = this.highlightMatch(name, query);
                
                return `
                    <div class="rc-suggest-item" data-value="${code}" data-name="${name}">
                        <strong>${codeMatch}</strong> — ${nameMatch}, ${country}
                    </div>
                `;
            } else {
                const match = this.highlightMatch(result, query);
                return `
                    <div class="rc-suggest-item" data-value="${result}">
                        ${match}
                    </div>
                `;
            }
        }).join('');
        
        // Add click handlers
        menu.querySelectorAll('.rc-suggest-item').forEach(item => {
            item.addEventListener('click', () => {
                const value = item.getAttribute('data-value');
                const name = item.getAttribute('data-name') || value;
                
                input.value = name;
                this.formData[fieldName] = value;
                menu.classList.remove('active');
                
                // Handle POL/POD selection
                if (fieldName === 'pol') {
                    this.selectPOL(value, name);
                } else if (fieldName === 'pod') {
                    this.selectPOD(value, name);
                } else if (fieldName === 'sellerCountry' || fieldName === 'buyerCountry') {
                    this.formData[fieldName] = value;
                    this.onFormDataChange();
                }
                
                console.log(`✅ Auto-suggest selected: ${fieldName} = ${value}`);
            });
        });
    }
    
    highlightMatch(text, query) {
        if (!text) return '';
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark>$1</mark>');
    }
    
    /**
     * Pill Group Selection
     */
    initPillGroups() {
        const pillGroups = document.querySelectorAll('.rc-pill-group');
        
        pillGroups.forEach(group => {
            const pills = group.querySelectorAll('.rc-pill');
            const fieldName = group.getAttribute('data-field');
            
            // Skip priority field (handled separately)
            if (fieldName === 'priority') return;
            
            pills.forEach(pill => {
                pill.addEventListener('click', () => {
                    const value = pill.getAttribute('data-value');
                    
                    pills.forEach(p => p.classList.remove('active'));
                    pill.classList.add('active');
                    
                    this.formData[fieldName] = value;
                    
                    console.log(`Pill selected: ${fieldName} = ${value}`);
                    this.onFormDataChange();
                });
            });
        });
        
        console.log('🔥 Pill groups initialized ✓');
    }
    
    /**
     * Module Cards
     */
    initModuleCards() {
        const moduleCards = document.querySelectorAll('.rc-module-card');
        
        moduleCards.forEach(card => {
            const checkbox = card.querySelector('.rc-module-checkbox');
            const fieldName = checkbox.getAttribute('data-field');
            
            card.addEventListener('click', (e) => {
                if (e.target === checkbox) return;
                
                checkbox.checked = !checkbox.checked;
                
                // Extract module name from data-field (e.g., "moduleESG" → "esg")
                const moduleName = fieldName.replace('module', '').toLowerCase();
                const shortName = {
                    'esg': 'esg',
                    'weather': 'weather',
                    'portcongestion': 'portCongestion',
                    'carrier': 'carrier',
                    'market': 'market',
                    'insurance': 'insurance'
                }[moduleName] || moduleName;
                
                this.formData.modules[shortName] = checkbox.checked;
                
                console.log(`Module toggled: ${shortName} = ${checkbox.checked}`);
                this.onFormDataChange();
            });
        });
        
        console.log('🔥 Module cards initialized ✓');
    }
    
    /**
     * Upload Zone
     */
    initUploadZone() {
        const uploadZone = document.getElementById('rc-upload-zone');
        const fileInput = document.getElementById('rc-file-input');
        const uploadBtn = document.getElementById('rc-upload-btn');
        const uploadPreview = document.getElementById('rc-upload-preview');
        const fileRemove = document.getElementById('rc-file-remove');
        
        if (!uploadZone || !fileInput) return;
        
        uploadBtn.addEventListener('click', () => {
            fileInput.click();
        });
        
        uploadZone.addEventListener('click', (e) => {
            if (e.target === uploadZone || e.target.closest('.rc-upload-content')) {
                fileInput.click();
            }
        });
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.handleFileUpload(file, uploadPreview);
            }
        });
        
        // Drag & Drop
        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragging');
        });
        
        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragging');
        });
        
        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragging');
            
            const file = e.dataTransfer.files[0];
            if (file) {
                this.handleFileUpload(file, uploadPreview);
            }
        });
        
        if (fileRemove) {
            fileRemove.addEventListener('click', (e) => {
                e.stopPropagation();
                this.uploadedFile = null;
                fileInput.value = '';
                uploadPreview.style.display = 'none';
                document.querySelector('.rc-upload-content').style.display = 'flex';
            });
        }
        
        console.log('🔥 Upload zone initialized ✓');
    }
    
    handleFileUpload(file, preview) {
        const allowedTypes = [
            'application/pdf',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'text/csv'
        ];
        
        if (!allowedTypes.includes(file.type)) {
            this.showToast('Invalid file type. Please upload PDF, Excel, or CSV.', 'error');
            return;
        }
        
        this.uploadedFile = file;
        this.formData.packingFileMeta = {
            name: file.name,
            size: file.size,
            type: file.type
        };
        
        preview.querySelector('.rc-file-name').textContent = file.name;
        preview.querySelector('.rc-file-size').textContent = this.formatFileSize(file.size);
        preview.style.display = 'block';
        document.querySelector('.rc-upload-content').style.display = 'none';
        
        console.log(`File uploaded: ${file.name}`);
        this.showToast(`File uploaded: ${file.name}`, 'success');
    }
    
    formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
    }
    
    /**
     * Input Handlers
     */
    initInputHandlers() {
        const inputs = document.querySelectorAll('input[data-field], textarea[data-field]');
        
        inputs.forEach(input => {
            const fieldName = input.getAttribute('data-field');
            
            input.addEventListener('input', () => {
                this.formData[fieldName] = input.value;
            });
            
            input.addEventListener('change', () => {
                this.formData[fieldName] = input.value;
                
                // Special handling for ETD
                if (fieldName === 'etd') {
                    this.calculateETA();
                }
                
                this.onFormDataChange();
            });
        });
        
        console.log('🔥 Input handlers initialized ✓');
    }
    
    /**
     * Button Handlers
     */
    initButtons() {
        // Reset
        const resetBtn = document.getElementById('rc-btn-reset');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (confirm('Reset form? All data will be lost.')) {
                    this.resetForm();
                }
            });
        }
        
        // Analyze
        const analyzeBtn = document.getElementById('rc-btn-analyze');
        if (analyzeBtn) {
            analyzeBtn.addEventListener('click', () => {
                this.submitForm();
            });
        }
        
        // Submit
        const submitBtn = document.getElementById('rc-btn-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                this.submitForm();
            });
        }
        
        // Save draft
        const saveDraftBtns = document.querySelectorAll('[id^="rc-btn-save-draft"]');
        saveDraftBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.saveDraft();
            });
        });
    }
    
    /**
     * Particle Background
     */
    initParticles() {
        const canvas = document.getElementById('rc-particles-canvas');
        if (!canvas) return;
        
        const ctx = canvas.getContext('2d');
        
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        
        const particles = [];
        const particleCount = 50;
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
        
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            const isDark = document.documentElement.classList.contains('rc-theme-dark');
            const color = isDark ? '0, 255, 204' : '0, 200, 180';
            
            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;
                
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${color}, ${p.opacity})`;
                ctx.fill();
                
                const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius * 4);
                gradient.addColorStop(0, `rgba(${color}, ${p.opacity * 0.8})`);
                gradient.addColorStop(1, `rgba(${color}, 0)`);
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius * 4, 0, Math.PI * 2);
                ctx.fillStyle = gradient;
                ctx.fill();
            });
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    /**
     * Section Animations
     */
    initSectionAnimations() {
        const sections = document.querySelectorAll('.rc-form-panel');
        sections.forEach((section, index) => {
            section.style.setProperty('--section-index', index);
        });
    }
    
    /**
     * Form Submission
     */
    submitForm() {
        console.log('📊 Submitting form:', this.formData);
        
        // Validate required fields
        const errors = this.validateForm();
        
        if (errors.length > 0) {
            this.showToast(`Missing required fields: ${errors.join(', ')}`, 'error');
            this.highlightErrors(errors);
            return;
        }
        
        // Show loading
        this.showToast('Running AI risk analysis...', 'success');
        
        // Save to window state
        window.RC_STATE = this.formData;
        
        // Save to localStorage for overview page (v21 format)
        try {
            const riskScore = this.calculateOverallRisk();
            const riskLevel = riskScore < 30 ? 'low' : riskScore < 60 ? 'medium' : 'high';
            
            // Build shipment snapshot for Overview v21
            const overviewSnapshot = {
                shipment_id: `RC-${Date.now().toString().slice(-6)}`,
                trade_lane_key: this.formData.tradeLane || 'unknown',
                trade_lane_label: this.getTradeLaneLabel(this.formData.tradeLane),
                mode: this.formData.shipmentType || this.formData.mode || 'ocean_fcl',
                mode_label: this.getModeLabel(this.formData.shipmentType || this.formData.mode),
                shipment_type_label: this.getShipmentTypeLabel(this.formData.shipmentType),
                pol_code: this.extractPortCode(this.formData.pol),
                pod_code: this.extractPortCode(this.formData.pod),
                carrier: this.formData.carrier || 'Unknown Carrier',
                etd: this.formData.etd || null,
                eta: this.formData.eta || null,
                transit_days: this.formData.transitDays || null,
                risk_score: riskScore,
                risk_level: riskLevel,
                reliability_score: this.formData.reliability || 85,
                weather: null,  // Will be populated by backend if available
                
                // Keep original data for backward compatibility
                transport: {
                    tradeLane: this.formData.tradeLane,
                    mode: this.formData.mode,
                    shipmentType: this.formData.shipmentType,
                    serviceRoute: this.formData.serviceRoute,
                    carrier: this.formData.carrier,
                    pol: this.formData.pol,
                    pod: this.formData.pod,
                    etd: this.formData.etd,
                    eta: this.formData.eta,
                    transitDays: this.formData.transitDays,
                    schedule: this.formData.schedule,
                    reliability: this.formData.reliability
                },
                cargo: this.formData.cargo,
                seller: this.formData.seller,
                buyer: this.formData.buyer
            };
            
            localStorage.setItem('RC_LIVE_SHIPMENT_V21', JSON.stringify(overviewSnapshot));
            localStorage.setItem('rc_overview_data', JSON.stringify(overviewSnapshot));  // Backward compat
            console.log('✅ Saved overview snapshot to localStorage:', overviewSnapshot);
        } catch (err) {
            console.error('❌ Failed to save overview data:', err);
        }
        
        // Submit to backend
        setTimeout(() => {
            window.location.href = '/overview';
        }, 1500);
    }
    
    /**
     * Calculate overall risk score
     */
    calculateOverallRisk() {
        let risk = 0;
        
        // Transit days risk
        if (this.formData.transitDays > 30) risk += 20;
        else if (this.formData.transitDays > 20) risk += 10;
        else if (this.formData.transitDays > 10) risk += 5;
        
        // Reliability risk
        const reliability = this.formData.reliability || 0;
        if (reliability < 70) risk += 20;
        else if (reliability < 85) risk += 10;
        
        // Missing data risk
        if (!this.formData.carrier) risk += 10;
        if (!this.formData.cargo.cargoType) risk += 10;
        
        return Math.min(100, risk);
    }
    
    /**
     * Extract port code from port string (e.g., "Ho Chi Minh City (SGN)" -> "SGN")
     */
    extractPortCode(portString) {
        if (!portString) return '';
        const match = portString.match(/\(([A-Z]+)\)/);
        return match ? match[1] : portString.toUpperCase();
    }
    
    /**
     * Get trade lane label
     */
    getTradeLaneLabel(key) {
        const labels = {
            'vn_us': 'Vietnam → United States',
            'vn_cn': 'Vietnam → China',
            'vn_eu': 'Vietnam → Europe',
            'vn_hk': 'Vietnam → Hong Kong',
            'cn_us': 'China → United States',
            'cn_eu': 'China → Europe',
            'us_vn': 'United States → Vietnam'
        };
        return labels[key] || key || 'Unknown Route';
    }
    
    /**
     * Get mode label
     */
    getModeLabel(mode) {
        if (!mode) return 'Unknown Mode';
        if (mode.includes('ocean_fcl')) return 'Sea Freight — FCL';
        if (mode.includes('ocean_lcl')) return 'Sea Freight — LCL';
        if (mode.includes('air')) return 'Air Freight';
        if (mode.includes('road')) return 'Road Transport';
        if (mode.includes('rail')) return 'Rail Transport';
        return mode;
    }
    
    /**
     * Get shipment type label
     */
    getShipmentTypeLabel(type) {
        if (!type) return '';
        if (type.includes('ocean_fcl')) return 'Đường Biển — FCL (Nguyên Container)';
        if (type.includes('ocean_lcl')) return 'Đường Biển — LCL (Hàng Lẻ Ghép)';
        if (type.includes('air')) return 'Hàng Không';
        if (type.includes('road')) return 'Đường Bộ';
        if (type.includes('rail')) return 'Đường Sắt';
        return type;
    }
    
    /**
     * Validate Form
     */
    validateForm() {
        const required = ['tradeLane', 'mode', 'pol', 'pod'];
        const errors = [];
        
        required.forEach(field => {
            if (!this.formData[field]) {
                errors.push(field);
            }
        });
        
        return errors;
    }
    
    /**
     * Highlight Errors
     */
    highlightErrors(fields) {
        // Remove existing error classes
        document.querySelectorAll('.rc-input-error').forEach(el => {
            el.classList.remove('rc-input-error');
        });
        
        // Add error class to missing fields
        fields.forEach(field => {
            const input = document.querySelector(`[data-field="${field}"]`);
            if (input) {
                const wrapper = input.closest('.rc-input-wrapper') || 
                               input.closest('.rc-dropdown-v20') ||
                               input.closest('.rc-autosuggest');
                if (wrapper) {
                    wrapper.classList.add('rc-input-error');
                }
            }
        });
    }
    
    /**
     * Save Draft
     */
    saveDraft() {
        localStorage.setItem('rc-form-draft-v20', JSON.stringify(this.formData));
        this.showToast('Draft saved successfully!', 'success');
        console.log('💾 Draft saved');
    }
    
    /**
     * Reset Form (Updated for v20.3)
     */
    resetForm() {
        this.formData = {
            tradeLane: '', mode: '', shipmentType: '', priority: 'balanced',
            serviceRoute: '', serviceRouteData: null,
            carrier: '', pol: '', pod: '', containerType: '',
            etd: '', schedule: '', transitDays: null, seasonality: null,
            eta: '', reliability: null,
            cargo: {
                cargoType: '', hsCode: '', packingType: '', packageCount: null,
                weights: { grossKg: null, netKg: null },
                volumeCbm: null, stackable: true, loadabilityIssues: false,
                insurance: { valueUsd: null, coverageType: '' },
                sensitivity: 'standard',
                temperatureRange: { minC: null, maxC: null },
                dangerousGoods: { isDG: false, unNumber: '', dgClass: '', packingGroup: '' },
                description: '', specialHandling: ''
            },
            seller: {
                companyName: '', country: { name: '', iso2: '' }, city: '', address: '',
                contactPerson: '', contactRole: '', email: '', phone: '',
                businessType: '', taxId: '', incoterm: ''
            },
            buyer: {
                companyName: '', country: { name: '', iso2: '' }, city: '', address: '',
                contactPerson: '', contactRole: '', email: '', phone: '',
                businessType: '', taxId: '', incoterm: ''
            },
            modules: { esg: false, weather: false, portCongestion: false, carrier: false, market: false, insurance: false }
        };
        
        document.querySelectorAll('.rc-input, .rc-textarea').forEach(input => {
            input.value = '';
        });
        
        document.querySelectorAll('.rc-dropdown-value').forEach(span => {
            const trigger = span.closest('.rc-dropdown-trigger');
            if (trigger) {
                const dropdown = trigger.closest('.rc-dropdown-v20');
                const fieldName = dropdown ? dropdown.getAttribute('data-field') : '';
                const placeholders = {
                    'tradeLane': 'Select trade lane',
                    'mode': 'Select mode',
                    'shipmentType': 'Select shipment type',
                    'serviceRoute': 'Select service route',
                    'carrier': 'Select carrier',
                    'containerType': 'Select container',
                    'cargoType': 'Select cargo type',
                    'packingType': 'Select packing'
                };
                span.textContent = placeholders[fieldName] || 'Select...';
            }
        });
        
        document.querySelectorAll('.rc-pill.active, .rc-dropdown-item.selected').forEach(el => {
            el.classList.remove('active', 'selected');
        });
        
        // Reset priority to balanced
        const priorityPills = document.querySelectorAll('.rc-pill-group[data-field="priority"] .rc-pill');
        priorityPills.forEach(pill => {
            if (pill.getAttribute('data-value') === 'balanced') {
                pill.classList.add('active');
            }
        });
        
        document.querySelectorAll('.rc-module-checkbox').forEach(cb => {
            cb.checked = false;
        });
        
        this.uploadedFile = null;
        const fileInput = document.getElementById('rc-file-input');
        if (fileInput) fileInput.value = '';
        
        const uploadPreview = document.getElementById('rc-upload-preview');
        if (uploadPreview) {
            uploadPreview.style.display = 'none';
            document.querySelector('.rc-upload-content').style.display = 'flex';
        }
        
        this.showToast('Form reset successfully', 'success');
        console.log('🔄 Form reset');
    }
    
    /**
     * ============================================================
     * NEW: CARGO V20 INITIALIZATION (International Standard)
     * ============================================================
     */
    initCargoV20() {
        if (!this.logisticsData) {
            setTimeout(() => this.initCargoV20(), 500);
            return;
        }
        
        // Load Cargo Types
        this.loadCargoTypes();
        
        // Load Packing Types
        this.loadPackingTypes();
        
        // Load Insurance Coverage Types
        this.loadInsuranceCoverageTypes();
        
        // Load DG Classes
        this.loadDGClasses();
        
        // Initialize stackability pill group
        this.initStackabilityPills();
        
        // Initialize sensitivity pill group with conditional temperature fields
        this.initSensitivityPills();
        
        // Initialize DG pill group with conditional DG fields
        this.initDGPills();
        
        console.log('🔥 Cargo v20 initialized ✓ (International Standard)');
    }
    
    loadCargoTypes() {
        const menu = document.getElementById('cargoType-menu');
        if (!menu || !this.logisticsData.cargoTypes) return;
        
        menu.innerHTML = '';
        
        this.logisticsData.cargoTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', type.value);
            btn.textContent = type.label;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.formData.cargo.cargoType = type.value;
                this.updateDropdownSelection('cargoType', type.value, type.label);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`✅ Loaded ${this.logisticsData.cargoTypes.length} cargo types`);
    }
    
    loadPackingTypes() {
        const menu = document.getElementById('packingType-menu');
        if (!menu || !this.logisticsData.packingTypes) return;
        
        menu.innerHTML = '';
        
        this.logisticsData.packingTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', type.value);
            btn.textContent = type.label;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.formData.cargo.packingType = type.value;
                this.updateDropdownSelection('packingType', type.value, type.label);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`✅ Loaded ${this.logisticsData.packingTypes.length} packing types`);
    }
    
    loadInsuranceCoverageTypes() {
        const menu = document.getElementById('insuranceCoverage-menu');
        if (!menu || !this.logisticsData.insuranceCoverageTypes) return;
        
        menu.innerHTML = '';
        
        this.logisticsData.insuranceCoverageTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', type.value);
            btn.textContent = type.label;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.formData.cargo.insurance.coverageType = type.value;
                this.updateDropdownSelection('insuranceCoverage', type.value, type.label);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`✅ Loaded ${this.logisticsData.insuranceCoverageTypes.length} insurance coverage types`);
    }
    
    loadDGClasses() {
        const menu = document.getElementById('dgClass-menu');
        if (!menu || !this.logisticsData.dgClasses) return;
        
        menu.innerHTML = '';
        
        this.logisticsData.dgClasses.forEach(cls => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', cls.value);
            btn.textContent = cls.label;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.formData.cargo.dangerousGoods.dgClass = cls.value;
                this.updateDropdownSelection('dgClass', cls.value, cls.label);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`✅ Loaded ${this.logisticsData.dgClasses.length} DG classes`);
    }
    
    initStackabilityPills() {
        const group = document.getElementById('stackableGroup');
        if (!group) return;
        
        const pills = group.querySelectorAll('.rc-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const value = pill.getAttribute('data-value') === 'true';
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.formData.cargo.stackable = value;
                this.onFormDataChange();
            });
        });
    }
    
    initSensitivityPills() {
        const group = document.getElementById('sensitivityGroup');
        if (!group) return;
        
        const pills = group.querySelectorAll('.rc-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const value = pill.getAttribute('data-value');
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.formData.cargo.sensitivity = value;
                
                // Show/hide temperature fields
                const tempFields = document.getElementById('tempRangeFields');
                const tempFields2 = document.getElementById('tempRangeFields2');
                if (value === 'temperature') {
                    if (tempFields) tempFields.style.display = '';
                    if (tempFields2) tempFields2.style.display = '';
                } else {
                    if (tempFields) tempFields.style.display = 'none';
                    if (tempFields2) tempFields2.style.display = 'none';
                }
                
                this.onFormDataChange();
            });
        });
    }
    
    initDGPills() {
        const group = document.getElementById('dgGroup');
        if (!group) return;
        
        const pills = group.querySelectorAll('.rc-pill');
        pills.forEach(pill => {
            pill.addEventListener('click', () => {
                const value = pill.getAttribute('data-value') === 'true';
                pills.forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                this.formData.cargo.dangerousGoods.isDG = value;
                
                // Show/hide DG fields
                const dgFields1 = document.getElementById('dgFields1');
                const dgFields2 = document.getElementById('dgFields2');
                const dgFields3 = document.getElementById('dgFields3');
                
                if (value) {
                    if (dgFields1) dgFields1.style.display = '';
                    if (dgFields2) dgFields2.style.display = '';
                    if (dgFields3) dgFields3.style.display = '';
                } else {
                    if (dgFields1) dgFields1.style.display = 'none';
                    if (dgFields2) dgFields2.style.display = 'none';
                    if (dgFields3) dgFields3.style.display = 'none';
                }
                
                this.onFormDataChange();
            });
        });
    }
    
    /**
     * ============================================================
     * NEW: SELLER & BUYER V20 (Risk-Oriented with Countries & Incoterms)
     * ============================================================
     */
    initSellerBuyerV20() {
        if (!this.logisticsData) {
            setTimeout(() => this.initSellerBuyerV20(), 500);
            return;
        }
        
        // Initialize country dropdowns for both Seller and Buyer
        this.initCountryDropdown('seller');
        this.initCountryDropdown('buyer');
        
        // Initialize business type dropdowns
        this.initBusinessTypeDropdown('seller');
        this.initBusinessTypeDropdown('buyer');
        
        console.log('🔥 Seller & Buyer v20 initialized ✓ (Risk-Oriented)');
    }
    
    initCountryDropdown(party) {
        const dropdownId = `${party}Country`;
        const dropdown = document.getElementById(dropdownId);
        const menu = document.getElementById(`${dropdownId}-menu`);
        const searchInput = document.getElementById(`${dropdownId}Search`);
        
        if (!dropdown || !menu || !this.logisticsData.countries) return;
        
        // Render all countries
        const renderCountries = (filter = '') => {
            menu.innerHTML = '';
            
            const filtered = this.logisticsData.countries.filter(country =>
                country.name.toLowerCase().includes(filter.toLowerCase()) ||
                country.iso2.toLowerCase().includes(filter.toLowerCase())
            );
            
            filtered.forEach(country => {
                const btn = document.createElement('button');
                btn.className = 'rc-dropdown-item';
                btn.setAttribute('data-value', country.iso2);
                btn.innerHTML = `${country.emoji} ${country.name}`;
                
                btn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    
                    if (party === 'seller') {
                        this.formData.seller.country = {
                            name: country.name,
                            iso2: country.iso2
                        };
                    } else {
                        this.formData.buyer.country = {
                            name: country.name,
                            iso2: country.iso2
                        };
                    }
                    
                    this.updateDropdownSelection(dropdownId, country.iso2, `${country.emoji} ${country.name}`);
                    this.onFormDataChange();
                });
                
                menu.appendChild(btn);
            });
        };
        
        // Initial render
        renderCountries();
        
        // Search functionality
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                renderCountries(e.target.value);
            });
        }
        
        console.log(`✅ Loaded ${this.logisticsData.countries.length} countries for ${party}`);
    }
    
    initBusinessTypeDropdown(party) {
        const dropdownId = `${party}BusinessType`;
        const menu = document.getElementById(`${dropdownId}-menu`);
        
        if (!menu || !this.logisticsData.businessTypes) return;
        
        menu.innerHTML = '';
        
        this.logisticsData.businessTypes.forEach(type => {
            const btn = document.createElement('button');
            btn.className = 'rc-dropdown-item';
            btn.setAttribute('data-value', type.value);
            btn.textContent = type.label;
            
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                
                if (party === 'seller') {
                    this.formData.seller.businessType = type.value;
                } else {
                    this.formData.buyer.businessType = type.value;
                }
                
                this.updateDropdownSelection(dropdownId, type.value, type.label);
                this.onFormDataChange();
            });
            
            menu.appendChild(btn);
        });
        
        console.log(`✅ Loaded business types for ${party}`);
    }
    
    
    /**
     * ============================================================
     * NEW: CONDITIONAL FIELDS (Temperature, DG, etc.)
     * ============================================================
     */
    initConditionalFields() {
        // Bind cargo input fields to nested state
        this.bindCargoInputs();
        
        // Bind seller input fields
        this.bindSellerInputs();
        
        // Bind buyer input fields
        this.bindBuyerInputs();
        
        console.log('🔥 Conditional fields initialized ✓');
    }
    
    bindCargoInputs() {
        // HS Code
        const hsCode = document.getElementById('hsCode');
        if (hsCode) {
            hsCode.addEventListener('input', (e) => {
                this.formData.cargo.hsCode = e.target.value;
            });
        }
        
        // Package Count
        const packageCount = document.getElementById('packageCount');
        if (packageCount) {
            packageCount.addEventListener('input', (e) => {
                this.formData.cargo.packageCount = parseInt(e.target.value) || null;
            });
        }
        
        // Gross Weight
        const grossWeight = document.getElementById('grossWeight');
        if (grossWeight) {
            grossWeight.addEventListener('input', (e) => {
                this.formData.cargo.weights.grossKg = parseFloat(e.target.value) || null;
            });
        }
        
        // Net Weight
        const netWeight = document.getElementById('netWeight');
        if (netWeight) {
            netWeight.addEventListener('input', (e) => {
                this.formData.cargo.weights.netKg = parseFloat(e.target.value) || null;
            });
        }
        
        // Volume
        const volumeCbm = document.getElementById('volumeCbm');
        if (volumeCbm) {
            volumeCbm.addEventListener('input', (e) => {
                this.formData.cargo.volumeCbm = parseFloat(e.target.value) || null;
            });
        }
        
        // Insurance Value
        const insuranceValue = document.getElementById('insuranceValue');
        if (insuranceValue) {
            insuranceValue.addEventListener('input', (e) => {
                this.formData.cargo.insurance.valueUsd = parseFloat(e.target.value) || null;
            });
        }
        
        // Temperature Range
        const tempMin = document.getElementById('tempMin');
        if (tempMin) {
            tempMin.addEventListener('input', (e) => {
                this.formData.cargo.temperatureRange.minC = parseFloat(e.target.value) || null;
            });
        }
        
        const tempMax = document.getElementById('tempMax');
        if (tempMax) {
            tempMax.addEventListener('input', (e) => {
                this.formData.cargo.temperatureRange.maxC = parseFloat(e.target.value) || null;
            });
        }
        
        // DG UN Number
        const dgUnNumber = document.getElementById('dgUnNumber');
        if (dgUnNumber) {
            dgUnNumber.addEventListener('input', (e) => {
                this.formData.cargo.dangerousGoods.unNumber = e.target.value;
            });
        }
        
        // DG Packing Group
        const dgPackingGroup = document.getElementById('dgPackingGroup');
        if (dgPackingGroup) {
            const items = dgPackingGroup.querySelectorAll('.rc-dropdown-item');
            items.forEach(item => {
                item.addEventListener('click', (e) => {
                    e.stopPropagation();
                    const value = item.getAttribute('data-value');
                    this.formData.cargo.dangerousGoods.packingGroup = value;
                    this.updateDropdownSelection('dgPackingGroup', value, `Packing Group ${value}`);
                });
            });
        }
        
        // Cargo Description
        const cargoDescription = document.getElementById('cargoDescription');
        if (cargoDescription) {
            cargoDescription.addEventListener('input', (e) => {
                this.formData.cargo.description = e.target.value;
            });
        }
        
        // Special Handling
        const specialHandling = document.getElementById('specialHandling');
        if (specialHandling) {
            specialHandling.addEventListener('input', (e) => {
                this.formData.cargo.specialHandling = e.target.value;
            });
        }
        
        // Loadability Issues Toggle
        const loadabilityIssues = document.getElementById('loadabilityIssues');
        if (loadabilityIssues) {
            loadabilityIssues.addEventListener('change', (e) => {
                this.formData.cargo.loadabilityIssues = e.target.checked;
            });
        }
    }
    
    bindSellerInputs() {
        // Company Name
        const sellerCompany = document.getElementById('sellerCompany');
        if (sellerCompany) {
            sellerCompany.addEventListener('input', (e) => {
                this.formData.seller.companyName = e.target.value;
            });
        }
        
        // City
        const sellerCity = document.getElementById('sellerCity');
        if (sellerCity) {
            sellerCity.addEventListener('input', (e) => {
                this.formData.seller.city = e.target.value;
            });
        }
        
        // Address
        const sellerAddress = document.getElementById('sellerAddress');
        if (sellerAddress) {
            sellerAddress.addEventListener('input', (e) => {
                this.formData.seller.address = e.target.value;
            });
        }
        
        // Contact Person
        const sellerContact = document.getElementById('sellerContact');
        if (sellerContact) {
            sellerContact.addEventListener('input', (e) => {
                this.formData.seller.contactPerson = e.target.value;
            });
        }
        
        // Contact Role
        const sellerContactRole = document.getElementById('sellerContactRole');
        if (sellerContactRole) {
            sellerContactRole.addEventListener('input', (e) => {
                this.formData.seller.contactRole = e.target.value;
            });
        }
        
        // Email
        const sellerEmail = document.getElementById('sellerEmail');
        if (sellerEmail) {
            sellerEmail.addEventListener('input', (e) => {
                this.formData.seller.email = e.target.value;
            });
        }
        
        // Phone
        const sellerPhone = document.getElementById('sellerPhone');
        if (sellerPhone) {
            sellerPhone.addEventListener('input', (e) => {
                this.formData.seller.phone = e.target.value;
            });
        }
        
        // Tax ID
        const sellerTaxId = document.getElementById('sellerTaxId');
        if (sellerTaxId) {
            sellerTaxId.addEventListener('input', (e) => {
                this.formData.seller.taxId = e.target.value;
            });
        }
    }
    
    bindBuyerInputs() {
        // Company Name
        const buyerCompany = document.getElementById('buyerCompany');
        if (buyerCompany) {
            buyerCompany.addEventListener('input', (e) => {
                this.formData.buyer.companyName = e.target.value;
            });
        }
        
        // City
        const buyerCity = document.getElementById('buyerCity');
        if (buyerCity) {
            buyerCity.addEventListener('input', (e) => {
                this.formData.buyer.city = e.target.value;
            });
        }
        
        // Address
        const buyerAddress = document.getElementById('buyerAddress');
        if (buyerAddress) {
            buyerAddress.addEventListener('input', (e) => {
                this.formData.buyer.address = e.target.value;
            });
        }
        
        // Contact Person
        const buyerContact = document.getElementById('buyerContact');
        if (buyerContact) {
            buyerContact.addEventListener('input', (e) => {
                this.formData.buyer.contactPerson = e.target.value;
            });
        }
        
        // Contact Role
        const buyerContactRole = document.getElementById('buyerContactRole');
        if (buyerContactRole) {
            buyerContactRole.addEventListener('input', (e) => {
                this.formData.buyer.contactRole = e.target.value;
            });
        }
        
        // Email
        const buyerEmail = document.getElementById('buyerEmail');
        if (buyerEmail) {
            buyerEmail.addEventListener('input', (e) => {
                this.formData.buyer.email = e.target.value;
            });
        }
        
        // Phone
        const buyerPhone = document.getElementById('buyerPhone');
        if (buyerPhone) {
            buyerPhone.addEventListener('input', (e) => {
                this.formData.buyer.phone = e.target.value;
            });
        }
        
        // Tax ID
        const buyerTaxId = document.getElementById('buyerTaxId');
        if (buyerTaxId) {
            buyerTaxId.addEventListener('input', (e) => {
                this.formData.buyer.taxId = e.target.value;
            });
        }
    }
    
    /**
     * On Form Data Change - UPDATE SUMMARY
     */
    onFormDataChange() {
        // Update global state
        window.RC_STATE = this.formData;
        
        // Update summary
        this.updateSummary();
    }
    
    /**
     * UPDATE SUMMARY - Full implementation
     */
    updateSummary() {
        console.log('📝 Updating summary...');
        
        const summary = {
            tradeLane: this.formData.tradeLane || 'Not selected',
            mode: this.formData.mode || 'Not selected',
            shipmentType: this.formData.shipmentType || 'Not selected',
            priority: this.formData.priority || 'balanced',
            carrier: this.formData.carrier || 'Not selected',
            pol: this.formData.pol || 'Not set',
            pod: this.formData.pod || 'Not set',
            transitDays: this.formData.transitDays || 'N/A',
            reliability: this.formData.reliability || 'N/A',
            eta: this.formData.eta || 'N/A',
            riskScore: this.calculatePreviewRiskScore()
        };
        
        console.log('📊 Summary:', summary);
        
        // Store summary in window for other components
        window.RC_SUMMARY = summary;
        
        return summary;
    }
    
    /**
     * Calculate preview risk score (basic)
     */
    calculatePreviewRiskScore() {
        let score = 50; // Base score
        
        // Adjust based on mode
        if (this.formData.mode === 'SEA') score -= 5;
        if (this.formData.mode === 'AIR') score += 10;
        
        // Adjust based on reliability
        if (this.formData.reliability) {
            score -= (this.formData.reliability - 80) * 0.5;
        }
        
        // Adjust based on transit time
        if (this.formData.transitDays) {
            if (this.formData.transitDays > 30) score += 10;
            else if (this.formData.transitDays < 10) score += 5;
        }
        
        return Math.max(0, Math.min(100, Math.round(score)));
    }
    
    /**
     * Toast Notification
     */
    showToast(message, type = 'info') {
        const container = document.getElementById('rc-toast-container');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = 'rc-toast';
        
        const iconName = {
            'success': 'check-circle',
            'error': 'alert-circle',
            'info': 'info'
        }[type] || 'info';
        
        toast.innerHTML = `
            <i data-lucide="${iconName}"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100px)';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// ========================================================================
// AUTO-INITIALIZE ON DOM READY
// ========================================================================
document.addEventListener('DOMContentLoaded', () => {
    if (window.__RC_V20_INITIALIZED__) {
        console.warn('⚠️ RISKCAST v20.2 already initialized');
        return;
    }
    window.__RC_V20_INITIALIZED__ = true;
    
    console.log('🚀 RISKCAST v20.2 — Initializing...');
    
    window.RC_V20 = new RiskcastInputControllerV20();
    window.RC_V20.init();
    
    window.RC_STATE = window.RC_V20.formData;
    
    console.log('✅ RISKCAST v20.2 — Ready! All features loaded.');
});
