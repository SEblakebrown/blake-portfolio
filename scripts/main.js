// ✅ Theme toggle
document.getElementById('themeToggle').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
  document.body.classList.toggle('dark-mode');
  createSkillsChart();  // Rebuild chart on theme toggle
});

// ✅ Radar Skills Chart (theme aware)
let skillsChart;
function createSkillsChart() {
  const ctx = document.getElementById('skillsChart').getContext('2d');
  const isDark = document.body.classList.contains('dark-mode');
  if (skillsChart) skillsChart.destroy();

  skillsChart = new Chart(ctx, {
    type: 'radar',
    data: {
      labels: ['C++', 'Java', 'Python', 'Object-Oriented Design', 'Data Engineering', 'Algorithms'],
      datasets: [{
        label: 'Skill Level (1-10)',
        data: [8, 7, 7, 8, 8, 7],
        backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)',
        borderColor: isDark ? '#ffffff' : '#000000',
        pointBackgroundColor: isDark ? '#ffffff' : '#000000',
        pointBorderColor: isDark ? '#ffffff' : '#000000'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          suggestedMin: 0,
          suggestedMax: 10,
          beginAtZero: true,
          ticks: {
            stepSize: 1,
            color: isDark ? '#fff' : '#000',
            backdropColor: 'transparent'
          },
          grid: {
            color: isDark ? '#fff' : '#000'
          },
          angleLines: {
            color: isDark ? '#fff' : '#000'
          },
          pointLabels: {
            color: isDark ? '#fff' : '#000',
            font: { size: 12 }
          }
        }
      },
      plugins: {
        legend: {
          labels: { color: isDark ? '#fff' : '#000' }
        }
      }
    }
  });
}
createSkillsChart();

// ✅ Lightbox Gallery Logic
const galleryImgs = document.querySelectorAll('.gallery-img');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxClose = document.getElementById('lightbox-close');

galleryImgs.forEach(img => {
  img.addEventListener('click', () => {
    lightboxImg.src = img.src;
    lightbox.classList.add('show');
  });
});
lightboxClose?.addEventListener('click', () => lightbox.classList.remove('show'));
lightbox?.addEventListener('click', (e) => {
  if (e.target === lightbox) lightbox.classList.remove('show');
});

// ✅ GitHub Repo Fetch
fetch('https://api.github.com/users/SEblakebrown/repos')
  .then(response => response.json())
  .then(data => {
    const repoList = document.getElementById('repo-list');
    if (repoList) {
      data.slice(0, 5).forEach(repo => {
        const li = document.createElement('li');
        li.innerHTML = `<a href="${repo.html_url}" target="_blank">${repo.name}</a>`;
        repoList.appendChild(li);
      });
    }
  })
  .catch(error => console.error('GitHub API error:', error));

// ✅ Snake Game Variables
let snakeInterval;
let snake;
let food;
let direction;
let nextDirection;
let canvas, ctx, rows, cols, scale;

// ✅ Start Snake Game
function startSnakeGame() {
  canvas = document.getElementById('snake-canvas');
  ctx = canvas.getContext('2d');
  scale = 20;
  rows = canvas.height / scale;
  cols = canvas.width / scale;
  snake = [{ x: 5, y: 5 }];
  direction = { x: 1, y: 0 };
  nextDirection = { x: 1, y: 0 };
  food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };

  window.removeEventListener('keydown', snakeKeyHandler);
  window.addEventListener('keydown', snakeKeyHandler);

  clearInterval(snakeInterval);
  snakeInterval = setInterval(gameLoop, 200);  // ✅ Adjust speed here
}

// ✅ Snake Controls
function snakeKeyHandler(e) {
  switch (e.key) {
    case 'ArrowUp': if (direction.y !== 1) nextDirection = { x: 0, y: -1 }; break;
    case 'ArrowDown': if (direction.y !== -1) nextDirection = { x: 0, y: 1 }; break;
    case 'ArrowLeft': if (direction.x !== 1) nextDirection = { x: -1, y: 0 }; break;
    case 'ArrowRight': if (direction.x !== -1) nextDirection = { x: 1, y: 0 }; break;
  }
}

