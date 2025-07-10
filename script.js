        // Navigation functionality
        const navLinks = document.querySelectorAll('.nav-link');
        const sections = document.querySelectorAll('.page-section');
        const mobileMenu = document.getElementById('mobile-menu');
        const navLinksContainer = document.getElementById('nav-links');

        // Handle navigation clicks
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                
                // Remove active class from all links and sections
                navLinks.forEach(l => l.classList.remove('active'));
                sections.forEach(s => s.classList.remove('active'));
                
                // Add active class to clicked link and target section
                link.classList.add('active');
                document.getElementById(targetId).classList.add('active');
                
                // Close mobile menu if open
                navLinksContainer.classList.remove('active');
            });
        });

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
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
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

        // Add dynamic background to hero section
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

        // Initialize floating elements
        createFloatingElements();

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
        document.querySelector('a[href="#projects"]').addEventListener('click', () => {
            setTimeout(addProjectSearch, 100);
        });

        // Add theme toggle functionality
        function addThemeToggle() {
            const themeToggle = document.createElement('button');
            themeToggle.innerHTML = '🌙';
            themeToggle.className = 'theme-toggle';
            themeToggle.style.cssText = `
                position: fixed;
                top: 50%;
                right: 20px;
                width: 50px;
                height: 50px;
                border-radius: 50%;
                border: none;
                background: var(--secondary-color);
                color: white;
                font-size: 1.2rem;
                cursor: pointer;
                z-index: 1001;
                transition: all 0.3s ease;
                box-shadow: var(--shadow);
                transform: translateY(-50%);
            `;
            
            document.body.appendChild(themeToggle);
            
            themeToggle.addEventListener('click', () => {
                document.body.classList.toggle('dark-theme');
                themeToggle.innerHTML = document.body.classList.contains('dark-theme') ? '☀️' : '🌙';
            });
        }

        // Add dark theme styles
        const darkThemeStyles = document.createElement('style');
        darkThemeStyles.textContent = `
            .dark-theme {
                --primary-color: #3498db;
                --secondary-color: #2ecc71;
                --text-color: #ecf0f1;
                --text-light: #bdc3c7;
                --bg-color: #2c3e50;
                --bg-light: #34495e;
                --border-color: #4a5568;
                --shadow: 0 2px 10px rgba(0,0,0,0.3);
                --shadow-hover: 0 4px 20px rgba(0,0,0,0.4);
            }
            
            .dark-theme header {
                background: var(--bg-color);
                border-bottom: 1px solid var(--border-color);
            }
            
            .dark-theme .hero {
                background: linear-gradient(135deg, var(--bg-light) 0%, var(--bg-color) 100%);
            }
            
            .dark-theme .project-card,
            .dark-theme .education-item,
            .dark-theme .experience-item,
            .dark-theme .award-item {
                background: var(--bg-light);
                border: 1px solid var(--border-color);
            }
            
            .dark-theme .resume-download {
                background: var(--bg-light);
                border: 1px solid var(--border-color);
            }
            
            .dark-theme .tag {
                background: var(--bg-color);
                border-color: var(--border-color);
            }
            
            .dark-theme #project-search {
                background: var(--bg-light);
                color: var(--text-color);
                border-color: var(--border-color);
            }
            
            .dark-theme #project-search::placeholder {
                color: var(--text-light);
            }
        `;
        document.head.appendChild(darkThemeStyles);

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