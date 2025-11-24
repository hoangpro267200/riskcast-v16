/**
 * ============================================================
 * SMART INPUT SYSTEM - RISKCAST v12.5
 * ============================================================
 * 
 * Xử lý các tính năng thông minh cho form input:
 * 1. Country → Route → Transport Auto-suggest
 * 2. Port Selector với search
 * 3. Smart Container Recommendation
 * 4. Transit Time Auto-calculation + Calendar
 * 5. Real-time Validation + Visual Feedback
 * 6. Smart Defaults based on Industry Data
 * 7. Conditional Field Visibility
 * 8. Copy from Previous Shipment
 * 9. Mobile Optimization
 * 10. Enhanced Demo Mode
 * 
 * Tương thích với cấu trúc HTML/CSS/JS hiện có
 * ============================================================
 */

// ============================================================
// GLOBAL STATE MANAGEMENT
// ============================================================

const SmartInputState = {
    selectedRoute: null,
    selectedTransportMode: null,
    selectedPOL: null,
    selectedPOD: null,
    selectedCargoType: null,
    recentShipments: [],
    validationErrors: {},
    completedFields: new Set(),
    initialized: false
};

// ============================================================
// CHỨC NĂNG CHÍNH: ROUTE → TRANSPORT → POL/POD → AUTO-FILL
// ============================================================

/**
 * Initialize Route-Based Suggestions
 */
function initRouteBasedSuggestions() {
    console.log('✓ [INIT] Route-Based Suggestions activated');
    
    const routeDropdown = document.getElementById('route_dropdown');
    if (!routeDropdown) {
        console.warn('⚠️ Route dropdown not found');
        return;
    }
    
    // Listen for option selection trong route dropdown
    const routeOptions = routeDropdown.querySelectorAll('.dropdown-option');
    routeOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            const routeKey = this.getAttribute('data-value');
            if (routeKey) {
                console.log('📍 Route option clicked:', routeKey);
                // Wait a bit for dropdown to close
                setTimeout(() => {
                    handleRouteSelection(routeKey);
                }, 200);
            }
        });
    });
    
    // Also check if route is already selected on page load
    setTimeout(() => {
        const selectedRoute = getDropdownValue('route_dropdown');
        if (selectedRoute) {
            console.log('📍 Found pre-selected route:', selectedRoute);
            handleRouteSelection(selectedRoute);
        }
    }, 500);
    
    // Listen for manual selection changes
    const observer = new MutationObserver(() => {
        const selectedOption = routeDropdown.querySelector('.dropdown-option.selected');
        if (selectedOption) {
            const routeKey = selectedOption.getAttribute('data-value');
            if (routeKey && routeKey !== SmartInputState.selectedRoute) {
                console.log('📍 Route changed via mutation:', routeKey);
                handleRouteSelection(routeKey);
            }
        }
    });
    
    observer.observe(routeDropdown, { 
        childList: true, 
        subtree: true, 
        attributes: true,
        attributeFilter: ['class']
    });
}

/**
 * Xử lý khi user chọn ROUTE
 */
function handleRouteSelection(routeKey) {
    if (!routeKey) {
        const routeValue = getDropdownValue('route_dropdown');
        if (!routeValue) return;
        routeKey = routeValue;
    }
    
    console.log(`📍 Route selected: ${routeKey}`);
    SmartInputState.selectedRoute = routeKey;
    
    // 1. Populate Transport Modes
    populateTransportModes(routeKey);
    
    // 2. Reset dependent fields
    resetTransportDependentFields();
}

/**
 * Populate Transport Modes dựa trên Route
 */
function populateTransportModes(routeKey) {
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.routes[routeKey]) {
        console.error('❌ Route data not found:', routeKey);
        return;
    }
    
    const routeData = window.LOGISTICS_DATA.routes[routeKey];
    const transportModes = routeData.transport_modes;
    
    if (!transportModes || transportModes.length === 0) {
        console.warn('⚠️ No transport modes for route:', routeKey);
        return;
    }
    
    console.log(`✓ Found ${transportModes.length} transport modes for ${routeKey}`);
    
    // Get transport dropdown elements
    const transportDropdown = document.getElementById('transport_mode_dropdown');
    const transportMenu = document.getElementById('transport_mode_menu');
    const transportTrigger = transportDropdown?.querySelector('.dropdown-trigger .dropdown-value');
    
    if (!transportMenu) {
        console.error('❌ Transport mode menu not found');
        return;
    }
    
    // Clear existing options
    transportMenu.innerHTML = '';
    
    // Populate new options
    transportModes.forEach((mode, index) => {
        const option = document.createElement('div');
        option.className = 'dropdown-option';
        if (mode.default) {
            option.classList.add('recommended');
        }
        option.setAttribute('data-value', mode.value);
        option.setAttribute('role', 'option');
        
        option.innerHTML = `
            <div class="transport-option-content">
                <div class="transport-label">
                    ${mode.label}
                    ${mode.default ? '<span class="badge-recommended">Đề xuất</span>' : ''}
                </div>
                <div class="transport-meta">
                    <span class="transport-time">${mode.days || mode.hours}</span>
                    <span class="transport-share">${mode.share}% thị phần</span>
                </div>
            </div>
        `;
        
        // Add click handler - tương thích với custom dropdown system
        option.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Mark as selected
            transportMenu.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Lấy lại mode object từ LOGISTICS_DATA để đảm bảo có đầy đủ data
            const routeData = window.LOGISTICS_DATA?.routes[routeKey];
            const fullMode = routeData?.transport_modes?.find(m => m.value === mode.value);
            
            // Select the mode với full data
            selectTransportMode(fullMode || mode, routeKey);
            
            // Close dropdown
            if (transportDropdown) {
                transportDropdown.classList.remove('active');
            }
        });
        
        transportMenu.appendChild(option);
    });
    
    // Đảm bảo dropdown có thể mở được
    if (transportDropdown) {
        const trigger = transportDropdown.querySelector('.dropdown-trigger');
        if (trigger) {
            // Remove old listeners và add new one
            const newTrigger = trigger.cloneNode(true);
            trigger.parentNode.replaceChild(newTrigger, trigger);
            
            newTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                // Toggle dropdown
                if (transportDropdown.classList.contains('active')) {
                    transportDropdown.classList.remove('active');
                } else {
                    transportDropdown.classList.add('active');
                }
            });
        }
    }
    
    // Enable dropdown
    if (transportTrigger) {
        transportTrigger.textContent = 'Chọn phương thức vận tải';
        transportTrigger.classList.remove('placeholder');
    }
    
    // Auto-select default mode
    const defaultMode = transportModes.find(m => m.default);
    if (defaultMode) {
        setTimeout(() => {
            // Đảm bảo lấy full mode object từ LOGISTICS_DATA
            const routeData = window.LOGISTICS_DATA?.routes[routeKey];
            const fullDefaultMode = routeData?.transport_modes?.find(m => m.value === defaultMode.value);
            selectTransportMode(fullDefaultMode || defaultMode, routeKey);
        }, 300);
    }
    
    console.log('✓ Transport modes populated successfully');
}

/**
 * Xử lý khi user chọn TRANSPORT MODE
 */
