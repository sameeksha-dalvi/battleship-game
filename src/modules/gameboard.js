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

    return { getBoard, placeShip, receiveAttack, allShipsSunk };
}

export { gameboard };