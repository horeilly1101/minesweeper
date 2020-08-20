import React from 'react';
import './Board.css';
import { connect } from "react-redux";
import Square from '../Square/Square';
import { rightClickSquare, clickSquare } from "../../actions/creators";


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
        const numCols = this.props.numCols;
        const squares = Array(numCols).fill(null)
            .map((val, i) => this.renderSquare(numCols * row + i));
        return (
            <div className="board-row" key={row}>
                {squares}
            </div>
        );
    }

    render() {
        const rows = Array(this.props.numRows).fill(null)
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
    numRows: state.numRows,
    numCols: state.numCols,
});

const mapDispatchToProps = dispatch => ({
    handleClick: squareId => dispatch(clickSquare(squareId)),
    handleRightClick: squareId => dispatch(rightClickSquare(squareId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);