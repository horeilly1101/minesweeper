import React from 'react';
import { connect } from "react-redux";
import Square from './Square';
import { rightClickSquare, clickSquare } from "../actions";
import { NUM_ROWS, NUM_COLS } from "../constants";


class Board extends React.Component {
    renderSquare(squareId) {
        const square = this.props.squares[squareId];
        return (
            <Square
                key={squareId}
                status={square.status}
                count={square.count}
                onClick={() => this.props.handleClick(squareId)}
                onContextMenu={e => {
                    e.preventDefault();
                    this.props.handleRightClick(squareId);
                }}
            />
        );
    }

    renderRow(row) {
        const squares = Array(NUM_COLS).fill(null)
            .map((val, i) => this.renderSquare(NUM_COLS * row + i));
        return (
            <div className="board-row" key={row}>
                {squares}
            </div>
        );
    }

    render() {
        const rows = Array(NUM_ROWS).fill(null)
            .map((val, i) => this.renderRow(i));
        return (
            <div>
                {rows}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    squares: state.squares,
});

const mapDispatchToProps = dispatch => ({
    handleClick: squareId => dispatch(clickSquare(squareId)),
    handleRightClick: squareId => dispatch(rightClickSquare(squareId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);