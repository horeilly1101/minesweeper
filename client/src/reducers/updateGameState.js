import { 
    NUM_COLS, NUM_ROWS, NUM_BOMBS, BOARD_SIZE, SQUARE_STATUS,
    GAME_STATUS
} from "../constants";
import * as _ from "underscore";
import {
    FLAG_SQUARE, INIT_BOMB_SQUARES, RESTART_GAME, REVEAL_SQUARE
} from "../actions";
import { produce } from "immer";

const INITIAL_STATE = {
    bombSquares: [],
    areBombSquaresInitialized: false,
    squares: Object.assign({}, Array(BOARD_SIZE).fill({
        status: SQUARE_STATUS.HIDDEN,
        count: null,
    })),
    numBombsFlagged: 0,
    numSquaresCleared: 0,
    gameStatus: GAME_STATUS.IN_PROGRESS,
};

const initializeBombSquares = () => {
    // Randomly select the bomb squares.
    let bombSquares = Array.from(Array(BOARD_SIZE).keys());
    return _.sample(bombSquares, NUM_BOMBS);
};

const getSurroundingSquares = squareId => {
    // This is easiest to compute if we transform the squareId to
    // a row value and a column value.
    const row = Math.floor(squareId / NUM_COLS);
    const col = squareId - NUM_COLS * row;
    const surroundingSquares = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newCol >= 0 && newRow < NUM_ROWS && newCol < NUM_COLS) {
                const newId = newRow * NUM_COLS + newCol;
                surroundingSquares.push(newId);
            }
        }
    }
    return surroundingSquares;
};

const countSurroundingBombs = (bombSquares, squareId) => {
    let count = 0;
    const surroundingSquares = getSurroundingSquares(squareId);
    for (let i = 0; i < surroundingSquares.length; i++) {
        const neighborId = surroundingSquares[i];
        if (bombSquares.includes(neighborId)) {
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
        const count = countSurroundingBombs(draft.bombSquares, nextId);
        draft.squares[nextId] = {count: count, status: SQUARE_STATUS.CLEARED};
        draft.numSquaresCleared++;
        if (count > 0) {
            continue;
        }
        const surrounding = getSurroundingSquares(nextId);
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

const isGameWon = (draft) => (
    draft.numBombsFlagged + draft.numSquaresCleared === BOARD_SIZE
);

const updateGameState = (state = INITIAL_STATE, action) => produce(state, draft => {
    switch (action.type) {
        case INIT_BOMB_SQUARES: {
            draft.bombSquares = initializeBombSquares();
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
            const count = countSurroundingBombs(draft.bombSquares, squareId);
            if (count > 0) {
                draft.squares[squareId] = {count, status: SQUARE_STATUS.CLEARED};
                draft.numSquaresCleared++;
            } else {
                // If there are no surrounding bombs, then clear all surrounding
                // empty squares, including the current square.
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
