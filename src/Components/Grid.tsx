import React, { useState } from "react";
import Dijkstras from "../Pathfinding/dijkstras";
import Graph, { Edge, Vertex } from "../Pathfinding/graph";
import "./../App.css";
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

const generateGridVertices = (gridSize: GridSize): Graph => {
    const graph = new Graph();

    const vertices: Vertex[][] = Array(gridSize.rows)
        .fill(0)
        .map((row) => Array(gridSize.columns));
    for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.columns; j++) {
            const pos = { x: j, y: i };
            const vertex = new Vertex(posToString(pos));
            vertices[i][j] = vertex;
            graph.addVertex(vertex.getName());
        }
    }

    for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.columns; j++) {
            const pos = { x: j, y: i };
            const vertex = vertices[i][j];
            const adjacentVertices = adjacentNodePositions(pos)
                .filter((p) => inBounds(p, gridSize))
                .map((p) => ({ toVertex: posToString(p), weight: 1 }));

            adjacentVertices.forEach((e) => {
                const edge = new Edge(vertex.getName(), e.toVertex, 1);
                graph.addEdge(vertex.getName(), edge);
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

    const graph = generateGridVertices(size);
    const dijkstras = new Dijkstras(graph);
    const path = dijkstras.calculateShortestPath("0,0", "2,2");
    console.log("Found path: ", path);

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
