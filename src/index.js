import "./style.css";
import { ship } from "../src/modules/ship";
import { gameboard } from "./modules/gameboard";
import { player } from "./modules/player";
import fireworkSrc from "./sounds/firework.mp3";
import hitSrc from "./sounds/hit.mp3";
import missSrc from "./sounds/miss.mp3";
import playerSrc from "./sounds/playerTurn.mp3";
import computerSrc from "./sounds/computerTurn.mp3";
import clickSrc from "./sounds/click.mp3";

const volumeOn = `
<path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
`;

const volumeOff = `
<path d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"/>
`;


let gamePhase = 'setup';
let soundEnabled = true;

if (gamePhase === 'setup') {
    showSetupPhase();
}


const shuffleFleetBtn = document.querySelector('#shuffle-fleet-btn');
const startBattleBtn = document.querySelector('#start-battle-btn');


startBattleBtn.addEventListener('click', () => {
    playSound(clickSound);
    gamePhase = 'battle';
    showBattlePhase();
});

shuffleFleetBtn.addEventListener('click', () => {
    playSound(clickSound);
    shuffleFleet();
})



const soundBtn = document.getElementById("sound-btn");
const soundIcon = document.getElementById("sound-icon");

soundBtn.addEventListener("click", () => {
    soundEnabled = !soundEnabled;
    playSound(clickSound);
    soundIcon.innerHTML = soundEnabled ? volumeOn : volumeOff;
});

const p1 = player("human");
const p2 = player("computer");

let currentTurn = "player";
let gameOver = false;
let winner = "";
let fireworkLoop = null;
let targetQueue = [];

const fireworkSound = new Audio(fireworkSrc);
fireworkSound.volume = 0.6; // adjust loudness

const hitSound = new Audio(hitSrc);
hitSound.volume = 0.9;

const missSound = new Audio(missSrc);
missSound.volume = 0.9;

hitSound.preload = "auto";
missSound.preload = "auto";


const playerTurnSound = new Audio(playerSrc);
playerTurnSound.volume = 0.6;

const computerTurnSound = new Audio(computerSrc);
computerTurnSound.volume = 0.6;

const clickSound = new Audio(clickSrc);
clickSound.volume = 0.4;

playerTurnSound.preload = "auto";
computerTurnSound.preload = "auto";
clickSound.preload = "auto";


// Create all ships
const p1Ship1 = ship(5);
const p1Ship2 = ship(4);
const p1Ship3 = ship(3);
const p1Ship4 = ship(3);
const p1Ship5 = ship(2);

const p2Ship1 = ship(5);
const p2Ship2 = ship(4);
const p2Ship3 = ship(3);
const p2Ship4 = ship(3);
const p2Ship5 = ship(2);

// Place ships at fixed coordinates for now (no random)
// p1.board.placeShip(p1Ship1, 0, 0, "horizontal");
// p1.board.placeShip(p1Ship2, 2, 0, "vertical");
// p1.board.placeShip(p1Ship3, 5, 5, "horizontal");
// p1.board.placeShip(p1Ship4, 7, 3, "vertical");
// p1.board.placeShip(p1Ship5, 9, 0, "horizontal");

// // Computer ships (also fixed or random later)
// p2.board.placeShip(p2Ship1, 0, 0, "vertical");
// p2.board.placeShip(p2Ship2, 0, 5, "horizontal");
// p2.board.placeShip(p2Ship3, 4, 2, "vertical");
// p2.board.placeShip(p2Ship4, 6, 6, "horizontal");
// p2.board.placeShip(p2Ship5, 9, 4, "horizontal");

// Player ships (random)
p1.board.placeRandomShip(p1Ship1);
p1.board.placeRandomShip(p1Ship2);
p1.board.placeRandomShip(p1Ship3);
p1.board.placeRandomShip(p1Ship4);
p1.board.placeRandomShip(p1Ship5);

// Computer ships (random)
p2.board.placeRandomShip(p2Ship1);
p2.board.placeRandomShip(p2Ship2);
p2.board.placeRandomShip(p2Ship3);
p2.board.placeRandomShip(p2Ship4);
p2.board.placeRandomShip(p2Ship5);

renderBoard(p1.board.getBoard(), "player1");
renderBoard(p2.board.getBoard(), "player2");

updateTurnUI();

