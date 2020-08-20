export const FLAG_SQUARE = "FLAG_SQUARE";
export const REVEAL_SQUARE = "REVEAL_SQUARE";
export const INIT_BOMB_SQUARES = "INIT_BOMB_SQUARES";
export const RESTART_GAME = "RESTART_GAME";

interface FlagSquareAction {
    type: typeof FLAG_SQUARE,
    squareId: number,
}

interface RevealSquareAction {
    type: typeof REVEAL_SQUARE,
    squareId: number,
}

interface InitBombSquaresAction {
    type: typeof INIT_BOMB_SQUARES,
    squareId: number,
}

interface RestartGameAction {
    type: typeof RESTART_GAME,
}

export type ActionTypes = (
    FlagSquareAction | RevealSquareAction
    | InitBombSquaresAction | RestartGameAction
);
