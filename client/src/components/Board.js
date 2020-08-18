import React from 'react';
import { connect } from "react-redux";
import Square from './Square';
import { flagSquare, revealSquare } from "../actions/actions";
import { numRows, numCols } from "../constants";


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
        const squares = Array(numCols).fill(null)
            .map((val, i) => this.renderSquare(numCols * row + i));
        return (
            <div className="board-row" key={row}>
                {squares}
            </div>
        );
    }

    render() {
        const rows = Array(numRows).fill(null)
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
    handleClick: squareId => dispatch(revealSquare(squareId)),
    handleRightClick: squareId => dispatch(flagSquare(squareId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);