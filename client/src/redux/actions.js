import { FLAG_SQUARE, REVEAL_SQUARE } from "./actionTypes";

export const flagSquare = squareId => ({
    type: FLAG_SQUARE,
    squareId: squareId,
});

export const revealSquare = squareId => ({
    type: REVEAL_SQUARE,
    squareId: squareId,
});
