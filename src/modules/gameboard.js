import { ship } from "../modules/ship";

function gameboard() {

    const rows = 10;
    const cols = 10;
    const board = [];

    for (let i = 0; i < rows; i++) {
        board[i] = [];
        for (let j = 0; j < cols; j++) {
            board[i][j] = '';
        }
    }

    const getBoard = () => board;

    const placeShip = (ship, x, y, direction) => {
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
        //ship present to mark attack
        if (board[x][y]) {
            board[x][y].hit();
            board[x][y] = "attacked";
        } else { //ship not present so mark missed
            board[x][y] = "missed";
        }

        

    };


    return { getBoard, placeShip, receiveAttack };
}

export { gameboard };