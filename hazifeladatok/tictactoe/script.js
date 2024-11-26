let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let isGameOver = false;
let gameMode = null;

const boardElement = document.getElementById('board');
const messageElement = document.getElementById('message');
const resetButton = document.getElementById('resetBtn');
const twoPlayersButton = document.getElementById('twoPlayers');
const singlePlayerButton = document.getElementById('singlePlayer');
const gameContainer = document.getElementById('gameContainer');

document.addEventListener("DOMContentLoaded", function() {
    twoPlayersButton.addEventListener('click', () => {
        gameMode = 'two';
        startGame();
    });

    singlePlayerButton.addEventListener('click', () => {
        gameMode = 'single';
        startGame();
    });

    resetButton.addEventListener('click', startGame);

    gameContainer.style.display = 'none';
});

function startGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    isGameOver = false;
    currentPlayer = 'X';
    messageElement.textContent = '';
    resetButton.style.display = 'none';
    gameContainer.style.display = 'block';
    renderBoard();
}

function renderBoard() {
    boardElement.innerHTML = '';

    for (let i = 0; i < gameBoard.length; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.textContent = gameBoard[i];
        cell.addEventListener('click', () => handleCellClick(i));
        boardElement.appendChild(cell);
    }
}

function handleCellClick(index) {
    if (gameBoard[index] !== '' || isGameOver) return;

    gameBoard[index] = currentPlayer;
    renderBoard();

    if (checkWinner(currentPlayer)) {
        messageElement.textContent = `${currentPlayer} játékos nyert!`;
        isGameOver = true;
        resetButton.style.display = 'block';
        return;
    }

    if (gameBoard.every(cell => cell !== '')) {
        messageElement.textContent = 'A játék döntetlen.';
        isGameOver = true;
        resetButton.style.display = 'block';
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

    if (gameMode === 'single' && currentPlayer === 'O' && !isGameOver) {
        setTimeout(() => computerMove(), 500);
    }
}

function checkWinner(player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern =>
        pattern.every(index => gameBoard[index] === player)
    );
}

function computerMove() {
    if (isGameOver || gameMode === 'two') return;

    const availableMoves = gameBoard.map((value, index) => value === '' ? index : null).filter(value => value !== null);
    const randomMove = availableMoves[Math.floor(Math.random() * availableMoves.length)];

    gameBoard[randomMove] = 'O';
    renderBoard();

    if (checkWinner('O')) {
        messageElement.textContent = 'A számítógép nyert!';
        isGameOver = true;
        resetButton.style.display = 'block';
        return;
    }

    currentPlayer = 'X';
}