function selectTransportMode(mode, routeKey) {
    console.log(`🚢 Transport mode selected: ${mode.label}`);
    
    // Update dropdown UI
    const transportDropdown = document.getElementById('transport_mode_dropdown');
    const valueSpan = transportDropdown?.querySelector('.dropdown-value');
    if (valueSpan) {
        valueSpan.textContent = mode.label;
        valueSpan.classList.remove('placeholder');
    }
    
    // Update hidden input
    const hiddenInput = document.getElementById('transport_mode_input');
    if (hiddenInput) {
        hiddenInput.value = mode.value;
    }
    
    // Mark selected option
    transportDropdown?.querySelectorAll('.dropdown-option').forEach(opt => {
        opt.classList.remove('selected');
        if (opt.getAttribute('data-value') === mode.value) {
            opt.classList.add('selected');
        }
    });
    
    // Close dropdown
    transportDropdown?.classList.remove('active');
    
    // Show market share hint
    const hintElement = document.getElementById('transport_mode_hint');
    if (hintElement) {
        hintElement.textContent = `✓ ${mode.share}% thị phần - ${mode.days || mode.hours}`;
        hintElement.style.color = '#00ffc3';
    }
    
    // Show recommended badge
    const badge = document.getElementById('transport_recommended_badge');
    if (badge && mode.default) {
        badge.style.display = 'inline-block';
    }
    
    // Populate POL/POD options
    populatePortOptions(mode, routeKey);
}

/**
 * Populate POL/POD Options
 */
function populatePortOptions(mode, routeKey) {
    console.log('🔍 populatePortOptions called with mode:', mode);
    
    if (!mode.routes || mode.routes.length === 0) {
        console.warn('⚠️ No port routes available for this mode:', mode.value);
        console.warn('   Mode object:', mode);
        return;
    }
    
    console.log(`✓ Found ${mode.routes.length} port routes:`, mode.routes);
    
    // Get POL dropdown
    const polDropdown = document.getElementById('pol_dropdown');
    const polMenu = document.getElementById('pol_menu');
    const polTrigger = polDropdown?.querySelector('.dropdown-value');
    
    // Get POD dropdown
    const podDropdown = document.getElementById('pod_dropdown');
    const podMenu = document.getElementById('pod_menu');
    const podTrigger = podDropdown?.querySelector('.dropdown-value');
    
    if (!polMenu || !podMenu) {
        console.error('❌ POL/POD menus not found');
        return;
    }
    
    // Clear existing
    polMenu.innerHTML = '';
    podMenu.innerHTML = '';
    
    // Get unique POLs
    const uniquePOLs = [...new Set(mode.routes.map(r => r.pol))];
    uniquePOLs.forEach(pol => {
        const polOption = document.createElement('div');
        polOption.className = 'dropdown-option';
        polOption.setAttribute('data-value', pol);
        polOption.setAttribute('role', 'option');
        polOption.textContent = pol;
        
        polOption.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Mark as selected
            polMenu.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Select POL
            selectPOL(pol, mode, polDropdown, podDropdown);
            
            // Close dropdown
            if (polDropdown) {
                polDropdown.classList.remove('active');
            }
        });
        
        polMenu.appendChild(polOption);
    });
    
    // Enable POL dropdown
    if (polTrigger) {
        polTrigger.textContent = 'Chọn cảng bốc hàng';
        polTrigger.classList.remove('placeholder');
    }
    
    // Setup POL dropdown trigger - tương thích với custom dropdown system
    if (polDropdown) {
        const polTriggerBtn = polDropdown.querySelector('.dropdown-trigger');
        if (polTriggerBtn) {
            // Remove existing listeners by cloning
            const newTrigger = polTriggerBtn.cloneNode(true);
            polTriggerBtn.parentNode.replaceChild(newTrigger, polTriggerBtn);
            
            newTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Close other dropdowns
                document.querySelectorAll('.custom-dropdown.active').forEach(dd => {
                    if (dd !== polDropdown) {
                        dd.classList.remove('active');
                    }
                });
                
                // Toggle this dropdown
                polDropdown.classList.toggle('active');
                
                console.log('📍 POL dropdown toggled, active:', polDropdown.classList.contains('active'));
                console.log('📍 POL options count:', polMenu.children.length);
            });
        }
    }
    
    // Auto-select first POL
    if (uniquePOLs.length > 0) {
        setTimeout(() => {
            selectPOL(uniquePOLs[0], mode, polDropdown, podDropdown);
        }, 200);
    }
}

/**
 * Select POL and populate PODs
 */
function selectPOL(pol, mode, polDropdown, podDropdown) {
    console.log(`📍 POL selected: ${pol}`);
    
    // Update POL UI
    const polValue = polDropdown?.querySelector('.dropdown-value');
    if (polValue) {
        polValue.textContent = pol;
        polValue.classList.remove('placeholder');
    }
    polDropdown?.classList.remove('active');
    
    // Update hidden input
    const polInput = document.getElementById('pol_input');
    if (polInput) {
        polInput.value = pol;
    }
    
    // Get matching PODs
    const matchingRoutes = mode.routes.filter(r => r.pol === pol);
    const podMenu = document.getElementById('pod_menu');
    const podTrigger = podDropdown?.querySelector('.dropdown-value');
    
    if (!podMenu) return;
    
    podMenu.innerHTML = '';
    
    matchingRoutes.forEach(route => {
        const podOption = document.createElement('div');
        podOption.className = 'dropdown-option';
        podOption.setAttribute('data-value', route.pod);
        podOption.innerHTML = `
            <div class="port-option-content">
                <div class="port-name">${route.pod}</div>
                <div class="port-meta">
                    ${route.km ? `${route.km.toLocaleString()} km` : ''} • 
                    ${route.days ? `${route.days} ngày` : `${route.hours} giờ`}
                </div>
            </div>
        `;
        
        podOption.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            
            // Mark as selected
            podMenu.querySelectorAll('.dropdown-option').forEach(opt => {
                opt.classList.remove('selected');
            });
            this.classList.add('selected');
            
            // Select POD
            selectPOD(route, podDropdown);
            
            // Close dropdown
            if (podDropdown) {
                podDropdown.classList.remove('active');
            }
        });
        
        podMenu.appendChild(podOption);
    });
    
    // Setup POD dropdown trigger - tương thích với custom dropdown system
    if (podDropdown) {
        const podTriggerBtn = podDropdown.querySelector('.dropdown-trigger');
        if (podTriggerBtn) {
            // Remove existing listeners by cloning
            const newTrigger = podTriggerBtn.cloneNode(true);
            podTriggerBtn.parentNode.replaceChild(newTrigger, podTriggerBtn);
            
            newTrigger.addEventListener('click', function(e) {
                e.stopPropagation();
                e.preventDefault();
                
                // Close other dropdowns
                document.querySelectorAll('.custom-dropdown.active').forEach(dd => {
                    if (dd !== podDropdown) {
                        dd.classList.remove('active');
                    }
                });
                
                // Toggle this dropdown
                podDropdown.classList.toggle('active');
                
                console.log('🏁 POD dropdown toggled, active:', podDropdown.classList.contains('active'));
                console.log('🏁 POD options count:', podMenu.children.length);
            });
        }
    }
    
    // Enable POD dropdown
    if (podTrigger) {
        podTrigger.textContent = 'Chọn cảng dỡ hàng';
        podTrigger.classList.remove('placeholder');
    }
    
    // Auto-select first POD
    if (matchingRoutes.length > 0) {
        setTimeout(() => {
            selectPOD(matchingRoutes[0], podDropdown);
        }, 200);
    }
}

/**
 * Select POD and auto-fill distance + transit time
 */
function selectPOD(route, podDropdown) {
    console.log(`🏁 POD selected: ${route.pod}`);
    
    // Update POD UI
    const podValue = podDropdown?.querySelector('.dropdown-value');
    if (podValue) {
        podValue.textContent = route.pod;
        podValue.classList.remove('placeholder');
    }
    podDropdown?.classList.remove('active');
    
    // Update hidden input
    const podInput = document.getElementById('pod_input');
    if (podInput) {
        podInput.value = route.pod;
    }
    
    // Auto-fill distance
    if (route.km) {
        const distanceInput = document.getElementById('distance');
        if (distanceInput) {
            distanceInput.value = route.km;
            animateAutoFill(distanceInput);
            console.log(`✓ Auto-filled distance: ${route.km} km`);
        }
    }
    
    // Auto-fill transit time
    if (route.days || route.hours) {
        const transitDisplay = document.getElementById('transit_time_display');
        const transitHidden = document.getElementById('transit_time');
        
        if (transitDisplay) {
            if (route.days) {
                transitDisplay.value = `${route.days} ngày`;
                if (transitHidden) transitHidden.value = route.days;
            } else if (route.hours) {
                const days = Math.ceil(route.hours / 24);
                transitDisplay.value = `${route.hours} giờ (${days} ngày)`;
                if (transitHidden) transitHidden.value = days;
            }
            animateAutoFill(transitDisplay);
            console.log(`✓ Auto-filled transit time: ${route.days || route.hours}`);
        }
    }
}

