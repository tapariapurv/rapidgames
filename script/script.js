// Rapid Games - Enhanced with Rating System
// Deep integration with existing game structure

// Game data structure to store ratings
let gameRatings = {};

// Load ratings from localStorage on page load
function loadRatings() {
    const saved = localStorage.getItem('rapidgames-ratings');
    if (saved) {
        gameRatings = JSON.parse(saved);
    }
}

// Save ratings to localStorage
function saveRatings() {
    localStorage.setItem('rapidgames-ratings', JSON.stringify(gameRatings));
}

// Get game ID from URL
function getGameId(url) {
    // Extract game name from URL for unique identification
    const match = url.match(/game\/([^/?]+)/);
    return match ? match[1] : url;
}

// Create rating stars HTML
function createRatingHTML(gameId, currentRating = 0) {
    return `
        <div class="game-rating" data-game-id="${gameId}">
            <div class="rating-stars">
                ${[1,2,3,4,5].map(i => 
                    `<span class="star ${i <= currentRating ? 'selected' : ''}" data-value="${i}">★</span>`
                ).join('')}
            </div>
            <div class="rating-info">
                <span class="current-rating">${currentRating > 0 ? currentRating : 'Not rated'}</span>
                <span class="rating-separator"> | </span>
                <span class="total-ratings">${gameRatings[gameId] ? '1 rating' : 'Be the first to rate!'}</span>
            </div>
        </div>
    `;
}

// Initialize rating system for all games
function initializeRatings() {
    // Find all game containers
    const gameContainers = document.querySelectorAll('.game-horizontal, .game-horizontal-last, .game-horizontal-408x408');
    
    gameContainers.forEach(container => {
        const gameLink = container.querySelector('a');
        if (gameLink) {
            const gameUrl = gameLink.href;
            const gameId = getGameId(gameUrl);
            const currentRating = gameRatings[gameId] || 0;
            
            // Insert rating HTML after the image
            const ratingHTML = createRatingHTML(gameId, currentRating);
            container.insertAdjacentHTML('beforeend', ratingHTML);
        }
    });
    
    // Add event listeners to all rating stars
    addRatingListeners();
}

// Add click event listeners to rating stars
function addRatingListeners() {
    const ratingContainers = document.querySelectorAll('.game-rating');
    
    ratingContainers.forEach(container => {
        const gameId = container.getAttribute('data-game-id');
        const stars = container.querySelectorAll('.star');
        const currentRatingSpan = container.querySelector('.current-rating');
        const totalRatingsSpan = container.querySelector('.total-ratings');
        
        stars.forEach(star => {
            // Hover effect
            star.addEventListener('mouseenter', () => {
                const hoverValue = parseInt(star.getAttribute('data-value'));
                highlightStars(stars, hoverValue);
            });
            
            // Click to rate
            star.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                const ratingValue = parseInt(star.getAttribute('data-value'));
                
                // Update game rating
                gameRatings[gameId] = ratingValue;
                saveRatings();
                
                // Update UI
                selectStars(stars, ratingValue);
                currentRatingSpan.textContent = ratingValue;
                totalRatingsSpan.textContent = '1 rating';
                
                // Show confirmation
                showRatingConfirmation(container, ratingValue);
            });
        });
        
        // Reset hover effect when leaving container
        container.addEventListener('mouseleave', () => {
            const currentRating = gameRatings[gameId] || 0;
            selectStars(stars, currentRating);
        });
    });
}

// Highlight stars for hover effect
function highlightStars(stars, count) {
    stars.forEach((star, index) => {
        if (index < count) {
            star.classList.add('hover');
            star.classList.remove('selected');
        } else {
            star.classList.remove('hover', 'selected');
        }
    });
}

// Select stars for rating
function selectStars(stars, count) {
    stars.forEach((star, index) => {
        star.classList.remove('hover');
        if (index < count) {
            star.classList.add('selected');
        } else {
            star.classList.remove('selected');
        }
    });
}

// Show rating confirmation
function showRatingConfirmation(container, rating) {
    const confirmation = document.createElement('div');
    confirmation.className = 'rating-confirmation';
    confirmation.textContent = `Rated ${rating} star${rating > 1 ? 's' : ''}!`;
    
    container.appendChild(confirmation);
    
    // Remove confirmation after 2 seconds
    setTimeout(() => {
        confirmation.remove();
    }, 2000);
}

// Enhanced search functionality (integrating with existing search bar)
function enhanceSearch() {
    const searchInput = document.querySelector('.search-bar input');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterGamesBySearch(searchTerm);
        });
    }
}

// Filter games based on search term
function filterGamesBySearch(searchTerm) {
    const gameContainers = document.querySelectorAll('.game-horizontal, .game-horizontal-last, .game-horizontal-408x408');
    
    gameContainers.forEach(container => {
        const gameLink = container.querySelector('a');
        if (gameLink) {
            const gameUrl = gameLink.href.toLowerCase();
            const gameId = getGameId(gameUrl).toLowerCase();
            
            // Show/hide based on search match
            if (searchTerm === '' || gameId.includes(searchTerm) || gameUrl.includes(searchTerm)) {
                container.style.display = '';
            } else {
                container.style.display = 'none';
            }
        }
    });
}

// Get rating statistics
function getRatingStats() {
    const totalGames = Object.keys(gameRatings).length;
    const totalRatings = Object.values(gameRatings).reduce((sum, rating) => sum + rating, 0);
    const averageRating = totalGames > 0 ? (totalRatings / totalGames).toFixed(1) : 0;
    
    return { totalGames, averageRating };
}

// Add rating stats to footer
function addRatingStatsToFooter() {
    const footer = document.querySelector('.description p');
    if (footer) {
        const stats = getRatingStats();
        if (stats.totalGames > 0) {
            const statsHTML = `<br><br><strong>Game Ratings:</strong> ${stats.totalGames} games rated with an average of ${stats.averageRating} stars.`;
            footer.insertAdjacentHTML('beforeend', statsHTML);
        }
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Load saved ratings
    loadRatings();
    
    // Initialize rating system
    initializeRatings();
    
    // Enhance search functionality
    enhanceSearch();
    
    // Add stats to footer
    setTimeout(addRatingStatsToFooter, 100);
    
    console.log('Rapid Games rating system initialized!');
});