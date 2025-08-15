// Add dropdown functionality for static pages (like About Me)
function addStaticDropdownFunctionality() {
    const dropdownHeaders = document.querySelectorAll('.dropdown-header');

    dropdownHeaders.forEach(header => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.dropdown-icon');

        // Skip if this header already has event listeners (avoid duplicates)
        if (header.hasAttribute('data-dropdown-initialized')) {
            return;
        }
        header.setAttribute('data-dropdown-initialized', 'true');

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

// Initialize functions on document load
document.addEventListener('DOMContentLoaded', () => {
    addStaticDropdownFunctionality();
});
