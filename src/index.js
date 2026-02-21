import "./style.css";
import { ship } from "../src/modules/ship";
import { gameboard } from "./modules/gameboard";
import { player } from "./modules/player";

const p1 = player("human");
const p2 = player("computer");

let currentTurn = "player";
let gameOver = false;
let winner = "";

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
p1.board.placeShip(p1Ship1, 0, 0, "horizontal");
p1.board.placeShip(p1Ship2, 2, 0, "vertical");
p1.board.placeShip(p1Ship3, 5, 5, "horizontal");
p1.board.placeShip(p1Ship4, 7, 3, "vertical");
p1.board.placeShip(p1Ship5, 9, 0, "horizontal");

// Computer ships (also fixed or random later)
p2.board.placeShip(p2Ship1, 0, 0, "vertical");
p2.board.placeShip(p2Ship2, 0, 5, "horizontal");
p2.board.placeShip(p2Ship3, 4, 2, "vertical");
p2.board.placeShip(p2Ship4, 6, 6, "horizontal");
p2.board.placeShip(p2Ship5, 9, 4, "horizontal");

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
        } else {
            clickedCell.classList.add("miss");
        }

        clickedCell.classList.add("attacked");

        if (!p2.board.allShipsSunk()) {
            changeTurn();

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

    if (!gameOver) {
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
        console.log("all ship sunk computer: ", p1.board.allShipsSunk());
        if (result === "hit") {
            cell.classList.add("hit");
        } else {
            cell.classList.add("miss");
        }

        if (!p1.board.allShipsSunk()) {
            setTimeout(() => {
                changeTurn();
            }, 600);
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

function showWinner(){
    const gameStatus = document.querySelector('.game-status');
    gameStatus.textContent = "Game Over!! Winner is " + winner.toUpperCase() + "!!!";
    gameStatus.classList.remove('hidden');

}