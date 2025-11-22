// ============================================
// RISKCAST v16.5 — COMMON LANGUAGE SYSTEM
// Works on both input.html and results.html
// ============================================

(function() {
    'use strict';
    
    // Get current language from localStorage or default to 'vi'
    let currentLang = localStorage.getItem('riskcast_lang') || 'vi';
    
    // Get translations object based on current language
    function getTranslations() {
        if (currentLang === 'en') {
            return window.TRANSLATIONS_EN || {};
        } else {
            return window.TRANSLATIONS_VI || {};
        }
    }
    
    // Apply language to all elements with data-lang attribute
    function applyLanguage() {
        const t = getTranslations();
        
        // Update all elements with data-lang attribute
        document.querySelectorAll('[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        // Update elements with data-i18n (for input.html compatibility)
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (t[key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = t[key];
                } else {
                    el.textContent = t[key];
                }
            }
        });
        
        // Update dropdown items
        document.querySelectorAll(".dropdown-item").forEach(item => {
            const key = item.getAttribute('data-i18n');
            if (key && t[key]) {
                item.textContent = t[key];
            }
        });
        
        // Update dropdown selected text (if placeholder)
        document.querySelectorAll(".dropdown-selected.placeholder").forEach(sel => {
            const key = sel.getAttribute('data-i18n');
            if (key && t[key]) {
                sel.textContent = t[key];
            }
        });
        
        // Update selected dropdown text if value exists
        document.querySelectorAll('.dropdown-wrapper .dropdown').forEach(dropdown => {
            const selected = dropdown.querySelector('.dropdown-selected');
            if (selected && selected.dataset.value && !selected.classList.contains('placeholder')) {
                // Find the item with matching value and get its i18n key
                const value = selected.dataset.value;
                const item = dropdown.querySelector(`.dropdown-item[data-value="${value}"]`);
                if (item) {
                    const key = item.getAttribute('data-i18n');
                    if (key && t[key]) {
                        selected.textContent = t[key];
                    }
                }
            }
        });
        
        // Update placeholders with data-placeholder attribute
        document.querySelectorAll('[data-placeholder]').forEach(el => {
            const key = el.getAttribute('data-placeholder');
            if (t[key]) {
                el.placeholder = t[key];
            }
        });
        
        // Update dropdown placeholders
        document.querySelectorAll('.dropdown-value.placeholder').forEach(el => {
            const key = el.getAttribute('data-lang') || el.getAttribute('data-i18n');
            if (key && t[key]) {
                el.textContent = t[key];
            } else if (t.placeholder_select) {
                el.textContent = t.placeholder_select;
            }
        });
        
        // Update tab buttons (they have spans inside)
        const tabEnterprise = document.querySelector('#tab-enterprise span[data-lang="tab_enterprise"]');
        const tabResearch = document.querySelector('#tab-research span[data-lang="tab_research"]');
        const tabInvestor = document.querySelector('#tab-investor span[data-lang="tab_investor"]');
        
        if (tabEnterprise && t.tab_enterprise) tabEnterprise.textContent = t.tab_enterprise;
        if (tabResearch && t.tab_research) tabResearch.textContent = t.tab_research;
        if (tabInvestor && t.tab_investor) tabInvestor.textContent = t.tab_investor;
        
        // Update card titles (they have spans inside)
        document.querySelectorAll('.card-title span[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
        
        // Update card badges
        document.querySelectorAll('.card-badge[data-lang]').forEach(el => {
            const key = el.getAttribute('data-lang');
            if (t[key]) {
                el.textContent = t[key];
            }
        });
        
        console.log(`[RISKCAST] Language applied: ${currentLang}`);
    }
    
    // Set language and apply
    function setLanguage(lang) {
        if (lang === 'vi' || lang === 'en') {
            currentLang = lang;
            localStorage.setItem('riskcast_lang', lang);
            applyLanguage();
            updateLanguageButtons();
            
            // If ResultsCore exists, trigger gauge explanation re-render
            if (window.ResultsCore && window.ResultsCore.renderGaugeExplanation && window.appData) {
                window.ResultsCore.renderGaugeExplanation(window.appData);
            }
            
            // If ResultsCore exists, re-render gauge charts
            if (window.ResultsCore && window.ResultsCore.renderGaugeCharts && window.appData?.summary) {
                window.ResultsCore.renderGaugeCharts(window.appData.summary);
            }
        }
    }
    
    // Update language button states
    function updateLanguageButtons() {
        document.querySelectorAll('.lang-btn').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang');
            if (btnLang === currentLang) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
        
        // Also handle buttons with IDs
        const btnVI = document.getElementById('lang-btn-vi') || document.getElementById('btn-lang-vi');
        const btnEN = document.getElementById('lang-btn-en') || document.getElementById('btn-lang-en');
        
        if (btnVI) {
            if (currentLang === 'vi') {
                btnVI.classList.add('active');
            } else {
                btnVI.classList.remove('active');
            }
        }
        if (btnEN) {
            if (currentLang === 'en') {
                btnEN.classList.add('active');
            } else {
                btnEN.classList.remove('active');
            }
        }
    }
    
    // Initialize language system
    function initializeLanguage() {
        // Wait for translations to load
        if (typeof window.TRANSLATIONS_VI === 'undefined' || typeof window.TRANSLATIONS_EN === 'undefined') {
            setTimeout(initializeLanguage, 100);
            return;
        }
        
        // Bind language buttons
        document.querySelectorAll('.lang-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const lang = this.getAttribute('data-lang');
                setLanguage(lang);
            });
        });
        
        // Also bind by ID if they exist
        const btnVI = document.getElementById('lang-btn-vi') || document.getElementById('btn-lang-vi');
        const btnEN = document.getElementById('lang-btn-en') || document.getElementById('btn-lang-en');
        
        if (btnVI) {
            btnVI.addEventListener('click', () => setLanguage('vi'));
        }
        if (btnEN) {
            btnEN.addEventListener('click', () => setLanguage('en'));
        }
        
        // Apply initial language
        applyLanguage();
        updateLanguageButtons();
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeLanguage);
    } else {
        initializeLanguage();
    }
    
    // Export to window for global access
    window.RiskcastLang = {
        setLanguage: setLanguage,
        applyLanguage: applyLanguage,
        getCurrentLang: () => currentLang,
        getTranslations: getTranslations
    };
    
})();




