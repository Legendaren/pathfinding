import React, { useCallback, useEffect, useRef } from "react";
import { useState } from "react";
import {
    GridElementFactory,
    GridElementState,
    GridElementType,
} from "../grid-element";
import { DistanceVertex } from "../Pathfinding/dijkstras";
import {
    delay,
    generateGraph,
    GridPosition,
    GridSize,
    initGridStates,
    posToString,
    ShortestPathFinder,
    stringToPos,
} from "../grid";
import "./../App.css";
import ControlPanel from "./ControlPanel";
import GridElement, { Handler } from "./GridElement";

interface GridProps {
    size: GridSize;
    start: GridPosition;
    target: GridPosition;
}

const Grid = ({ size, start, target }: GridProps) => {
    const startRef = useRef(start);
    const targetRef = useRef(target);
    const leftMouseDownRef = useRef<boolean>(false);
    const rightMouseDownRef = useRef<boolean>(false);
    const draggedElementRef = useRef<GridElementState | undefined>(undefined);
    const pathVerticesRef = useRef<DistanceVertex[]>([]);
    const [isVisitedComplete, setVisitedComplete] = useState<boolean>(false);
    const [gridStates, setGridStates] = useState(
        initGridStates(size, startRef.current, targetRef.current)
    );

    const setElement = useCallback(
        (pos: GridPosition, state: GridElementState) => {
            setGridStates((prevGrid) => {
                const gridCopy = [...prevGrid];
                gridCopy[pos.y][pos.x] = state;
                return gridCopy;
            });
        },
        []
    );

    const clearGrid = useCallback((...types: GridElementType[]) => {
        setGridStates((oldGridStates) =>
            oldGridStates.map((row) =>
                row.map((state) =>
                    types.includes(state.type)
                        ? GridElementFactory.createDefault(state.position)
                        : state
                )
            )
        );
    }, []);

    const setPathVertices = useCallback(async () => {
        console.log("setPathVertices:", pathVerticesRef.current);
        for (const vertex of pathVerticesRef.current) {
            const pathGridElement = GridElementFactory.createPath(
                vertex.position
            );
            setElement(vertex.position, pathGridElement);
            await delay(30);
        }
    }, [setElement]);

    const setVisitedVertices = useCallback(
        async (vertices: string[]) => {
            for (const v of vertices) {
                const pos = stringToPos(v);
                const visitedGridElement =
                    GridElementFactory.createVisited(pos);
                setElement(pos, visitedGridElement);
                await delay(15);
            }
            setVisitedComplete(true);
        },
        [setElement]
    );

    useEffect(() => {
        console.log("useEffect", isVisitedComplete);
        if (isVisitedComplete) {
            setPathVertices();
        } else {
            clearGrid(GridElementType.PATH, GridElementType.VISITED);
        }
    }, [isVisitedComplete, setPathVertices, clearGrid]);

    const clearElement = useCallback(
        (pos: GridPosition) => {
            setElement(pos, GridElementFactory.createDefault(pos));
        },
        [setElement]
    );

    const handleDrag = useCallback(
        (state: GridElementState) => {
            const newDraggedElement: GridElementState = {
                ...draggedElementRef.current!,
                position: state.position,
            };

            if (newDraggedElement.type === GridElementType.START) {
                startRef.current = state.position;
            } else if (newDraggedElement.type === GridElementType.TARGET) {
                targetRef.current = state.position;
            }

            clearElement(draggedElementRef.current!.position);
            setElement(state.position, newDraggedElement);
            draggedElementRef.current = newDraggedElement;
            return true;
        },
        [setElement, clearElement]
    );

    const onMouseDownLeft = useCallback(
        (state: GridElementState) => {
            const isStart = state.type === GridElementType.START;
            const isTarget = state.type === GridElementType.TARGET;
            if (isStart || isTarget) {
                draggedElementRef.current = state;
            } else {
                const wallElem = GridElementFactory.createWall(state.position);
                setElement(state.position, wallElem);
            }
            leftMouseDownRef.current = true;
        },
        [setElement]
    );

    const onMouseDownRight = useCallback(
        (state: GridElementState) => {
            const isWall = state.type === GridElementType.WALL;
            if (isWall) clearElement(state.position);
            rightMouseDownRef.current = true;
        },
        [clearElement]
    );

    const onMouseDownHandler: Handler = useCallback(
        (e, state) => {
            const isLeft = e.button === 0;
            const isRight = e.button === 2;
            if (isLeft) {
                onMouseDownLeft(state);
            } else if (isRight) {
                onMouseDownRight(state);
            }
        },
        [onMouseDownLeft, onMouseDownRight]
    );

    const onMouseUpHandler: Handler = useCallback((e, state) => {
        const isLeft = e.button === 0;
        const isRight = e.button === 2;
        if (isLeft) {
            leftMouseDownRef.current = false;
            draggedElementRef.current = undefined;
        } else if (isRight) {
            rightMouseDownRef.current = false;
        }
    }, []);

    const onMouseEnterLeft = useCallback(
        (state: GridElementState) => {
            const isStart = state.type === GridElementType.START;
            const isTarget = state.type === GridElementType.TARGET;
            const isWall = state.type === GridElementType.WALL;
            const isValidPos = !isWall && !isStart && !isTarget;
            if (draggedElementRef.current && isValidPos) {
                handleDrag(state);
            } else if (leftMouseDownRef.current && isValidPos) {
                const wallElem = GridElementFactory.createWall(state.position);
                setElement(state.position, wallElem);
            }
        },
        [setElement, handleDrag]
    );

    const onMouseEnterRight = useCallback(
        (state: GridElementState) => {
            const isWall = state.type === GridElementType.WALL;
            if (rightMouseDownRef.current && isWall) {
                clearElement(state.position);
            }
        },
        [clearElement]
    );

    const onMouseEnterHandler: Handler = useCallback(
        (e, state) => {
            onMouseEnterLeft(state);
            onMouseEnterRight(state);
        },
        [onMouseEnterLeft, onMouseEnterRight]
    );

    const calculatePath = useCallback(
        (pathfinder: ShortestPathFinder) => {
            const [visited, path] = pathfinder.calculateShortestPath(
                posToString(startRef.current),
                posToString(targetRef.current),
                generateGraph(gridStates, size)
            );
            console.log("Found path: ", path);
            const pathWithoutFirstandLastVertex = path.slice(1, -1);
            const visitedWithoutFirstAndLast = visited.slice(1, -1);
            pathVerticesRef.current = pathWithoutFirstandLastVertex.reverse();
            setVisitedVertices(visitedWithoutFirstAndLast);
        },
        [setVisitedVertices, size, gridStates]
    );

    return (
        <div className="grid" onContextMenu={(e) => e.preventDefault()}>
            {gridStates.map((row, i) => (
                <div key={"row:" + i} className={"grid-row"}>
                    {row.map((elem, j) => (
                        <GridElement
                            key={"row:" + i + ",col:" + j}
                            state={elem}
                            onMouseDown={onMouseDownHandler}
                            onMouseUp={onMouseUpHandler}
                            onMouseEnter={onMouseEnterHandler}
                        />
                    ))}
                </div>
            ))}
            <ControlPanel
                calculatePath={calculatePath}
                clearWalls={() => clearGrid(GridElementType.WALL)}
                clearPath={() => {
                    setVisitedComplete(false);
                }}
            />
        </div>
    );
};

export default Grid;
