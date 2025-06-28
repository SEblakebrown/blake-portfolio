const gameBoard = document.querySelector('.game-board');
const statusText = document.getElementById('game-status');
const cardsArray = ['🍎','🍎','🍌','🍌','🍇','🍇','🍒','🍒'];
let flippedCards = [];
let matchedCards = [];

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createBoard() {
  gameBoard.innerHTML = '';
  shuffle(cardsArray).forEach((emoji, index) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.index = index;
    card.dataset.emoji = emoji;
    card.innerHTML = '?';
    card.addEventListener('click', flipCard);
    gameBoard.appendChild(card);
  });
}

function flipCard() {
  if (this.classList.contains('flipped') || flippedCards.length >= 2) return;
  this.textContent = this.dataset.emoji;
  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    checkForMatch();
  }
}

function checkForMatch() {
  const [card1, card2] = flippedCards;
  if (card1.dataset.emoji === card2.dataset.emoji) {
    card1.classList.add('matched');
    card2.classList.add('matched');
    matchedCards.push(card1, card2);
    statusText.textContent = '✔️ Match!';
    if (matchedCards.length === cardsArray.length) {
      statusText.textContent = '🎉 You won! Refresh to play again!';
    }
  } else {
    statusText.textContent = '❌ No match!';
    setTimeout(() => {
      card1.textContent = '?';
      card2.textContent = '?';
      card1.classList.remove('flipped');
      card2.classList.remove('flipped');
    }, 1000);
  }
  flippedCards = [];
}

createBoard();
