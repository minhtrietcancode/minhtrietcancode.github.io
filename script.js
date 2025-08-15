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

// NEW FUNCTIONS FOR DYNAMIC PROJECT LOADING

// Global variable to store all projects for featured section
let allProjects = {};

// Function to create project card HTML
function createProjectCard(project) {
    return `
        <div class="project-card" id="${project.id}">
            <div class="project-image">
                <img src="${project.image}" alt="${project.imageAlt}" style="width:100%; height:100%; object-fit:cover;">
            </div>
            <div class="project-content">
                <div class="project-title">${project.title}</div>
                <div class="project-description">
                    ${project.description}
                </div>
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
                <a href="${project.link}" class="project-link" target="_blank">View Project</a>
            </div>
        </div>
    `;
}

// Function to load config and initialize project loading
async function loadProjectsFromConfig() {
    try {
        // Load config file
        const configResponse = await fetch('../projects_json_database/config.json');
        const config = await configResponse.json();
        
        // Load all project categories
        await loadAllProjectCategories(config.project_categories);
        
        // Load featured projects after all projects are loaded
        await loadFeaturedProjectsFromJSON();
        
    } catch (error) {
        console.error('Error loading projects config:', error);
    }
}

// Function to load all project categories
async function loadAllProjectCategories(categories) {
    const allProjectsContainer = document.getElementById('all-projects-container');
    if (!allProjectsContainer) return;

    for (const category of categories) {
        try {
            // Load projects for this category
            const projectsResponse = await fetch(`../projects_json_database/${category.json_path}`);
            const projects = await projectsResponse.json();
            
            // Store projects in global object for featured section
            projects.forEach(project => {
                allProjects[project.id] = project;
            });
            
            // Create category HTML
            const categoryHTML = `
                <div class="projects-category">
                    <div class="dropdown-header" id="${category.id}-header">
                        <h3>${category.title}</h3>
                        <span class="dropdown-icon">&#9660;</span>
                    </div>
                    <div class="dropdown-content" id="${category.id}-content">
                        <div class="projects-grid">
                            ${projects.map(project => createProjectCard(project)).join('')}
                        </div>
                    </div>
                </div>
            `;
            
            allProjectsContainer.innerHTML += categoryHTML;
            
        } catch (error) {
            console.error(`Error loading projects for category ${category.title}:`, error);
        }
    }
    
    // Apply truncation to all project descriptions after they are loaded
    document.querySelectorAll('.project-description').forEach(descriptionElement => {
        truncateText(descriptionElement, 30);
    });
    
    // Initialize dropdown functionality after all categories are loaded
    addDropdownFunctionality();
}

// Updated function to load featured projects from JSON
async function loadFeaturedProjectsFromJSON() {
    try {
        // Load featured projects config
        const featuredResponse = await fetch('../projects_json_database/featured_project.json');
        const featuredConfig = await featuredResponse.json();
        
        const featuredProjectsGrid = document.getElementById('featured-projects-grid');
        if (!featuredProjectsGrid) return;

        featuredConfig.featured_projects.forEach(projectId => {
            const project = allProjects[projectId];
            if (project) {
                // Create project card
                const projectCardHTML = createProjectCard(project);
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = projectCardHTML;
                const clonedCard = tempDiv.firstElementChild;
                
                // Add pin icon and featured badge
                const pinIcon = document.createElement('div');
                pinIcon.className = 'pin-icon';
                pinIcon.innerHTML = '📌';
                clonedCard.prepend(pinIcon);
                
                const featuredBadge = document.createElement('div');
                featuredBadge.className = 'featured-badge';
                featuredBadge.textContent = 'FEATURED';
                clonedCard.prepend(featuredBadge);

                featuredProjectsGrid.appendChild(clonedCard);

                // Truncate project descriptions for featured projects
                const clonedDescriptionElement = clonedCard.querySelector('.project-description');
                if (clonedDescriptionElement) {
                    truncateText(clonedDescriptionElement, 30);
                }

                // Observe the cloned card for animation
                if (typeof observer !== 'undefined' && observer instanceof IntersectionObserver) {
                    observer.observe(clonedCard);
                }
            }
        });
        
    } catch (error) {
        console.error('Error loading featured projects:', error);
    }
}

// Updated loadFeaturedProjects function (keeping for compatibility)
function loadFeaturedProjects() {
    // This function is now handled by loadFeaturedProjectsFromJSON
    // Keeping it empty for compatibility with existing code
}

// Initialize functions on document load
document.addEventListener('DOMContentLoaded', () => {
    addThemeToggle();
    optimizePerformance();
    addProjectSearch();
    
    // Load projects dynamically
    loadProjectsFromConfig();
});