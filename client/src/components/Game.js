import React from 'react';
import { connect } from "react-redux";
import Board from './Board';
import {restartGame} from "../actions";


const Game = props => {
    let status = "Keep going!";
    if (props.isOver) {
        status = "Game over!";
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <button onClick={props.restartGame}>
                    Restart Game
                </button>
            </div>
        </div>
    );
};

const mapStateToProps = state => ({
    isOver: state.isOver,
});

const mapDispatchToProps = dispatch => ({
    restartGame: () => dispatch(restartGame()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
