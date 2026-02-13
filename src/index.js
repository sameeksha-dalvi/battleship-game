import "./style.css";
import { ship } from "../src/modules/ship";
import { gameboard } from "./modules/gameboard";
import { player } from "./modules/player";

const p1 = player("human");
const p2 = player("computer");

const ship1 = ship(3);
const ship2 = ship(4);

p1.board.placeShip(ship1, 0, 0, "horizontal");
p2.board.placeShip(ship2, 5, 5, "vertical");

console.log(p1.board.getBoard());
console.log(p2.board.getBoard());

renderBoard(p1.board.getBoard(), "player1");
renderBoard(p2.board.getBoard(), "player2");

function renderBoard(board, player) {
    console.log("renderBoard array size :" + board.length);

    let gameBoardDiv = "";
    let gameBoardHeadingDiv = "";
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