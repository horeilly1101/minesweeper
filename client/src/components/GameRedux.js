import React from 'react';
import { connect } from "react-redux";
import Board from './BoardRedux';
import { calculateWinner } from "../utils";
import { clickHistory } from "../redux/actions";


const Game = props => {
    const history = props.history;
    const current = history[props.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
        const desc = move ?
            'Go to move #' + move :
            'Go to game start';
        return (
            <li key={move}>
                <button onClick={() => props.jumpTo(move)}>{desc}</button>
            </li>
        );
    });

    let status;
    if (winner) {
        status = 'Winner: ' + winner;
    } else {
        status = 'Next player: ' + (props.xIsNext ? 'X' : 'O');
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    console.log(state);
    return {
        history: state.history,
        stepNumber: state.stepNumber,
        xIsNext: state.xIsNext,
    }
};

const mapDispatchToProps =  dispatch => ({
    jumpTo: stepNumber => dispatch(clickHistory(stepNumber))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game)
