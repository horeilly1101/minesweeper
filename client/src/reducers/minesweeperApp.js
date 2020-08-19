import { 
    NUM_COLS, NUM_ROWS, NUM_BOMBS, BOARD_SIZE, SQUARE_STATUS
} from "../constants";
import * as _ from "underscore";
import {
    FLAG_SQUARE, INIT_BOMB_SQUARES, RESTART_GAME, REVEAL_SQUARE
} from "../actions";

const INITIAL_STATE = {
    bombSquares: new Set(),
    areBombSquaresInitialized: false,
    squares: Object.assign({}, Array(BOARD_SIZE).fill({
        status: SQUARE_STATUS.HIDDEN,
        count: null,
    })),
    numBombsFlagged: 0,
    numSquaresCleared: 0,
    isOver: false,
};

const initializeBombSquares = () => {
    // Randomly select the bomb squares.
    let bombSquares = Array.from(Array(BOARD_SIZE).keys());
    return new Set(_.sample(bombSquares, NUM_BOMBS));
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
        if (bombSquares.has(neighborId)) {
            count++;
        }
    }
    return count;
};

const clearEmptySquares = (squares, bombSquares, squareId) => {
    // Run a depth first search to clear out the nearby
    // squares that don't have any surrounding bombs.
    const seen = new Set();
    const stack = [];
    stack.push(squareId);
    seen.add(squareId);
    let numCleared = 0;

    while (stack.length > 0) {
        const nextId = stack.pop();
        if (bombSquares.has(nextId)) {
            continue;
        }
        const count = countSurroundingBombs(bombSquares, nextId);
        squares[nextId] = {count: count, status: SQUARE_STATUS.CLEARED};
        numCleared++;
        if (count > 0) {
            continue;
        }
        const surrounding = getSurroundingSquares(nextId);
        for (let i = 0; i < surrounding.length; i++) {
            const successorId = surrounding[i];
            if (!seen.has(successorId) && squares[successorId].status === SQUARE_STATUS.HIDDEN) {
                stack.push(successorId);
                seen.add(successorId);
            }
        }
    }
    return {numSquaresCleared: numCleared, squares};
};

const isGameOver = (numBombsFlagged, numSquaresCleared) => (
    numBombsFlagged + numSquaresCleared === BOARD_SIZE
);

const minesweeperApp = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case INIT_BOMB_SQUARES: {
            const bombSquares = initializeBombSquares();
            bombSquares.delete(action.squareId);
            return {...state, bombSquares, areBombSquaresInitialized: true};
        }

        case REVEAL_SQUARE: {
            const squareId = action.squareId;
            // Do nothing if the square is not hidden.
            const squareStatus = state.squares[squareId].status;
            if (squareStatus !== SQUARE_STATUS.HIDDEN) {
                return state;
            }
            // End the game if the bomb was clicked.
            if (state.bombSquares.has(squareId)) {
                const squares = {...state.squares};
                squares[squareId] = {
                    ...squares[squareId],
                    status: SQUARE_STATUS.BOMB,
                };
                return {...state, squares, isOver: true};
            }
            // Reveal the selected square, and keep track of how many squares
            // are cleared.
            let squares = {...state.squares};
            let numSquaresCleared = state.numSquaresCleared;
            const count = countSurroundingBombs(state.bombSquares, squareId);
            if (count > 0) {
                squares[squareId] = {count, status: SQUARE_STATUS.CLEARED};
                numSquaresCleared++;
            } else {
                // If there are no surrounding bombs, then clear all surrounding
                // empty squares, including the current square.
                let {
                    numSquaresCleared: justCleared,
                    squares: newSquares
                } = clearEmptySquares(squares, state.bombSquares, squareId);
                squares = newSquares;
                numSquaresCleared += justCleared;
            }
            return {
                ...state,
                squares,
                numSquaresCleared,
                isOver: isGameOver(state.numBombsFlagged, numSquaresCleared),
            };
        }

        case FLAG_SQUARE: {
            const square = state.squares[action.squareId];
            if (square.status === SQUARE_STATUS.HIDDEN) {
                const squares = {...state.squares};
                squares[action.squareId] = {status: SQUARE_STATUS.FLAGGED};
                // Keep track of the number of bombs flagged.
                let numBombsFlagged = state.numBombsFlagged;
                if (state.bombSquares.has(action.squareId)) {
                    numBombsFlagged++;
                }
                return {
                    ...state,
                    squares,
                    numBombsFlagged,
                    isOver: isGameOver(numBombsFlagged, state.numSquaresCleared),
                };
            }
            if (square.status === SQUARE_STATUS.FLAGGED) {
                const squares = {...state.squares};
                squares[action.squareId] = {status: SQUARE_STATUS.HIDDEN};
                let numBombsFlagged = state.numBombsFlagged;
                // Keep track of the number of bombs flagged.
                if (state.bombSquares.has(action.squareId)) {
                    numBombsFlagged--;
                }
                return {...state, squares, numBombsFlagged};
            }
            return state;
        }

        case RESTART_GAME: {
            return INITIAL_STATE;
        }

        default: {
            return state;
        }
    }
};

export default minesweeperApp;