function renderBoard(board, player) {
    //console.log("renderBoard array size :" + board.length);

    let gameBoardDiv = "";
    let gameBoardTitle = "";
    let boardSize = board.length;

    const isPlayerBoard = player === "player1";

    if (isPlayerBoard) {
        gameBoardDiv = document.querySelector('#player1-board');
        gameBoardTitle = document.querySelector('#player1-heading');
        gameBoardTitle.textContent = "Your Fleet";
    } else {
        gameBoardDiv = document.querySelector('#player2-board');
        gameBoardTitle = document.querySelector('#player2-heading');
        gameBoardTitle.textContent = "Enemy Waters";
    }


    gameBoardDiv.innerHTML = "";



    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const boxDiv = document.createElement("div");
            boxDiv.className = "box";

            const cell = board[i][j];

            if (isPlayerBoard && typeof cell === "object") {
                boxDiv.classList.add("ship");
                const left = j > 0 ? board[i][j - 1] : null;
                const right = j < boardSize - 1 ? board[i][j + 1] : null;
                const top = i > 0 ? board[i - 1][j] : null;
                const bottom = i < boardSize - 1 ? board[i + 1][j] : null;

                if (left === cell || right === cell) {
                    // horizontal ship
                    if (left !== cell) {
                        boxDiv.classList.add("start-horizontal");
                    }
                    if (right !== cell) {
                        boxDiv.classList.add("end-horizontal");
                    }
                }

                if (top === cell || bottom === cell) {
                    // vertical ship
                    if (top !== cell) {
                        boxDiv.classList.add("start-vertical");
                    }
                    if (bottom !== cell) {
                        boxDiv.classList.add("end-vertical");
                    }
                }
            }

            gameBoardDiv.appendChild(boxDiv);
        }
    }



}


const enemyGameBoard = document.querySelector('#player2-board');

enemyGameBoard.addEventListener('click', function (e) {
    if (currentTurn !== "player") return; // prevent clicking during computer turn


    if (!gameOver) {
        const clickedCell = e.target;

        if (!clickedCell.classList.contains("box")) {
            return;
        }

        const boardCells = Array.from(enemyGameBoard.children);
        const index = boardCells.indexOf(clickedCell);
        const { row: row, col: col } = getCellPosition(index);
        const attackResult = p2.board.receiveAttack(row, col);

        console.log("all ship sunk player: ", p2.board.allShipsSunk());


        if (attackResult === "already") return;

        if (attackResult === "hit") {
            clickedCell.classList.add("hit");
            applyShipShape(p2.board.getBoard(), clickedCell, row, col, p2.board.getBoard()[row][col].ship);
            playSound(hitSound);

        } else {
            clickedCell.classList.add("miss");
            playSound(missSound);

        }

        clickedCell.classList.add("attacked");


        if (!p2.board.allShipsSunk()) {
            //changeTurn();
            setTimeout(() => {
                changeTurn();
            }, 800);

        } else {
            gameOver = true;
            winner = "player";
            showWinner();
            //alert("Game Over!!!!");
        }


    } else {
        //alert("Game Over!!!!");
        return;
    }

});

function getCellPosition(index) {
    const rowPosition = Math.floor(index / 10);
    const colPosition = index % 10;

    return { row: rowPosition, col: colPosition };
}


function updateTurnUI() {
    const playerBox = document.querySelector(".player-turn");
    const computerBox = document.querySelector(".computer-turn");
    const enemyBoard = document.querySelector("#player2-board");

    if (currentTurn === "player") {
        playerBox.classList.add("active");
        computerBox.classList.remove("active");
        enemyBoard.classList.remove("disabled"); // enable clicking
        playSound(playerTurnSound);

    } else {
        computerBox.classList.add("active");
        playerBox.classList.remove("active");
        enemyBoard.classList.add("disabled"); // disable clicking
        playSound(computerTurnSound);

    }
}

function changeTurn() {
    if (currentTurn === "player") {
        currentTurn = "computer";
    } else {
        currentTurn = "player";
    }
    updateTurnUI();

    if (currentTurn === "computer") {
        setTimeout(() => {
            computerAttack();
        }, 1000);
    }
}

function getAdjacentCells(row, col) {
    const neighbors = [];

    if (row > 0) neighbors.push({ row: row - 1, col: col }); // up
    if (row < 9) neighbors.push({ row: row + 1, col: col }); // down
    if (col > 0) neighbors.push({ row: row, col: col - 1 }); // left
    if (col < 9) neighbors.push({ row: row, col: col + 1 }); // right

    return neighbors;
}


