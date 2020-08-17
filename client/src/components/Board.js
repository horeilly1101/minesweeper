import React from 'react';
import { connect } from "react-redux";
import Square from './Square';
import { flagSquare, revealSquare } from "../redux/actions";
import { numRows, numCols } from "../constants";


class Board extends React.Component {
    renderSquare(i) {
        const status = this.props.statuses[i];
        const count = this.props.counts[i];
        return (
            <Square
                key={i}
                status={status}
                bombCount={count}
                onClick={() => this.props.handleClick(i)}
            />
        );
    }

    renderRow(row) {
        return (
            <div className="board-row" key={row}>
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
    statuses: state.statuses,
    counts: state.counts,
});

const mapDispatchToProps = dispatch => ({
    handleClick: squareId => dispatch(revealSquare(squareId))
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Board);