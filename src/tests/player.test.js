import { player } from "../modules/player";

test("player has its own gameboard", () => {
    const p1 = player("human");
    const p2 = player("computer");

    expect(p1.board).toBeDefined();
    expect(p2.board).toBeDefined();
    expect(p1.board).not.toBe(p2.board);
});

test("player type is stored correctly", () => {
    const p = player("computer");
    expect(p.type).toBe("computer");
});