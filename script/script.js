document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('searchInput');
    const gameItems = document.querySelectorAll('.game-item');
    let currentCategory = 'all';

    function filterGames() {
        const searchQuery = searchInput.value.toLowerCase();

        gameItems.forEach(function(game) {
            const gameName = game.dataset.name.toLowerCase();

            if (gameName.includes(searchQuery)) {
                game.style.display = '';
            } else {
                game.style.display = 'none';
            }
        });
    }

    searchInput.addEventListener('keyup', filterGames);

});