// Get DOM Elements
const bird = document.getElementById("bird");
const game = document.getElementById("game");
const scoreDisplay = document.getElementById("score");
const highScoreDisplay = document.getElementById("high-score");
const gameOverScreen = document.getElementById("game-over");
const finalScore = document.getElementById("final-score");
const bestScore = document.getElementById("best-score");
const tryAgainBtn = document.getElementById("try-again");
const difficultySelect = document.getElementById("difficulty");

// Game Variables
let birdPosition = 250;
let gravity = 0;
let isGameOver = false;
let score = 0;
let highScore = localStorage.getItem("flappyBirdHighScore") || 0;

// Sound Effects (make sure these files exist in /sounds/)
const jumpSound = new Audio('sounds/jump.mp3');
const hitSound = new Audio('sounds/hit.mp3');
const scoreSound = new Audio('sounds/score.mp3');

// Set High Score on Page Load
highScoreDisplay.textContent = "High Score: " + highScore;

// Bird Jump Controls
document.addEventListener("keydown", () => {
  if (!isGameOver) {
    gravity = -8;
    playJumpSound();
  }
});

document.addEventListener("mousedown", () => {
  if (!isGameOver) {
    gravity = -8;
    playJumpSound();
  }
});

document.addEventListener("touchstart", () => {
  if (!isGameOver) {
    gravity = -8;
    playJumpSound();
  }
});

function playJumpSound() {
  jumpSound.currentTime = 0; // Rewind to start
  jumpSound.play();
}

// Create Pipes
function createPipe() {
  let pipeGap = Math.random() * 40 + 110; // Random gap between pipes
  let pipeTopHeight = Math.random() * 150 + 50;
  let pipeBottomY = pipeTopHeight + pipeGap;

  const topPipe = document.createElement("div");
  topPipe.classList.add("pipe");
  topPipe.style.top = "0";
  topPipe.style.height = pipeTopHeight + "px";
  topPipe.style.left = "400px";

  const bottomPipe = document.createElement("div");
  bottomPipe.classList.add("pipe");
  bottomPipe.style.bottom = "0";
  bottomPipe.style.height = game.offsetHeight - pipeBottomY + "px";
  bottomPipe.style.left = "400px";

  game.appendChild(topPipe);
  game.appendChild(bottomPipe);

  return { topPipe, bottomPipe };
}

// Move Pipes
function movePipes(pipes) {
  pipes.forEach(pipe => {
    let left = parseFloat(pipe.style.left);
    left -= 2;
    pipe.style.left = left + "px";

    // Remove pipes when off screen
    if (left < -60) {
      pipe.remove();
      pipes.splice(pipes.indexOf(pipe), 1);
    }
  });
}

// Collision Detection
function checkCollision(pipe) {
  const birdRect = bird.getBoundingClientRect();
  const pipeRect = pipe.getBoundingClientRect();

  if (
    birdRect.left < pipeRect.right &&
    birdRect.right > pipeRect.left &&
    birdRect.top < pipeRect.bottom &&
    birdRect.bottom > pipeRect.top
  ) {
    hitSound.play();
    endGame();
  }
}

// Update Score
function updateScore(pipe) {
  const pipeLeft = parseFloat(pipe.style.left);
  if (pipeLeft === 298) {
    score++;
    scoreDisplay.textContent = "Score: " + score;
    scoreSound.currentTime = 0;
    scoreSound.play();

    if (score > highScore) {
      highScore = score;
      localStorage.setItem("flappyBirdHighScore", highScore);
      highScoreDisplay.textContent = "High Score: " + highScore;
    }
  }
}

// Main Animation Loop
function animate() {
  if (isGameOver) return;

  gravity += 0.5;
  birdPosition += gravity;
  bird.style.top = birdPosition + "px";

  if (pipes.length > 0) {
    pipes.forEach(pipe => {
      movePipes([pipe]);
      checkCollision(pipe);
      updateScore(pipe);
    });

    if (parseFloat(pipes[0].style.left) < -60) {
      pipes.shift();
    }
  }

  if (birdPosition > game.offsetHeight - 30 || birdPosition < 0) {
    hitSound.play();
    endGame();
  }

  requestAnimationFrame(animate);
}

// Start Game
function startGame() {
  isGameOver = false;
  birdPosition = 250;
  bird.style.top = birdPosition + "px";
  gravity = 0;
  score = 0;
  scoreDisplay.textContent = "Score: 0";
  gameOverScreen.classList.add("hidden");

  // Clear old pipes
  document.querySelectorAll(".pipe").forEach(pipe => pipe.remove());
  pipes = [];

  // Set Difficulty Speed
  const difficulty = difficultySelect.value;
  switch (difficulty) {
    case "easy":
      pipeSpeed = 1.5;
      break;
    case "medium":
      pipeSpeed = 2;
      break;
    case "hard":
      pipeSpeed = 2.5;
      break;
    case "daily":
      pipeSpeed = Math.random() * 1 + 1.5;
      break;
  }

  // Generate Pipes
  spawnInterval = setInterval(() => {
    const newPipe = createPipe();
    pipes.push(newPipe.topPipe, newPipe.bottomPipe);
  }, 2000);

  animate();
}

// End Game
function endGame() {
  isGameOver = true;
  clearInterval(spawnInterval);
  finalScore.textContent = score;
  bestScore.textContent = highScore;
  gameOverScreen.classList.remove("hidden");
}

// Try Again Button
tryAgainBtn.addEventListener("click", startGame);

// Initialize Game
let pipes = [];
let spawnInterval;
let pipeSpeed = 2;

startGame();
