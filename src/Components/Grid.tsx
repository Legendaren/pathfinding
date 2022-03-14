import React from "react";
import { useState } from "react";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import {
    createDefault,
    createPath,
    createWall,
    GridElementState,
    GridElementType,
} from "../grid-element";
import AStar from "../Pathfinding/astar";
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
import GridElement, { Handler } from "./GridElement";

interface GridProps {
    size: GridSize;
    start: GridPosition;
    target: GridPosition;
}

type StatePositionPair = [GridElementState, GridPosition];

const Grid = ({ size, start, target }: GridProps) => {
    const [startPos, setStartPos] = useState(start);
    const [targetPos, setTargetPos] = useState(target);
    const [isLeftMouseDown, setLeftMouseDown] = useState(false);
    const [isRightMouseDown, setRightMouseDown] = useState(false);
    const [gridStates, setGridStates] = useState(
        initGridStates(size, startPos, targetPos)
    );
    const [draggedElement, setDraggedElement] = useState<
        GridElementState | undefined
    >(undefined);

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

    const handleDrag = (state: GridElementState) => {
        const isStart = state.type === GridElementType.START;
        const isTarget = state.type === GridElementType.TARGET;
        const isWall = state.type === GridElementType.WALL;
        const isValidPos = !isStart && !isTarget && !isWall;
        if (!draggedElement || !isValidPos) return false;

        setDefault(draggedElement.position);
        const newDraggedElement: GridElementState = {
            ...draggedElement,
            position: state.position,
        };

        if (newDraggedElement.type === GridElementType.START) {
            setStartPos(state.position);
        } else if (newDraggedElement.type === GridElementType.TARGET) {
            setTargetPos(state.position);
        }

        updateGridState(state.position, newDraggedElement);
        setDraggedElement(newDraggedElement);
        return true;
    };

    const onMouseDownLeft = (state: GridElementState) => {
        const isStart = state.type === GridElementType.START;
        const isTarget = state.type === GridElementType.TARGET;
        if (isStart || isTarget) {
            setDraggedElement(state);
        } else {
            setWall(state.position);
        }
        setLeftMouseDown(true);
    };

    const onMouseDownRight = (state: GridElementState) => {
        const isWall = state.type === GridElementType.WALL;
        if (isWall) setDefault(state.position);
        setRightMouseDown(true);
    };

    const onMouseDownHandler: Handler = (e, state) => {
        const isLeft = e.button === 0;
        const isRight = e.button === 2;
        if (isLeft) {
            onMouseDownLeft(state);
        } else if (isRight) {
            onMouseDownRight(state);
        }
    };

    const onMouseUpHandler: Handler = (e, state) => {
        const isLeft = e.button === 0;
        const isRight = e.button === 2;
        if (isLeft) {
            setLeftMouseDown(false);
            setDraggedElement(undefined);
        } else if (isRight) {
            setRightMouseDown(false);
        }
    };

    const onMouseEnterLeft = (state: GridElementState) => {
        if (handleDrag(state)) return;
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

    const onMouseEnterHandler: Handler = (e, state) => {
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

    const reset = () => {
        setGridStates(initGridStates(size, start, target));
    };

    const calculatePathDijkstras = () => {
        const graph = generateGridVertices(gridStates, size);
        const path = new Dijkstras(graph).calculateShortestPath(
            posToString(startPos),
            posToString(targetPos)
        );
        console.log("Found path: ", path);
        const pathWithoutFirstandLastVertex = path.slice(1, path.length - 1);
        setPathVertices(pathWithoutFirstandLastVertex);
    };

    const calculatePathAStar = () => {
        const graph = generateGridVertices(gridStates, size);
        const path = new AStar(graph).calculateShortestPath(
            posToString(startPos),
            posToString(targetPos)
        );
        console.log("Found path: ", path);
        const pathWithoutFirstandLastVertex = path.slice(1, path.length - 1);
        setPathVertices(pathWithoutFirstandLastVertex);
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
            <ControlPanel
                calculatePathDijkstra={calculatePathDijkstras}
                calculatePathAStar={calculatePathAStar}
                reset={reset}
            />
        </div>
    );
};

export default Grid;
