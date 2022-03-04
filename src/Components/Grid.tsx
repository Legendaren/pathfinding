import React, { useState } from "react";
import "./../App.css";
import GridElement, { GridElementState, GridElementType } from "./GridElement";

export interface GridPosition {
    x: number;
    y: number;
}

interface GridProps {
    rows: number;
    columns: number;
    start: GridPosition;
    target: GridPosition;
}

const initGridStates = (
    rows: number,
    columns: number,
    start: GridPosition,
    target: GridPosition
): GridElementState[][] => {
    const gridStates = [];
    for (let i = 0; i < rows; i++) {
        const row = [];
        for (let j = 0; j < columns; j++) {
            const position = { x: j, y: i };
            let type = GridElementType.Default;
            const isStart = position.x === start.x && position.y === start.y;
            const isTarget = position.x === target.x && position.y === target.y;
            if (isStart) {
                type = GridElementType.Start;
            } else if (isTarget) {
                type = GridElementType.Target;
            }
            row.push({
                marked: false,
                position: position,
                type: type,
            });
        }
        gridStates.push(row);
    }
    return gridStates;
};

const Grid = ({ rows, columns, start, target }: GridProps) => {
    const [isMouseDown, setMouseDown] = useState(false);
    const [gridStates, setGridStates] = useState(
        initGridStates(rows, columns, start, target)
    );

    const updateGridState = (
        oldState: GridElementState,
        newState: GridElementState
    ) => {
        const gridStatesCopy = [...gridStates];
        gridStatesCopy[oldState.position.y][oldState.position.x] = newState;
        setGridStates(gridStatesCopy);
    };

    const setMarked = (state: GridElementState) => {
        updateGridState(state, { ...state, marked: true });
    };

    const onMouseDownHandler = (state: GridElementState) => {
        setMarked(state);
        setMouseDown(true);
        console.log("onMouseDown");
    };

    const onMouseUpHandler = (state: GridElementState) => {
        setMouseDown(false);
        console.log("onMouseUp");
    };

    const onMouseEnterHandler = (state: GridElementState) => {
        if (isMouseDown && !state.marked) {
            setMarked(state);
        }
        console.log("onMouseEnter");
    };

    const gridElements = gridStates.map((row) =>
        row.map((elem) => (
            <GridElement
                state={elem}
                onMouseDown={onMouseDownHandler}
                onMouseUp={onMouseUpHandler}
                onMouseEnter={onMouseEnterHandler}
            />
        ))
    );

    return (
        <div className="grid">
            {gridElements.map((row, i) => (
                <div key={"row" + i.toString()} className="grid-row">
                    {row.map((elem, j) => (
                        <div key={"elem" + j.toString()}>{elem}</div>
                    ))}
                </div>
            ))}
        </div>
    );
};

export default Grid;
