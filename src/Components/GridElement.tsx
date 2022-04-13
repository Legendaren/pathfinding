import React from "react";
import { GridElementState } from "../Grid/GridElement/grid-element";
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
            className={"grid-element " + state.className}
            onMouseDown={(e) => prevDef(e, onMouseDown)}
            onMouseUp={(e) => prevDef(e, onMouseUp)}
            onMouseEnter={(e) => prevDef(e, onMouseEnter)}
        ></div>
    );
};

export default React.memo(GridElement);
