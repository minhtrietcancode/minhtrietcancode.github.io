/**
 * Single-page portfolio: smooth scroll, active nav highlighting, mobile menu
 */

(function () {
    'use strict';

    const navLinksContainer = document.getElementById('nav-links');
    const mobileMenuBtn = document.getElementById('mobile-menu');
    const sections = document.querySelectorAll('.page-section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Section IDs in order (matching nav links)
    const sectionIds = [
        'hero',
        'education',
        'experience',
        'publications',
        'projects',
        'honors',
        'community',
        'my-picture'
    ];

    // Mobile menu toggle
    if (mobileMenuBtn && navLinksContainer) {
        mobileMenuBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinksContainer.classList.toggle('active');
        });

        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                navLinksContainer.classList.remove('active');
            }
        });
    }

    // Smooth scroll for nav links
    navLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href && href.startsWith('#')) {
                const targetId = href.slice(1);
                const target = document.getElementById(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    navLinksContainer.classList.remove('active');
                }
            }
        });
    });

    // Update active nav link based on scroll position
    function updateActiveNav() {
        const scrollY = window.pageYOffset;
        const headerOffset = 120;
        let currentSectionId = 'hero';

        for (let i = sectionIds.length - 1; i >= 0; i--) {
            const section = document.getElementById(sectionIds[i]);
            if (section) {
                const sectionTop = section.offsetTop - headerOffset;
                if (scrollY >= sectionTop) {
                    currentSectionId = sectionIds[i];
                    break;
                }
            }
        }

        navLinks.forEach((link) => {
            const href = link.getAttribute('href');
            if (href === '#' + currentSectionId) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Throttled scroll handler
    let scrollTimeout;
    function onScroll() {
        if (scrollTimeout) {
            window.cancelAnimationFrame(scrollTimeout);
        }
        scrollTimeout = window.requestAnimationFrame(() => {
            updateActiveNav();
            scrollTimeout = null;
        });
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', updateActiveNav);
    updateActiveNav();

    // Project descriptions: truncate with Read More / Read Less (same as projects.js)
    const DESCRIPTION_WORD_LIMIT = 19;

    function truncateProjectDescription(element, wordLimit) {
        const limit = wordLimit > 0 ? wordLimit : DESCRIPTION_WORD_LIMIT;
        const originalText = element.dataset.originalText || element.textContent.trim();
        element.dataset.originalText = originalText;

        const words = originalText.split(/\s+/).filter(Boolean);
        if (words.length > limit) {
            const truncatedText = words.slice(0, limit).join(' ') + '...';
            element.innerHTML = truncatedText + ' <span class="read-more">Read More</span>';
        } else {
            element.textContent = originalText;
        }
    }

    function expandProjectDescription(element) {
        element.innerHTML = element.dataset.originalText + ' <span class="read-less">Read Less</span>';
    }

    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('read-more')) {
            const desc = e.target.closest('.project-description');
            if (desc) expandProjectDescription(desc);
        } else if (e.target.classList.contains('read-less')) {
            const desc = e.target.closest('.project-description');
            if (desc) truncateProjectDescription(desc, DESCRIPTION_WORD_LIMIT);
        }
    });

    document.querySelectorAll('#projects .project-description').forEach((el) => {
        truncateProjectDescription(el, DESCRIPTION_WORD_LIMIT);
    });
})();