/**
 * Animate auto-fill effect
 */
function animateAutoFill(element) {
    element.style.transition = 'all 0.5s ease';
    element.style.backgroundColor = 'rgba(0, 255, 136, 0.2)';
    element.style.borderColor = '#00ffc3';
    
    setTimeout(() => {
        element.style.backgroundColor = 'rgba(0, 255, 136, 0.05)';
    }, 1000);
}

/**
 * Reset dependent fields
 */
function resetTransportDependentFields() {
    // Reset transport mode
    const transportDropdown = document.getElementById('transport_mode_dropdown');
    const transportValue = transportDropdown?.querySelector('.dropdown-value');
    if (transportValue) {
        transportValue.textContent = 'Chọn phương thức vận tải';
        transportValue.classList.add('placeholder');
    }
    
    // Reset POL/POD
    const polDropdown = document.getElementById('pol_dropdown');
    const podDropdown = document.getElementById('pod_dropdown');
    
    if (polDropdown) {
        const polValue = polDropdown.querySelector('.dropdown-value');
        if (polValue) {
            polValue.textContent = 'Chọn phương thức trước';
            polValue.classList.add('placeholder');
        }
    }
    
    if (podDropdown) {
        const podValue = podDropdown.querySelector('.dropdown-value');
        if (podValue) {
            podValue.textContent = 'Chọn phương thức trước';
            podValue.classList.add('placeholder');
        }
    }
    
    // Reset distance and transit time
    const distanceInput = document.getElementById('distance');
    const transitDisplay = document.getElementById('transit_time_display');
    
    if (distanceInput) distanceInput.value = '';
    if (transitDisplay) transitDisplay.value = '';
}

// ============================================================
// TÍNH NĂNG 1: COUNTRY → ROUTE → TRANSPORT AUTO-SUGGEST
// ============================================================

/**
 * Khởi tạo event listeners cho Country Selector
 */
function initCountryAutoSuggest() {
    console.log('✓ [INIT] Country Auto-suggest activated');
    
    // Lấy dropdowns (phải tương thích với structure hiện có)
    const sellerDropdown = document.getElementById('seller_country_dropdown') || 
                           document.querySelector('[id*="seller_country"]');
    const buyerDropdown = document.getElementById('buyer_country_dropdown') || 
                          document.querySelector('[id*="buyer_country"]');
    
    if (!sellerDropdown || !buyerDropdown) {
        console.warn('⚠️ Country dropdowns not found, skipping auto-suggest');
        return;
    }
    
    // Listen thay đổi trên cả 2 dropdowns
    sellerDropdown.addEventListener('change', handleCountryChange);
    buyerDropdown.addEventListener('change', handleCountryChange);
    
    console.log('✓ Country auto-suggest listeners registered');
}

/**
 * Xử lý khi người dùng thay đổi Seller hoặc Buyer Country
 */
function handleCountryChange() {
    const sellerCountry = getSelectedValue('seller_country_dropdown') || 
                         getSelectedValue('seller_country') ||
                         getDropdownValue('seller_country');
    const buyerCountry = getSelectedValue('buyer_country_dropdown') || 
                        getSelectedValue('buyer_country') ||
                        getDropdownValue('buyer_country');
    
    console.log(`📍 Country changed: ${sellerCountry} → ${buyerCountry}`);
    
    // Chỉ xử lý khi cả 2 đã có giá trị
    if (!sellerCountry || !buyerCountry) {
        console.log('⏸️ Waiting for both countries to be selected');
        return;
    }
    
    // Gọi auto-suggest route
    autoSuggestRoute(sellerCountry, buyerCountry);
}

/**
 * Tự động gợi ý tuyến đường dựa trên seller + buyer country
 */
function autoSuggestRoute(seller, buyer) {
    console.log(`🔍 Auto-suggesting route: ${seller} → ${buyer}`);
    
    // Xác định route key
    let routeKey = null;
    
    // Vietnam exports
    if (seller === 'vn' || seller === 'vietnam') {
        if (buyer === 'us' || buyer === 'united_states') routeKey = 'vn_us';
        else if (buyer === 'cn' || buyer === 'china') routeKey = 'vn_cn';
        else if (buyer === 'kr' || buyer === 'south_korea') routeKey = 'vn_kr';
        else if (buyer === 'jp' || buyer === 'japan') routeKey = 'vn_jp';
        else if (buyer === 'eu' || buyer === 'nl' || buyer === 'de' || buyer === 'europe') routeKey = 'vn_eu';
        else if (buyer === 'hk' || buyer === 'hong_kong') routeKey = 'vn_hk';
        else if (buyer === 'in' || buyer === 'india') routeKey = 'vn_in';
        else if (buyer === 'th' || buyer === 'thailand') routeKey = 'vn_th';
        else if (buyer === 'tw' || buyer === 'taiwan') routeKey = 'vn_tw';
    }
    
    // Domestic route
    if (seller === buyer || (seller === 'vn' && buyer === 'vn')) {
        routeKey = 'domestic';
    }
    
    // Nếu tìm thấy route trong data
    if (routeKey && window.LOGISTICS_DATA && window.LOGISTICS_DATA.routes[routeKey]) {
        const routeData = window.LOGISTICS_DATA.routes[routeKey];
        
        console.log(`✓ Found route: ${routeData.name_vi || routeData.name}`);
        
        // Auto-select route dropdown với animation
        setTimeout(() => {
            selectDropdownOption('route_dropdown', routeKey);
            SmartInputState.selectedRoute = routeKey;
            
            // Trigger transport mode suggestion
            autoSuggestTransportModes(routeKey);
            
            // Auto-fill distance
            autoFillDistance(routeData.distance_km);
            
            // Visual feedback
            showSuccessTooltip('route_dropdown', `✓ Tuyến ${routeData.name_vi || routeData.name} được chọn tự động`);
            
        }, 200); // Small delay for smooth animation
        
    } else {
        console.log('⚠️ No matching route found in database');
    }
}

/**
 * Tự động gợi ý phương thức vận tải dựa trên tuyến đường
 */
function autoSuggestTransportModes(routeKey) {
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.routes[routeKey]) {
        console.warn('⚠️ LOGISTICS_DATA not available');
        return;
    }
    
    const routeData = window.LOGISTICS_DATA.routes[routeKey];
    
    if (!routeData || !routeData.transport_modes) {
        console.warn('⚠️ No transport modes found for route:', routeKey);
        return;
    }
    
    console.log(`🚢 Auto-suggesting transport modes for route: ${routeKey}`);
    
    // Lấy transport mode dropdown (tương thích với custom dropdown hiện có)
    const transportDropdown = document.getElementById('transport_mode_dropdown') ||
                             document.querySelector('[id*="transport_mode"]');
    if (!transportDropdown) return;
    
    // Tìm mode default (share cao nhất)
    const availableModes = routeData.transport_modes;
    const defaultMode = availableModes.find(m => m.default === true) || availableModes[0];
    
    if (defaultMode) {
        console.log(`✓ Default transport mode: ${defaultMode.label} (${defaultMode.share}% market share)`);
        
        // Auto-select với animation
        setTimeout(() => {
            selectDropdownOption('transport_mode_dropdown', defaultMode.value);
            SmartInputState.selectedTransportMode = defaultMode.value;
            
            // Hiện tooltip với market share
            const tooltip = `✓ ${defaultMode.label} - Chiếm ${defaultMode.share}% thị phần`;
            showSuccessTooltip('transport_mode_dropdown', tooltip);
            
            // Trigger port suggestions
            autoSuggestPorts(routeKey);
            
            // Trigger Incoterm recommendation
            autoFillIncoterm(defaultMode.value);
            
        }, 400);
    }
}

