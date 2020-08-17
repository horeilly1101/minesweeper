import { FLAG_SQUARE, REVEAL_SQUARE } from "../actionTypes";
import { numCols, numRows } from "../../constants";
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../../squareStatus";

const NUM_BOMBS = numRows + numCols;
const BOARD_SIZE = numRows * numCols;
const INITIAL_STATE = {
    bombSquares: new Set(),
    statuses: Array(numRows).fill(Array(numCols).fill(HIDDEN)),
    counts: Array(numRows).fill(Array(numCols).fill(null)),
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
    const row = id % numCols;
    const col = id - numCols * Math.floor(id / numCols);
    return [row, col];
};

const copyBoard = rows => [...rows].map(row => [...row]);

const countSurroundingBombs = (bombSquares, row, col) => {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            const newRow = row + i;
            const newCol = col + j;
            if (newRow >= 0 && newCol >= 0 && newRow < numRows && newCol < numCols) {
                if (bombSquares.has(locToId(newRow, newCol))) {
                    count++;
                }
            }
        }
    }
    return count;
};

const updateBoard = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REVEAL_SQUARE: {
            const row = action.squareRow;
            const col = action.squareCol;
            // Do nothing if the square is not hidden, or if the game
            // is already over.
            const squareStatus = state.statuses[row][col];
            if (squareStatus !== HIDDEN || state.isOver) {
                return state;
            }
            // End the game if the bomb was clicked.
            if (state.bombSquares.has(locToId(row, col))) {
                const statuses = copyBoard(state.statuses);
                statuses[row][col] = BOMB;
                return {...state, statuses, isOver: true};
            }
            // Initialize the bomb squares, if this is the first
            // move. It's useful to do this here, so that the player
            // doesn't accidentally click the bomb at the start.
            let bombSquares = state.bombSquares;
            if (state.isFirstMove) {
                bombSquares = initializeBombSquares();
                bombSquares.delete(locToId(row, col));
            }
            const statuses = copyBoard(state.statuses);
            statuses[row][col] = CLEARED;
            let counts = state.counts;
            if (!counts[row][col]) {
                counts = copyBoard(state.counts);
                counts[row][col] = countSurroundingBombs(bombSquares, row, col);
            }
            return {
                ...state,
                "bombSquares": bombSquares,
                "counts": counts,
                "statuses": statuses,
                "isFirstMove": false,
            }
        }
        case FLAG_SQUARE: {
            const row = action.squareRow;
            const col = action.squareCol;
            const squareStatus = state.statuses[row][col];
            if (squareStatus === HIDDEN) {
                const statuses = copyBoard(state.statuses);
                statuses[row][col] = FLAGGED;
                return {...state, statuses};
            }
            if (squareStatus === FLAGGED) {
                const statuses = copyBoard(state.statuses);
                statuses[row][col] = HIDDEN;
                return {...state, statuses};
            }
            return state;
        }
        default: {
            return state;
        }
    }
};

export default updateBoard;
