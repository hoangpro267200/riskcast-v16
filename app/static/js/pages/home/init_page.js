
import { initHeroAnimations } from './hero_animations.js';
import { initStatsCounter } from './stats_counter.js';
import { initScrollEffects } from './scroll_effects.js';

async function initHomePage() {
    try {
        initHeroAnimations();
        await initStatsCounter();
        await initScrollEffects();
    } catch (error) {
        console.error('[Home Page] Initialization error:', error);
    }
}

// Start initialization
initHomePage();

