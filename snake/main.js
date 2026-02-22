const tg = window.Telegram.WebApp;
tg.ready(); 
tg.expand();

const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

const grid = 20;
canvas.width = 320; 
canvas.height = 320;

let score = 0;
let count = 0;

let snake = {
    x: 160, y: 160,
    dx: grid, dy: 0,
    cells: [],
    maxCells: 4
};

let apple = { x: 60, y: 60 };

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function loop() {
    requestAnimationFrame(loop);
    if (++count < 10) return;
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    snake.x += snake.dx;
    snake.y += snake.dy;

    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Рисуем яблоко (OrangeRed из CSS)
    ctx.fillStyle = '#ff4500';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Рисуем змейку
    ctx.fillStyle = '#00ff00';
    snake.cells.forEach(function (cell, index) {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            scoreElement.innerText = score;
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            apple.x = getRandomInt(0, 16) * grid;
            apple.y = getRandomInt(0, 16) * grid;
        }

        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
                resetGame();
            }
        }
    });
}

function resetGame() {
    snake.x = 160; snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid; snake.dy = 0;
    score = 0;
    scoreElement.innerText = score;
}

const changeDir = (x, y) => {
    if (x === -snake.dx || y === -snake.dy) return;
    snake.dx = x;
    snake.dy = y;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
};

// Управление кнопками (фиксим задержку)
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-up').onclick = () => changeDir(0, -grid);
    document.getElementById('btn-down').onclick = () => changeDir(0, grid);
    document.getElementById('btn-left').onclick = () => changeDir(-grid, 0);
    document.getElementById('btn-right').onclick = () => changeDir(grid, 0);
});

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  changeDir(-grid, 0);
    if (e.key === 'ArrowUp')    changeDir(0, -grid);
    if (e.key === 'ArrowRight') changeDir(grid, 0);
    if (e.key === 'ArrowDown')  changeDir(0, grid);
});

requestAnimationFrame(loop);