/**
 * Tự động điền khoảng cách
 */
function autoFillDistance(distanceKm) {
    const distanceInput = document.getElementById('distance') || 
                         document.getElementById('distance_input');
    
    if (distanceInput && distanceKm) {
        console.log(`📏 Auto-filling distance: ${distanceKm} km`);
        
        setTimeout(() => {
            distanceInput.value = distanceKm;
            distanceInput.classList.add('auto-filled');
            markFieldComplete('distance');
            
            // Animation effect
            distanceInput.style.transition = 'all 0.3s ease';
            distanceInput.style.backgroundColor = 'rgba(0, 255, 195, 0.1)';
            
            setTimeout(() => {
                distanceInput.style.backgroundColor = '';
            }, 1000);
            
        }, 600);
    }
}

// ============================================================
// TÍNH NĂNG 2: PORT/LOCATION SELECTOR UPGRADE
// ============================================================

/**
 * Khởi tạo Port Selectors với search functionality
 */
function initPortSelectors() {
    console.log('✓ [INIT] Port Selectors activated');
    
    // Tạo port selector inputs nếu chưa có
    createPortSelectorInputs();
    
    // Setup search functionality
    setupPortSearch('pol_input', 'pol_suggestions');
    setupPortSearch('pod_input', 'pod_suggestions');
}

/**
 * Tạo input fields cho Port Selection
 */
function createPortSelectorInputs() {
    // Check nếu đã có rồi thì không tạo lại
    if (document.getElementById('pol_input')) {
        console.log('✓ Port inputs already exist');
        return;
    }
    
    // Tìm shipping-info section
    const shippingSection = document.getElementById('shipping-info');
    if (!shippingSection) {
        console.warn('⚠️ shipping-info section not found, cannot create port inputs');
        return;
    }
    
    // Tìm form-grid trong shipping section
    const formGrid = shippingSection.querySelector('.form-grid');
    if (!formGrid) {
        console.warn('⚠️ form-grid not found in shipping-info section');
        return;
    }
    
    // Tìm route dropdown để insert sau nó
    const routeDropdown = document.getElementById('route_dropdown') ||
                         shippingSection.querySelector('[id*="route"]');
    
    // Tạo POL input
    const polWrapper = document.createElement('div');
    polWrapper.className = 'form-group';
    polWrapper.innerHTML = `
        <label for="pol_input" class="form-label">
            <span class="label-icon">🚢</span>
            Loading Port (POL)
            <span class="field-status" id="pol_status"></span>
        </label>
        <div class="port-input-wrapper">
            <input 
                type="text" 
                id="pol_input" 
                name="pol"
                placeholder="Nhập tên cảng xuất phát..." 
                autocomplete="off"
                class="form-input port-search-input"
            />
            <div id="pol_suggestions" class="port-suggestions hidden"></div>
        </div>
    `;
    
    // Tạo POD input
    const podWrapper = document.createElement('div');
    podWrapper.className = 'form-group';
    podWrapper.innerHTML = `
        <label for="pod_input" class="form-label">
            <span class="label-icon">🏁</span>
            Discharge Port (POD)
            <span class="field-status" id="pod_status"></span>
        </label>
        <div class="port-input-wrapper">
            <input 
                type="text" 
                id="pod_input" 
                name="pod"
                placeholder="Nhập tên cảng đích..." 
                autocomplete="off"
                class="form-input port-search-input"
            />
            <div id="pod_suggestions" class="port-suggestions hidden"></div>
        </div>
    `;
    
    // Insert vào DOM
    if (routeDropdown && routeDropdown.closest('.form-group')) {
        // Insert sau route dropdown group
        const routeGroup = routeDropdown.closest('.form-group');
        routeGroup.insertAdjacentElement('afterend', polWrapper);
        polWrapper.insertAdjacentElement('afterend', podWrapper);
    } else {
        // Insert vào cuối form-grid
        formGrid.appendChild(polWrapper);
        formGrid.appendChild(podWrapper);
    }
    
    console.log('✓ Port selector inputs created in shipping-info section');
}

/**
 * Tự động gợi ý cảng dựa trên tuyến đường
 */
function autoSuggestPorts(routeKey) {
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.routes[routeKey]) return;
    
    const routeData = window.LOGISTICS_DATA.routes[routeKey];
    
    if (!routeData || !routeData.common_routes || routeData.common_routes.length === 0) {
        console.log('⚠️ No common routes found for:', routeKey);
        return;
    }
    
    // Lấy tuyến đầu tiên (phổ biến nhất)
    const commonRoute = routeData.common_routes[0];
    
    console.log(`🏗️ Auto-suggesting ports: ${commonRoute.pol} → ${commonRoute.pod}`);
    
    // Auto-fill POL
    setTimeout(() => {
        const polInput = document.getElementById('pol_input');
        if (polInput) {
            polInput.value = commonRoute.pol;
            SmartInputState.selectedPOL = commonRoute.pol_code;
            markFieldComplete('pol_input');
            showSuccessTooltip('pol_input', `✓ ${commonRoute.pol}`);
        }
    }, 800);
    
    // Auto-fill POD
    setTimeout(() => {
        const podInput = document.getElementById('pod_input');
        if (podInput) {
            podInput.value = commonRoute.pod;
            SmartInputState.selectedPOD = commonRoute.pod_code;
            markFieldComplete('pod_input');
            showSuccessTooltip('pod_input', `✓ ${commonRoute.pod}`);
        }
    }, 1000);
    
    // Auto-calculate distance between specific ports
    if (commonRoute.distance_km) {
        autoFillDistance(commonRoute.distance_km);
    }
}

/**
 * Setup search functionality cho port input
 */
function setupPortSearch(inputId, suggestionsId) {
    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);
    
    if (!input || !suggestions) return;
    
    input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query.length < 2) {
            suggestions.classList.add('hidden');
            return;
        }
        
        // Search trong tất cả ports
        const allPorts = getAllPorts();
        const matches = allPorts.filter(port => 
            port.name.toLowerCase().includes(query) ||
            port.name_en.toLowerCase().includes(query) ||
            port.code.toLowerCase().includes(query)
        );
        
        if (matches.length > 0) {
            renderPortSuggestions(matches, suggestions, inputId);
            suggestions.classList.remove('hidden');
        } else {
            suggestions.classList.add('hidden');
        }
    });
    
    // Close suggestions khi click outside
    document.addEventListener('click', (e) => {
        if (!input.contains(e.target) && !suggestions.contains(e.target)) {
            suggestions.classList.add('hidden');
        }
    });
}

/**
 * Lấy tất cả ports từ LOGISTICS_DATA
 */
function getAllPorts() {
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.ports) return [];
    
    const allPorts = [];
    
    for (const [country, ports] of Object.entries(window.LOGISTICS_DATA.ports)) {
        if (Array.isArray(ports)) {
            ports.forEach(port => {
                allPorts.push({
                    ...port,
                    country: country
                });
            });
        }
    }
    
    return allPorts;
}

/**
 * Render port suggestions dropdown
 */
