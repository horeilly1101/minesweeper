import React from 'react';
import { connect } from "react-redux";
import Square from './Square';
import { clickSquare } from "../redux/actions";


class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.handleClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
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