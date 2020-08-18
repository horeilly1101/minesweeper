import { FLAG_SQUARE, REVEAL_SQUARE, RESTART_GAME } from "../actions/actionTypes";
import { numCols, numRows } from "../constants";
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../squareStatus";

const NUM_BOMBS = 45;
const BOARD_SIZE = numRows * numCols;
const INITIAL_STATE = {
    bombSquares: new Set(),
    squares: Object.assign({}, Array(BOARD_SIZE).fill({
        status: HIDDEN,
        count: null,
    })),
    isFirstMove: true,
    isOver: false,
};

// Source: https://stackoverflow.com/questions/2450954
const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
};

const initializeBombSquares = () => {
    // Randomly select the bomb squares.
    let bombSquares = Array(BOARD_SIZE)
        .fill(null)
        .map((val, i) => i);
    shuffleArray(bombSquares);
    const set = new Set();
    bombSquares.slice(0, NUM_BOMBS).forEach(value => set.add(value));
    return set;
};

const locToId = (row, col) => row * numCols + col;

const idToLoc = id => {
    const row = Math.floor(id / numCols);
    const col = id - numCols * row;
    return [row, col];
};

const copyBoard = squares => ({...squares});

const getSurroundingSquares = squareId => {
    // This is easiest to compute if we transform the squareIds to
    // a row and a column value.
    const [row, col] = idToLoc(squareId);
    const surroundingSquares = [];
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newCol >= 0 && newRow < numRows && newCol < numCols) {
                surroundingSquares.push(locToId(newRow, newCol));
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
                const squares = copyBoard(state.squares);
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
            const squares = copyBoard(state.squares);
            squares[squareId] = {
                ...squares[squareId],
                status: CLEARED,
            };
            if (!squares[squareId].count) {
                const count = countSurroundingBombs(bombSquares, squareId);
                console.log(count);
                squares[squareId] = {
                    ...squares[squareId],
                    count: count,
                };
                if (count === 0) {
                    clearEmptySquares(squares, bombSquares, squareId);
                }
            }
            return {
                ...state,
                "bombSquares": bombSquares,
                "squares": squares,
                "isFirstMove": false,
            }
        }

        case FLAG_SQUARE: {
            const square = state.squares[action.squareId];
            if (square.status === HIDDEN) {
                const newSquares = copyBoard(state.squares);
                newSquares[action.squareId] = {
                    ...newSquares[action.squareId],
                    status: FLAGGED,
                };
                return {...state, squares: newSquares};
            }
            if (square.status === FLAGGED) {
                const newSquares = copyBoard(state.squares);
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
