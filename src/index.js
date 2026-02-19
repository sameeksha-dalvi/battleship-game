import "./style.css";
import { ship } from "../src/modules/ship";
import { gameboard } from "./modules/gameboard";
import { player } from "./modules/player";

const p1 = player("human");
const p2 = player("computer");

const ship1 = ship(3);
const ship2 = ship(4);

let currentTurn = "player";

p1.board.placeShip(ship1, 0, 0, "horizontal");
p2.board.placeShip(ship2, 5, 5, "vertical");

console.log(p1.board.getBoard());
console.log(p2.board.getBoard());

renderBoard(p1.board.getBoard(), "player1");
renderBoard(p2.board.getBoard(), "player2");

updateTurnUI();

function renderBoard(board, player) {
    //console.log("renderBoard array size :" + board.length);

    let gameBoardDiv = "";
    let gameBoardTitle = "";
    let boardSize = board.length;
    if (player == "player1") {
        gameBoardDiv = document.querySelector('#player1-board');
        gameBoardTitle = document.querySelector('#player1-heading');
        gameBoardTitle.textContent = "Your Fleet";
    }

    if (player == "player2") {
        gameBoardDiv = document.querySelector('#player2-board');
        gameBoardTitle = document.querySelector('#player2-heading');
        gameBoardTitle.textContent = "Enemy Waters";
    }
    gameBoardDiv.innerHTML = "";



    for (let i = 0; i < boardSize; i++) {
        for (let j = 0; j < boardSize; j++) {
            const boxDiv = document.createElement("div");
            boxDiv.className = "box";

            if (board[i][j]) {
                boxDiv.classList.add("ship");
            }

            gameBoardDiv.appendChild(boxDiv);
        }
    }



}


const enemyGameBoard = document.querySelector('#player2-board');

enemyGameBoard.addEventListener('click', function (e) {
    if (currentTurn !== "player") return; // prevent clicking during computer turn


    const clickedCell = e.target;

    if (!clickedCell.classList.contains("box")) {
        return;
    }

    const boardCells = Array.from(enemyGameBoard.children);
    const index = boardCells.indexOf(clickedCell);
    const { row: row, col: col } = getCellPosition(index);
    const attackResult = p2.board.receiveAttack(row, col);
    console.log("rattackResult : ", attackResult);

    if (attackResult === "hit") {
        clickedCell.classList.add("hit");
    } else {
        clickedCell.classList.add("miss");
    }

    clickedCell.classList.add("attacked");

    changeTurn();

});

function getCellPosition(index) {
    const rowPosition = Math.floor(index / 10);
    const colPosition = index % 10;

    return { row: rowPosition, col: colPosition };
}


function updateTurnUI() {
    const playerBox = document.querySelector(".player-turn");
    const computerBox = document.querySelector(".computer-turn");

    if (currentTurn === "player") {
        playerBox.classList.add("active");
        computerBox.classList.remove("active");
    } else {
        computerBox.classList.add("active");
        playerBox.classList.remove("active");
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
        }, 600); 
    }
}

function computerAttack() {

    let row = Math.floor(Math.random() * 10);
    let col = Math.floor(Math.random() * 10);
    let result = p1.board.receiveAttack(row, col);

    while (result === "already") {
        row = Math.floor(Math.random() * 10);
        col = Math.floor(Math.random() * 10);
        result = p1.board.receiveAttack(row, col);
    }

    const playerBoard = document.querySelector("#player1-board");
    const cellIndex = row * 10 + col;
    const cell = playerBoard.children[cellIndex];

    if (result === "hit") {
        cell.classList.add("hit");
    } else {
        cell.classList.add("miss");
    }

    setTimeout(() => {
        changeTurn();
    }, 600);
}
