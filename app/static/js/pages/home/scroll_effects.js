
import { qsa, on } from '../../core/dom.js';
import { throttle } from '../../core/utils.js';
import { domReady } from '../../core/events.js';

export async function initScrollEffects() {
    await domReady();
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observe scroll-animate elements
    const animateElements = qsa('.scroll-animate');
    animateElements.forEach(el => observer.observe(el));

    // Smooth scroll for anchor links
    const anchors = qsa('a[href^="#"]');
    anchors.forEach(anchor => {
        on(anchor, 'click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || href === '#contact') return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                const navHeight = 80;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navContainer = document.querySelector('.nav-container');
    if (navContainer) {
        on(window, 'scroll', throttle(() => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.5)';
            } else {
                navContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
            }
        }, 100), { passive: true });
    }
}



















