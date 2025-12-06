/**

 * RISKCAST v15 Enterprise - Input Controller

 * Logic Engine: Dropdown, Progress, Summary, Validation

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

            { id: 'section-transport', name: 'transport' },

            { id: 'section-cargo', name: 'cargo' },

            { id: 'section-seller', name: 'seller' },

            { id: 'section-buyer', name: 'buyer' },

            { id: 'section-algorithms', name: 'algorithms' },

            { id: 'section-summary', name: 'summary' }

        ];

    }

    /**

     * Initialize all systems

     */

    init() {

        this.bindDropdowns();

        this.bindInputs();

        this.bindToggles();

        this.bindSubmit();

        this.updateProgress();

        this.updateSummary();

        

        console.log('RISKCAST v15 Input Controller Initialized');

    }

    /**

     * DROPDOWN ENGINE

     */

    bindDropdowns() {

        const dropdowns = document.querySelectorAll('.rc-dropdown');

        

        dropdowns.forEach(dropdown => {

            const trigger = dropdown.querySelector('.rc-dropdown-trigger');

            const menu = dropdown.querySelector('.rc-dropdown-menu');

            const items = dropdown.querySelectorAll('.rc-select-item');

            const valueSpan = dropdown.querySelector('.rc-dropdown-value');

            const fieldName = dropdown.getAttribute('data-name');

            

            // Open/Close dropdown

            trigger.addEventListener('click', (e) => {

                e.stopPropagation();

                this.toggleDropdown(dropdown);

            });

            

            // Select item

            items.forEach(item => {

                item.addEventListener('click', (e) => {

                    e.stopPropagation();

                    const value = item.getAttribute('data-value');

                    const text = item.textContent;

                    

                    this.selectDropdownItem(dropdown, fieldName, value, text, valueSpan);

                });

            });

            

            // Keyboard support

            trigger.addEventListener('keydown', (e) => {

                if (e.key === 'Enter' || e.key === ' ') {

                    e.preventDefault();

                    this.toggleDropdown(dropdown);

                }

                if (e.key === 'Escape') {

                    this.closeDropdown(dropdown);

                }

            });

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

        if (this.activeDropdown && this.activeDropdown !== dropdown) {

            this.closeDropdown(this.activeDropdown);

        }

        

        if (dropdown.classList.contains('active')) {

            this.closeDropdown(dropdown);

        } else {

            this.openDropdown(dropdown);

        }

    }

    /**

     * Open dropdown

     */

    openDropdown(dropdown) {

        dropdown.classList.add('active');

        this.activeDropdown = dropdown;

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

        valueSpan.textContent = text;

        valueSpan.classList.remove('rc-placeholder');

        

        // Update form data

        this.formData[fieldName] = value;

        

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

        const inputs = document.querySelectorAll('.rc-input');

        

        inputs.forEach(input => {

            input.addEventListener('input', (e) => {

                const name = e.target.name;

                const value = e.target.value;

                

                this.formData[name] = value || null;

                this.updateProgress();

                this.debouncedSummaryUpdate();

            });

        });

    }

    /**

     * BIND TOGGLE SWITCHES

     */

    bindToggles() {

        const toggles = document.querySelectorAll('.rc-toggle input[type="checkbox"]');

        

        toggles.forEach(toggle => {

            toggle.addEventListener('change', (e) => {

                const name = e.target.name;

                this.formData[name] = e.target.checked;

                this.debouncedSummaryUpdate();

            });

        });

    }

    /**

     * VALIDATION ENGINE - Check if section is complete

     */

    isSectionComplete(sectionElement) {

        const requiredFields = sectionElement.querySelectorAll('[data-required="true"]');

        

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

            } else if (field.classList.contains('rc-input')) {

                const fieldName = field.name;

                const value = this.formData[fieldName];

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

        const topFill = document.getElementById('rcTopProgressFill');

        const topLabel = document.getElementById('rcTopProgressLabel');

        if (topFill) topFill.style.width = `${percentage}%`;

        if (topLabel) topLabel.textContent = `${percentage}%`;

        

        // Toast progress

        const toastFill = document.getElementById('rcToastFill');

        const toastLabel = document.getElementById('rcToastLabel');

        if (toastFill) toastFill.style.width = `${percentage}%`;

        if (toastLabel) toastLabel.textContent = `${completedCount} / ${this.sections.length} sections completed`;

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

        // Route

        const routeEl = document.getElementById('summaryRoute');

        if (routeEl) {

            if (this.formData.originPort && this.formData.destinationPort) {

                routeEl.textContent = `${this.formData.originPort} → ${this.formData.destinationPort}`;

            } else {

                routeEl.textContent = 'Not configured';

            }

        }

        

        // Cargo Type

        const cargoEl = document.getElementById('summaryCargo');

        if (cargoEl) {

            if (this.formData.cargoType) {

                const cargoText = this.getDropdownText('cargoType', this.formData.cargoType);

                cargoEl.textContent = cargoText;

            } else {

                cargoEl.textContent = 'Not configured';

            }

        }

        

        // Weight

        const weightEl = document.getElementById('summaryWeight');

        if (weightEl) {

            if (this.formData.cargoWeight) {

                weightEl.textContent = `${this.formData.cargoWeight} kg`;

            } else {

                weightEl.textContent = 'Not configured';

            }

        }

        

        // Trade Partners

        const partnersEl = document.getElementById('summaryPartners');

        if (partnersEl) {

            const seller = this.formData.sellerCountry ? this.getDropdownText('sellerCountry', this.formData.sellerCountry) : null;

            const buyer = this.formData.buyerCountry ? this.getDropdownText('buyerCountry', this.formData.buyerCountry) : null;

            

            if (seller && buyer) {

                partnersEl.textContent = `${seller} → ${buyer}`;

            } else if (seller || buyer) {

                partnersEl.textContent = seller || buyer;

            } else {

                partnersEl.textContent = 'Not configured';

            }

        }

        

        // Departure Date

        const departureEl = document.getElementById('summaryDeparture');

        if (departureEl) {

            if (this.formData.departureDate) {

                const date = new Date(this.formData.departureDate);

                departureEl.textContent = date.toLocaleDateString('en-US', {

                    month: 'short',

                    day: 'numeric',

                    year: 'numeric'

                });

            } else {

                departureEl.textContent = 'Not configured';

            }

        }

        

        // Active Modules

        const modulesEl = document.getElementById('summaryModules');

        if (modulesEl) {

            const activeModules = [

                this.formData.moduleWeather,

                this.formData.moduleGeopolitical,

                this.formData.moduleCustoms,

                this.formData.moduleCarrier,

                this.formData.moduleFinancial,

                this.formData.moduleRoute

            ].filter(Boolean).length;

            

            modulesEl.textContent = `${activeModules} enabled`;

        }

    }

    /**

     * Helper: Get dropdown display text from value

     */

    getDropdownText(fieldName, value) {

        const dropdown = document.querySelector(`.rc-dropdown[data-name="${fieldName}"]`);

        if (!dropdown) return value;

        

        const item = dropdown.querySelector(`.rc-select-item[data-value="${value}"]`);

        return item ? item.textContent : value;

    }

    /**

     * BIND SUBMIT BUTTON

     */

    bindSubmit() {

        const submitBtn = document.getElementById('rcSubmitBtn');

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

        const transportComplete = this.isSectionComplete(document.getElementById('section-transport'));

        const cargoComplete = this.isSectionComplete(document.getElementById('section-cargo'));

        const sellerComplete = this.isSectionComplete(document.getElementById('section-seller'));

        const buyerComplete = this.isSectionComplete(document.getElementById('section-buyer'));

        

        if (!transportComplete || !cargoComplete || (!sellerComplete && !buyerComplete)) {

            alert('Please complete at least the Transport Setup, Cargo & Packing, and one of the partner sections (Seller or Buyer) before generating the analysis.');

            return;

        }

        

        console.log('Form Data:', this.formData);

        console.log('Completion:', `${completedCount}/${this.sections.length} sections`);

        

        alert('Risk analysis generation started!\n\n(In production, this would redirect to the results page)');

    }

}

// Export to global scope

window.RiskcastInputController = RiskcastInputController;




