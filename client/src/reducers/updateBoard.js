import { FLAG_SQUARE, REVEAL_SQUARE, RESTART_GAME } from "../actions/actionTypes";
import { numCols, numRows, NUM_BOMBS, BOARD_SIZE } from "../constants";
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../squareStatus";
import * as _ from "underscore";

const INITIAL_STATE = {
    bombSquares: new Set(),
    squares: Object.assign({}, Array(BOARD_SIZE).fill({
        status: HIDDEN,
        count: null,
    })),
    isFirstMove: true,
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
    const row = Math.floor(squareId / numCols);
    const col = squareId - numCols * row;
    const surroundingSquares = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newCol >= 0 && newRow < numRows && newCol < numCols) {
                const newId = newRow * numCols + newCol;
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

    while (stack.length > 0) {
        const nextId = stack.pop();
        if (bombSquares.has(nextId)) {
            continue;
        }
        const count = countSurroundingBombs(bombSquares, nextId);
        squares[nextId] = {count: count, status: CLEARED};
        if (count > 0) {
            continue;
        }
        const surrounding = getSurroundingSquares(nextId);
        for (let i = 0; i < surrounding.length; i++) {
            const successorId = surrounding[i];
            if (!seen.has(successorId)) {
                stack.push(successorId);
                seen.add(successorId);
            }
        }
    }
    return squares;
};

const updateBoard = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REVEAL_SQUARE: {
            const squareId = action.squareId;
            // Do nothing if the square is not hidden, or if the game
            // is already over.
            const squareStatus = state.squares[squareId].status;
            if (squareStatus !== HIDDEN || state.isOver) {
                return state;
            }
            // End the game if the bomb was clicked.
            if (state.bombSquares.has(squareId)) {
                const squares = {...state.squares};
                squares[squareId] = {
                    ...squares[squareId],
                    status: BOMB,
                };
                return {...state, squares, isOver: true};
            }
            // Initialize the bomb squares, if this is the first
            // move. It's useful to do this here, so that the player
            // doesn't accidentally click the bomb at the start.
            let bombSquares = state.bombSquares;
            if (state.isFirstMove) {
                bombSquares = initializeBombSquares();
                bombSquares.delete(squareId);
            }
            // Update the board statuses and counts.
            let squares = {...state.squares};
            const count = countSurroundingBombs(bombSquares, squareId);
            squares[squareId] = {
                count: count,
                status: CLEARED,
            };
            if (count === 0) {
                squares = clearEmptySquares(squares, bombSquares, squareId);
            }
            return {
                ...state,
                bombSquares: bombSquares,
                squares: squares,
                isFirstMove: false,
            }
        }

        case FLAG_SQUARE: {
            if (state.isOver) {
                return state;
            }
            const square = state.squares[action.squareId];
            if (square.status === HIDDEN) {
                const newSquares = {...state.squares};
                newSquares[action.squareId] = {
                    ...newSquares[action.squareId],
                    status: FLAGGED,
                };
                return {...state, squares: newSquares};
            }
            if (square.status === FLAGGED) {
                const newSquares = {...state.squares};
                newSquares[action.squareId] = {
                    ...newSquares[action.squareId],
                    status: HIDDEN,
                };
                return {...state, squares: newSquares};
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

export default updateBoard;
