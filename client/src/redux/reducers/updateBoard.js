import { FLAG_SQUARE, REVEAL_SQUARE } from "../actionTypes";
import { numCols, numRows } from "../../constants";
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../../squareStatus";

const NUM_BOMBS = numRows + numCols;
const BOARD_SIZE = numRows * numCols;
const INITIAL_STATE = {
    bombSquares: new Set(),
    statuses: Array(BOARD_SIZE).fill(HIDDEN),
    counts: Array(BOARD_SIZE).fill(null),
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
    bombSquares
        .slice(0, NUM_BOMBS)
        .forEach(value => set.add(value));
    return set;
};

const updateBoard = (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case REVEAL_SQUARE: {
            // Do nothing if the square is not hidden, or if the game
            // is already over.
            const squareStatus = state.statuses[action.squareId];
            if (squareStatus !== HIDDEN || state.isOver) {
                return state;
            }
            // Initialize the bomb squares, if this is the first
            // move. It's useful to do this here, so that the player
            // doesn't accidentally click the bomb at the start.
            let bombSquares = state.bombSquares;
            if (state.isFirstMove) {
                bombSquares = initializeBombSquares();
            }
            // Update the rest of the state.
            const newStatuses = [...state.statuses];
            let isOver = state.isOver;
            if (state.bombSquares.has(action.squareId)) {
                newStatuses[action.squareId] = BOMB;
                isOver = true;
            } else {
                newStatuses[action.squareId] = CLEARED;
            }
            return {
                ...state,
                "bombSquares": bombSquares,
                "statuses": newStatuses,
                "isFirstMove": false,
                "isOver": isOver,
            }
        }
        case FLAG_SQUARE: {
            return state;
        }
        default: {
            return state;
        }
    }
};

export default updateBoard;
