const cells = document.querySelectorAll('.cell');
const statusDisplay = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const aiToggleBtn = document.getElementById('aiToggleBtn');

let currentPlayer = 'X';
let board = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let againstAI = false;

// Sounds
const moveSound = new Audio('click.WAV'); 
const winSound = new Audio('clap.WAV');   

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = parseInt(clickedCell.getAttribute('data-index'));

    if (board[clickedIndex] !== '' || !gameActive) {
        return;
    }

    board[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    moveSound.play(); // Play sound on move

    checkResult();

    if (againstAI && currentPlayer === 'O' && gameActive) {
        setTimeout(aiMove, 500); // AI makes a move after 500ms
    } else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }
}

function checkResult() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            roundWon = true;
            winningCells = [a, b, c];
            break;
        }
    }

    if (roundWon) {
        statusDisplay.textContent = `Player ${currentPlayer} Wins!`;
        gameActive = false;
        winSound.play(); // Play sound on win
        winningCells.forEach(index => cells[index].classList.add('winning-cell'));
        return;
    }

    if (!board.includes('')) {
        statusDisplay.textContent = "It's a Draw!";
        gameActive = false;
        return;
    }

    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
}

function aiMove() {
    let availableCells = [];

    board.forEach((cell, index) => {
        if (cell === '') {
            availableCells.push(index);
        }
    });

    const aiChoice = availableCells[Math.floor(Math.random() * availableCells.length)];
    board[aiChoice] = 'O';
    cells[aiChoice].textContent = 'O';

    moveSound.play(); // Play sound on AI move

    checkResult();

    currentPlayer = 'X';
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('winning-cell');
    });
    statusDisplay.textContent = `Player ${currentPlayer}'s Turn`;
    
    winSound.pause(); // Stop the win sound
    winSound.currentTime = 0; // Reset the win sound to the start
}

function toggleAI() {
    againstAI = !againstAI;
    aiToggleBtn.textContent = againstAI ? "Play Against Human" : "Play Against AI";
    resetGame();
}

cells.forEach(cell => cell.addEventListener('click', handleCellClick));
resetBtn.addEventListener('click', resetGame);
aiToggleBtn.addEventListener('click', toggleAI);
