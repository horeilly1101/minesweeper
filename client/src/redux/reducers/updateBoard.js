import { CLICK_SQUARE, CLICK_HISTORY } from "../actionTypes";

const initialState = {
    history: [{
        squares: Array(9).fill(null),
    }],
    stepNumber: 0,
    winner: null,
    xIsNext: true,
};

export const calculateWinner = (squares) => {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
};

const updateBoard = (state = initialState, action) => {
    switch (action.type) {
        case CLICK_SQUARE: {
            const history = state.history.slice(0, state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            // Do nothing if the game is already over, or if the square
            // has already been clicked.
            if (state.winner || squares[action.squareId]) {
                return state;
            }
            // Update the squares with the new move.
            squares[action.squareId] = state.xIsNext ? 'X' : 'O';
            return {
                "history": history.concat([{
                    squares: squares,
                }]),
                "stepNumber": history.length,
                "winner": calculateWinner(squares),
                "xIsNext": !state.xIsNext,
            };
        }
        case CLICK_HISTORY: {
            if (action.stepNumber === state.stepNumber) {
                return state;
            }
            return {
                ...state,
                "stepNumber": action.stepNumber,
                "winner": null,
                "xIsNext": (action.stepNumber % 2) === 0,
            };
        }
        default: {
            return state;
        }
    }
};

export default updateBoard;