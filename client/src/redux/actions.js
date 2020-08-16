import { CLICK_SQUARE, CLICK_HISTORY } from "./actionTypes";

const clickSquare = squareId => ({
    type: CLICK_SQUARE,
    squareId: squareId,
});

const clickHistory = stepNumber => ({
    type: CLICK_HISTORY,
    stepNumber: stepNumber,
});
