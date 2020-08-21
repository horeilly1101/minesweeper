import React from 'react';
import './Game.css';
import { connect } from "react-redux";
import Board from '../Board/Board';
import { restartGame } from "../../actions/creators";
import { GAME_STATUS } from "../../constants";

const Game = props => {
    let buttonText;
    let buttonStyle;
    if (props.gameStatus === GAME_STATUS.WON) {
        buttonText = "Play Again";
        buttonStyle = {
            background: "#41FF1E",
            color: "#FFFFFF",
        };
    } else if (props.gameStatus === GAME_STATUS.LOST) {
        buttonText = "Play Again";
        buttonStyle = {
            backgroundColor: "#FF5353",
            color: "#FFFFFF",
        };
    } else {
        buttonText = "Restart Game";
        buttonStyle = {};
    }

    return (
        <div className="game">
            <div>
                <Board />
            </div>
            <div className="game-info">
                <button
                    onClick={props.restartGame}
                    className="restart-game"
                    style={buttonStyle}
                >
                    {buttonText}
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
