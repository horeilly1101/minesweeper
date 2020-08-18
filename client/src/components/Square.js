import React from 'react';
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../squareStatus";

class Square extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.status !== nextProps.status);
    }

    render() {
        const infoMap = {
            HIDDEN: {
                value: "",
                styleClass: "hidden-square"
            },
            CLEARED: {
                value: (this.props.count) ? this.props.count.toString() : "",
                styleClass: "cleared-square color-" + this.props.count
            },
            BOMB: {
                value: "💣",
                styleClass: "bomb-square"
            },
            FLAGGED: {
                value: "🚩",
                styleClass: "hidden-square"
            },
        };
        const info = infoMap[this.props.status];
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
