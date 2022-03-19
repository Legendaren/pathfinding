import React, { useCallback, useRef } from "react";
import { useState } from "react";
import {
    GridElementFactory,
    GridElementState,
    GridElementType,
} from "../grid-element";
import { DistanceVertex } from "../Pathfinding/dijkstras";
import {
    generateGraph,
    GridPosition,
    GridSize,
    initGridStates,
    posToString,
    ShortestPathFinder,
} from "../grid";
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

    const leftMouseDownRef = useRef<boolean>();
    const rightMouseDownRef = useRef<boolean>();
    const draggedElementRef = useRef<GridElementState | undefined>();
    const startPosRef = useRef<GridPosition>();
    const targetPosRef = useRef<GridPosition>();
    leftMouseDownRef.current = isLeftMouseDown;
    rightMouseDownRef.current = isRightMouseDown;
    draggedElementRef.current = draggedElement;
    startPosRef.current = startPos;
    targetPosRef.current = targetPos;

    const updateGridStates = useCallback((newStates: StatePositionPair[]) => {
        setGridStates((oldGridStates) => {
            const gridStatesCopy = [...oldGridStates];
            for (const newState of newStates) {
                const [elementState, { x, y }] = newState;
                gridStatesCopy[y][x] = elementState;
            }
            return gridStatesCopy;
        });
    }, []);

    const updateGridState = useCallback(
        (position: GridPosition, newState: GridElementState) => {
            updateGridStates([[newState, position]]);
        },
        [updateGridStates]
    );

    const handleDrag = useCallback(
        (state: GridElementState) => {
            const isStart = state.type === GridElementType.START;
            const isTarget = state.type === GridElementType.TARGET;
            const isWall = state.type === GridElementType.WALL;
            const isValidPos = !isStart && !isTarget && !isWall;
            if (!draggedElementRef.current || !isValidPos) return false;

            updateGridState(
                draggedElementRef.current.position,
                GridElementFactory.createDefault(
                    draggedElementRef.current.position
                )
            );
            const newDraggedElement: GridElementState = {
                ...draggedElementRef.current,
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
        },
        [updateGridState]
    );

    const onMouseDownLeft = useCallback(
        (state: GridElementState) => {
            const isStart = state.type === GridElementType.START;
            const isTarget = state.type === GridElementType.TARGET;
            if (isStart || isTarget) {
                setDraggedElement(state);
            } else {
                updateGridState(
                    state.position,
                    GridElementFactory.createWall(state.position)
                );
            }
            setLeftMouseDown(true);
        },
        [updateGridState]
    );

    const onMouseDownRight = useCallback(
        (state: GridElementState) => {
            const isWall = state.type === GridElementType.WALL;
            if (isWall)
                updateGridState(
                    state.position,
                    GridElementFactory.createDefault(state.position)
                );
            setRightMouseDown(true);
        },
        [updateGridState]
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
            setLeftMouseDown(false);
            setDraggedElement(undefined);
        } else if (isRight) {
            setRightMouseDown(false);
        }
    }, []);

    const onMouseEnterLeft = useCallback(
        (state: GridElementState) => {
            if (handleDrag(state)) return;
            const isStart = state.type === GridElementType.START;
            const isTarget = state.type === GridElementType.TARGET;
            const isWall = state.type === GridElementType.WALL;
            const isValidPos =
                leftMouseDownRef.current && !isWall && !isStart && !isTarget;
            if (isValidPos)
                updateGridState(
                    state.position,
                    GridElementFactory.createWall(state.position)
                );
        },
        [updateGridState, handleDrag]
    );

    const onMouseEnterRight = useCallback(
        (state: GridElementState) => {
            const isWall = state.type === GridElementType.WALL;
            if (rightMouseDownRef.current && isWall)
                updateGridState(
                    state.position,
                    GridElementFactory.createDefault(state.position)
                );
        },
        [updateGridState]
    );

    const onMouseEnterHandler: Handler = useCallback(
        (e, state) => {
            onMouseEnterLeft(state);
            onMouseEnterRight(state);
        },
        [onMouseEnterLeft, onMouseEnterRight]
    );

    const setPathVertices = useCallback(
        (path: DistanceVertex[]) => {
            const newStates: StatePositionPair[] = [];
            path.forEach((vertex, i) => {
                const pathGridElement = GridElementFactory.createPath(
                    vertex.position
                );
                const pathVertex = GridElementFactory.createWithAnimationDelay(
                    pathGridElement,
                    pathGridElement.animationDelay +
                        pathGridElement.animationDelay * (path.length - i + 1)
                );
                newStates.push([pathVertex, vertex.position]);
            });
            updateGridStates(newStates);
        },
        [updateGridStates]
    );

    const clearGrid = useCallback((type: GridElementType) => {
        setGridStates((oldGridStates) =>
            oldGridStates.map((row) =>
                row.map((state) =>
                    state.type === type
                        ? GridElementFactory.createDefault(state.position)
                        : state
                )
            )
        );
    }, []);

    const calculatePath = useCallback(
        (pathfinder: ShortestPathFinder) => {
            setGridStates((oldGridStates) => {
                const path = pathfinder.calculateShortestPath(
                    posToString(startPosRef.current!),
                    posToString(targetPosRef.current!),
                    generateGraph(oldGridStates, size)
                );
                console.log("Found path: ", path);
                const pathWithoutFirstandLastVertex = path.slice(
                    1,
                    path.length - 1
                );
                setPathVertices(pathWithoutFirstandLastVertex);
                return oldGridStates;
            });
        },
        [setPathVertices, size]
    );

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
                calculatePath={calculatePath}
                clearWalls={() => clearGrid(GridElementType.WALL)}
                clearPath={() => clearGrid(GridElementType.PATH)}
            />
        </div>
    );
};

export default Grid;
