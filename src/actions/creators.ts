import { GAME_STATUS } from "../constants";
import {
    FLAG_SQUARE, INIT_BOMB_SQUARES, RESTART_GAME, REVEAL_SQUARE,
    ActionTypes, AppThunk
} from "./types";

export const flagSquare = (squareId: number): ActionTypes => ({
    type: FLAG_SQUARE,
    squareId: squareId,
});

export const revealSquare = (squareId: number): ActionTypes => ({
    type: REVEAL_SQUARE,
    squareId: squareId,
});

export const restartGame = (): ActionTypes => ({
    type: RESTART_GAME,
});

export const initBombSquares = (squareId: number): ActionTypes => ({
    type: INIT_BOMB_SQUARES,
    squareId: squareId,
});

export const clickSquare = (squareId: number): AppThunk => (dispatch: any, getState: any) => {
    const state = getState();
    if (!state.areBombSquaresInitialized) {
        dispatch(initBombSquares(squareId));
    }
    if (state.gameStatus === GAME_STATUS.IN_PROGRESS) {
        dispatch(revealSquare(squareId));
    }
};

export const rightClickSquare = (squareId: number): AppThunk => (dispatch: any, getState: any) => {
    const state = getState();
    if (state.gameStatus === GAME_STATUS.IN_PROGRESS) {
      dispatch(flagSquare(squareId));
    }
};
