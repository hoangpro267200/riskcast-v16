/**

 * RISKCAST v15 Enterprise - Page Initialization (Optimized)

 */

(function () {

    'use strict';

    let controller = null;

    let scrolling = false;

    function initializePage() {

        controller = new RiskcastInputController();

        controller.init();

        initScrollNavigation();

        initIntersectionObserver();

        setupFadeIn();

        console.log('%c[RISKCAST v15] Input System Ready', 'color:#00FFC8;font-weight:700;');

    }

    /** Navigation click → smooth scroll */

    function initScrollNavigation() {

        document.querySelectorAll('.rc-nav-item').forEach(item => {

            item.addEventListener('click', (e) => {

                e.preventDefault();

                scrollToSection(item.dataset.section);

            });

        });

    }

    /** Smooth scroll with dynamic header offset */

    function scrollToSection(id) {

        const section = document.getElementById(id);

        if (!section) return;

        const headerHeight = document.querySelector('.rc-header').offsetHeight;

        const offset = 32;

        const top = section.getBoundingClientRect().top + window.scrollY - headerHeight - offset;

        // Debounce scroll

        if (scrolling) return;

        scrolling = true;

        window.scrollTo({

            top,

            behavior: "smooth"

        });

        setTimeout(() => { scrolling = false }, 350);

    }

    /** Highlight active section in sidebar */

    function initIntersectionObserver() {

        const options = {

            root: null,

            rootMargin: '-45% 0px -45% 0px',

            threshold: 0

        };

        const observer = new IntersectionObserver((entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    highlightNav(entry.target.id);

                }

            });

        }, options);

        document.querySelectorAll('.rc-section[id]').forEach(sec => observer.observe(sec));

    }

    function highlightNav(sectionId) {

        document.querySelectorAll('.rc-nav-item').forEach(item => {

            item.classList.toggle(

                'active',

                item.dataset.section === sectionId

            );

        });

    }

    /** Fade in page smoothly */

    function setupFadeIn() {

        document.body.classList.add("rc-fade-init");

        setTimeout(() => {

            document.body.classList.add("rc-fade-done");

        }, 20);

    }

    if (document.readyState === 'loading') {

        document.addEventListener('DOMContentLoaded', initializePage);

    } else {

        initializePage();

    }

})();




