const tg = window.Telegram.WebApp;
tg.expand();

const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('score');

// Настройки
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

// Game Loop
function loop() {
    requestAnimationFrame(loop);

    // Ограничение FPS (60 / 10 = 6 кадров в секунду)
    if (++count < 10) return;
    count = 0;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update: двигаем змейку
    snake.x += snake.dx;
    snake.y += snake.dy;

    // Коллизии со стенами
    if (snake.x < 0) snake.x = canvas.width - grid;
    else if (snake.x >= canvas.width) snake.x = 0;
    if (snake.y < 0) snake.y = canvas.height - grid;
    else if (snake.y >= canvas.height) snake.y = 0;

    snake.cells.unshift({ x: snake.x, y: snake.y });

    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }

    // Рисуем яблоко
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(apple.x, apple.y, grid - 1, grid - 1);

    // Рисуем змейку
    ctx.fillStyle = '#00ff00ff';
    snake.cells.forEach(function (cell, index) {
        ctx.fillRect(cell.x, cell.y, grid - 1, grid - 1);

        // Проверка: съели яблоко
        if (cell.x === apple.x && cell.y === apple.y) {
            snake.maxCells++;
            score++;
            scoreElement.innerText = score;
            if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('medium');
            apple.x = getRandomInt(0, 16) * grid;
            apple.y = getRandomInt(0, 16) * grid;
        }

        // Проверка: врезались в себя
        for (let i = index + 1; i < snake.cells.length; i++) {
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                resetGame();
            }
        }
    });
}

function resetGame() {
    if (tg.HapticFeedback) tg.HapticFeedback.notificationOccurred('error');
    snake.x = 160; snake.y = 160;
    snake.cells = [];
    snake.maxCells = 4;
    snake.dx = grid; snake.dy = 0;
    score = 0;
    scoreElement.innerText = score;
    apple.x = getRandomInt(0, 16) * grid;
    apple.y = getRandomInt(0, 16) * grid;
}

// Управление
const changeDir = (x, y) => {
    if (x !== -snake.dx) snake.dx = x;
    if (y !== -snake.dy) snake.dy = y;
    if (tg.HapticFeedback) tg.HapticFeedback.impactOccurred('light');
};

document.addEventListener('keydown', e => {
    // Используем e.key вместо e.which
    if (e.key === 'ArrowLeft')  changeDir(-grid, 0);  // Влево
    if (e.key === 'ArrowUp')    changeDir(0, -grid); // Вверх
    if (e.key === 'ArrowRight') changeDir(grid, 0);  // Вправо
    if (e.key === 'ArrowDown')  changeDir(0, grid);  // Вниз
});

// Проверка на существование кнопок перед назначением клика
if(document.getElementById('btn-up')) document.getElementById('btn-up').onclick = () => changeDir(0, -grid);
if(document.getElementById('btn-down')) document.getElementById('btn-down').onclick = () => changeDir(0, grid);
if(document.getElementById('btn-left')) document.getElementById('btn-left').onclick = () => changeDir(-grid, 0);
if(document.getElementById('btn-right')) document.getElementById('btn-right').onclick = () => changeDir(grid, 0);

// Запуск игры
requestAnimationFrame(loop);