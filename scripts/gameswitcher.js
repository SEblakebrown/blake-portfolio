document.addEventListener('DOMContentLoaded', () => {
  const gameSelect = document.getElementById('game-select');
  const memorySection = document.getElementById('memory-section');
  const snakeSection = document.getElementById('snake-section');
  const lifeSection = document.getElementById('life-section');

  function hideAllGames() {
    memorySection.style.display = 'none';
    snakeSection.style.display = 'none';
    lifeSection.style.display = 'none';
  }

  gameSelect.addEventListener('change', () => {
    hideAllGames();

    const choice = gameSelect.value;

    if (choice === 'memory') {
      memorySection.style.display = 'block';
      if (typeof initMemoryGame === 'function') initMemoryGame();
    }

    if (choice === 'snake') {
      snakeSection.style.display = 'block';
      if (typeof startSnakeGame === 'function') startSnakeGame();
    }

    if (choice === 'life') {
      lifeSection.style.display = 'block';
      // ✅ When you add the Life game logic, call it here
    }
  });
});
