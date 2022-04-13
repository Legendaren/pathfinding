import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { useState } from "react";
import {
    Draggable,
    ElementType,
    GridElementState,
    RefStates,
} from "../Grid/GridElement/grid-element";
import {
    generateGraph,
    GridPosition,
    GridSize,
    initGridStates,
    posToString,
    ShortestPathFinder,
    stringToPos,
} from "../Grid/grid";
import "./../App.css";
import ControlPanel from "./ControlPanel";
import GridElement, { Handler } from "./GridElement";
import Path from "../Grid/GridElement/path";
import Default from "../Grid/GridElement/default";
import Visited from "../Grid/GridElement/visited";

interface GridProps {
    size: GridSize;
    start: GridPosition;
    target: GridPosition;
}

const Grid = ({ size, start, target }: GridProps) => {
    const startRef = useRef<GridPosition>(start);
    const targetRef = useRef<GridPosition>(target);
    const leftMouseDownRef = useRef<boolean>(false);
    const rightMouseDownRef = useRef<boolean>(false);
    const draggedElementRef = useRef<Draggable | undefined>(undefined);
    const pathVerticesRef = useRef<GridPosition[]>([]);
    const timeoutRef = useRef<number>();
    const [isVisitedComplete, setVisitedComplete] = useState<boolean>(false);
    const [isGridReset, setGridReset] = useState<boolean>(true);
    const [isCalculatingPath, setCalculatingPath] = useState<boolean>(false);
    const [gridStates, setGridStates] = useState<GridElementState[][]>(
        initGridStates(size, startRef.current, targetRef.current)
    );

    const allRefs: RefStates = useMemo(
        () => ({
            startRef: startRef,
            targetRef: targetRef,
            draggedElementRef: draggedElementRef,
        }),
        []
    );

    const delay = (timeInMs: number): Promise<number> => {
        return new Promise((resolve) => {
            timeoutRef.current = setTimeout(resolve, timeInMs);
        });
    };

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

    const setPathVertices = useCallback(async () => {
        if (pathVerticesRef.current.length === 0) {
            alert("Path not found");
        }
        for (const pos of pathVerticesRef.current) {
            const pathGridElement = new Path(pos);
            setElement(pos, pathGridElement);
            await delay(30);
        }
        setCalculatingPath(false);
    }, [setElement]);

    useEffect(() => {
        if (isVisitedComplete) {
            setPathVertices();
        }
    }, [isVisitedComplete, setPathVertices]);

    const clearGrid = useCallback((...types: ElementType[]) => {
        setGridStates((oldGridStates) =>
            oldGridStates.map((row) =>
                row.map((elem) =>
                    types.includes(elem.type)
                        ? new Default(elem.position)
                        : elem
                )
            )
        );
    }, []);

    const setVisitedVertices = useCallback(
        async (vertices: string[]) => {
            for (const v of vertices) {
                const pos = stringToPos(v);
                const visitedGridElement = new Visited(pos);
                setElement(pos, visitedGridElement);
                await delay(15);
            }
            setVisitedComplete(true);
        },
        [setElement]
    );

    const onMouseDownLeft = useCallback(
        (state: GridElementState) => {
            state.onMouseDownLeft(setElement, allRefs);
            leftMouseDownRef.current = true;
        },
        [setElement, allRefs]
    );

    const onMouseDownRight = useCallback(
        (state: GridElementState) => {
            state.onMouseDownRight(setElement, allRefs);
            rightMouseDownRef.current = true;
        },
        [setElement, allRefs]
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
            if (leftMouseDownRef.current) {
                state.onMouseEnterLeft(setElement, allRefs);
            }
        },
        [setElement, allRefs]
    );

    const onMouseEnterRight = useCallback(
        (state: GridElementState) => {
            if (rightMouseDownRef.current) {
                state.onMouseEnterRight(setElement, allRefs);
            }
        },
        [setElement, allRefs]
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
            setCalculatingPath(true);
            setGridReset(false);
            const [visited, path] = pathfinder.calculateShortestPath(
                posToString(startRef.current),
                posToString(targetRef.current),
                generateGraph(gridStates, size)
            );
            if (path.length > 0) {
                console.log("Found path: ", path);
            } else {
                console.log("Path not found");
            }
            const pathWithoutFirstandLastVertex = path.slice(1, -1);
            const visitedWithoutFirstAndLast = visited.slice(1, -1);
            pathVerticesRef.current = pathWithoutFirstandLastVertex.reverse();
            setVisitedVertices(visitedWithoutFirstAndLast);
        },
        [setVisitedVertices, size, gridStates]
    );

    return (
        <>
            <ControlPanel
                calculatePath={calculatePath}
                clearWalls={() => {
                    clearGrid("obstacle");
                }}
                clearPath={() => {
                    setVisitedComplete(false);
                    clearGrid("path");
                    setGridReset(true);
                }}
                cancelCalculation={() => {
                    clearTimeout(timeoutRef.current);
                    setVisitedComplete(false);
                    setCalculatingPath(false);
                    setGridReset(true);
                    clearGrid("path");
                }}
                isCalculatingPath={isCalculatingPath}
                isGridReset={isGridReset}
            />
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
            </div>
        </>
    );
};

export default Grid;
