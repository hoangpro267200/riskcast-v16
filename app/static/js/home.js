/* ==========================================================
   RISKCAST — Optimized JavaScript v2.0
   Performance Optimized: Adaptive FPS, Intersection Observer
   ========================================================== */

(function() {
    'use strict';

    // ========== PERFORMANCE OPTIMIZATION ==========
    let isPageVisible = true;
    let lastFrameTime = 0;
    const TARGET_FPS = 45; // Reduced from 60fps
    const FRAME_DURATION = 1000 / TARGET_FPS;

    // Visibility API - Stop animation when tab is hidden
    document.addEventListener('visibilitychange', () => {
        isPageVisible = !document.hidden;
    });

    // ========== MATRIX CANVAS SETUP ==========
    const canvas = document.getElementById('matrixCanvas');
    if (!canvas) {
        console.warn('Matrix canvas not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    const HERO_HEIGHT = 650;
    
    // Optimized: Reduced character set and columns
    const INCOTERM_LIST = [
        'EXW', 'FOB', 'CIF', 'CFR', 'FCA', 'CPT', 'CIP', 'DAP', 'DPU', 'DDP'
    ];

    function randomChar() {
        const pick = INCOTERM_LIST[Math.floor(Math.random() * INCOTERM_LIST.length)];
        const num = Math.floor(Math.random() * 99);
        return Math.random() > 0.5 ? pick : num;
    }

    const fontSize = 20;
    // Reduced columns by 40% for performance
    let columns = Math.floor((window.innerWidth / fontSize) * 0.6);
    
    // Initialize depth array
    const depth = [];
    for (let i = 0; i < columns; i++) {
        depth[i] = {
            y: Math.random() * HERO_HEIGHT,
            speed: 1.2 + Math.random() * 2.5, // Slightly slower
            blur: Math.random() * 2,
            tilt: 7 * Math.PI / 180
        };
    }

    // Resize handler
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = HERO_HEIGHT;
        
        const newColumns = Math.floor((canvas.width / fontSize) * 0.6);
        
        if (newColumns !== columns) {
            const oldDepth = [...depth];
            depth.length = 0;
            
            for (let i = 0; i < newColumns; i++) {
                if (oldDepth[i]) {
                    depth.push(oldDepth[i]);
                } else {
                    depth.push({
                        y: Math.random() * HERO_HEIGHT,
                        speed: 1.2 + Math.random() * 2.5,
                        blur: Math.random() * 2,
                        tilt: 7 * Math.PI / 180
                    });
                }
            }
            columns = newColumns;
        }
    }

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Adaptive frame rate drawing
    function drawMatrix(currentTime) {
        if (!isPageVisible) {
            requestAnimationFrame(drawMatrix);
            return;
        }

        // Throttle to target FPS
        const elapsed = currentTime - lastFrameTime;
        if (elapsed < FRAME_DURATION) {
            requestAnimationFrame(drawMatrix);
            return;
        }
        lastFrameTime = currentTime;

        // Clear with fade effect
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw matrix rain
        for (let i = 0; i < columns; i++) {
            const d = depth[i];
            
            ctx.save();
            
            // Optimized gradient
            const gradient = ctx.createLinearGradient(0, 0, 0, HERO_HEIGHT);
            gradient.addColorStop(0, '#00ff8a');
            gradient.addColorStop(1, '#00c9ff');
            ctx.fillStyle = gradient;
            ctx.font = `${fontSize}px Inter`;
            ctx.filter = `blur(${d.blur}px)`;
            ctx.translate(i * fontSize, d.y);
            ctx.rotate(d.tilt);
            ctx.fillText(randomChar(), 0, 0);
            ctx.restore();

            // Update position
            d.y += d.speed * 0.85; // Slightly slower
            
            if (d.y > HERO_HEIGHT + 200) {
                d.y = -200;
            }
        }

        requestAnimationFrame(drawMatrix);
    }

    // Start matrix animation
    drawMatrix(0);

    // ========== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS ==========
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Unobserve after animation to save resources
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe all scroll-animate elements
    document.addEventListener('DOMContentLoaded', () => {
        const animateElements = document.querySelectorAll('.scroll-animate');
        animateElements.forEach(el => observer.observe(el));
    });

    // ========== SMOOTH SCROLL FOR ANCHOR LINKS ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // ========== NAVBAR SCROLL EFFECT ==========
    let lastScroll = 0;
    const navContainer = document.querySelector('.nav-container');
    
    if (navContainer) {
        window.addEventListener('scroll', () => {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                navContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.5)';
            } else {
                navContainer.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.3)';
            }
            
            lastScroll = currentScroll;
        }, { passive: true });
    }

    // ========== PERFORMANCE MONITORING (Development only) ==========
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        let frameCount = 0;
        let lastTime = performance.now();
        
        function measureFPS() {
            frameCount++;
            const currentTime = performance.now();
            
            if (currentTime >= lastTime + 1000) {
                console.log(`FPS: ${frameCount.toFixed(1)}`);
                frameCount = 0;
                lastTime = currentTime;
            }
            
            requestAnimationFrame(measureFPS);
        }
        
        // Uncomment to monitor FPS in development
        // measureFPS();
    }

    // ========== LAZY LOAD IMAGES (if any) ==========
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ========== CLEANUP ON PAGE UNLOAD ==========
    window.addEventListener('beforeunload', () => {
        if (observer) {
            observer.disconnect();
        }
    });

})();



