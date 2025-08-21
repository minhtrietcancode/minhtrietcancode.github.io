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
        // Check if the link is internal to the current page
        const isInternalLink = this.pathname === window.location.pathname || this.pathname === '' || this.pathname === '/';
        const targetId = this.getAttribute('href');
        const target = document.querySelector(targetId);
        
        if (target && isInternalLink && targetId.startsWith('#')) {
            e.preventDefault();

            // Update active class for nav links
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');

            // Remove 'active' from all page sections
            document.querySelectorAll('.page-section').forEach(section => {
                section.classList.remove('active');
            });

            // Add 'active' to the target section
            target.classList.add('active');

            // If the target is the home section, also activate the stories section
            if (targetId === '#home') {
                const storiesSection = document.getElementById('stories');
                if (storiesSection) {
                    storiesSection.classList.add('active');
                }
            }

            // Smooth scroll to the target
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

// Add theme toggle functionality
function addThemeToggle() {
    const themeToggle = document.createElement('button');
    themeToggle.className = 'theme-toggle';

    // Append to the navigation bar
    const nav = document.querySelector('nav');
    if (nav) {
        nav.prepend(themeToggle);
    } else {
        document.body.appendChild(themeToggle);
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

// Helper function to update dropdown height
function updateDropdownHeight(element) {
    const dropdownContent = element.closest('.dropdown-content');
    if (dropdownContent && dropdownContent.classList.contains('expanded')) {
        dropdownContent.style.maxHeight = dropdownContent.scrollHeight + "px";
    }
}

// Initialize functions on document load
document.addEventListener('DOMContentLoaded', () => {
    addThemeToggle();
    optimizePerformance();
    // Add event listener for story read more/less
    document.querySelectorAll('.story-entry .read-more').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const storyEntry = this.closest('.story-entry');
            const fullDescription = storyEntry.querySelector('.story-description-full');
            
            if (fullDescription) {
                fullDescription.classList.toggle('expanded');
                if (fullDescription.classList.contains('expanded')) {
                    this.textContent = '...Read Less';
                } else {
                    this.textContent = '...Read More';
                }
            }
        });
    });
});
