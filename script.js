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
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target && isInternalLink && this.getAttribute('href').startsWith('#')) {
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

// Function to truncate text and add "Read More" button
function truncateText(element, wordLimit) {
    const originalText = element.dataset.originalText || element.textContent;
    element.dataset.originalText = originalText; // Store original text

    const words = originalText.split(' ');
    if (words.length > wordLimit) {
        const truncatedText = words.slice(0, wordLimit).join(' ') + '...';
        element.innerHTML = `${truncatedText} <span class="read-more">Read More</span>`;
    } else {
        element.textContent = originalText;
    }
}

// Function to expand text
function expandText(element) {
    element.innerHTML = `${element.dataset.originalText} <span class="read-less">Read Less</span>`;
    updateDropdownHeight(element);
}

// Add event listeners for Read More/Read Less
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('read-more')) {
        const descriptionElement = e.target.closest('.project-description');
        if (descriptionElement) {
            expandText(descriptionElement);
        }
    } else if (e.target.classList.contains('read-less')) {
        const descriptionElement = e.target.closest('.project-description');
        if (descriptionElement) {
            truncateText(descriptionElement, 30); // Re-truncate after expanding
            updateDropdownHeight(descriptionElement);
        }
    }
});

// Add search functionality for projects
function addProjectSearch() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return; // Only run if projects section exists

    const searchContainer = document.createElement('div');
    searchContainer.className = 'search-container';
    searchContainer.innerHTML = `
        <input type="text" id="project-search" placeholder="Search projects...">
    `;
    
    const container = projectsSection.querySelector('.container');
    if (container) {
        container.insertBefore(searchContainer, container.firstChild);
    }
    
    const searchInput = document.getElementById('project-search');
    if (searchInput) {
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
}

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

// Add dropdown functionality for project categories and about sections
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
    addProjectSearch(); // This will now correctly check if #projects exists
    addDropdownFunctionality(); // This will now correctly check if #about or #projects exists
    loadFeaturedProjects();
    
    // Apply truncation to all project descriptions after they are loaded
    document.querySelectorAll('.project-description').forEach(descriptionElement => {
        truncateText(descriptionElement, 30); // You can adjust the word limit as needed
    });
}); 

function loadFeaturedProjects() {
    const featuredProjectsGrid = document.getElementById('featured-projects-grid');
    if (!featuredProjectsGrid) return; // Only run if featured projects section exists

    const featuredProjectIds = [
        'project-rag-migration-law-chatbot',
        'project-cristiano-ronaldo-detection',
        'project-linkedin-talent-search-agent',
        'project-futuretrack-careerguidance',
        'project-australian-accident-research',
        'project-optimizing-airplane-boarding-and-disembarking'
    ];

    featuredProjectIds.forEach(id => {
        const projectCard = document.getElementById(id);
        if (projectCard) {
            const clonedCard = projectCard.cloneNode(true);
            
            // Add pin icon and featured badge if they don't exist
            if (!clonedCard.querySelector('.pin-icon')) {
                const pinIcon = document.createElement('div');
                pinIcon.className = 'pin-icon';
                pinIcon.innerHTML = '📌';
                clonedCard.prepend(pinIcon);
            }
            if (!clonedCard.querySelector('.featured-badge')) {
                const featuredBadge = document.createElement('div');
                featuredBadge.className = 'featured-badge';
                featuredBadge.textContent = 'FEATURED';
                clonedCard.prepend(featuredBadge);
            }

            // Remove any inline styles for animation that might conflict
            clonedCard.style.opacity = '';
            clonedCard.style.transform = '';
            clonedCard.style.transition = '';

            featuredProjectsGrid.appendChild(clonedCard);

            // Truncate project descriptions for cloned cards
            const clonedDescriptionElement = clonedCard.querySelector('.project-description');
            if (clonedDescriptionElement) {
                truncateText(clonedDescriptionElement, 30); // Limit to 30 words for featured projects
            }

            // Observe the cloned card for animation, if IntersectionObserver is set up
            if (typeof observer !== 'undefined' && observer instanceof IntersectionObserver) {
                observer.observe(clonedCard);
            }
        }
    });
} 