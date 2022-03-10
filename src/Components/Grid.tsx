import React, { useEffect, useState } from "react";
import Dijkstras from "../Pathfinding/dijkstras";
import Graph, { Edge, Vertex } from "../Pathfinding/graph";
import "./../App.css";
import ControlPanel from "./ControlPanel";
import GridElement, { GridElementState, GridElementType } from "./GridElement";

export interface GridPosition {
    x: number;
    y: number;
}

interface GridSize {
    rows: number;
    columns: number;
}

interface GridProps {
    size: GridSize;
    start: GridPosition;
    target: GridPosition;
}

const inBounds = (pos: GridPosition, gridSize: GridSize) => {
    const xInBounds = pos.x >= 0 && pos.x < gridSize.columns;
    const yInBounds = pos.y >= 0 && pos.y < gridSize.rows;
    return xInBounds && yInBounds;
};

const adjacentNodePositions = (pos: GridPosition): GridPosition[] => {
    const left: GridPosition = { x: pos.x - 1, y: pos.y };
    const right: GridPosition = { x: pos.x + 1, y: pos.y };
    const up: GridPosition = { x: pos.x, y: pos.y - 1 };
    const down: GridPosition = { x: pos.x, y: pos.y + 1 };
    return [right, down, up, left];
};

const posToString = (pos: GridPosition) => {
    return `${pos.x},${pos.y}`;
};

const generateGridVertices = (
    states: GridElementState[][],
    gridSize: GridSize
): Graph => {
    const graph = new Graph();

    for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.columns; j++) {
            if (states[i][j].marked) continue;

            const pos: GridPosition = { x: j, y: i };

            const vertex = new Vertex(posToString(pos), pos);
            graph.addVertex(vertex);

            // Add edges to adjacent vertices that are not marked
            adjacentNodePositions(pos)
                .filter(
                    (p) => inBounds(p, gridSize) && !states[p.y][p.x].marked
                )
                .forEach((p) => {
                    graph.addEdge(
                        vertex.getName(),
                        new Edge(vertex.getName(), posToString(p), 1)
                    );
                });
        }
    }
    return graph;
};

const initGridStates = (
    size: GridSize,
    start: GridPosition,
    target: GridPosition
): GridElementState[][] => {
    const gridStates: GridElementState[][] = [];
    for (let i = 0; i < size.rows; i++) {
        const row: GridElementState[] = [];
        for (let j = 0; j < size.columns; j++) {
            const position = { x: j, y: i };
            let type: GridElementType = "default";
            const isStart = position.x === start.x && position.y === start.y;
            const isTarget = position.x === target.x && position.y === target.y;
            if (isStart) {
                type = "start";
            } else if (isTarget) {
                type = "target";
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

const Grid = ({ size, start, target }: GridProps) => {
    const [isMouseDown, setMouseDown] = useState(false);
    const [gridStates, setGridStates] = useState(
        initGridStates(size, start, target)
    );

    const updateGridState = (newState: GridElementState) => {
        const gridStatesCopy = [...gridStates];
        gridStatesCopy[newState.position.y][newState.position.x] = newState;
        setGridStates(gridStatesCopy);
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
        // console.log("onMouseDown");
    };

    const onMouseUpHandler = (state: GridElementState) => {
        setMouseDown(false);
        // console.log("onMouseUp");
    };

    const onMouseEnterHandler = (state: GridElementState) => {
        if (isMouseDown && !state.marked) {
            setMarked(state);
        }
        // console.log("onMouseEnter");
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

    const calculatePath = () => {
        const graph = generateGridVertices(gridStates, size);
        const dijkstras = new Dijkstras(graph);
        const path = dijkstras.calculateShortestPath("0,0", "15,15");
        console.log("Found path: ", path);

        const newStates: GridElementState[] = [];
        path.forEach((vertex) => {
            const { x, y } = vertex.position;
            newStates.push({ ...gridStates[y][x], type: "path" });
        });
        updateGridStates(newStates);
    };

    return (
        <div className="grid">
            {gridElements.map((row, i) => (
                <div key={"row" + i.toString()} className="grid-row">
                    {row.map((elem, j) => (
                        <div key={"elem" + j.toString()}>{elem}</div>
                    ))}
                </div>
            ))}
            <ControlPanel onClickHandler={calculatePath} />
        </div>
    );
};

export default Grid;
