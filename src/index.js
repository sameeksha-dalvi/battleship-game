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