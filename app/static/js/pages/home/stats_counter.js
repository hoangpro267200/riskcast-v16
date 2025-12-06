
import { qsa } from '../../core/dom.js';
import { domReady } from '../../core/events.js';

function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = formatNumber(target);
            clearInterval(timer);
        } else {
            element.textContent = formatNumber(Math.floor(current));
        }
    }, 16);
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    if (num >= 100) {
        return num.toFixed(0);
    }
    return num.toFixed(1);
}

export async function initStatsCounter() {
    await domReady();
    
    const stats = qsa('.stat-number');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                entry.target.classList.add('counted');
                const text = entry.target.textContent;
                const value = parseFloat(text.replace(/[^\d.]/g, ''));
                if (!isNaN(value)) {
                    animateCounter(entry.target, value, 2000);
                }
            }
        });
    }, { threshold: 0.5 });
    
    stats.forEach(stat => observer.observe(stat));
}



















