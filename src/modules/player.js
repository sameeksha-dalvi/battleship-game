import { gameboard } from "./gameboard";

function player(type) {
    const board = gameboard();  // each player gets its own board

    return {
        type,
        board,
    };
}

export { player };