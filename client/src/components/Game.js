import React from 'react';
import { connect } from "react-redux";
import Board from './Board';
import { restartGame } from "../actions";
import { GAME_STATUS } from "../constants";


const Game = props => {
    let status;
    if (props.gameStatus === GAME_STATUS.WON) {
        status = "You won!";
    } else if (props.gameStatus === GAME_STATUS.LOST) {
        status = "You lost. Try again!"
    } else {
        status = "Keep going!"
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
    gameStatus: state.gameStatus,
});

const mapDispatchToProps = dispatch => ({
    restartGame: () => dispatch(restartGame()),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);
