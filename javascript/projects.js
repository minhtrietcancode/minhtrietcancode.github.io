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

// Word limit for truncating project descriptions (Read More)
const DESCRIPTION_WORD_LIMIT = 25;

// Function to truncate text and add "Read More" button
function truncateText(element, wordLimit) {
    const limit = wordLimit > 0 ? wordLimit : DESCRIPTION_WORD_LIMIT;
    const originalText = element.dataset.originalText || element.textContent.trim();
    element.dataset.originalText = originalText;

    const words = originalText.split(/\s+/).filter(Boolean);
    if (words.length > limit) {
        const truncatedText = words.slice(0, limit).join(' ') + '...';
        element.innerHTML = `${truncatedText} <span class="read-more">Read More</span>`;
    } else {
        element.textContent = originalText;
    }
}

// Function to expand text
function expandText(element) {
    element.innerHTML = `${element.dataset.originalText} <span class="read-less">Read Less</span>`;
    if (typeof updateDropdownHeight === 'function') {
        updateDropdownHeight(element);
    }
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
            truncateText(descriptionElement, DESCRIPTION_WORD_LIMIT);
            if (typeof updateDropdownHeight === 'function') {
                updateDropdownHeight(descriptionElement);
            }
        }
    }
});

// Add search functionality for projects
function addProjectSearch() {
    const projectsSection = document.getElementById('projects');
    if (!projectsSection) return;

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
            const categories = document.querySelectorAll('.projects-category');

            categories.forEach(category => {
                const cards = category.querySelectorAll('.project-card');
                let visibleCards = 0;

                cards.forEach(card => {
                    const titleEl = card.querySelector('.project-title');
                    const descEl = card.querySelector('.project-description');
                    const title = (titleEl ? titleEl.textContent : '').toLowerCase();
                    const description = (descEl ? descEl.textContent : '').toLowerCase();
                    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');

                    if (title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm)) {
                        card.style.display = 'block';
                        visibleCards++;
                    } else {
                        card.style.display = 'none';
                    }
                });

                category.style.display = visibleCards > 0 ? 'block' : 'none';
            });

            // Also filter featured section cards (they're in #featured-projects-grid)
            const featuredGrid = document.getElementById('featured-projects-grid');
            if (featuredGrid && searchTerm) {
                featuredGrid.querySelectorAll('.project-card').forEach(card => {
                    const titleEl = card.querySelector('.project-title');
                    const descEl = card.querySelector('.project-description');
                    const title = (titleEl ? titleEl.textContent : '').toLowerCase();
                    const description = (descEl ? descEl.textContent : '').toLowerCase();
                    const tags = Array.from(card.querySelectorAll('.tag')).map(tag => tag.textContent.toLowerCase()).join(' ');
                    const matches = title.includes(searchTerm) || description.includes(searchTerm) || tags.includes(searchTerm);
                    card.style.display = matches ? 'block' : 'none';
                });
            } else if (featuredGrid && !searchTerm) {
                featuredGrid.querySelectorAll('.project-card').forEach(card => {
                    card.style.display = 'block';
                });
            }
        });
    }
}

// Add dropdown functionality for category headers
function addDropdownFunctionality(header) {
    const content = header.nextElementSibling;
    const icon = header.querySelector('.dropdown-icon');
    if (!content || !icon) return;

    content.style.maxHeight = null;
    content.classList.remove('expanded');
    icon.classList.remove('expanded');

    header.addEventListener('click', () => {
        if (content.classList.contains('expanded')) {
            content.style.maxHeight = null;
            content.classList.remove('expanded');
            icon.classList.remove('expanded');
        } else {
            content.style.maxHeight = content.scrollHeight + 'px';
            content.classList.add('expanded');
            icon.classList.add('expanded');
        }
    });
}

// Initialize: search, truncation, dropdowns, and scroll animation
document.addEventListener('DOMContentLoaded', () => {
    addProjectSearch();

    // Truncate all project descriptions
    document.querySelectorAll('.project-description').forEach(descriptionElement => {
        truncateText(descriptionElement, DESCRIPTION_WORD_LIMIT);
    });

    // Initialize dropdowns for all project category headers
    document.querySelectorAll('#all-projects-container .dropdown-header').forEach(header => {
        addDropdownFunctionality(header);
    });

    // Observe all project cards for scroll animation
    document.querySelectorAll('.project-card').forEach(card => {
        observer.observe(card);
    });
});