function renderPortSuggestions(ports, container, inputId) {
    container.innerHTML = ports.slice(0, 5).map(port => `
        <div class="port-suggestion-item" data-port-code="${port.code}" data-port-name="${port.name}">
            <span class="port-icon">${port.icon || '🚢'}</span>
            <div class="port-info">
                <div class="port-name">${port.name} (${port.code})</div>
                <div class="port-location">${port.location}</div>
            </div>
        </div>
    `).join('');
    
    // Add click handlers
    container.querySelectorAll('.port-suggestion-item').forEach(item => {
        item.addEventListener('click', () => {
            const portName = item.dataset.portName;
            const portCode = item.dataset.portCode;
            
            document.getElementById(inputId).value = portName;
            
            if (inputId === 'pol_input') {
                SmartInputState.selectedPOL = portCode;
            } else {
                SmartInputState.selectedPOD = portCode;
            }
            
            markFieldComplete(inputId);
            container.classList.add('hidden');
            
            console.log(`✓ Port selected: ${portName} (${portCode})`);
        });
    });
}

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Get selected value từ dropdown (tương thích với custom dropdown)
 */
function getSelectedValue(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    if (!dropdown) return null;
    
    // Nếu là custom dropdown (có hidden input)
    const hiddenInput = document.getElementById(dropdownId.replace('_dropdown', '_input'));
    if (hiddenInput && hiddenInput.value) {
        return hiddenInput.value;
    }
    
    // Nếu là custom dropdown với selected option
    const selectedOption = dropdown.querySelector('.dropdown-option.selected');
    if (selectedOption) {
        return selectedOption.getAttribute('data-value');
    }
    
    // Nếu là standard select
    return dropdown.value || null;
}

/**
 * Get dropdown value (helper function)
 */
function getDropdownValue(dropdownId) {
    return getSelectedValue(dropdownId);
}

/**
 * Select option trong dropdown (tương thích với custom dropdown)
 */
function selectDropdownOption(dropdownId, value) {
    const dropdown = document.getElementById(dropdownId);
    
    if (!dropdown) {
        // Thử tìm custom dropdown
        const customDropdown = document.querySelector(`[id*="${dropdownId}"]`);
        if (customDropdown && typeof window.selectOption === 'function') {
            window.selectOption(dropdownId, value, 0);
            return;
        }
        return;
    }
    
    // Standard select
    if (dropdown.tagName === 'SELECT') {
        dropdown.value = value;
        const event = new Event('change', { bubbles: true });
        dropdown.dispatchEvent(event);
        markFieldComplete(dropdownId);
    } else {
        // Custom dropdown - sử dụng function có sẵn
        if (typeof window.selectOption === 'function') {
            window.selectOption(dropdownId, value, 0);
        }
    }
}

/**
 * Mark field as completed
 */
function markFieldComplete(fieldId) {
    SmartInputState.completedFields.add(fieldId);
    const field = document.getElementById(fieldId);
    if (field) {
        field.classList.add('field-completed');
    }
    console.log(`✓ Field completed: ${fieldId}`);
}

/**
 * Show success tooltip
 */
function showSuccessTooltip(fieldId, message) {
    console.log(`💡 Tooltip: ${message}`);
    // Implementation có thể mở rộng với UI tooltip
}

/**
 * Auto-fill Incoterm
 */
function autoFillIncoterm(transportMode) {
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.incoterm_recommendations) return;
    
    const recommendation = window.LOGISTICS_DATA.incoterm_recommendations[transportMode];
    
    if (recommendation) {
        console.log(`✓ Incoterm recommendation: ${recommendation.recommended}`);
        setTimeout(() => {
            selectDropdownOption('incoterm_dropdown', recommendation.recommended);
        }, 600);
    }
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize tất cả các tính năng
 */
function initSmartInputSystem() {
    if (SmartInputState.initialized) {
        console.log('⚠️ Smart Input System already initialized');
        return;
    }
    
    console.log('🚀 Initializing Smart Input System...');
    
    // Check if LOGISTICS_DATA is available
    if (typeof window.LOGISTICS_DATA === 'undefined') {
        console.error('❌ LOGISTICS_DATA not found! Please include logistics_data.js first');
        return;
    }
    
    // Initialize các tính năng
    console.log('🚀 RISKCAST Smart Input System initializing...');
    
    console.log('🌏 Setting up Route-Based Suggestions...');
    initRouteBasedSuggestions();
    
    console.log('📍 Setting up Country Selectors...');
    initCountryAutoSuggest();
    
    console.log('🚢 Setting up Port Selectors...');
    initPortSelectors();
    
    console.log('📦 Setting up Cargo Type Selector...');
    initContainerRecommendation();
    
    console.log('📅 Setting up ETD/ETA Selectors...');
    initTransitTimeCalculation();
    
    console.log('✅ Setting up Form Validation...');
    initRealtimeValidation();
    
    console.log('📊 Setting up Progress Tracking...');
    initProgressTracking();
    
    console.log('🔧 Setting up Smart Defaults...');
    initSmartDefaults();
    
    console.log('👁️ Setting up Conditional Fields...');
    initConditionalFields();
    
    console.log('📋 Setting up Copy from Previous Shipment...');
    initCopyPreviousShipment();
    
    console.log('📱 Setting up Mobile Optimization...');
    initMobileOptimization();
    
    console.log('🎬 Setting up Enhanced Demo Mode...');
    initEnhancedDemoMode();
    
    SmartInputState.initialized = true;
    
    console.log('✅ Smart Input System initialized successfully!');
}

// ===== FORCE INITIALIZATION =====
// Đảm bảo initialization chạy đúng cách
function forceInitSmartInput() {
    console.log('🚀 DOM Ready - Starting Smart Input Init...');
    
    // Wait 300ms để đảm bảo tất cả scripts loaded
    setTimeout(() => {
        console.log('✓ Checking prerequisites...');
        console.log('  - LOGISTICS_DATA:', typeof window.LOGISTICS_DATA !== 'undefined' ? '✓' : '✗');
        console.log('  - SmartInput:', typeof window.SmartInput !== 'undefined' ? '✓' : '✗');
        
        if (typeof window.LOGISTICS_DATA === 'undefined') {
            console.error('❌ LOGISTICS_DATA not loaded! Please check logistics_data.js');
            console.error('   Make sure logistics_data.js is loaded BEFORE smart_input.js');
            return;
        }
        
        // Initialize
        if (!SmartInputState.initialized) {
            initSmartInputSystem();
        } else {
            console.log('⚠️ Smart Input System already initialized');
        }
        
        console.log('✅ Smart Input System initialization complete');
    }, 300);
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', forceInitSmartInput);
} else {
    // DOM already loaded
    forceInitSmartInput();
}

// ============================================================
// TÍNH NĂNG 3: SMART CONTAINER RECOMMENDATION
// ============================================================

/**
 * Khởi tạo Container Recommendation dựa trên Cargo Type
 */
function initContainerRecommendation() {
    console.log('✓ [INIT] Container Recommendation activated');
    
    const cargoDropdown = document.getElementById('cargo_type_dropdown') ||
                         document.querySelector('[id*="cargo_type"]');
    
    if (!cargoDropdown) {
        console.warn('⚠️ Cargo type dropdown not found');
        return;
    }
    
    cargoDropdown.addEventListener('change', handleCargoTypeChange);
}

/**
 * Xử lý khi Cargo Type thay đổi
 */
function handleCargoTypeChange() {
    const cargoType = getSelectedValue('cargo_type_dropdown') || 
                     getSelectedValue('cargo_type');
    
    if (!cargoType) return;
    
    console.log(`📦 Cargo type changed: ${cargoType}`);
    SmartInputState.selectedCargoType = cargoType;
    
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.container_recommendations) return;
    
    const recommendation = window.LOGISTICS_DATA.container_recommendations[cargoType];
    
    if (recommendation) {
        // Auto-select recommended container
        setTimeout(() => {
            selectDropdownOption('container_type_dropdown', recommendation.recommended);
            
            // Show success badge
            showContainerRecommendationBadge(recommendation);
            
            // Show warning nếu có
            if (recommendation.warning) {
                showWarningBanner(recommendation.warning);
            }
        }, 300);
    }
}

