
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
                board[x][y + i] = "X";
            }
        }

        if (direction == 'vertical') {
            for (let i = 0; i < ship.length; i++) {
                board[x + i][y] = "X";
            }
        }

    };


    return { getBoard, placeShip };
}

export {gameboard} ;