import React from 'react';
import './Square.css';
import { SQUARE_STATUS } from "../../constants";
import {connect} from "react-redux";
import {clickSquare, rightClickSquare} from "../../actions/creators";
import {getSquareCount, getSquareStatus} from "../../selectors";

const Square = props => {
    let value;
    let buttonStyle;
    switch (props.getStatus(props.squareId)) {
        case SQUARE_STATUS.HIDDEN: {
            value = "";
            buttonStyle = {
              backgroundColor: "#3AA3FF",
            };
            break;
        }
        case SQUARE_STATUS.CLEARED: {
            const count = props.getCount(props.squareId);
            value = (count) ? count.toString() : "";
            const countToTextColorMap = {
                0: "#ffffff",  // This is ignored anyway.
                1: "#117A65",
                2: "#6C3483",
                3: "#FF8A0D",
                4: "#FF29DF",
                5: "#2874A6",
                6: "#17202A",
                7: "#17202A",
                8: "#17202A",
            };
            buttonStyle = {
                backgroundColor: "#CCE7FF",
                color: countToTextColorMap[count]
            };
            break;
        }
        case SQUARE_STATUS.FLAGGED: {
            value = "🚩";
            buttonStyle = {
                backgroundColor: "#3AA3FF",
            };
            break;
        }
        case SQUARE_STATUS.BOMB: {
            value = "💣";
            buttonStyle = {
                backgroundColor: "#FF5353",
            };
            break;
        }
        default: {
            // Do nothing.
        }
    }
    return (
        <button
            className="square"
            style={buttonStyle}
            onClick={() => props.handleClick(props.squareId)}
            onContextMenu={e => {
                e.preventDefault();
                props.handleRightClick(props.squareId);
            }}
        >
            {value}
        </button>
    );
};

// This has the same effect as shouldComponentUpdate()
React.memo(Square, (props, nextProps) => (
    // If true, don't re-render/update.
    props.getStatus(props.squareId) === nextProps.getStatus(nextProps.squareId)
));

const mapStateToProps = state => ({
    getStatus: (squareId) => getSquareStatus(state, squareId),
    getCount: (squareId) => getSquareCount(state, squareId),
});

const mapDispatchToProps = dispatch => ({
    handleClick: squareId => dispatch(clickSquare(squareId)),
    handleRightClick: squareId => dispatch(rightClickSquare(squareId)),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Square);
