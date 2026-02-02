import { ship } from "../modules/ship";

test('ship length check', () => {
    const myShip = ship(4);
    expect(myShip.length).toBe(4);
});

test('ship sunk', () => {
    const myShip = ship(3);
    myShip.hit();
    myShip.hit();
    myShip.hit();
    expect(myShip.isSunk()).toBe(true);
});

test('ship unsunk', ()=>{
     const myShip = ship(3);
    myShip.hit();
    expect(myShip.isSunk()).toBe(false);
});