/**
 * Hiển thị badge recommendation
 */
function showContainerRecommendationBadge(recommendation) {
    const containerGroup = document.getElementById('container_type_group') ||
                           document.querySelector('[id*="container"]').closest('.form-group');
    
    if (!containerGroup) return;
    
    // Remove existing badge
    const existingBadge = containerGroup.querySelector('.success-badge');
    if (existingBadge) existingBadge.remove();
    
    // Create new badge
    const badge = document.createElement('div');
    badge.className = 'success-badge';
    badge.innerHTML = `✓ ${recommendation.reason}`;
    containerGroup.appendChild(badge);
    
    // Add glow animation
    const containerDropdown = document.getElementById('container_type_dropdown');
    if (containerDropdown) {
        containerDropdown.classList.add('glow-animation');
        setTimeout(() => {
            containerDropdown.classList.remove('glow-animation');
        }, 2000);
    }
}

/**
 * Hiển thị warning banner
 */
function showWarningBanner(message) {
    // Remove existing warning
    const existingWarning = document.querySelector('.warning-banner');
    if (existingWarning) existingWarning.remove();
    
    // Create warning banner
    const warning = document.createElement('div');
    warning.className = 'warning-banner';
    warning.innerHTML = `
        <span class="warning-icon">⚠️</span>
        <span class="warning-text">${message}</span>
        <button class="warning-close" onclick="this.parentElement.remove()">×</button>
    `;
    
    // Insert vào đầu form hoặc sau cargo section
    const form = document.querySelector('form') || document.querySelector('.form-container');
    if (form) {
        form.insertBefore(warning, form.firstChild);
    }
}

// ============================================================
// TÍNH NĂNG 4: TRANSIT TIME AUTO-CALCULATION + CALENDAR
// ============================================================

/**
 * Khởi tạo Transit Time Calculation
 */
function initTransitTimeCalculation() {
    console.log('✓ [INIT] Transit Time Calculation activated');
    
    const etdInput = document.getElementById('etd') || document.getElementById('etd_input');
    const etaInput = document.getElementById('eta') || document.getElementById('eta_input');
    
    if (!etdInput || !etaInput) {
        console.warn('⚠️ ETD/ETA inputs not found');
        return;
    }
    
    etdInput.addEventListener('change', calculateTransitTime);
    
    // Listen route và transport mode changes
    const routeDropdown = document.getElementById('route_dropdown');
    const transportDropdown = document.getElementById('transport_mode_dropdown');
    
    if (routeDropdown) {
        routeDropdown.addEventListener('change', calculateTransitTime);
    }
    if (transportDropdown) {
        transportDropdown.addEventListener('change', calculateTransitTime);
    }
}

/**
 * Tính toán Transit Time và ETA
 */
function calculateTransitTime() {
    const etdInput = document.getElementById('etd') || document.getElementById('etd_input');
    const etaInput = document.getElementById('eta') || document.getElementById('eta_input');
    
    if (!etdInput || !etdInput.value) return;
    
    const routeKey = SmartInputState.selectedRoute || 
                    getSelectedValue('route_dropdown');
    const transportMode = SmartInputState.selectedTransportMode ||
                         getSelectedValue('transport_mode_dropdown');
    
    if (!routeKey || !transportMode) return;
    
    if (!window.LOGISTICS_DATA || !window.LOGISTICS_DATA.transit_times) return;
    
    const transitData = window.LOGISTICS_DATA.transit_times[routeKey];
    if (!transitData) return;
    
    const days = transitData[transportMode];
    if (!days) return;
    
    const etd = new Date(etdInput.value);
    const eta = new Date(etd);
    eta.setDate(eta.getDate() + Math.ceil(days));
    
    // Auto-fill ETA
    etaInput.value = eta.toISOString().split('T')[0];
    
    // Show transit indicator
    showTransitIndicator(etd, eta, days);
    
    console.log(`📅 Calculated ETA: ${eta.toLocaleDateString()} (${days} days)`);
}

/**
 * Hiển thị Transit Time Indicator
 */
function showTransitIndicator(etd, eta, days) {
    let indicator = document.getElementById('transit_indicator');
    
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'transit_indicator';
        indicator.className = 'transit-indicator';
        
        const container = document.getElementById('transit_indicator_container') ||
                         document.querySelector('[id*="eta"]').closest('.form-group');
        if (container) {
            container.appendChild(indicator);
        }
    }
    
    const progressPercent = Math.min(100, (days / 45) * 100);
    
    indicator.innerHTML = `
        <div class="transit-info">
            <span class="transit-label">ETD:</span>
            <span class="transit-date">${etd.toLocaleDateString('vi-VN')}</span>
            <span class="transit-arrow">→</span>
            <span class="transit-label">ETA:</span>
            <span class="transit-date">${eta.toLocaleDateString('vi-VN')}</span>
        </div>
        <div class="transit-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${progressPercent}%"></div>
            </div>
            <div class="transit-duration">${days} ngày trên biển</div>
        </div>
    `;
}

// ============================================================
// TÍNH NĂNG 5: REAL-TIME VALIDATION + VISUAL FEEDBACK + PROGRESS TRACKING
// ============================================================

/**
 * Khởi tạo Progress Tracking
 */
function initProgressTracking() {
    console.log('✓ [INIT] Progress Tracking activated');
    
    function calculateProgress() {
        const requiredFields = document.querySelectorAll('input[required], select[required], textarea[required]');
        const filledFields = Array.from(requiredFields).filter(field => {
            if (field.tagName === 'INPUT' && field.type !== 'checkbox') {
                return field.value && field.value.trim() !== '';
            }
            if (field.tagName === 'SELECT') {
                return field.value;
            }
            if (field.tagName === 'TEXTAREA') {
                return field.value && field.value.trim() !== '';
            }
            return false;
        });
        
        const progress = requiredFields.length > 0 
            ? Math.round((filledFields.length / requiredFields.length) * 100) 
            : 0;
        
        // Update progress bar nếu có
        const progressBar = document.getElementById('header_progress_bar');
        const progressText = document.getElementById('header_progress_text');
        
        if (progressBar) {
            progressBar.style.width = progress + '%';
        }
        if (progressText) {
            progressText.textContent = progress + '%';
        }
        
        return progress;
    }
    
    // Update on any change
    document.addEventListener('input', calculateProgress);
    document.addEventListener('change', calculateProgress);
    
    // Initial calculation
    setTimeout(calculateProgress, 500);
}

// ============================================================
// TÍNH NĂNG 5: REAL-TIME VALIDATION + VISUAL FEEDBACK
// ============================================================

/**
 * Khởi tạo Real-time Validation
 */
function initRealtimeValidation() {
    console.log('✓ [INIT] Real-time Validation activated');
    
    const requiredFields = document.querySelectorAll('input[required], select[required]');
    
    requiredFields.forEach(field => {
        field.addEventListener('blur', () => validateField(field));
        field.addEventListener('input', () => {
            if (field.classList.contains('error')) {
                validateField(field);
            } else {
                // Show checkmark when valid
                markFieldValid(field);
            }
        });
    });
}

/**
 * Validate một field
 */
function validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    
    if (isRequired && !value) {
        field.classList.add('error-field');
        field.classList.remove('field-completed');
        showFieldError(field, '⚠️ Trường này là bắt buộc');
        return false;
    }
    
    // Remove error
    field.classList.remove('error-field');
    markFieldValid(field);
    return true;
}

/**
 * Mark field as valid
 */
