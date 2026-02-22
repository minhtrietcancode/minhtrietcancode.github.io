// Read More / Read Less for story entries
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.story-entry .read-more').forEach(button => {
        if (button.classList.contains('read-less')) return;

        button.addEventListener('click', function (e) {
            e.preventDefault();
            e.stopPropagation();
            const storyEntry = this.closest('.story-entry');
            const expandableContent = storyEntry.querySelector('.story-expandable-content');
            const readMoreButton = this;

            if (!expandableContent) return;

            expandableContent.classList.toggle('expanded');

            if (expandableContent.classList.contains('expanded')) {
                readMoreButton.style.display = 'none';

                let readLessButton = storyEntry.querySelector('.read-less');
                if (!readLessButton) {
                    readLessButton = document.createElement('span');
                    readLessButton.className = 'read-more read-less';
                    readLessButton.textContent = '...Read Less';
                    expandableContent.appendChild(readLessButton);
                    readLessButton.addEventListener('click', function (ev) {
                        ev.preventDefault();
                        ev.stopPropagation();
                        expandableContent.classList.remove('expanded');
                        readLessButton.remove();
                        readMoreButton.style.display = 'inline';
                    });
                }
            } else {
                const readLessBtn = storyEntry.querySelector('.read-less');
                if (readLessBtn) readLessBtn.remove();
                readMoreButton.style.display = 'inline';
            }
        });
    });
});
