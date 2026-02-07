import { gameboard } from "../modules/gameboard";
import { ship } from "../modules/ship";

test('places a ship horizontally on the board', () => {
    const boardObj = gameboard();
    const myShip = ship(3);

    boardObj.placeShip(myShip, 0, 0, 'horizontal');
    const board = boardObj.getBoard();

    expect(board[0][0]).toBe(myShip);
    expect(board[0][1]).toBe(myShip);
    expect(board[0][2]).toBe(myShip);
});

test('places a ship vertically on the board', () => {
    const boardObj = gameboard();
    const myShip = ship(4);

    boardObj.placeShip(myShip, 1, 1, 'vertical');
    const board = boardObj.getBoard();

    expect(board[1][1]).toBe(myShip);
    expect(board[2][1]).toBe(myShip);
    expect(board[3][1]).toBe(myShip);
    expect(board[4][1]).toBe(myShip);
});

test('attacked a ship', () => {
    const boardObj = gameboard();
    const myShip = ship(3);
    boardObj.placeShip(myShip, 1, 1, 'horizontal');
    boardObj.receiveAttack(1, 1);
    const board = boardObj.getBoard();
    expect(board[1][1]).toBe('attacked');

});


test('missed a ship', () => {
    const boardObj = gameboard();
    const myShip = ship(3);
    boardObj.placeShip(myShip, 1, 1, 'horizontal');
    boardObj.receiveAttack(0, 1);
    const board = boardObj.getBoard();
    expect(board[0][1]).toBe('missed');

});


test('all ships are sunk', () => {

    const boardObj = gameboard();
    const myShip = ship(1);
    boardObj.placeShip(myShip, 1, 1, 'horizontal');
    boardObj.receiveAttack(1, 1);
    expect(boardObj.allShipsSunk()).toBe(true);

});