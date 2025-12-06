/**
 * RISKCAST v19 Enterprise - Input Controller
 * Logic Engine: Dropdown, Progress, Summary, Validation
 * Updated for v19 VisionOS Edition
 */

class RiskcastInputController {

    constructor() {

        this.formData = {};

        this.sections = [];

        this.activeDropdown = null;

        this.summaryUpdateTimeout = null;

        

        this.initializeFormData();

        this.initializeSections();

    }

    /**
     * Initialize form data structure
     */

    initializeFormData() {

        // Transport

        this.formData.transportMethod = null;

        this.formData.originPort = null;

        this.formData.destinationPort = null;

        this.formData.departureDate = null;

        this.formData.transitDays = null;

        

        // Cargo

        this.formData.cargoType = null;

        this.formData.cargoWeight = null;

        this.formData.cargoVolume = null;

        this.formData.insuranceValue = null;

        this.formData.packagingType = null;

        

        // Seller

        this.formData.sellerCompany = null;

        this.formData.sellerCountry = null;

        this.formData.sellerContact = null;

        this.formData.sellerEmail = null;

        

        // Buyer

        this.formData.buyerCompany = null;

        this.formData.buyerCountry = null;

        this.formData.buyerContact = null;

        this.formData.buyerEmail = null;

        

        // Modules

        this.formData.moduleWeather = false;

        this.formData.moduleGeopolitical = false;

        this.formData.moduleCustoms = false;

        this.formData.moduleCarrier = false;

        this.formData.moduleFinancial = false;

        this.formData.moduleRoute = false;

    }

    /**
     * Initialize sections metadata
     */

    initializeSections() {

        this.sections = [

            { id: 'rc-section-transport', name: 'transport' },

            { id: 'rc-section-cargo', name: 'cargo' },

            { id: 'rc-section-seller', name: 'seller' },

            { id: 'rc-section-buyer', name: 'buyer' },

            { id: 'rc-section-modules', name: 'modules' },

            { id: 'rc-section-summary', name: 'summary' }

        ];

    }

    /**
     * Initialize all systems
     */

    init() {

        console.log('🔥 Initializing controller systems...');

        

        this.bindDropdowns();

        console.log('🔥 Dropdowns bound ✓');

        

        this.bindInputs();

        console.log('🔥 Inputs bound ✓');

        

        this.bindToggles();

        console.log('🔥 Toggles bound ✓');

        

        this.bindSubmit();

        console.log('🔥 Submit bound ✓');

        

        this.updateProgress();

        console.log('🔥 Progress updated ✓');

        

        this.updateSummary();

        console.log('🔥 Summary updated ✓');

        

        console.log('🔥 ========================================');

        console.log('🔥 INPUT CONTROLLER READY ✓');

        console.log('🔥 ========================================');

    }

    /**
     * DROPDOWN ENGINE
     */

    bindDropdowns() {

        const dropdowns = document.querySelectorAll('.rc-dropdown');

        

        console.log(`🔥 Found ${dropdowns.length} dropdowns to bind`);

        

        dropdowns.forEach(dropdown => {

            // Support both naming conventions: .rc-dropdown-trigger and .rc-dropdown-toggle

            const trigger = dropdown.querySelector('.rc-dropdown-trigger') || 

                           dropdown.querySelector('.rc-dropdown-toggle') ||

                           dropdown.querySelector('.rc-dropdown-selected');

            

            const menu = dropdown.querySelector('.rc-dropdown-menu');

            const items = dropdown.querySelectorAll('.rc-select-item, li[data-value]');

            const valueSpan = dropdown.querySelector('.rc-dropdown-value') || 

                             dropdown.querySelector('.rc-dropdown-label') ||

                             dropdown.querySelector('.rc-dropdown-selected');

            

            const fieldName = dropdown.getAttribute('data-name') || 

                            dropdown.getAttribute('data-field') || 

                            dropdown.id;

            

            // Open/Close dropdown

            if (trigger) {

                trigger.addEventListener('click', (e) => {

                    e.stopPropagation();

                    console.log(`🔥 Dropdown clicked: ${fieldName}`);

                    this.toggleDropdown(dropdown);

                });

            } else {

                console.warn(`⚠️ Dropdown missing trigger: ${fieldName}`);

            }

            

            // Select item

            items.forEach(item => {

                item.addEventListener('click', (e) => {

                    e.stopPropagation();

                    const value = item.getAttribute('data-value');

                    const text = item.textContent.trim();

                    

                    console.log(`🔥 Item selected: ${fieldName} = ${value}`);

                    this.selectDropdownItem(dropdown, fieldName, value, text, valueSpan);

                });

            });

            

            // Keyboard support

            if (trigger) {

                trigger.addEventListener('keydown', (e) => {

                    if (e.key === 'Enter' || e.key === ' ') {

                        e.preventDefault();

                        this.toggleDropdown(dropdown);

                    }

                    if (e.key === 'Escape') {

                        this.closeDropdown(dropdown);

                    }

                });

            }

        });

        

        // Close dropdown when clicking outside

        document.addEventListener('click', () => {

            if (this.activeDropdown) {

                this.closeDropdown(this.activeDropdown);

            }

        });

    }

    /**
     * Toggle dropdown state
     */

    toggleDropdown(dropdown) {

        const fieldName = dropdown.getAttribute('data-name');

        

        if (this.activeDropdown && this.activeDropdown !== dropdown) {

            this.closeDropdown(this.activeDropdown);

        }

        

        if (dropdown.classList.contains('active')) {

            console.log(`🔥 Closing dropdown: ${fieldName}`);

            this.closeDropdown(dropdown);

        } else {

            console.log(`🔥 Opening dropdown: ${fieldName}`);

            this.openDropdown(dropdown);

        }

    }