function computerAttack() {

    if (!gameOver) {
        // let row = Math.floor(Math.random() * 10);
        // let col = Math.floor(Math.random() * 10);
        let row;
        let col;

        if (targetQueue.length > 0) {
            const next = targetQueue.shift();
            row = next.row;
            col = next.col;
        } else {
            row = Math.floor(Math.random() * 10);
            col = Math.floor(Math.random() * 10);
        }
        let result = p1.board.receiveAttack(row, col);

        while (result === "already") {
            // row = Math.floor(Math.random() * 10);
            // col = Math.floor(Math.random() * 10);
            if (targetQueue.length > 0) {
                const next = targetQueue.shift();
                row = next.row;
                col = next.col;
            } else {
                row = Math.floor(Math.random() * 10);
                col = Math.floor(Math.random() * 10);
            }

            result = p1.board.receiveAttack(row, col);
        }

        const playerBoard = document.querySelector("#player1-board");
        const cellIndex = row * 10 + col;
        const cell = playerBoard.children[cellIndex];
        console.log("all ship sunk computer: ", p1.board.allShipsSunk());
        if (result === "hit") {
            cell.classList.add("hit");
            playSound(hitSound);
            const neighbors = getAdjacentCells(row, col);

            for (let i = 0; i < neighbors.length; i++) {
                targetQueue.push(neighbors[i]);
            }

        } else {
            cell.classList.add("miss");
            playSound(missSound);

        }

        if (!p1.board.allShipsSunk()) {
            setTimeout(() => {
                changeTurn();
            }, 1000);
        } else {
            gameOver = true;
            winner = "computer";
            showWinner();
            //alert("Game Over!!!!");
        }

    } else {
        //alert("Game Over!!!!");
        return;
    }
}

function showWinner() {
    const overlay = document.querySelector(".winner-overlay");
    const text = document.querySelector(".winner-text");

    text.textContent = `${winner.toUpperCase()} WINS!`;

    overlay.classList.remove("hidden");

    fireworkLoop = setInterval(launchFirework, 1000);

}

// document.getElementById("test-fw-btn").addEventListener("click", () => {
//     winner = "player";  // temporary
//     showWinner();
// });


const fireworkColors = [
    "#FF2B2B", // Real Red
    "#FFD700", // Gold
    "#00FF7F", // Emerald Green
    "#1E90FF", // Firework Blue
    "#FF1493", // Magenta Pink
    "#FFFFFF"  // White Spark
];
function launchFirework() {
    const container = document.querySelector("#fireworks-container");
    container.classList.remove('hidden');

    const startX = Math.random() * window.innerWidth;
    const endY = window.innerHeight * (0.6 + Math.random() * 0.35);

    const rocket = document.createElement("div");
    rocket.classList.add("firework-rocket");
    rocket.style.left = startX + "px";
    rocket.style.bottom = "0px";
    container.appendChild(rocket);

    let y = 0;
    const rocketInterval = setInterval(() => {
        y += 12;
        rocket.style.bottom = y + "px";

        // Spark trail
        const spark = document.createElement("div");
        spark.classList.add("spark");
        spark.style.left = startX + "px";
        spark.style.bottom = (y - 10) + "px";
        container.appendChild(spark);

        setTimeout(() => spark.remove(), 300);

        if (y >= endY) {
            clearInterval(rocketInterval);
            rocket.remove();
            explode(startX, y);
        }
    }, 20);
}

function explode(x, y) {

    if (soundEnabled) {
        fireworkSound.currentTime = 0; // restart sound from beginning
        fireworkSound.play();
    }


    const container = document.querySelector("#fireworks-container");
    const color = fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

    // Multi-stage explosion
    multiStageExplosion(x, y, color, 40);   // inner burst
    setTimeout(() => multiStageExplosion(x, y, color, 60), 150); // bigger
    setTimeout(() => multiStageExplosion(x, y, color, 80), 300); // biggest

    // Crackling effect
    for (let i = 0; i < 20; i++) {
        const crack = document.createElement("div");
        crack.classList.add("crackle");
        crack.style.left = x + "px";
        crack.style.bottom = y + "px";
        container.appendChild(crack);

        let angle = Math.random() * Math.PI * 2;
        let distance = 20 + Math.random() * 40;

        crack.animate(
            [
                { transform: "translate(0,0)", opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, opacity: 0 }
            ],
            { duration: 500, easing: "ease-out" }
        );

        setTimeout(() => crack.remove(), 550);
    }
}

