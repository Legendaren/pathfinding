import React from "react";
import { GridElementState, GridElementType } from "../grid-element";
import "./../App.css";

export type Handler = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    state: GridElementState
) => void;

export interface GridElementProps {
    state: GridElementState;
    onMouseEnter: Handler;
    onMouseDown: Handler;
    onMouseUp: Handler;
}

const typeToClassName = new Map<GridElementType, string>([
    [GridElementType.DEFAULT, ""],
    [GridElementType.START, "start"],
    [GridElementType.TARGET, "target"],
    [GridElementType.WALL, "wall"],
    [GridElementType.PATH, "path"],
    [GridElementType.VISITED, "visited"],
]);

const GridElement = ({
    state,
    onMouseDown,
    onMouseEnter,
    onMouseUp,
}: GridElementProps) => {
    const prevDef = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        handlerFunc: Handler
    ) => {
        e.preventDefault();
        handlerFunc(e, state);
    };

    return (
        <div
            className={"grid-element " + typeToClassName.get(state.type) || ""}
            onMouseDown={(e) => prevDef(e, onMouseDown)}
            onMouseUp={(e) => prevDef(e, onMouseUp)}
            onMouseEnter={(e) => prevDef(e, onMouseEnter)}
        ></div>
    );
};

export default React.memo(GridElement);
