import React from "react";
import { GridElementState, GridElementType } from "../grid-element";
import "./../App.css";
import { CSSTransition } from "react-transition-group";

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
        <CSSTransition
            in={state.type === GridElementType.PATH}
            timeout={state.animationDelay}
            classNames="fade"
            exit={false}
        >
            <div
                className={
                    "grid-element " + typeToClassName.get(state.type) || ""
                }
                onMouseDown={(e) => prevDef(e, onMouseDown)}
                onMouseUp={(e) => prevDef(e, onMouseUp)}
                onMouseEnter={(e) => prevDef(e, onMouseEnter)}
            ></div>
        </CSSTransition>
    );
};

export default React.memo(GridElement);
