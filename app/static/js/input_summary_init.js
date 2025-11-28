/**
 * ============================================================
 * INPUT SUMMARY INITIALIZATION
 * Extracted from input.html for better organization
 * ============================================================
 */

// Initialize input summary updates when form fields change
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for all scripts to load
    setTimeout(() => {
        // Initial update
        if (typeof updateInputSummary === 'function') {
            updateInputSummary();
        }
        
        // Update summary when any form field changes
        const formInputs = document.querySelectorAll('input[type="text"], input[type="number"], input[type="date"], select');
        formInputs.forEach(input => {
            input.addEventListener('change', function() {
                if (typeof updateInputSummary === 'function') {
                    setTimeout(() => updateInputSummary(), 100);
                }
            });
            input.addEventListener('input', function() {
                if (typeof updateInputSummary === 'function') {
                    setTimeout(() => updateInputSummary(), 100);
                }
            });
        });
        
        // Watch for dropdown changes
        const dropdownValues = document.querySelectorAll('.dropdown-value');
        dropdownValues.forEach(dropdown => {
            const observer = new MutationObserver(() => {
                if (typeof updateInputSummary === 'function') {
                    setTimeout(() => updateInputSummary(), 100);
                }
            });
            observer.observe(dropdown, { childList: true, characterData: true, subtree: true });
        });
    }, 500);
});





