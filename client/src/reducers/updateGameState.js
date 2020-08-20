import * as _ from "underscore";
import { produce } from "immer";
import { SQUARE_STATUS, GAME_STATUS } from "../constants";
import {
    FLAG_SQUARE, INIT_BOMB_SQUARES, RESTART_GAME, REVEAL_SQUARE
} from "../actions/types";

const DEFAULT_NUM_ROWS = 20;
const DEFAULT_NUM_COLS = 30;
const DEFAULT_BOARD_SIZE = DEFAULT_NUM_ROWS * DEFAULT_NUM_COLS;
const DEFAULT_NUM_BOMBS = 80;
const INITIAL_STATE = {
    bombSquares: [],
    areBombSquaresInitialized: false,
    squares: Object.assign({}, Array(DEFAULT_BOARD_SIZE).fill({
        status: SQUARE_STATUS.HIDDEN,
        count: null,
    })),
    numBombsFlagged: 0,
    numSquaresCleared: 0,
    gameStatus: GAME_STATUS.IN_PROGRESS,
    numBombs: DEFAULT_NUM_BOMBS,
    numRows: DEFAULT_NUM_ROWS,
    numCols: DEFAULT_NUM_COLS,
};

const generateBombSquares = (state, excludedId) => {
    // Randomly select the bomb squares.
    const boardSize = state.numRows * state.numCols;
    const bombSquares = Array.from(Array(boardSize).keys());
    bombSquares.splice(excludedId, 1);
    return _.sample(bombSquares, state.numBombs);
};

const isGameWon = (state) => {
    const boardSize = state.numRows * state.numCols;
    return state.numBombsFlagged + state.numSquaresCleared === boardSize;
};

const getSurroundingSquares = (state, squareId) => {
    // This is easiest to compute if we transform the squareId to
    // a row value and a column value.
    const row = Math.floor(squareId / state.numCols);
    const col = squareId - state.numCols * row;
    const surroundingSquares = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newCol >= 0 && newRow < state.numRows && newCol < state.numCols) {
                const newId = newRow * state.numCols + newCol;
                surroundingSquares.push(newId);
            }
        }
    }
    return surroundingSquares;
};

const countSurroundingBombs = (state, squareId) => {
    let count = 0;
    const surroundingSquares = getSurroundingSquares(state, squareId);
    for (let i = 0; i < surroundingSquares.length; i++) {
        const neighborId = surroundingSquares[i];
        if (state.bombSquares.includes(neighborId)) {
            count++;
        }
    }
    return count;
};

const clearEmptySquares = (draft, squareId) => {
    // Run a depth first search to clear out the nearby squares that
    // don't have any surrounding bombs.
    const seen = new Set();
    const stack = [];
    stack.push(squareId);
    seen.add(squareId);

    while (stack.length > 0) {
        const nextId = stack.pop();
        if (draft.bombSquares.includes(nextId)) {
            continue;
        }
        const count = countSurroundingBombs(draft, nextId);
        draft.squares[nextId] = {count: count, status: SQUARE_STATUS.CLEARED};
        draft.numSquaresCleared++;
        if (count > 0) {
            continue;
        }
        const surrounding = getSurroundingSquares(draft, nextId);
        for (let i = 0; i < surrounding.length; i++) {
            const successorId = surrounding[i];
            const successorStatus = draft.squares[successorId].status;
            if (!seen.has(successorId) && successorStatus === SQUARE_STATUS.HIDDEN) {
                stack.push(successorId);
                seen.add(successorId);
            }
        }
    }
};

const updateGameState = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch (action.type) {
        case INIT_BOMB_SQUARES: {
            draft.bombSquares = generateBombSquares(draft, action.squareId);
            draft.areBombSquaresInitialized = true;
            break;
        }

        case REVEAL_SQUARE: {
            const squareId = action.squareId;
            // Do nothing if the square is not hidden.
            if (draft.squares[squareId].status !== SQUARE_STATUS.HIDDEN) {
                break;
            }
            // End the game if the bomb was clicked.
            if (draft.bombSquares.includes(squareId)) {
                draft.squares[squareId] = {status: SQUARE_STATUS.BOMB};
                draft.gameStatus = GAME_STATUS.LOST;
                break;
            }
            // Reveal the selected square, and keep track of how many squares
            // are cleared.
            const count = countSurroundingBombs(draft, squareId);
            if (count > 0) {
                draft.squares[squareId] = {count, status: SQUARE_STATUS.CLEARED};
                draft.numSquaresCleared++;
            } else {
                // If there are no surrounding bombs, then clear all surrounding
                // empty squares, including the current square. This updates the
                // draft.
                clearEmptySquares(draft, squareId);
            }
            draft.gameStatus = (isGameWon(draft)) ? GAME_STATUS.WON : GAME_STATUS.IN_PROGRESS;
            break;
        }

        case FLAG_SQUARE: {
            const square = draft.squares[action.squareId];
            if (square.status === SQUARE_STATUS.HIDDEN) {
                draft.squares[action.squareId] = {status: SQUARE_STATUS.FLAGGED};
                if (draft.bombSquares.includes(action.squareId)) {
                    draft.numBombsFlagged++;
                }
                draft.gameStatus = (isGameWon(draft)) ? GAME_STATUS.WON : GAME_STATUS.IN_PROGRESS;
                break;
            }
            if (square.status === SQUARE_STATUS.FLAGGED) {
                draft.squares[action.squareId] = {status: SQUARE_STATUS.HIDDEN};
                if (draft.bombSquares.includes(action.squareId)) {
                    draft.numBombsFlagged--;
                }
                break;
            }
            break;
        }

        case RESTART_GAME: {
            return INITIAL_STATE;
        }

        default: {
            return state;
        }
    }
});

export default updateGameState;