    /**
     * Open dropdown
     */

    openDropdown(dropdown) {

        dropdown.classList.add('active');

        this.activeDropdown = dropdown;

        console.log(`🔥 Dropdown opened successfully`);

    }

    /**
     * Close dropdown
     */

    closeDropdown(dropdown) {

        dropdown.classList.remove('active');

        if (this.activeDropdown === dropdown) {

            this.activeDropdown = null;

        }

    }

    /**
     * Select dropdown item
     */

    selectDropdownItem(dropdown, fieldName, value, text, valueSpan) {

        // Update UI

        if (valueSpan) {

            valueSpan.textContent = text;

            valueSpan.classList.remove('rc-placeholder');

        }

        

        // Update form data

        if (fieldName) {

            this.formData[fieldName] = value;

        }

        

        // Close dropdown

        this.closeDropdown(dropdown);

        

        // Update systems

        this.updateProgress();

        this.debouncedSummaryUpdate();

    }

    /**
     * BIND TEXT/NUMBER/DATE INPUTS
     */

    bindInputs() {

        const inputs = document.querySelectorAll('.rc-input, input[type="text"], input[type="number"], input[type="date"]');

        

        inputs.forEach(input => {

            input.addEventListener('input', (e) => {

                const name = e.target.name || e.target.id;

                const value = e.target.value;

                

                if (name) {

                    this.formData[name] = value || null;

                    this.updateProgress();

                    this.debouncedSummaryUpdate();

                }

            });

        });

    }

    /**
     * BIND TOGGLE SWITCHES
     */

    bindToggles() {

        const toggles = document.querySelectorAll('.rc-toggle input[type="checkbox"], input[type="checkbox"][data-module]');

        

        toggles.forEach(toggle => {

            toggle.addEventListener('change', (e) => {

                const name = e.target.name || e.target.id || e.target.getAttribute('data-module');

                if (name) {

                    this.formData[name] = e.target.checked;

                    this.debouncedSummaryUpdate();

                }

            });

        });

    }

    /**
     * VALIDATION ENGINE - Check if section is complete
     */

    isSectionComplete(sectionElement) {

        if (!sectionElement) return false;

        

        const requiredFields = sectionElement.querySelectorAll('[data-required="true"], .required');

        

        if (requiredFields.length === 0) {

            return true; // Section with no required fields is always complete

        }

        

        let allFilled = true;

        

        requiredFields.forEach(field => {

            if (field.classList.contains('rc-dropdown')) {

                const fieldName = field.getAttribute('data-name');

                if (!this.formData[fieldName]) {

                    allFilled = false;

                }

            } else if (field.classList.contains('rc-input') || field.tagName === 'INPUT') {

                const fieldName = field.name || field.id;

                const value = this.formData[fieldName] || field.value;

                if (!value || value.trim() === '') {

                    allFilled = false;

                }

            }

        });

        

        return allFilled;

    }

    /**
     * PROGRESS ENGINE - Calculate completion
     */

    calculateProgress() {

        let completedCount = 0;

        

        this.sections.forEach(section => {

            const sectionElement = document.getElementById(section.id);

            if (sectionElement && this.isSectionComplete(sectionElement)) {

                completedCount++;

            }

        });

        

        const percentage = Math.round((completedCount / this.sections.length) * 100);

        return { completedCount, percentage };

    }

    /**
     * Update progress bars
     */

    updateProgress() {

        const { completedCount, percentage } = this.calculateProgress();

        

        // Top progress bar

        const topFill = document.getElementById('rc-top-progress-bar');

        if (topFill) {

            topFill.style.width = `${percentage}%`;

        }

        

        // Update section indicators

        this.sections.forEach(section => {

            const sectionElement = document.getElementById(section.id);

            const navItem = document.querySelector(`[data-nav-target="${section.name}"]`);

            if (sectionElement && navItem) {

                if (this.isSectionComplete(sectionElement)) {

                    navItem.classList.add('completed');

                } else {

                    navItem.classList.remove('completed');

                }

            }

        });

    }

    /**
     * SUMMARY ENGINE - Debounced update
     */

    debouncedSummaryUpdate() {

        clearTimeout(this.summaryUpdateTimeout);

        this.summaryUpdateTimeout = setTimeout(() => {

            this.updateSummary();

        }, 300);

    }

    /**
     * Update summary panel
     */

    updateSummary() {

        // This will be implemented based on v19 summary structure

        const summaryContainer = document.getElementById('inputSummaryGrid');

        if (summaryContainer) {

            // Summary update logic for v19

            console.log('Summary updated:', this.formData);

        }

    }

    /**
     * BIND SUBMIT BUTTON
     */

    bindSubmit() {

        const submitBtn = document.getElementById('rcSubmitBtn') || document.querySelector('[data-action="submit"]');

        if (submitBtn) {

            submitBtn.addEventListener('click', () => {

                this.handleSubmit();

            });

        }

    }

    /**
     * Handle form submission
     */

    handleSubmit() {

        const { completedCount } = this.calculateProgress();

        

        // Check minimum completion

        const transportComplete = this.isSectionComplete(document.getElementById('rc-section-transport'));

        const cargoComplete = this.isSectionComplete(document.getElementById('rc-section-cargo'));

        

        if (!transportComplete || !cargoComplete) {

            alert('Vui lòng hoàn thành ít nhất phần Thiết lập vận chuyển và Hàng hóa trước khi phân tích rủi ro.');

            return;

        }

        

        console.log('Form Data:', this.formData);

        console.log('Completion:', `${completedCount}/${this.sections.length} sections`);

        

        // Redirect to results or submit to API

        window.location.href = '/results';

    }

}

// Export to global scope

window.RiskcastInputController = RiskcastInputController;