function multiStageExplosion(x, y, color, size) {
    const container = document.querySelector("#fireworks-container");

    for (let i = 0; i < 50; i++) {
        const p = document.createElement("div");
        p.classList.add("firework-particle");
        p.style.background = color;
        p.style.boxShadow = `0 0 10px ${color}`;
        p.style.left = x + "px";
        p.style.bottom = y + "px";
        container.appendChild(p);

        let angle = Math.random() * Math.PI * 2;
        let distance = size + Math.random() * size;

        p.animate(
            [
                { transform: "translate(0,0)", opacity: 1 },
                { transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px)`, opacity: 0 }
            ],
            { duration: 1200, easing: "ease-out" }
        );

        setTimeout(() => p.remove(), 1300);
    }
}

const restartBtn = document.querySelector('.restart-btn');

restartBtn.addEventListener('click', function () {
    const overlay = document.querySelector(".winner-overlay");
    overlay.classList.add("hidden");
    clearFireworks();
    // Reset variables
    gamePhase = 'setup';
    currentTurn = "player";
    gameOver = false;
    winner = "";
    targetQueue = [];

    // Recreate ship objects
    const newP1Ships = [
        ship(5),
        ship(4),
        ship(3),
        ship(3),
        ship(2)
    ];
    const newP2Ships = [
        ship(5),
        ship(4),
        ship(3),
        ship(3),
        ship(2)
    ];

    // Reset boards
    p1.board = gameboard();
    p2.board = gameboard();

    // Place new ships randomly
    newP1Ships.forEach(s => p1.board.placeRandomShip(s));
    newP2Ships.forEach(s => p2.board.placeRandomShip(s));

    // Render clean boards
    renderBoard(p1.board.getBoard(), "player1");
    renderBoard(p2.board.getBoard(), "player2");

    // Show setup phase UI
    showSetupPhase();

});

function clearFireworks() {

    if (soundEnabled) {
        fireworkSound.pause();
        fireworkSound.currentTime = 0;
    }

    const fireworksContainer = document.getElementById("fireworks-container");
    clearInterval(fireworkLoop);
    fireworkLoop = null;
    fireworksContainer.classList.add("hidden");
    fireworksContainer.innerHTML = "";

}

const howToBtn = document.querySelector("#how-to-play-btn");
const howToOverlay = document.querySelector(".howto-overlay");
const closeHowToBtn = document.querySelector(".close-howto-btn");

howToBtn.addEventListener("click", () => {
    playSound(clickSound);
    howToOverlay.classList.remove("hidden");
});

closeHowToBtn.addEventListener("click", () => {
    playSound(clickSound);
    howToOverlay.classList.add("hidden");
});

howToOverlay.addEventListener("click", (e) => {
    if (e.target === howToOverlay) {
        howToOverlay.classList.add("hidden");
    }
});

function showSetupPhase() {
    document.querySelector('#player2-board').classList.add('hidden')
    document.querySelector('#player2-heading').classList.add('hidden')
    document.querySelector('#turn-indicator').classList.add('hidden')
    document.querySelector('.gameboard-container').classList.add('setup-phase')
    document.querySelector('.setup-btns').classList.remove('hidden');
    document.querySelector('#setup-header').classList.remove('hidden');
}

function showBattlePhase() {
    document.querySelector('#player2-board').classList.remove('hidden');
    document.querySelector('#player2-heading').classList.remove('hidden');
    document.querySelector('#turn-indicator').classList.remove('hidden');
    document.querySelector('.gameboard-container').classList.remove('setup-phase');
    document.querySelector('.setup-btns').classList.add('hidden');
    document.querySelector('#setup-header').classList.add('hidden');
}

function shuffleFleet() {
    p1.board = gameboard();// reset board

    p1.board.placeRandomShip(p1Ship1);
    p1.board.placeRandomShip(p1Ship2);
    p1.board.placeRandomShip(p1Ship3);
    p1.board.placeRandomShip(p1Ship4);
    p1.board.placeRandomShip(p1Ship5);
    renderBoard(p1.board.getBoard(), "player1");
}

function applyShipShape(board, boxDiv, row, col, forcedShip) {
    const cell = forcedShip || board[row][col];
    if (!cell || cell === "missed") return;

    const shipCell = cell.ship || cell;
    if (!shipCell.positions || !shipCell.orientation) {
        console.warn("Missing positions/orientation", shipCell);
        return;
    }
    const posIndex = shipCell.positions.findIndex(p => p.row === row && p.col === col);

    if (shipCell.orientation === "horizontal") {
        if (posIndex === 0) boxDiv.classList.add("start-horizontal");
        else if (posIndex === shipCell.positions.length - 1) boxDiv.classList.add("end-horizontal");
    } else if (shipCell.orientation === "vertical") {
        if (posIndex === 0) boxDiv.classList.add("start-vertical");
        else if (posIndex === shipCell.positions.length - 1) boxDiv.classList.add("end-vertical");
    }
}


function playSound(audio) {
    if (!soundEnabled) return;
    audio.currentTime = 0;
    audio.play();
}
