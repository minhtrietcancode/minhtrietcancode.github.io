// No specific functionalities for index.js yet.

document.addEventListener('DOMContentLoaded', () => {
    loadStories();
});

async function loadStories() {
    try {
        const response = await fetch('stories.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const stories = await response.json();
        const storiesSection = document.querySelector('#stories .container');
        if (!storiesSection) {
            console.error('Stories section container not found!');
            return;
        }

        // Clear existing content if any (though we removed hardcoded ones)
        // We want to keep the h2 title
        const storiesTitle = storiesSection.querySelector('h2');
        storiesSection.innerHTML = ''; 
        if (storiesTitle) {
            storiesSection.appendChild(storiesTitle);
        }

        stories.forEach(story => {
            const storyEntry = document.createElement('div');
            storyEntry.classList.add('story-entry');

            storyEntry.innerHTML = `
                <p class="story-title-preview">
                    <strong>${story.date}: ${story.title}</strong> 
                    <span class="read-more">...Read More</span>
                </p>
                <div class="story-description-full">
                    ${story.description.split('\n').map(p => `<p>${p}</p>`).join('')}
                </div>
            `;
            storiesSection.appendChild(storyEntry);
        });

        // Re-attach event listeners for "Read More" after stories are loaded
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

    } catch (error) {
        console.error('Could not load stories:', error);
    }
}