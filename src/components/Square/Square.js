import React from 'react';
import './Square.css';
import { SQUARE_STATUS } from "../../constants";

class Square extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.status !== nextProps.status);
    }

    render() {
        let value;
        let buttonStyle;
        switch (this.props.status) {
            case SQUARE_STATUS.HIDDEN: {
                value = "";
                buttonStyle = {
                  backgroundColor: "#3AA3FF",
                };
                break;
            }
            case SQUARE_STATUS.CLEARED: {
                const count = this.props.count;
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
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
            >
                {value}
            </button>
        );
    }
}

export default Square;
