import { CLICK_SQUARE, CLICK_HISTORY } from "./actionTypes";

export const clickSquare = squareId => ({
    type: CLICK_SQUARE,
    squareId: squareId,
});

export const clickHistory = stepNumber => ({
    type: CLICK_HISTORY,
    stepNumber: stepNumber,
});
