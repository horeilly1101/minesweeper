import { FLAG_SQUARE, REVEAL_SQUARE, RESTART_GAME } from "./actionTypes";

export const flagSquare = squareId => ({
    type: FLAG_SQUARE,
    squareId: squareId,
});

export const revealSquare = squareId => ({
    type: REVEAL_SQUARE,
    squareId: squareId,
});

export const restartGame = () => ({
    type: RESTART_GAME,
});