// ✅ Snake Game Loop
function gameLoop() {
  direction = nextDirection;
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
  snake.unshift(head);

  // ✅ Eat food
  if (head.x === food.x && head.y === food.y) {
    food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
  } else {
    snake.pop();
  }

  // ✅ Collision detection
  if (head.x < 0 || head.y < 0 || head.x >= cols || head.y >= rows || snake.slice(1).some(p => p.x === head.x && p.y === head.y)) {
    alert('Game Over! 🐍');
    clearInterval(snakeInterval);
    return;
  }

  // ✅ Draw game
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#0f0';
  snake.forEach(part => ctx.fillRect(part.x * scale, part.y * scale, scale, scale));
  ctx.fillStyle = '#f00';
  ctx.fillRect(food.x * scale, food.y * scale, scale, scale);
}

// ✅ Game Switcher for Dropdown
document.getElementById('game-select')?.addEventListener('change', (e) => {
  const choice = e.target.value;
  document.querySelectorAll('.game-section').forEach(sec => sec.style.display = 'none');

  if (choice === 'snake') {
    document.getElementById('snake-section').style.display = 'block';
    startSnakeGame();
  }
  if (choice === 'memory') {
    document.getElementById('memory-section').style.display = 'block';
    // ✅ Call your memory game start function here if needed
  }
  if (choice === 'life') {
    document.getElementById('life-section').style.display = 'block';
    // ✅ Call your Game of Life init here if needed
  }
});


// ✅ Game of Life Implementation
let lifeInterval;
let lifeRunning = false;
const lifeCanvas = document.getElementById('life-canvas');
const lifeCtx = lifeCanvas.getContext('2d');
const cellSize = 10;
const rowsLife = lifeCanvas.height / cellSize;
const colsLife = lifeCanvas.width / cellSize;
let lifeGrid = createEmptyGrid();

function createEmptyGrid() {
  return Array.from({ length: rowsLife }, () => Array(colsLife).fill(0));
}

function drawLifeGrid() {
  lifeCtx.clearRect(0, 0, lifeCanvas.width, lifeCanvas.height);
  for (let y = 0; y < rowsLife; y++) {
    for (let x = 0; x < colsLife; x++) {
      lifeCtx.fillStyle = lifeGrid[y][x] ? '#0f0' : '#222';
      lifeCtx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
    }
  }
}

function getNextLifeGrid() {
  const next = createEmptyGrid();
  for (let y = 0; y < rowsLife; y++) {
    for (let x = 0; x < colsLife; x++) {
      let neighbors = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue;
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && ny < rowsLife && nx >= 0 && nx < colsLife) {
            neighbors += lifeGrid[ny][nx];
          }
        }
      }
      if (lifeGrid[y][x] === 1 && (neighbors === 2 || neighbors === 3)) next[y][x] = 1;
      if (lifeGrid[y][x] === 0 && neighbors === 3) next[y][x] = 1;
    }
  }
  return next;
}

function updateLife() {
  lifeGrid = getNextLifeGrid();
  drawLifeGrid();
}

// ✅ Canvas Click to toggle cells
lifeCanvas.addEventListener('click', (e) => {
  const rect = lifeCanvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);
  lifeGrid[y][x] = lifeGrid[y][x] ? 0 : 1;
  drawLifeGrid();
});

// ✅ Start/Pause Button
document.getElementById('start-life').addEventListener('click', () => {
  if (lifeRunning) {
    clearInterval(lifeInterval);
    lifeRunning = false;
  } else {
    lifeInterval = setInterval(updateLife, 200);
    lifeRunning = true;
  }
});

// ✅ Clear Grid Button
document.getElementById('clear-life').addEventListener('click', () => {
  clearInterval(lifeInterval);
  lifeGrid = createEmptyGrid();
  drawLifeGrid();
  lifeRunning = false;
});

// ✅ When Life Section Opens → Reset Grid
document.getElementById('game-select').addEventListener('change', (e) => {
  if (e.target.value === 'life') {
    drawLifeGrid();
  }
});

// ✅ Drag-to-paint for Game of Life
let isMouseDown = false;

lifeCanvas.addEventListener('mousedown', (e) => {
  isMouseDown = true;
  handleLifePaint(e);
});

lifeCanvas.addEventListener('mousemove', (e) => {
  if (isMouseDown) {
    handleLifePaint(e);
  }
});

window.addEventListener('mouseup', () => {
  isMouseDown = false;
});

function handleLifePaint(e) {
  const rect = lifeCanvas.getBoundingClientRect();
  const x = Math.floor((e.clientX - rect.left) / cellSize);
  const y = Math.floor((e.clientY - rect.top) / cellSize);

  if (x >= 0 && x < colsLife && y >= 0 && y < rowsLife) {
    lifeGrid[y][x] = 1;  // ✅ Paint cell as alive while dragging
    drawLifeGrid();
  }
}
