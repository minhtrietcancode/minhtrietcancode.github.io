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

            const storyTitlePreview = document.createElement('p');
            storyTitlePreview.classList.add('story-title-preview');
            storyTitlePreview.innerHTML = `<strong>${story.date}: ${story.title}</strong>`;

            const readMoreButton = document.createElement('span');
            readMoreButton.classList.add('read-more');
            readMoreButton.textContent = '...Read More';
            storyTitlePreview.appendChild(readMoreButton);

            // Create expandable content container
            const expandableContent = document.createElement('div');
            expandableContent.classList.add('story-expandable-content');

            const storyDescriptionFull = document.createElement('div');
            storyDescriptionFull.classList.add('story-description-full');
            storyDescriptionFull.innerHTML = story.description.map(p => `<p>${p}</p>`).join('');

            // Add description to expandable content
            expandableContent.appendChild(storyDescriptionFull);

            // Add images to expandable content if they exist
            if (story.images_path && story.images && story.images.length > 0) {
                const imagesContainer = document.createElement('div');
                imagesContainer.classList.add('story-images-container');

                story.images.forEach(imageName => {
                    const img = document.createElement('img');
                    img.src = `${story.images_path}/${imageName}`;
                    img.alt = story.title;
                    img.classList.add('story-image');
                    imagesContainer.appendChild(img);
                });
                expandableContent.appendChild(imagesContainer);
            }

            storyEntry.appendChild(storyTitlePreview);
            storyEntry.appendChild(expandableContent);

            storiesSection.appendChild(storyEntry);
        });

        // Re-attach event listeners for "Read More" after stories are loaded
        document.querySelectorAll('.story-entry .read-more').forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                const storyEntry = this.closest('.story-entry');
                const expandableContent = storyEntry.querySelector('.story-expandable-content');
                const readMoreButton = this;
                let readLessButton = storyEntry.querySelector('.read-less');

                if (expandableContent) {
                    expandableContent.classList.toggle('expanded');

                    if (expandableContent.classList.contains('expanded')) {
                        readMoreButton.style.display = 'none'; // Hide "Read More"

                        if (!readLessButton) {
                            readLessButton = document.createElement('span');
                            readLessButton.classList.add('read-more'); // Re-use read-more class for styling
                            readLessButton.classList.add('read-less');
                            readLessButton.textContent = '...Read Less';
                            expandableContent.appendChild(readLessButton); // Append to expandable content (after images)
                            readLessButton.addEventListener('click', function(event) {
                                event.preventDefault();
                                expandableContent.classList.remove('expanded');
                                readLessButton.remove(); // Remove "Read Less"
                                readMoreButton.style.display = 'inline'; // Show "Read More"
                                event.stopPropagation();
                            });
                        }
                    } else {
                        // This case handles collapsing when the readLessButton is clicked directly
                        // which is handled by its own listener now.
                        // If a user clicks the original readMoreButton when already expanded, it will collapse.
                        if (readLessButton) {
                            readLessButton.remove();
                        }
                        readMoreButton.style.display = 'inline';
                    }
                }
                e.stopPropagation();
            });
        });

    } catch (error) {
        console.error('Could not load stories:', error);
    }
}