function markFieldValid(field) {
    if (field.value && field.value.trim()) {
        field.classList.add('field-completed');
        markFieldComplete(field.id);
        
        // Add checkmark to label
        const label = field.closest('.form-group')?.querySelector('label');
        if (label && !label.querySelector('.field-checkmark')) {
            const checkmark = document.createElement('span');
            checkmark.className = 'field-checkmark';
            checkmark.innerHTML = '✓';
            label.appendChild(checkmark);
        }
    }
}

/**
 * Show field error
 */
function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.closest('.form-group')?.querySelector('.error-message');
    if (existingError) existingError.remove();
    
    // Create error message
    const error = document.createElement('div');
    error.className = 'error-message';
    error.innerHTML = `<span class="error-icon">⚠️</span>${message}`;
    
    const formGroup = field.closest('.form-group');
    if (formGroup) {
        formGroup.appendChild(error);
    }
}

// ============================================================
// TÍNH NĂNG 6: SMART DEFAULTS
// ============================================================

/**
 * Khởi tạo Smart Defaults
 */
function initSmartDefaults() {
    console.log('✓ [INIT] Smart Defaults activated');
    
    const transportDropdown = document.getElementById('transport_mode_dropdown');
    if (transportDropdown) {
        transportDropdown.addEventListener('change', applySmartDefaults);
    }
    
    const cargoDropdown = document.getElementById('cargo_type_dropdown');
    if (cargoDropdown) {
        cargoDropdown.addEventListener('change', applySmartDefaults);
    }
}

/**
 * Áp dụng Smart Defaults dựa trên selections
 */
function applySmartDefaults() {
    const transportMode = getSelectedValue('transport_mode_dropdown');
    const cargoType = getSelectedValue('cargo_type_dropdown');
    
    // Ocean Freight → FOB, Good packaging, Standard priority
    if (transportMode === 'ocean_fcl' || transportMode === 'ocean_lcl') {
        setTimeout(() => {
            selectDropdownOption('incoterm_dropdown', 'fob');
            selectDropdownOption('packaging_quality', 'good');
            selectDropdownOption('priority_profile', 'standard');
            
            // Set container match slider nếu có
            const containerMatch = document.getElementById('container_match');
            if (containerMatch) {
                containerMatch.value = 8.5;
                containerMatch.dispatchEvent(new Event('input'));
            }
        }, 500);
    }
    
    // Air Freight → CIP, Express priority
    if (transportMode === 'air_freight') {
        setTimeout(() => {
            selectDropdownOption('incoterm_dropdown', 'cip');
            selectDropdownOption('priority_profile', 'express');
        }, 500);
    }
    
    // Dangerous Goods → Increase risk sliders
    if (cargoType === 'dg') {
        const weatherRisk = document.getElementById('weather_risk');
        const portRisk = document.getElementById('port_risk');
        
        if (weatherRisk) {
            weatherRisk.value = Math.min(10, parseFloat(weatherRisk.value || 5) + 2);
            weatherRisk.dispatchEvent(new Event('input'));
        }
        if (portRisk) {
            portRisk.value = Math.min(10, parseFloat(portRisk.value || 4) + 1.5);
            portRisk.dispatchEvent(new Event('input'));
        }
        
        showWarningBanner('⚠️ Yêu cầu giấy phép đặc biệt (MSDS, IMO)');
    }
}

// ============================================================
// TÍNH NĂNG 7: CONDITIONAL FIELD VISIBILITY
// ============================================================

/**
 * Khởi tạo Conditional Fields
 */
function initConditionalFields() {
    console.log('✓ [INIT] Conditional Fields activated');
    
    const transportDropdown = document.getElementById('transport_mode_dropdown');
    const routeDropdown = document.getElementById('route_dropdown');
    const cargoDropdown = document.getElementById('cargo_type_dropdown');
    
    if (transportDropdown) {
        transportDropdown.addEventListener('change', toggleConditionalFields);
    }
    if (routeDropdown) {
        routeDropdown.addEventListener('change', toggleConditionalFields);
    }
    if (cargoDropdown) {
        cargoDropdown.addEventListener('change', toggleConditionalFields);
    }
    
    // Initial toggle
    toggleConditionalFields();
}

/**
 * Toggle conditional fields visibility
 */
function toggleConditionalFields() {
    const transportMode = getSelectedValue('transport_mode_dropdown');
    const route = getSelectedValue('route_dropdown');
    const cargoType = getSelectedValue('cargo_type_dropdown');
    
    // Air Freight → Hide Container, Show AWB
    const containerGroup = document.getElementById('container_type_group') ||
                          document.querySelector('[id*="container"]')?.closest('.form-group');
    const awbGroup = document.getElementById('awb_group');
    
    if (transportMode === 'air_freight') {
        if (containerGroup) containerGroup.style.display = 'none';
        if (awbGroup) awbGroup.style.display = 'block';
    } else {
        if (containerGroup) containerGroup.style.display = 'block';
        if (awbGroup) awbGroup.style.display = 'none';
    }
    
    // Domestic → Hide international risk fields
    const portRiskField = document.querySelector('[id*="port_risk"]')?.closest('.form-group');
    const ensoField = document.querySelector('[id*="enso"]')?.closest('.form-group');
    const typhoonField = document.querySelector('[id*="typhoon"]')?.closest('.form-group');
    
    if (route === 'domestic') {
        if (portRiskField) portRiskField.style.display = 'none';
        if (ensoField) ensoField.style.display = 'none';
        if (typhoonField) typhoonField.style.display = 'none';
    } else {
        if (portRiskField) portRiskField.style.display = 'block';
        if (ensoField) ensoField.style.display = 'block';
        if (typhoonField) typhoonField.style.display = 'block';
    }
    
    // Refrigerated → Show temperature field
    let tempField = document.getElementById('temperature_field');
    if (cargoType === 'refrigerated') {
        if (!tempField) {
            tempField = document.createElement('div');
            tempField.id = 'temperature_field';
            tempField.className = 'form-group conditional-field';
            tempField.innerHTML = `
                <label for="temperature_input">
                    <span class="label-icon">❄️</span>
                    Required Temperature (°C)
                </label>
                <input type="number" id="temperature_input" name="temperature" 
                       placeholder="Nhiệt độ yêu cầu" class="form-input">
                <div class="field-warning">
                    ⚠️ Lưu ý: Container cần điện lạnh liên tục
                </div>
            `;
            
            const cargoGroup = document.querySelector('[id*="cargo"]')?.closest('.form-group');
            if (cargoGroup) {
                cargoGroup.insertAdjacentElement('afterend', tempField);
            }
        }
        tempField.style.display = 'block';
    } else {
        if (tempField) tempField.style.display = 'none';
    }
}

// ============================================================
// TÍNH NĂNG 8: COPY FROM PREVIOUS SHIPMENT
// ============================================================

/**
 * Khởi tạo Copy Previous Shipment
 */
function initCopyPreviousShipment() {
    console.log('✓ [INIT] Copy Previous Shipment activated');
    
    // Load recent shipments from localStorage
    loadRecentShipments();
    
    // Create button nếu chưa có
    let copyBtn = document.getElementById('copy_previous_btn');
    if (!copyBtn) {
        copyBtn = document.createElement('button');
        copyBtn.id = 'copy_previous_btn';
        copyBtn.type = 'button';
        copyBtn.className = 'btn-copy-previous';
        copyBtn.innerHTML = '📋 Sao chép từ lô hàng trước';
        
        const form = document.querySelector('form') || document.querySelector('.form-container');
        if (form) {
            form.insertBefore(copyBtn, form.firstChild);
        }
    }
    
    copyBtn.addEventListener('click', showCopyModal);
}

/**
 * Load recent shipments từ localStorage
 */
function loadRecentShipments() {
    try {
        const stored = localStorage.getItem('riskcast_recent_shipments');
        if (stored) {
            SmartInputState.recentShipments = JSON.parse(stored);
        }
    } catch (e) {
        console.warn('⚠️ Could not load recent shipments:', e);
    }
}

