// --- Theme Logic (Global) ---
const themeSelect = document.getElementById('theme-select');
const html = document.documentElement;

function setTheme(themeName) {
    html.setAttribute('data-theme', themeName);
    localStorage.setItem('selected-theme', themeName);
    if (themeSelect) themeSelect.value = themeName;
}

if (themeSelect) {
    themeSelect.addEventListener('change', (e) => {
        setTheme(e.target.value);
    });
}

const savedTheme = localStorage.getItem('selected-theme');
if (savedTheme) {
    setTheme(savedTheme);
}

// --- Common UI Logic ---
const navbar = document.getElementById('navbar');
// Navbar Scroll
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.style.padding = '10px 0';
        } else {
            navbar.style.padding = '20px 0';
        }
    });
}

// Reveal Animation on Scroll
function reveal() {
    var reveals = document.querySelectorAll(".reveal, .fade-in-up, .timeline-item");
    for (var i = 0; i < reveals.length; i++) {
        var windowHeight = window.innerHeight;
        var elementTop = reveals[i].getBoundingClientRect().top;
        var elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add("active");
        }
    }
}
window.addEventListener("scroll", reveal);
reveal(); // Trigger on load

// Timeline Scroll Animation
function setupTimelineAnimation() {
    const timeline = document.querySelector('.timeline');
    const line = document.querySelector('.timeline-line');
    const items = document.querySelectorAll('.timeline-item');

    if (!timeline || !line) return;

    function handleTimelineScroll() {
        const rect = timeline.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const center = windowHeight / 2;

        // Calculate progress based on how much of the timeline has passed the center of the screen
        const start = rect.top;
        const totalHeight = rect.height;

        // Start animating when the top of timeline hits the center of screen
        // End when bottom hits center
        let progress = 0;

        if (start < center) {
            const scrolled = center - start;
            progress = (scrolled / totalHeight) * 100;
        }

        // Clamp 0-100
        progress = Math.min(Math.max(progress, 0), 100);

        // Latch: Only update if progress increases (don't shrink back)
        if (progress > (timeline.maxProgress || 0)) {
            timeline.maxProgress = progress;
            line.style.height = `${progress}% `;

            // Activate items as the line passes them
            items.forEach(item => {
                const itemTop = item.offsetTop; // Relative to parent
                const currentLineHeightPx = (progress / 100) * totalHeight;

                if (currentLineHeightPx > itemTop) {
                    item.classList.add('active');
                }
            });
        }
    }

    window.addEventListener('scroll', handleTimelineScroll);
    handleTimelineScroll(); // Initial check
}
document.addEventListener('DOMContentLoaded', setupTimelineAnimation);


// --- Helper: Path correction for images ---
// If we are in /games/, we need to go up one level to find images
const isGamePage = window.location.pathname.includes('/games/');
const assetsPath = isGamePage ? '../images/' : 'images/';


