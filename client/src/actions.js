import { GAME_STATUS } from "./constants";

export const FLAG_SQUARE = "FLAG_SQUARE";
export const REVEAL_SQUARE = "REVEAL_SQUARE";
export const INIT_BOMB_SQUARES = "INIT_BOMB_SQUARES";
export const RESTART_GAME = "RESTART_GAME";

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

export const initBombSquares = squareId => ({
    type: INIT_BOMB_SQUARES,
    squareId: squareId,
});

export const clickSquare = squareId => (dispatch, getState) =>  {
    const state = getState();
    if (!state.areBombSquaresInitialized) {
        dispatch(initBombSquares(squareId));
    }
    if (state.gameStatus === GAME_STATUS.IN_PROGRESS) {
        dispatch(revealSquare(squareId));
    }
};

export const rightClickSquare = squareId => (dispatch, getState) => {
  const state = getState();
  if (state.gameStatus === GAME_STATUS.IN_PROGRESS) {
      dispatch(flagSquare(squareId));
  }
};
