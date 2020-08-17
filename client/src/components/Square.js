import React from 'react';
import { HIDDEN, CLEARED, BOMB, FLAGGED } from "../squareStatus";

class Square extends React.Component {
    shouldComponentUpdate(nextProps) {
        return (this.props.status !== nextProps.status);
    }

    render() {
        const infoProducers = {
            HIDDEN: () => ({
                value: "",
                styleClass: "hidden-square"
            }),
            CLEARED: () => ({
                value: this.props.count.toString(),
                styleClass: "cleared-square"
            }),
            BOMB: () => ({
                value: "💣",
                styleClass: "bomb-square"
            }),
            FLAGGED: () => ({
                value: "🚩",
                styleClass: "hidden-square"
            }),
        };
        const info = infoProducers[this.props.status]();
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
