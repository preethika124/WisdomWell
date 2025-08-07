class DailyQuoteGenerator {
  constructor() {
    this.quotes = [
      {
        text: "The only way to do great work is to love what you do.",
        author: "Steve Jobs",
        mood: "motivated"
      },
      {
        text: "Life is what happens to you while you're busy making other plans.",
        author: "John Lennon",
        mood: "peaceful"
      },
      {
        text: "The future belongs to those who believe in the beauty of their dreams.",
        author: "Eleanor Roosevelt",
        mood: "inspirational"
      },
      {
        text: "Creativity takes courage.",
        author: "Henri Matisse",
        mood: "creative"
      },
      {
        text: "The only impossible journey is the one you never begin.",
        author: "Tony Robbins",
        mood: "motivated"
      },
      {
        text: "In the depths of winter, I finally learned that within me there lay an invincible summer.",
        author: "Albert Camus",
        mood: "sad"
      },
      {
        text: "Be yourself; everyone else is already taken.",
        author: "Oscar Wilde",
        mood: "inspirational"
      },
      {
        text: "Two things are infinite: the universe and human stupidity; and I'm not sure about the universe.",
        author: "Albert Einstein",
        mood: "creative"
      },
      {
        text: "A room without books is like a body without a soul.",
        author: "Marcus Tullius Cicero",
        mood: "peaceful"
      },
      {
        text: "You only live once, but if you do it right, once is enough.",
        author: "Mae West",
        mood: "motivated"
      },
      {
        text: "Be the change that you wish to see in the world.",
        author: "Mahatma Gandhi",
        mood: "inspirational"
      },
      {
        text: "A friend is someone who knows all about you and still loves you.",
        author: "Elbert Hubbard",
        mood: "peaceful"
      },
      {
        text: "The wound is the place where the Light enters you.",
        author: "Rumi",
        mood: "sad"
      },
      {
        text: "Imagination is more important than knowledge.",
        author: "Albert Einstein",
        mood: "creative"
      },
      {
        text: "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        author: "Winston Churchill",
        mood: "motivated"
      }
    ];

    this.currentQuote = null;
    this.favorites = this.loadFavorites();
    this.currentMood = 'all';
    this.theme = this.loadTheme();
    
    this.initializeElements();
    this.setupEventListeners();
    this.applyTheme();
    this.displayRandomQuote();
    this.updateInspirationMeter();
  }

  initializeElements() {
    // Quote elements
    this.quoteText = document.getElementById('quoteText');
    this.quoteAuthor = document.getElementById('quoteAuthor');
    this.quoteDisplay = document.getElementById('quoteDisplay');
    
    // Control buttons
    this.newQuoteBtn = document.getElementById('newQuoteBtn');
    this.saveQuoteBtn = document.getElementById('saveQuoteBtn');
    this.favoritesToggle = document.getElementById('favoritesToggle');
    
    // Theme controls
    this.themeToggle = document.getElementById('themeToggle');
    
    // Sidebar elements
    this.favoritesSidebar = document.getElementById('favoritesSidebar');
    this.favoritesList = document.getElementById('favoritesList');
    this.closeFavorites = document.getElementById('closeFavorites');
    this.sidebarOverlay = document.getElementById('sidebarOverlay');
    
    // Other elements
    this.moodSelect = document.getElementById('moodSelect');
  }

  setupEventListeners() {
    // Button clicks
    this.newQuoteBtn.addEventListener('click', () => this.displayRandomQuote());
    this.saveQuoteBtn.addEventListener('click', () => this.toggleFavorite());
    this.favoritesToggle.addEventListener('click', () => this.toggleFavoritesSidebar());
    this.closeFavorites.addEventListener('click', () => this.closeFavoritesSidebar());
    this.sidebarOverlay.addEventListener('click', () => this.closeFavoritesSidebar());
    
    // Theme toggle
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    
    // Mood selector
    this.moodSelect.addEventListener('change', (e) => {
      this.currentMood = e.target.value;
      this.displayRandomQuote();
    });
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => this.handleKeyboardShortcuts(e));
    
    // Ripple effect for buttons
    document.querySelectorAll('[data-ripple]').forEach(button => {
      button.addEventListener('click', (e) => this.createRipple(e));
    });
  }

  displayRandomQuote() {
    const filteredQuotes = this.getFilteredQuotes();
    if (filteredQuotes.length === 0) {
      this.showNoQuotesMessage();
      return;
    }

    let newQuote;
    do {
      newQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];
    } while (newQuote === this.currentQuote && filteredQuotes.length > 1);

    this.currentQuote = newQuote;
    this.animateQuoteChange();
    this.updateSaveButtonState();
    this.updateInspirationMeter();
  }

  getFilteredQuotes() {
    if (this.currentMood === 'all') {
      return this.quotes;
    }
    return this.quotes.filter(quote => quote.mood === this.currentMood);
  }

  showNoQuotesMessage() {
    this.currentQuote = {
      text: "No quotes available for this mood. Try selecting a different mood!",
      author: "Quote Generator",
      mood: "all"
    };
    this.animateQuoteChange();
  }

  animateQuoteChange() {
    // Fade out current quote
    this.quoteDisplay.style.animation = 'slideOut 0.3s ease forwards';
    
    setTimeout(() => {
      this.quoteText.textContent = this.currentQuote.text;
      this.quoteAuthor.textContent = this.currentQuote.author;
      
      // Add typing animation
      this.quoteText.classList.add('typing');
      
      // Fade in new quote
      this.quoteDisplay.style.animation = 'slideIn 0.5s ease forwards';
      
      // Remove typing animation after completion
      setTimeout(() => {
        this.quoteText.classList.remove('typing');
      }, 2000);
    }, 300);
  }

  toggleFavorite() {
    if (!this.currentQuote) return;

    const quoteId = this.getQuoteId(this.currentQuote);
    const existingIndex = this.favorites.findIndex(fav => this.getQuoteId(fav) === quoteId);

    if (existingIndex > -1) {
      this.favorites.splice(existingIndex, 1);
      this.saveQuoteBtn.classList.remove('saved');
    } else {
      this.favorites.push({ ...this.currentQuote });
      this.saveQuoteBtn.classList.add('saved');
    }

    this.saveFavorites();
    this.updateFavoritesList();
    this.updateInspirationMeter();
  }

  getQuoteId(quote) {
    return `${quote.text}-${quote.author}`;
  }

  updateSaveButtonState() {
    if (!this.currentQuote) return;

    const quoteId = this.getQuoteId(this.currentQuote);
    const isFavorite = this.favorites.some(fav => this.getQuoteId(fav) === quoteId);
    
    this.saveQuoteBtn.classList.toggle('saved', isFavorite);
  }

  toggleFavoritesSidebar() {
    this.favoritesSidebar.classList.add('open');
    this.sidebarOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.updateFavoritesList();
  }

  closeFavoritesSidebar() {
    this.favoritesSidebar.classList.remove('open');
    this.sidebarOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  updateFavoritesList() {
    if (this.favorites.length === 0) {
      this.favoritesList.innerHTML = `
        <div class="empty-favorites">
          <p>✨ No favorite quotes yet. Start saving quotes that inspire you!</p>
        </div>
      `;
      return;
    }

    // Create interesting animated cards
    this.favoritesList.innerHTML = this.favorites.map((quote, index) => `
      <div class="favorite-item" style="animation-delay: ${index * 0.15}s">
        <div class="favorite-number">${index + 1}</div>
        <div class="favorite-content">
          <div class="favorite-quote">${quote.text}</div>
          <div class="favorite-author">${quote.author}</div>
          <div class="favorite-mood">${this.getMoodEmoji(quote.mood)} ${quote.mood}</div>
        </div>
        <button class="remove-favorite" onclick="quoteGenerator.removeFavorite(${index})" aria-label="Remove favorite">
          ×
        </button>
      </div>
    `).join('');
  }

  getMoodEmoji(mood) {
    const moodEmojis = {
      motivated: '🚀',
      sad: '💙',
      creative: '🎨',
      inspirational: '✨',
      peaceful: '🕊️',
      all: '💫'
    };
    return moodEmojis[mood] || '💫';
  }

  removeFavorite(index) {
    this.favorites.splice(index, 1);
    this.saveFavorites();
    this.updateFavoritesList();
    this.updateSaveButtonState();
    this.updateInspirationMeter();
  }

  toggleTheme() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    this.applyTheme();
    this.saveTheme();
  }

  applyTheme() {
    document.documentElement.setAttribute('data-theme', this.theme);
  }



  updateInspirationMeter() {
    // Removed inspiration meter functionality since it's no longer in the UI
  }

  handleKeyboardShortcuts(e) {
    // Ignore if user is typing in an input
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT') {
      return;
    }

    switch (e.key.toLowerCase()) {
      case 'n':
        e.preventDefault();
        this.displayRandomQuote();
        this.animateButton(this.newQuoteBtn);
        break;
      case 's':
        e.preventDefault();
        this.toggleFavorite();
        this.animateButton(this.saveQuoteBtn);
        break;
      case 'f':
        e.preventDefault();
        if (this.favoritesSidebar.classList.contains('open')) {
          this.closeFavoritesSidebar();
        } else {
          this.toggleFavoritesSidebar();
        }
        this.animateButton(this.favoritesToggle);
        break;
    }
  }

  animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
      button.style.transform = '';
    }, 150);
  }

  createRipple(e) {
    const button = e.currentTarget;
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.classList.add('ripple');
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    button.appendChild(ripple);

    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // LocalStorage methods
  loadFavorites() {
    try {
      const saved = localStorage.getItem('daily-quote-favorites');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.warn('Could not load favorites from localStorage');
      return [];
    }
  }

  saveFavorites() {
    try {
      localStorage.setItem('daily-quote-favorites', JSON.stringify(this.favorites));
    } catch (error) {
      console.warn('Could not save favorites to localStorage');
    }
  }

  loadTheme() {
    try {
      return localStorage.getItem('daily-quote-theme') || 'dark';
    } catch (error) {
      console.warn('Could not load theme from localStorage');
      return 'light';
    }
  }

  saveTheme() {
    try {
      localStorage.setItem('daily-quote-theme', this.theme);
    } catch (error) {
      console.warn('Could not save theme to localStorage');
    }
  }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  window.quoteGenerator = new DailyQuoteGenerator();
});

// Add some extra visual effects
document.addEventListener('DOMContentLoaded', () => {
  // Animate particles on page load
  const particles = document.querySelectorAll('.particle');
  particles.forEach((particle, index) => {
    particle.style.animationDelay = `${index * -2.5}s`;
  });

  // Add smooth scrolling for better UX
  document.documentElement.style.scrollBehavior = 'smooth';

  // Enhance accessibility with focus indicators
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      document.body.classList.add('using-keyboard');
    }
  });

  document.addEventListener('mousedown', () => {
    document.body.classList.remove('using-keyboard');
  });
});

// Add CSS for keyboard navigation
const style = document.createElement('style');
style.textContent = `
  .using-keyboard *:focus {
    outline: 2px solid var(--text-accent) !important;
    outline-offset: 2px !important;
  }
  
  :not(.using-keyboard) *:focus {
    outline: none !important;
  }
`;
document.head.appendChild(style);
