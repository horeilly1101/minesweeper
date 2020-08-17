import React from 'react';
import { HIDDEN, CLEARED, BOMB } from "../squareStatus";

const Square = props => {
    let value;
    switch (props.status) {
        case HIDDEN: {
            value = "?";
            break;
        }
        case CLEARED: {
            value = "8";
            break;
        }
        case BOMB: {
            value = "💣";
            break;
        }
        default: {
            value = "uh";
            break;
        }
    }
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {value}
        </button>
    );
};

export default Square;
