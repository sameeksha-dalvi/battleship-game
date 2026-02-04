import { gameboard } from "../modules/gameboard";

test('places a ship horizontally on the board', () => {
    const boardObj = gameboard();
    const ship = { length: 3 };

    boardObj.placeShip(ship, 0, 0, 'horizontal');
    const board = boardObj.getBoard();

    expect(board[0][0]).toBe('X');
    expect(board[0][1]).toBe('X');
    expect(board[0][2]).toBe('X');
});

test('places a ship vertically on the board', () => {
    const boardObj = gameboard();
    const ship = { length: 4 };

    boardObj.placeShip(ship, 1, 1, 'vertical');
    const board = boardObj.getBoard();

    expect(board[1][1]).toBe('X');
    expect(board[2][1]).toBe('X');
    expect(board[3][1]).toBe('X');
    expect(board[4][1]).toBe('X');
});