// --- FEATURE: Tic Tac Toe ---
const tttBoard = document.getElementById('ttt-board');
if (tttBoard) {
    const cells = Array.from(document.querySelectorAll('.ttt-cell'));
    const statusText = document.getElementById('ttt-status');
    const resetBtn = document.getElementById('ttt-reset');
    const diffSelect = document.getElementById('difficulty-select');

    // Stats
    const playedEl = document.getElementById('stat-played');
    const wonEl = document.getElementById('stat-won');
    const lostEl = document.getElementById('stat-lost');
    const wrEl = document.getElementById('stat-wr');

    let board = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    let difficulty = 'easy';

    let played = parseInt(localStorage.getItem('ttt-played')) || 0;
    let won = parseInt(localStorage.getItem('ttt-won')) || 0;
    let lost = parseInt(localStorage.getItem('ttt-lost')) || 0;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    function updateStats(result) {
        played++;
        if (result === 'win') won++;
        if (result === 'loss') lost++;

        localStorage.setItem('ttt-played', played);
        localStorage.setItem('ttt-won', won);
        localStorage.setItem('ttt-lost', lost);
        updateUI();
    }

    function updateUI() {
        if (!playedEl) return;
        playedEl.textContent = played;
        wonEl.textContent = won;
        lostEl.textContent = lost;
        const wr = played === 0 ? 0 : ((won / played) * 100).toFixed(1);
        wrEl.textContent = wr + '%';
    }

    updateUI();

    function handleCellClick(e) {
        const index = e.target.getAttribute('data-index');
        if (board[index] !== '' || !gameActive || currentPlayer === 'O') return;

        makeMove(index, 'X');
        if (gameActive) {
            currentPlayer = 'O';
            statusText.textContent = "AI is thinking...";
            setTimeout(aiMove, 500);
        }
    }

    function makeMove(index, player) {
        board[index] = player;
        cells[index].textContent = player;
        cells[index].classList.add(player.toLowerCase());
        checkResult();
    }

    function checkResult() {
        let roundWon = false;
        for (let i = 0; i < 8; i++) {
            const [a, b, c] = winningConditions[i];
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            if (currentPlayer === 'X') {
                statusText.textContent = "You Win!";
                updateStats('win');
            } else {
                statusText.textContent = "AI Wins!";
                updateStats('loss');
            }
            gameActive = false;
            return;
        }

        if (!board.includes('')) {
            statusText.textContent = "It's a Draw!";
            updateStats('draw');
            gameActive = false;
            return;
        }
    }

    function aiMove() {
        if (!gameActive) return;
        difficulty = diffSelect ? diffSelect.value : 'easy';
        let index;

        if (difficulty === 'easy') index = getRandomMove();
        else if (difficulty === 'medium') index = getBestMove(2);
        else index = getBestMove(Infinity); // Hard/Extreme

        makeMove(index, 'O');
        if (gameActive) {
            currentPlayer = 'X';
            statusText.textContent = "Your Turn";
        }
    }

    function getRandomMove() {
        const available = board.map((v, i) => v === '' ? i : null).filter(v => v !== null);
        return available[Math.floor(Math.random() * available.length)];
    }

    function getBestMove(depthLimit) {
        let bestScore = -Infinity;
        let move;
        for (let i = 0; i < 9; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, 0, false, depthLimit);
                board[i] = '';
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
        return move;
    }

    const scores = { X: -10, O: 10, tie: 0 };
    function minimax(currentBoard, depth, isMaximizing, limit) {
        let result = checkWinner(currentBoard);
        if (result !== null) return scores[result];
        if (depth >= limit) return 0;

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (currentBoard[i] === '') {
                    currentBoard[i] = 'O';
                    let score = minimax(currentBoard, depth + 1, false, limit);
                    currentBoard[i] = '';
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (currentBoard[i] === '') {
                    currentBoard[i] = 'X';
                    let score = minimax(currentBoard, depth + 1, true, limit);
                    currentBoard[i] = '';
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    }

    function checkWinner(b) {
        for (let i = 0; i < 8; i++) {
            const [a, x, c] = winningConditions[i];
            if (b[a] && b[a] === b[x] && b[a] === b[c]) return b[a];
        }
        if (!b.includes('')) return 'tie';
        return null;
    }

    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    if (resetBtn) resetBtn.addEventListener('click', () => {
        board = ['', '', '', '', '', '', '', '', ''];
        gameActive = true;
        currentPlayer = 'X';
        statusText.textContent = "Your Turn";
        cells.forEach(c => {
            c.textContent = '';
            c.classList.remove('x', 'o');
        });
    });
}

// --- FEATURE: BMI Calculator ---
const heightInput = document.getElementById('height');
const weightInput = document.getElementById('weight');
if (heightInput && weightInput) {
    const bmiDisplay = document.getElementById('bmi-display');
    const bmiCategory = document.getElementById('bmi-category');

    function calculateBMI() {
        const h = parseInt(heightInput.value);
        const w = parseInt(weightInput.value);

        document.getElementById('height-val').textContent = h;
        document.getElementById('weight-val').textContent = w;

        const bmi = (w / ((h / 100) * (h / 100))).toFixed(1);
        if (bmiDisplay) bmiDisplay.textContent = bmi;

        if (bmiCategory) {
            let category = 'normal';
            if (bmi < 18.5) {
                category = 'underweight';
                bmiCategory.textContent = "Underweight";
                bmiCategory.className = "bmi-category category-underweight";
            } else if (bmi < 25) {
                category = 'normal';
                bmiCategory.textContent = "Normal Weight";
                bmiCategory.className = "bmi-category category-normal";
            } else if (bmi < 30) {
                category = 'overweight';
                bmiCategory.textContent = "Overweight";
                bmiCategory.className = "bmi-category category-overweight";
            } else {
                category = 'obese';
                bmiCategory.textContent = "Obese";
                bmiCategory.className = "bmi-category category-obese";
            }

            const img = document.getElementById('bmi-image');
            if (img) img.src = `${assetsPath}bmi_${category}.png`;
        }
    }

    heightInput.addEventListener('input', calculateBMI);
    weightInput.addEventListener('input', calculateBMI);
}

// --- FEATURE: Sudoku ---
const sudokuBoard = document.getElementById('sudoku-board');
if (sudokuBoard) {
    const easyBoard = [
        "530070000", "600195000", "098000060",
        "800060003", "400803001", "700020006",
        "060000280", "000419005", "000080079"
    ]; // Simple hardcoded start

    function createSudokuGrid() {
        sudokuBoard.innerHTML = '';
        const boardStr = easyBoard.join('');
        for (let i = 0; i < 81; i++) {
            const val = boardStr[i];
            const div = document.createElement('div');
            div.className = 'sudoku-cell';
            if (val !== '0') {
                div.textContent = val;
                div.classList.add('fixed');
            } else {
                const input = document.createElement('input');
                input.type = 'number';
                input.min = 1;
                input.max = 9;
                div.appendChild(input);
            }
            sudokuBoard.appendChild(div);
        }
    }

    document.getElementById('sudoku-new')?.addEventListener('click', createSudokuGrid);
    document.getElementById('sudoku-check')?.addEventListener('click', () => {
        const msg = document.getElementById('sudoku-message');
        if (msg) msg.textContent = "Checking mechanism coming soon! (Prototype)";
    });

    createSudokuGrid();
}

// --- FEATURE: Wordle ---
const wordleBoard = document.getElementById('wordle-board');
if (wordleBoard) {
    const WORDS = ["APPLE", "BEACH", "BRAIN", "BREAD", "BRUSH", "CHAIR", "CHEST", "CHORD", "CLICK", "CLOCK"];
    let secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    let currentAttempt = 0;
    let currentTile = 0;
    const maxAttempts = 6;
    const guesses = Array(6).fill(null).map(() => Array(5).fill(''));

    function drawBoard() {
        wordleBoard.innerHTML = '';
        for (let i = 0; i < maxAttempts; i++) {
            for (let j = 0; j < 5; j++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-cell';
                tile.id = `row - ${i} -tile - ${j} `;
                wordleBoard.appendChild(tile);
            }
        }
        createKeyboard();
    }

    function createKeyboard() {
        const kb = document.getElementById('keyboard');
        if (!kb) return;
        kb.innerHTML = '';
        const rows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];

        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'key-row';
            if (row === "ZXCVBNM") {
                const enter = document.createElement('button');
                enter.className = 'key wide';
                enter.textContent = 'ENTER';
                enter.onclick = submitGuess;
                rowDiv.appendChild(enter);
            }

            row.split('').forEach(char => {
                const key = document.createElement('div');
                key.className = 'key';
                key.textContent = char;
                key.onclick = () => handleInput(char);
                rowDiv.appendChild(key);
            });

            if (row === "ZXCVBNM") {
                const back = document.createElement('button');
                back.className = 'key wide';
                back.textContent = '⌫';
                back.onclick = handleDelete;
                rowDiv.appendChild(back);
            }
            kb.appendChild(rowDiv);
        });
    }

    function handleInput(char) {
        if (currentTile < 5 && currentAttempt < maxAttempts) {
            guesses[currentAttempt][currentTile] = char;
            const tile = document.getElementById(`row - ${currentAttempt} -tile - ${currentTile} `);
            tile.textContent = char;
            currentTile++;
        }
    }

    function handleDelete() {
        if (currentTile > 0) {
            currentTile--;
            guesses[currentAttempt][currentTile] = '';
            document.getElementById(`row - ${currentAttempt} -tile - ${currentTile} `).textContent = '';
        }
    }

    function submitGuess() {
        if (currentTile !== 5) return;
        const guess = guesses[currentAttempt].join('');
        // Simple check (in real app, validate isWord)

        for (let i = 0; i < 5; i++) {
            const letter = guess[i];
            const tile = document.getElementById(`row - ${currentAttempt} -tile - ${i} `);

            if (letter === secretWord[i]) {
                tile.classList.add('correct');
            } else if (secretWord.includes(letter)) {
                tile.classList.add('present');
            } else {
                tile.classList.add('absent');
            }
        }

        if (guess === secretWord) {
            document.getElementById('wordle-message').textContent = "Excellent! You guessed it!";
            currentAttempt = maxAttempts; // End game
        } else {
            currentAttempt++;
            currentTile = 0;
            if (currentAttempt >= maxAttempts) {
                document.getElementById('wordle-message').textContent = `Game Over! Word was ${secretWord} `;
            }
        }
    }

    document.getElementById('wordle-reset')?.addEventListener('click', () => {
        secretWord = WORDS[Math.floor(Math.random() * WORDS.length)];
        currentAttempt = 0;
        currentTile = 0;
        for (let i = 0; i < 6; i++) for (let j = 0; j < 5; j++) guesses[i][j] = '';
        drawBoard();
        document.getElementById('wordle-message').textContent = '';
    });

    drawBoard();
}

