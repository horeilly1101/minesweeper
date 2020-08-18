import { FLAG_SQUARE, REVEAL_SQUARE } from "./actionTypes";

export const flagSquare = (row, col) => ({
    type: FLAG_SQUARE,
    squareRow: row,
    squareCol: col,
});

export const revealSquare = (row, col) => ({
    type: REVEAL_SQUARE,
    squareRow: row,
    squareCol: col,
});
