
import { domReady } from '../../core/events.js';

async function initResultsPage() {
    
    try {
        await domReady();
        
        // Wait for ResultsCore to be available
        if (window.ResultsCore && typeof window.ResultsCore.init === 'function') {
            await window.ResultsCore.init();
        } else {
            setTimeout(async () => {
                if (window.ResultsCore && typeof window.ResultsCore.init === 'function') {
                    await window.ResultsCore.init();
                }
            }, 500);
        }
        
    } catch (error) {
        console.error('[Results Page] Initialization error:', error);
    }
}

// Start initialization
initResultsPage();