// --- FEATURE: Guess the Word (Enhanced) ---
const wordDisplay = document.getElementById('word-display');
if (wordDisplay) {
    // 1. Data & State
    const WORD_CATEGORIES = {
        food: ["PIZZA", "BURGER", "SUSHI", "PASTA", "STEAK", "SALAD", "TACO", "RAMEN", "CURRY", "WAFFLE", "PANCAKE", "DONUT", "COOKIES", "CHOCOLATE", "ICE CREAM", "SANDWICH", "RISOTTO", "DIM SUM", "CROISSANT", "BAGEL"],
        beverage: ["COFFEE", "TEA", "JUICE", "SODA", "WATER", "MILK", "WINE", "BEER", "WHISKEY", "SMOOTHIE", "LEMONADE", "COCKTAIL", "MATCHA", "ESPRESSO", "CAPPUCCINO", "LATTE", "MOCHA", "TEQUILA"],
        movie: ["AVATAR", "TITANIC", "JOKER", "FROZEN", "MATRIX", "GLADIATOR", "INCEPTION", "INTERSTELLAR", "GODFATHER", "ROCKY", "TERMINATOR", "ALIEN", "JAWS", "SHREK", "UP", "CARS", "DUNE", "BARBIE", "OPPENHEIMER", "PARASITE"],
        anime: ["NARUTO", "ONEPIECE", "BLEACH", "DRAGONBALL", "POKEMON", "GUNDAM", "AKIRA", "EVANGELION", "BERSERK", "GINTEAMA", "HAIKYUU", "DEMONSLAYER", "JUJUTSU", "CHAINSAW", "SPYFAMILY", "BLUE LOCK", "DEATHNOTE", "AOT", "HUNTER", "JOGIO"],
        other: ["ALGORITHM", "DATABASE", "FIREWALL", "NETWORK", "COMPILER", "INTERFACE", "VARIABLE", "FUNCTION", "PROMISE", "ASYNC", "GALAXY", "NEBULA", "QUANTUM", "PHYSICS", "GRAVITY", "ECLIPSE", "ROBOT", "DROID", "CYBORG", "MATRIX"] // "AI" generated mix
    };

    let currentCategory = "";
    let currentSecret = "";
    let guessedLetters = [];
    let lives = 6;
    let gameActive = false;

    // 2. Stats
    let stats = { played: 0, wins: 0, losses: 0 };

    function loadStats() {
        const stored = localStorage.getItem('guessWordStats');
        if (stored) {
            stats = JSON.parse(stored);
        }
        updateStatsUI();
    }

    function saveStats() {
        localStorage.setItem('guessWordStats', JSON.stringify(stats));
        updateStatsUI();
    }

    function updateStatsUI() {
        // Safe check for elements since this runs on other pages potentially? 
        // Logic guard at top prevents this, but element IDs must match HTML.
        const elPlayed = document.getElementById('stat-played');
        const elWins = document.getElementById('stat-wins');
        const elLosses = document.getElementById('stat-losses');
        if (elPlayed) elPlayed.textContent = stats.played;
        if (elWins) elWins.textContent = stats.wins;
        if (elLosses) elLosses.textContent = stats.losses;
    }

    // 3. UI Control
    const categoryScreen = document.getElementById('category-selection');
    const gameArea = document.getElementById('game-area');
    const categoryBtns = document.querySelectorAll('.category-btn');
    const currentCatDisplay = document.getElementById('current-category');
    const resetBtn = document.getElementById('guess-reset'); // Change Category
    const nextBtn = document.getElementById('guess-next'); // Next Word

    function showCategories() {
        categoryScreen.style.display = 'block';
        gameArea.style.display = 'none';
        resetBtn.textContent = 'Change Category';
        nextBtn.style.display = 'none';
        document.getElementById('guess-message').textContent = "";
    }

    function startGame(category) {
        currentCategory = category;
        currentCatDisplay.textContent = category.toUpperCase();

        categoryScreen.style.display = 'none';
        gameArea.style.display = 'block';

        loadNewWord();
    }

    function loadNewWord() {
        const words = WORD_CATEGORIES[currentCategory];
        currentSecret = words[Math.floor(Math.random() * words.length)];
        guessedLetters = [];
        lives = 6;
        gameActive = true;

        updateGameDisplay();
        generateKeyboard();

        document.getElementById('guess-message').textContent = "";
        nextBtn.style.display = 'none'; // Hide next button during gameplay
        resetBtn.style.display = 'inline-block'; // Allow changing category
    }

    // 4. Game Logic
    function updateGameDisplay() {
        document.getElementById('lives').textContent = lives;

        const display = currentSecret.split('').map(char => guessedLetters.includes(char) ? char : '_').join(' ');
        wordDisplay.textContent = display;

        if (!display.includes('_') && gameActive) {
            endGame(true);
        } else if (lives <= 0 && gameActive) {
            endGame(false);
        }
    }

    function endGame(win) {
        gameActive = false;
        disableAllKeys();

        stats.played++;
        if (win) {
            stats.wins++;
            document.getElementById('guess-message').textContent = "You Won! 🎉";
            document.getElementById('guess-message').style.color = "var(--color-green)";
        } else {
            stats.losses++;
            document.getElementById('guess-message').textContent = `Game Over! Word was ${currentSecret}`;
            document.getElementById('guess-message').style.color = "var(--color-red)";
        }
        saveStats();

        // Show "Next Word" button
        nextBtn.style.display = 'inline-block';
        resetBtn.textContent = 'Change Category';
    }

    function generateKeyboard() {
        const area = document.getElementById('keyboard-area');
        area.innerHTML = '';
        const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        alphabet.split('').forEach(char => {
            const btn = document.createElement('button');
            btn.textContent = char;
            btn.className = 'letter-btn';
            btn.onclick = () => handleGuess(char, btn);
            area.appendChild(btn);
        });
    }

    function handleGuess(char, btn) {
        if (!gameActive) return;

        btn.disabled = true;
        guessedLetters.push(char);

        if (currentSecret.includes(char)) {
            btn.classList.add('correct');
        } else {
            btn.classList.add('wrong');
            lives--;
        }
        updateGameDisplay();
    }

    function disableAllKeys() {
        const btns = document.querySelectorAll('.letter-btn');
        btns.forEach(b => b.disabled = true);
    }

    // 5. Init
    categoryBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cat = btn.dataset.category;
            startGame(cat);
        });
    });

    if (resetBtn) resetBtn.addEventListener('click', showCategories);
    if (nextBtn) nextBtn.addEventListener('click', loadNewWord);

    loadStats();
    showCategories(); // Init state
}
