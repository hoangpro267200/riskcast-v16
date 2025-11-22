// ==================== INPUT FORM HANDLER ====================

function handleSubmit(e) {
    e.preventDefault();
    e.stopPropagation();

    console.log("✓ FORM SUBMITTED — calling runAnalysis()");

    if (typeof window.runAnalysis === "function") {
        window.runAnalysis();
    } else {
        console.error("✗ ERROR: runAnalysis() missing");
        alert("Không tìm thấy hàm runAnalysis.");
    }
}

function attachFormSubmitHandler() {
    const form = document.getElementById("risk_form");

    if (!form) {
        console.error("✗ Form #risk_form NOT FOUND");
        return false;
    }

    // Remove existing listener if any
    form.removeEventListener("submit", handleSubmit);
    // Add new listener
    form.addEventListener("submit", handleSubmit);

    console.log("✓ Handler attached to #risk_form");
    return true;
}

// Attach after DOM ready with retry mechanism
function initializeFormHandler() {
    if (attachFormSubmitHandler()) {
        console.log("✓ Form handler initialized successfully");
    } else {
        // Retry after a short delay if form not found yet
        console.log("⚠ Form not found, retrying...");
        setTimeout(() => {
            if (attachFormSubmitHandler()) {
                console.log("✓ Form handler initialized on retry");
            } else {
                console.error("✗ Failed to initialize form handler after retry");
            }
        }, 200);
    }
}

// Attach after DOM ready
if (document.readyState === 'loading') {
    document.addEventListener("DOMContentLoaded", initializeFormHandler);
} else {
    // DOM already loaded
    initializeFormHandler();
}

// Export globally
window.handleSubmit = handleSubmit;
window.attachFormSubmitHandler = attachFormSubmitHandler;
