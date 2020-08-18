import { FLAG_SQUARE, REVEAL_SQUARE, RESTART_GAME } from "./actionTypes";

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

export const restartGame = () => ({
    type: RESTART_GAME,
});
