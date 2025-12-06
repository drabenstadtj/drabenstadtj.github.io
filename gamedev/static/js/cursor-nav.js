// Keyboard cursor navigation system
class CursorNav {
  constructor(selector) {
    this.items = Array.from(document.querySelectorAll(selector));
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (this.items.length === 0) return;

    // Set initial cursor position
    this.updateCursor();

    // Add keyboard event listener
    document.addEventListener('keydown', (e) => this.handleKeyPress(e));

    // Prevent page scroll with arrow keys
    window.addEventListener('keydown', (e) => {
      if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
      }
    }, { passive: false });
  }

  handleKeyPress(e) {
    switch(e.key) {
      case 'ArrowUp':
        this.moveCursor(-1);
        break;
      case 'ArrowDown':
        this.moveCursor(1);
        break;
      case 'Enter':
      case 'ArrowRight':
        this.selectItem();
        break;
      case 'Backspace':
      case 'Escape':
      case 'ArrowLeft':
        this.goBack();
        break;
    }
  }

  goBack() {
    // Find the back link (usually "< back")
    const backLink = document.querySelector('a[href="../index.html"], a[href="index.html"], a[href="../gamelog.html"]');
    if (backLink) {
      backLink.click();
    } else {
      // Fallback to browser back
      window.history.back();
    }
  }

  moveCursor(direction) {
    // Remove current cursor
    this.items[this.currentIndex].classList.remove('nav-item-cursor', 'nav-selected');

    // Update index with wrapping
    this.currentIndex += direction;
    if (this.currentIndex < 0) {
      this.currentIndex = this.items.length - 1;
    } else if (this.currentIndex >= this.items.length) {
      this.currentIndex = 0;
    }

    // Add cursor to new position
    this.updateCursor();

    // Scroll item into view
    this.items[this.currentIndex].scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });
  }

  updateCursor() {
    this.items[this.currentIndex].classList.add('nav-item-cursor', 'nav-selected');
  }

  selectItem() {
    // Find the link within the current item
    const link = this.items[this.currentIndex].querySelector('a');
    if (link) {
      link.click();
    }
  }
}

// Global back navigation handler
function globalGoBack() {
  const backLink = document.querySelector('a[href="../index.html"], a[href="index.html"], a[href="../gamelog.html"]');
  if (backLink) {
    backLink.click();
  } else {
    window.history.back();
  }
}

// Initialize cursor navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  // For index.html - target .entry divs
  if (document.querySelector('.nav .entries')) {
    new CursorNav('.nav .entries .entry');
  }
  // For gamelog.html - target .log-preview divs
  else if (document.querySelector('.log-list')) {
    new CursorNav('.log-list .log-preview');
  }
  // For lamport.html - target .project-item divs
  else if (document.querySelector('.project-items-list')) {
    new CursorNav('.project-items-list .project-item');
  }
  // For pages without navigable items (like log entries), just add back navigation
  else {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Backspace' || e.key === 'Escape' || e.key === 'ArrowLeft') {
        globalGoBack();
      }
    });
  }
});
