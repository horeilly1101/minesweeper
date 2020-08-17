import React from 'react';
import { connect } from "react-redux";
import Board from './Board';


const Game = props => {
    let status;
    if (props.isOver) {
        status = "Game over!";
    } else {
        status = "Keep going!";
    }

    return (
        <div className="game">
            <div className="game-board">
                <Board />
            </div>
            <div className="game-info">
                <div>{status}</div>
            </div>
        </div>
    );
};

const mapStateToProps = state => {
    console.log(state);
    return {
        squares: state.squares,
        isOver: state.isOver,
    }
};

export default connect(
    mapStateToProps,
    null
)(Game);
