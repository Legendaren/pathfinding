import React, { useState } from "react";
import Dijkstras, { DistanceVertex } from "../Pathfinding/dijkstras";
import {
    generateGridVertices,
    GridPosition,
    GridSize,
    initGridStates,
} from "../Pathfinding/grid";
import "./../App.css";
import ControlPanel from "./ControlPanel";
import GridElement, { GridElementState, GridElementType } from "./GridElement";

interface GridProps {
    size: GridSize;
    start: GridPosition;
    target: GridPosition;
}

const Grid = ({ size, start, target }: GridProps) => {
    const [isMouseDown, setMouseDown] = useState(false);
    const [gridStates, setGridStates] = useState(
        initGridStates(size, start, target)
    );

    const updateGridState = (newState: GridElementState) => {
        updateGridStates([newState]);
    };

    const updateGridStates = (newStates: GridElementState[]) => {
        const gridStatesCopy = [...gridStates];
        newStates.forEach((state) => {
            gridStatesCopy[state.position.y][state.position.x] = state;
        });
        setGridStates(gridStatesCopy);
    };

    const setMarked = (state: GridElementState) => {
        updateGridState({ ...state, marked: true });
    };

    const onMouseDownHandler = (state: GridElementState) => {
        setMarked(state);
        setMouseDown(true);
    };

    const onMouseUpHandler = (state: GridElementState) => {
        setMouseDown(false);
    };

    const onMouseEnterHandler = (state: GridElementState) => {
        if (isMouseDown && !state.marked) {
            setMarked(state);
        }
    };

    const setPathVertices = (path: DistanceVertex[]) => {
        const newStates: GridElementState[] = [];
        path.forEach((vertex) => {
            const { x, y } = vertex.position;
            newStates.push({ ...gridStates[y][x], type: "path" });
        });
        updateGridStates(newStates);
    };

    const calculatePath = () => {
        const graph = generateGridVertices(gridStates, size);
        const path = new Dijkstras(graph).calculateShortestPath("0,0", "15,15");
        console.log("Found path: ", path);
        setPathVertices(path);
    };

    const reset = () => {
        const gridStatesCopy = [...gridStates];
        gridStatesCopy.forEach((row) => {
            row.forEach((state) => {
                state.type = "default";
                state.marked = false;
            });
        });
        setGridStates(gridStatesCopy);
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
            <ControlPanel calculatePath={calculatePath} reset={reset} />
        </div>
    );
};

export default Grid;
