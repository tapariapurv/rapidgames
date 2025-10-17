document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const gameItems = document.querySelectorAll('.game-item');

    searchInput.addEventListener('keyup', function(event) {
        const searchQuery = event.target.value.toLowerCase();

        gameItems.forEach(function(game) {
            const gameName = game.dataset.name.toLowerCase();
            if (gameName.includes(searchQuery)) {
                game.style.display = '';
            } else {
                game.style.display = 'none';
            }
        });
    });
});