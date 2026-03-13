
function ship(length) {

    let hits = 0;
    let positions = []; // array of { row, col }
    let orientation = null; // "horizontal" or "vertical"

    const hit = () => {
        hits++;
    };

    const isSunk = () => {
        return hits >= length;
    };

    // allow setting positions when ship is placed
    const setPositions = (posArray, dir) => {
        positions = posArray;
        orientation = dir;
    };

    return { length, hit, isSunk, positions, orientation, setPositions }

}

export { ship };