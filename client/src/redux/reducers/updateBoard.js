import { CLICK_SQUARE, CLICK_HISTORY } from "../actionTypes";
import { calculateWinner } from "../../utils";

const initialState = {
    history: [{
        squares: Array(9).fill(null),
    }],
    stepNumber: 0,
    xIsNext: true,
};


const updateBoard = (state = initialState, action) => {
    switch (action.type) {
        case CLICK_SQUARE: {
            const history = state.history.slice(0, state.stepNumber + 1);
            const current = history[history.length - 1];
            const squares = current.squares.slice();
            if (calculateWinner(squares) || squares[action.squareId]) {
                return state;
            }
            squares[action.squareId] = state.xIsNext ? 'X' : 'O';
            return {
                "history": history.concat([{
                    squares: squares,
                }]),
                "stepNumber": history.length,
                "xIsNext": !state.xIsNext,
            };
        }
        case CLICK_HISTORY: {
            return {
                ...state,
                stepNumber: action.stepNumber,
                xIsNext: (action.stepNumber % 2) === 0,
            };
        }
        default: {
            return state;
        }
    }
};

export default updateBoard;