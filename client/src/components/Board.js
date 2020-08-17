import React from 'react';
import { connect } from "react-redux";
import Square from './Square';
import { flagSquare, revealSquare } from "../redux/actions";
import { numRows, numCols } from "../constants";


class Board extends React.Component {
    renderSquare(row, col) {
        const status = this.props.statuses[row][col];
        const count = this.props.counts[row][col];
        return (
            <Square
                key={col}
                status={status}
                count={count}
                onClick={() => this.props.handleClick(row, col)}
                onContextMenu={e => {
                    e.preventDefault();
                    this.props.handleRightClick(row, col);
                }}
            />
        );
    }

    renderRow(row) {
        return (
            <div className="board-row" key={row}>
                {Array(numCols)
                    .fill(null)
                    .map((val, i) => this.renderSquare(row, i))}
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
    statuses: state.statuses,
    counts: state.counts,
});

const mapDispatchToProps = dispatch => ({
    handleClick: (row, col) => dispatch(revealSquare(row, col)),
    handleRightClick: (row, col) => dispatch(flagSquare(row, col)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);