        // Navigation functionality
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinksContainer = document.getElementById('nav-links');

        // Mobile menu toggle
        mobileMenu.addEventListener('click', () => {
            navLinksContainer.classList.toggle('active');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('nav')) {
                navLinksContainer.classList.remove('active');
            }
        });

        // Smooth scrolling for better UX
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const target = document.querySelector(this.getAttribute('href'));
                // Only prevent default and scroll if it's an internal anchor link
                if (target && this.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Add scroll-to-top functionality
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            if (scrollTop > 100) {
                document.body.classList.add('scrolled');
            } else {
                document.body.classList.remove('scrolled');
            }
        });

        // Add animation on scroll for project cards
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all project cards
        document.querySelectorAll('.project-card, .education-item, .experience-item, .award-item').forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(card);
        });

        // Add typing effect to hero text
        /*
        function typeWriter(element, text, speed = 50) {
            let i = 0;
            element.innerHTML = '';
            function type() {
                if (i < text.length) {
                    element.innerHTML += text.charAt(i);
                    i++;
                    setTimeout(type, speed);
                }
            }
            type();
        }

        // Initialize typing effect on page load
        window.addEventListener('load', () => {
            const heroTitle = document.querySelector('.hero h1');
            const heroDescription = document.querySelector('.hero p');
            
            if (heroTitle && heroDescription) {
                const originalTitle = heroTitle.textContent;
                const originalDescription = heroDescription.textContent;
                
                setTimeout(() => {
                    typeWriter(heroTitle, originalTitle, 100);
                    setTimeout(() => {
                        typeWriter(heroDescription, originalDescription, 30);
                    }, originalTitle.length * 100 + 500);
                }, 500);
            }
        });
        */

        // Add dynamic background to hero section
        /*
        function createFloatingElements() {
            const hero = document.querySelector('.hero');
            if (!hero) return;

            for (let i = 0; i < 5; i++) {
                const element = document.createElement('div');
                element.className = 'floating-element';
                element.style.cssText = `
                    position: absolute;
                    width: ${Math.random() * 20 + 10}px;
                    height: ${Math.random() * 20 + 10}px;
                    background: rgba(52, 152, 219, 0.1);
                    border-radius: 50%;
                    left: ${Math.random() * 100}%;
                    top: ${Math.random() * 100}%;
                    animation: float ${Math.random() * 10 + 5}s ease-in-out infinite;
                    pointer-events: none;
                `;
                hero.appendChild(element);
            }
        }
        */

        // Initialize floating elements
        // createFloatingElements();

        // Add search functionality for projects
        function addProjectSearch() {
            const projectsSection = document.getElementById('projects');
            const searchContainer = document.createElement('div');
            searchContainer.className = 'search-container';
            searchContainer.innerHTML = `
                <input type="text" id="project-search" placeholder="Search projects...">
            `;
            
            const container = projectsSection.querySelector('.container');
            container.insertBefore(searchContainer, container.firstChild);
            
            const searchInput = document.getElementById('project-search');
            searchInput.addEventListener('focus', () => {
                searchInput.style.borderColor = 'var(--secondary-color)';
            });
            
            searchInput.addEventListener('blur', () => {
                searchInput.style.borderColor = 'var(--border-color)';
            });
            
            searchInput.addEventListener('input', (e) => {
                const searchTerm = e.target.value.toLowerCase();
                const projectCards = document.querySelectorAll('.project-card');
                const categories = document.querySelectorAll('.projects-category');
                
                categories.forEach(category => {
                    const cards = category.querySelectorAll('.project-card');
                    let visibleCards = 0;
                    
                    cards.forEach(card => {
                        const title = card.querySelector('.project-title').textContent.toLowerCase();
                        const description = card.querySelector('.project-description').textContent.toLowerCase();
                        const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                        
                        if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                            card.style.display = 'block';
                            visibleCards++;
                        } else {
                            card.style.display = 'none';
                        }
                    });
                    
                    // Hide category if no visible cards
                    category.style.display = visibleCards > 0 ? 'block' : 'none';
                });
            });
        }

        // Add project search when projects section is active
        if (document.getElementById('projects')) { // Only add if projects section exists on the page
            addProjectSearch();
        }

        // Add theme toggle functionality
        function addThemeToggle() {
            const themeToggle = document.createElement('button');
            themeToggle.className = 'theme-toggle';

            // Append to the navigation bar
            const nav = document.querySelector('nav');
            if (nav) {
                nav.prepend(themeToggle); // Prepend to place it on the left
            } else {
                document.body.appendChild(themeToggle); // Fallback if nav not found
            }

            // Function to apply theme
            function applyTheme(theme) {
                if (theme === 'dark') {
                    document.body.classList.add('dark-theme');
                    themeToggle.innerHTML = '☀️';
                } else {
                    document.body.classList.remove('dark-theme');
                    themeToggle.innerHTML = '🌙';
                }
            }

            // Check for saved theme on load
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                applyTheme(savedTheme);
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                // Default to dark theme if OS prefers dark
                applyTheme('dark');
            } else {
                // Default to light theme
                applyTheme('light');
            }

            themeToggle.addEventListener('click', () => {
                if (document.body.classList.contains('dark-theme')) {
                    applyTheme('light');
                    localStorage.setItem('theme', 'light');
                } else {
                    applyTheme('dark');
                    localStorage.setItem('theme', 'dark');
                }
            });
        }

        // Initialize theme toggle
        addThemeToggle();

        // Add performance optimization
        function optimizePerformance() {
            // Lazy load images
            const images = document.querySelectorAll('.project-image');
            images.forEach(img => {
                img.loading = 'lazy';
            });
            
            // Debounce scroll events
            let scrollTimeout;
            window.addEventListener('scroll', () => {
                clearTimeout(scrollTimeout);
                scrollTimeout = setTimeout(() => {
                    // Scroll-dependent operations here
                }, 16); // ~60fps
            });
        }

        // Initialize performance optimizations
        optimizePerformance();

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
            }
        });

        document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Add focus styles for keyboard navigation
        const keyboardNavStyles = document.createElement('style');
        keyboardNavStyles.textContent = `
            .keyboard-nav .nav-link:focus,
            .keyboard-nav .project-link:focus,
            .keyboard-nav .social-links a:focus,
            .keyboard-nav .download-btn:focus {
                outline: 3px solid var(--secondary-color);
                outline-offset: 2px;
            }
        `;
        document.head.appendChild(keyboardNavStyles);

        // Add dropdown functionality for project categories
        function addDropdownFunctionality() {
            const dropdownHeaders = document.querySelectorAll('.dropdown-header');

            dropdownHeaders.forEach(header => {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.dropdown-icon');

                // Set initial state to collapsed
                content.style.maxHeight = null;
                content.classList.remove('expanded');
                icon.classList.remove('expanded');

                header.addEventListener('click', () => {
                    if (content.classList.contains('expanded')) {
                        content.style.maxHeight = null; // Reset max-height
                        content.classList.remove('expanded');
                        icon.classList.remove('expanded');
                    } else {
                        content.style.maxHeight = content.scrollHeight + "px"; // Set max-height to scrollHeight
                        content.classList.add('expanded');
                        icon.classList.add('expanded');
                    }
                });
            });
        }

        // Initialize project dropdowns when projects section is active
        if (document.getElementById('projects')) { 
            addDropdownFunctionality();
        }

        // Initialize about section dropdowns when about section is active
        if (document.getElementById('about')) {
            addDropdownFunctionality();
        } 