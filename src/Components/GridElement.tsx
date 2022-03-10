import React from "react";
import "./../App.css";
import { GridPosition } from "./Grid";

export interface GridElementState {
    position: GridPosition;
    marked: boolean;
    type: GridElementType;
}

export type GridElementType = "default" | "start" | "target" | "path";

export interface GridElementProps {
    state: GridElementState;
    onMouseEnter: (state: GridElementState) => void;
    onMouseDown: (state: GridElementState) => void;
    onMouseUp: (state: GridElementState) => void;
}

const GridElement = ({
    state,
    onMouseEnter,
    onMouseDown,
    onMouseUp,
}: GridElementProps) => {
    const classNames = ["grid-element"];
    if (state.marked) {
        classNames.push("marked");
    }
    if (state.type !== "default") {
        classNames.push(state.type);
    }

    return (
        <div
            className={classNames.join(" ")}
            onMouseDown={() => onMouseDown(state)}
            onMouseUp={() => onMouseUp(state)}
            onMouseEnter={() => onMouseEnter(state)}
        ></div>
    );
};

export default GridElement;
