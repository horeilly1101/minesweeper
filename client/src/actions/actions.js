import {
    FLAG_SQUARE, REVEAL_SQUARE, RESTART_GAME , INIT_BOMB_SQUARES
} from "./actionTypes";

export const flagSquare = squareId => ({
    type: FLAG_SQUARE,
    squareId: squareId,
});

const revealSquare = squareId => ({
    type: REVEAL_SQUARE,
    squareId: squareId,
});

export const restartGame = () => ({
    type: RESTART_GAME,
});

const initBombSquares = squareId => ({
    type: INIT_BOMB_SQUARES,
    squareId: squareId,
});

export const clickSquare = squareId => (dispatch, getState) =>  {
    const state = getState();
    if (state.isFirstMove) {
        dispatch(initBombSquares());
    }
    dispatch(revealSquare(squareId));
};
