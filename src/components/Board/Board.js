import React from 'react';
import './Board.css';
import { connect } from "react-redux";
import Square from '../Square/Square';

const Row = props => {
    const numCols = props.numCols;
    const squares = Array(numCols).fill(null)
        .map((val, i) => {
            const squareId = numCols * props.row + i;
            return <Square key={squareId} squareId={squareId}/>;
        });
    return (
        <div className="board-row" key={props.row}>
            {squares}
        </div>
    );
};

const Board = props => {
    const rows = Array(props.numRows).fill(null)
        .map((val, i) => <Row row={i} numCols={props.numCols} />);
    return (
        <div>
            {rows}
        </div>
    );
};

const mapStateToProps = state => ({
    numRows: state.numRows,
    numCols: state.numCols,
});

export default connect(
    mapStateToProps,
    null
)(Board);