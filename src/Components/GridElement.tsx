import React, { useEffect } from "react";
import { GridElementState } from "../grid-element";
import "./../App.css";

type Handler = (
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
    onMouseEnter,
    onMouseDown,
    onMouseUp,
}: GridElementProps) => {
    const classNames = ["grid-element", ...state.classNames];

    useEffect(() => {
        // console.log("Render");
    }, [state, onMouseEnter, onMouseDown, onMouseUp]);

    const prevDef = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        handlerFunc: Handler
    ) => {
        e.preventDefault();
        handlerFunc(e, state);
    };

    return (
        <div
            className={classNames.join(" ")}
            onMouseDown={(e) => prevDef(e, onMouseDown)}
            onMouseUp={(e) => prevDef(e, onMouseUp)}
            onMouseEnter={(e) => prevDef(e, onMouseEnter)}
        ></div>
    );
};

export default GridElement;