/**
 * Save current shipment
 */
function saveCurrentShipment() {
    const formData = collectFormData();
    if (!formData) return;
    
    const shipment = {
        id: `SH${Date.now()}`,
        timestamp: new Date().toISOString(),
        data: formData
    };
    
    SmartInputState.recentShipments.unshift(shipment);
    SmartInputState.recentShipments = SmartInputState.recentShipments.slice(0, 5);
    
    try {
        localStorage.setItem('riskcast_recent_shipments', 
            JSON.stringify(SmartInputState.recentShipments));
    } catch (e) {
        console.warn('⚠️ Could not save shipment:', e);
    }
}

/**
 * Collect form data
 */
function collectFormData() {
    const form = document.querySelector('form');
    if (!form) return null;
    
    const data = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    
    inputs.forEach(input => {
        if (input.name && input.value) {
            data[input.name] = input.value;
        }
    });
    
    return Object.keys(data).length > 0 ? data : null;
}

/**
 * Show copy modal
 */
function showCopyModal() {
    if (SmartInputState.recentShipments.length === 0) {
        alert('Chưa có lô hàng nào được lưu');
        return;
    }
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h3>Chọn lô hàng để sao chép</h3>
                <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
            </div>
            <div class="modal-body">
                ${SmartInputState.recentShipments.map(shipment => `
                    <div class="shipment-item" data-shipment-id="${shipment.id}">
                        <div class="shipment-id">✓ ${shipment.id}</div>
                        <div class="shipment-details">
                            ${formatShipmentDetails(shipment)}
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add click handlers
    modal.querySelectorAll('.shipment-item').forEach(item => {
        item.addEventListener('click', () => {
            const shipmentId = item.dataset.shipmentId;
            const shipment = SmartInputState.recentShipments.find(s => s.id === shipmentId);
            if (shipment) {
                copyShipmentData(shipment.data);
                modal.remove();
                showSuccessToast('✓ Dữ liệu lô hàng đã được sao chép!');
            }
        });
    });
    
    // Close on overlay click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}

/**
 * Format shipment details for display
 */
function formatShipmentDetails(shipment) {
    const data = shipment.data;
    const cargo = data.cargo_type || 'N/A';
    const route = data.route || 'N/A';
    const date = new Date(shipment.timestamp).toLocaleDateString('vi-VN');
    return `${cargo} | ${route} | ${date}`;
}

/**
 * Copy shipment data to form
 */
function copyShipmentData(data) {
    Object.keys(data).forEach(key => {
        // Skip dates
        if (key === 'etd' || key === 'eta') return;
        
        const field = document.querySelector(`[name="${key}"]`);
        if (field) {
            field.value = data[key];
            field.dispatchEvent(new Event('change', { bubbles: true }));
        }
    });
}

/**
 * Show success toast
 */
function showSuccessToast(message) {
    const toast = document.createElement('div');
    toast.className = 'success-toast';
    toast.textContent = message;
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================================
// TÍNH NĂNG 9: MOBILE OPTIMIZATION
// ============================================================

/**
 * Khởi tạo Mobile Optimization
 */
function initMobileOptimization() {
    console.log('✓ [INIT] Mobile Optimization activated');
    
    if (window.innerWidth < 768) {
        setupMobileLayout();
    }
    
    window.addEventListener('resize', () => {
        if (window.innerWidth < 768) {
            setupMobileLayout();
        } else {
            setupDesktopLayout();
        }
    });
}

/**
 * Setup mobile layout
 */
function setupMobileLayout() {
    // Make sections collapsible
    const sections = document.querySelectorAll('.form-section');
    sections.forEach((section, index) => {
        if (index > 1) { // Collapse sections 3-7
            section.classList.add('collapsed');
        }
        
        const header = section.querySelector('.section-header, h3, h2');
        if (header) {
            header.classList.add('collapsible-header');
            header.addEventListener('click', () => {
                section.classList.toggle('collapsed');
            });
        }
    });
    
    // Make submit button sticky
    const submitBtn = document.querySelector('button[type="submit"]') ||
                      document.querySelector('#run_risk');
    if (submitBtn) {
        submitBtn.classList.add('btn-submit-sticky');
    }
}

/**
 * Setup desktop layout
 */
function setupDesktopLayout() {
    const sections = document.querySelectorAll('.form-section');
    sections.forEach(section => {
        section.classList.remove('collapsed');
    });
    
    const submitBtn = document.querySelector('.btn-submit-sticky');
    if (submitBtn) {
        submitBtn.classList.remove('btn-submit-sticky');
    }
}

// ============================================================
// TÍNH NĂNG 10: ENHANCED DEMO MODE
// ============================================================

/**
 * Khởi tạo Enhanced Demo Mode
 */
function initEnhancedDemoMode() {
    console.log('✓ [INIT] Enhanced Demo Mode activated');
    
    const demoBtn = document.getElementById('demo_case_btn') ||
                   document.querySelector('[data-demo-case]');
    
    if (!demoBtn) {
        console.warn('⚠️ Demo button not found');
        return;
    }
    
    demoBtn.addEventListener('click', runDemoCase);
}

/**
 * Chạy Demo Case
 */
function runDemoCase() {
    console.log('🎬 Starting Demo Case...');
    
    // Show progress indicator
    const progressIndicator = createDemoProgressIndicator();
    document.body.appendChild(progressIndicator);
    
    const demoSteps = [
        { field: 'transport_mode_dropdown', value: 'ocean_fcl', delay: 100 },
        { field: 'route_dropdown', value: 'vn_us', delay: 200 },
        { field: 'pol_input', value: 'Cái Mép - Thị Vải', delay: 300 },
        { field: 'pod_input', value: 'Long Beach', delay: 400 },
        { field: 'cargo_type_dropdown', value: 'electronics', delay: 500 },
        { field: 'packages', value: '50', delay: 600 },
        { field: 'cargo_value', value: '2500000', delay: 700 },
        { field: 'distance', value: '15200', delay: 800 },
        // ... more fields
    ];
    
    let completed = 0;
    const total = demoSteps.length;
    
    demoSteps.forEach((step, index) => {
        setTimeout(() => {
            const field = document.getElementById(step.field) ||
                         document.querySelector(`[name="${step.field}"]`);
            if (field) {
                field.value = step.value;
                field.dispatchEvent(new Event('change', { bubbles: true }));
            }
            
            completed++;
            updateDemoProgress(progressIndicator, (completed / total) * 100);
        }, step.delay);
    });
    
    setTimeout(() => {
        progressIndicator.remove();
        showSuccessToast('✓ Demo Case đã được điền thành công!');
    }, demoSteps[demoSteps.length - 1].delay + 500);
}

/**
 * Tạo Demo Progress Indicator
 */
function createDemoProgressIndicator() {
    const indicator = document.createElement('div');
    indicator.className = 'demo-progress-indicator';
    indicator.innerHTML = `
        <div class="demo-progress-text">⏳ Đang điền dữ liệu mẫu...</div>
        <div class="demo-progress-bar">
            <div class="demo-progress-fill" style="width: 0%"></div>
        </div>
        <div class="demo-progress-percentage">0%</div>
    `;
    return indicator;
}

/**
 * Update demo progress
 */
function updateDemoProgress(indicator, percentage) {
    const fill = indicator.querySelector('.demo-progress-fill');
    const text = indicator.querySelector('.demo-progress-percentage');
    
    if (fill) fill.style.width = percentage + '%';
    if (text) text.textContent = Math.round(percentage) + '%';
}

// Export for global access
if (typeof window !== 'undefined') {
    window.SmartInput = {
        init: initSmartInputSystem,
        state: SmartInputState,
        saveCurrentShipment: saveCurrentShipment
    };
    
    // Alias for compatibility
    window.SmartInputSystem = window.SmartInput;
}

