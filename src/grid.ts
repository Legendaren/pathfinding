import {
    GridElementFactory,
    GridElementState,
    GridElementType,
} from "./grid-element";
import { DistanceVertex } from "./Pathfinding/astar";
import Graph, { Edge, Vertex } from "./Pathfinding/graph";

export interface GridPosition {
    x: number;
    y: number;
}

export interface GridSize {
    rows: number;
    columns: number;
}

type Visited = string[];
type ShortestPath = DistanceVertex[];

export interface ShortestPathFinder {
    calculateShortestPath: (
        start: string,
        target: string,
        graph: Graph
    ) => [Visited, ShortestPath];
}

export const inBounds = (pos: GridPosition, gridSize: GridSize) => {
    const xInBounds = pos.x >= 0 && pos.x < gridSize.columns;
    const yInBounds = pos.y >= 0 && pos.y < gridSize.rows;
    return xInBounds && yInBounds;
};

export const adjacentVertexPositions = (pos: GridPosition): GridPosition[] => {
    const left: GridPosition = { x: pos.x - 1, y: pos.y };
    const right: GridPosition = { x: pos.x + 1, y: pos.y };
    const up: GridPosition = { x: pos.x, y: pos.y - 1 };
    const down: GridPosition = { x: pos.x, y: pos.y + 1 };
    return [right, down, up, left];
};

export const posToString = (pos: GridPosition): string => {
    return `${pos.x},${pos.y}`;
};

export const stringToPos = (s: string): GridPosition => {
    const [x, y] = s.split(",");
    return { x: parseInt(x), y: parseInt(y) };
};

export const delay = (timeInMs: number) => {
    return new Promise((resolve) => setTimeout(resolve, timeInMs));
};

export const initGridStates = (
    size: GridSize,
    start: GridPosition,
    target: GridPosition
): GridElementState[][] => {
    const gridStates: GridElementState[][] = [];
    for (let i = 0; i < size.rows; i++) {
        const row: GridElementState[] = [];
        for (let j = 0; j < size.columns; j++) {
            const position = { x: j, y: i };
            row.push(GridElementFactory.createDefault(position));
        }
        gridStates.push(row);
    }

    // Set start vertex
    gridStates[start.y][start.x] = GridElementFactory.createStart(start);
    // Set target vertex
    gridStates[target.y][target.x] = GridElementFactory.createTarget(target);

    return gridStates;
};

export const generateGraph = (
    states: GridElementState[][],
    gridSize: GridSize
): Graph => {
    const graph = new Graph();

    for (let i = 0; i < gridSize.rows; i++) {
        for (let j = 0; j < gridSize.columns; j++) {
            if (states[i][j].type === GridElementType.WALL) continue;

            const pos: GridPosition = { x: j, y: i };

            const vertex = new Vertex(posToString(pos), pos);
            graph.addVertex(vertex);

            const adjValidVertices = adjacentVertexPositions(pos).filter(
                (p) =>
                    inBounds(p, gridSize) &&
                    states[p.y][p.x].type !== GridElementType.WALL
            );

            for (const vertexPos of adjValidVertices) {
                graph.addEdge(
                    vertex.getName(),
                    new Edge(vertex.getName(), posToString(vertexPos), 1)
                );
            }
        }
    }
    return graph;
};
