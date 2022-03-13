import React from "react";
import { useState } from "react";
import {
    createDefault,
    createPath,
    createWall,
    GridElementState,
    GridElementType,
} from "../grid-element";
import Dijkstras, { DistanceVertex } from "../Pathfinding/dijkstras";
import {
    generateGridVertices,
    GridPosition,
    GridSize,
    initGridStates,
    posToString,
} from "../Pathfinding/grid";
import "./../App.css";
import ControlPanel from "./ControlPanel";
import GridElement from "./GridElement";

interface GridProps {
    size: GridSize;
    start: GridPosition;
    target: GridPosition;
}

type StatePositionPair = [GridElementState, GridPosition];

const Grid = ({ size, start, target }: GridProps) => {
    const [isLeftMouseDown, setLeftMouseDown] = useState(false);
    const [isRightMouseDown, setRightMouseDown] = useState(false);
    const [gridStates, setGridStates] = useState(
        initGridStates(size, start, target)
    );

    const updateGridStates = (newStates: StatePositionPair[]) => {
        const gridStatesCopy = [...gridStates];
        for (const newState of newStates) {
            const [elementState, { x, y }] = newState;
            gridStatesCopy[y][x] = elementState;
        }
        setGridStates(gridStatesCopy);
    };

    const updateGridState = (
        position: GridPosition,
        newState: GridElementState
    ) => {
        updateGridStates([[newState, position]]);
    };

    const setWall = (position: GridPosition) => {
        updateGridState(position, createWall(position));
    };

    const setDefault = (position: GridPosition) => {
        updateGridState(position, createDefault(position));
    };

    const onMouseDownLeft = (state: GridElementState) => {
        const isStart = state.type === GridElementType.START;
        const isTarget = state.type === GridElementType.TARGET;
        if (!isStart && !isTarget) setWall(state.position);
        setLeftMouseDown(true);
    };

    const onMouseDownRight = (state: GridElementState) => {
        const isWall = state.type === GridElementType.WALL;
        if (isWall) setDefault(state.position);
        setRightMouseDown(true);
    };

    const onMouseDownHandler = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        state: GridElementState
    ) => {
        const isLeft = e.button === 0;
        const isRight = e.button === 2;
        if (isLeft) {
            onMouseDownLeft(state);
        } else if (isRight) {
            onMouseDownRight(state);
        }
    };

    const onMouseUpLeft = (state: GridElementState) => {
        setLeftMouseDown(false);
    };

    const onMouseUpRight = (state: GridElementState) => {
        setRightMouseDown(false);
    };

    const onMouseUpHandler = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        state: GridElementState
    ) => {
        const isLeft = e.button === 0;
        const isRight = e.button === 2;
        if (isLeft) {
            onMouseUpLeft(state);
        } else if (isRight) {
            onMouseUpRight(state);
        }
    };

    const onMouseEnterLeft = (state: GridElementState) => {
        const isStart = state.type === GridElementType.START;
        const isTarget = state.type === GridElementType.TARGET;
        const isWall = state.type === GridElementType.WALL;
        const isValidPos = isLeftMouseDown && !isWall && !isStart && !isTarget;
        if (isValidPos) setWall(state.position);
    };

    const onMouseEnterRight = (state: GridElementState) => {
        const isWall = state.type === GridElementType.WALL;
        if (isRightMouseDown && isWall) setDefault(state.position);
    };

    const onMouseEnterHandler = (
        e: React.MouseEvent<HTMLElement, MouseEvent>,
        state: GridElementState
    ) => {
        onMouseEnterLeft(state);
        onMouseEnterRight(state);
    };

    const setPathVertices = (path: DistanceVertex[]) => {
        const newStates: StatePositionPair[] = [];
        for (const vertex of path) {
            const pathVertex = createPath(vertex.position);
            newStates.push([pathVertex, vertex.position]);
        }
        updateGridStates(newStates);
    };

    const calculatePath = () => {
        const graph = generateGridVertices(gridStates, size);
        const path = new Dijkstras(graph).calculateShortestPath(
            posToString(start),
            posToString(target)
        );
        console.log("Found path: ", path);
        const pathWithoutFirstandLastVertex = path.slice(1, path.length - 1);
        setPathVertices(pathWithoutFirstandLastVertex);
    };

    const reset = () => {
        setGridStates(initGridStates(size, start, target));
    };

    return (
        <div className="grid" onContextMenu={(e) => e.preventDefault()}>
            {gridStates.map((row, i) => (
                <div key={i} className={"grid-row"}>
                    {row.map((elem, j) => (
                        <GridElement
                            key={j}
                            state={elem}
                            onMouseDown={onMouseDownHandler}
                            onMouseUp={onMouseUpHandler}
                            onMouseEnter={onMouseEnterHandler}
                        />
                    ))}
                </div>
            ))}
            <ControlPanel calculatePath={calculatePath} reset={reset} />
        </div>
    );
};

export default Grid;
