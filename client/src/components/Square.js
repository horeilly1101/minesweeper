import React from 'react';
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../squareStatus";

class Square extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.status !== nextProps.status);
    }

    render() {
        let value;
        switch (this.props.status) {
            case HIDDEN: {
                value = "";
                break;
            }
            case CLEARED: {
                value = this.props.count.toString();
                break;
            }
            case BOMB: {
                value = "💣";
                break;
            }
            case FLAGGED: {
                value = "🚩";
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
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
            >
                {value}
            </button>
        );
    }
}

export default Square;
