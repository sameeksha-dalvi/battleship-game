import { ship } from "../modules/ship";

function gameboard() {

    const rows = 10;
    const cols = 10;
    const board = [];
    const ships = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = '';
        }
    }

    const getBoard = () => board;

    const placeShip = (ship, x, y, direction) => {
        ships.push(ship);
        if (direction == 'horizontal') {
            for (let i = 0; i < ship.length; i++) {
                board[x][y + i] = ship;
            }
        }

        if (direction == 'vertical') {
            for (let i = 0; i < ship.length; i++) {
                board[x + i][y] = ship;
            }
        }

    };

    const receiveAttack = (x, y) => {

        if (board[x][y] === "attacked" || board[x][y] === "missed") {
            return "already";
        }

        //ship present so mark attack
        if (board[x][y]) {
            board[x][y].hit();
            board[x][y] = "attacked";
            return "hit";
        } else { //ship not present so mark missed
            board[x][y] = "missed";
            return "miss";
        }



    };

    const allShipsSunk = () => {
        for (let i = 0; i < ships.length; i++) {
            if (!ships[i].isSunk()) {
                return false;
            }
        }

        return true;
    };

    const canPlace = (ship, x, y, direction) => {
    const len = ship.length;

    if (direction === "horizontal") {
        if (y + len > cols) return false; // out of bounds
        for (let i = 0; i < len; i++) {
            if (board[x][y + i] !== "") return false; // overlap
        }
    }

    if (direction === "vertical") {
        if (x + len > rows) return false; // out of bounds
        for (let i = 0; i < len; i++) {
            if (board[x + i][y] !== "") return false; // overlap
        }
    }

    return true;
};


const placeRandomShip = (ship) => {
    let placed = false;

    while (!placed) {
        const x = Math.floor(Math.random() * rows);
        const y = Math.floor(Math.random() * cols);
        const direction = Math.random() < 0.5 ? "horizontal" : "vertical";

        if (canPlace(ship, x, y, direction)) {
            placeShip(ship, x, y, direction);
            placed = true;
        }
    }
};

    return { getBoard, placeShip, receiveAttack, allShipsSunk, canPlace, placeRandomShip };
}

export { gameboard };