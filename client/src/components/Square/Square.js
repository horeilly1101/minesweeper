import React from 'react';
import './Square.css';
import { SQUARE_STATUS } from "../../constants";

class Square extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.status !== nextProps.status);
    }

    render() {
        const infoMap = new Map([
            [SQUARE_STATUS.HIDDEN, {
                value: "",
                styleClass: "hidden-square"
            }],
            [SQUARE_STATUS.CLEARED, {
                value: (this.props.count) ? this.props.count.toString() : "",
                styleClass: "cleared-square color-" + this.props.count
            }],
            [SQUARE_STATUS.BOMB, {
                value: "💣",
                styleClass: "bomb-square"
            }],
            [SQUARE_STATUS.FLAGGED, {
                value: "🚩",
                styleClass: "hidden-square"
            }],
        ]);
        const info = infoMap.get(this.props.status);
        const value = info.value;
        const styleClass = info.styleClass;
        return (
            <button
                className={"square " + styleClass}
                onClick={this.props.onClick}
                onContextMenu={this.props.onContextMenu}
            >
                {value}
            </button>
        );
    }
}

export default Square;
