import React from 'react';
import { connect } from "react-redux";
import Square from './Square';
import { clickSquare } from "../redux/actions";
import { numRows, numCols } from "../constants";


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.handleClick(i)}
            />
        );
    }

    renderRow(row) {
        return (
            <div className="board-row">
                {Array(numCols)
                    .fill(null)
                    .map((val, i) => this.renderSquare(row * numCols + i))}
            </div>
        );
    }

    render() {
        return (
            <div>
                {Array(numRows)
                    .fill(null)
                    .map((val, i) => this.renderRow(i))}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    squares: state.history[state.stepNumber]["squares"]
});

const mapDispatchToProps = dispatch => ({
    handleClick: squareId => dispatch(clickSquare(squareId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);