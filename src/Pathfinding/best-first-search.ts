import Graph from "./graph";
import { GridPosition, ShortestPathFinder } from "../grid";
import PriorityQueue from "./priority-queue/priority-queue";

export interface DistanceVertex {
    position: GridPosition;
    weight: number;
    previous?: string;
}

class BestFirstSearch implements ShortestPathFinder {
    unvisited: PriorityQueue;
    visited: Set<string>;
    previous: Map<string, string>;
    graph: Graph;

    constructor() {
        this.unvisited = new PriorityQueue();
        this.visited = new Set();
        this.graph = new Graph();
        this.previous = new Map();
    }

    private pathToTarget(target: string) {
        const path: DistanceVertex[] = [
            {
                position: this.graph.getVertex(target)!.getPosition(),
                weight: 0,
            },
        ];
        let vertexIterator = this.previous.get(target);
        while (vertexIterator) {
            console.log(vertexIterator);
            const distVert: DistanceVertex = {
                position: this.graph.getVertex(vertexIterator)!.getPosition(),
                weight: 0,
            };
            path.push(distVert);
            vertexIterator = this.previous.get(vertexIterator);
        }
        console.log(path);
        return path;
    }

    private manhattanDistance(from: GridPosition, to: GridPosition) {
        const { x: x0, y: y0 } = from;
        const { x: x1, y: y1 } = to;
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }

    calculateShortestPath(
        start: string,
        target: string,
        graph: Graph
    ): [string[], DistanceVertex[]] {
        this.graph = graph;
        const targetPos = this.graph.getVertex(target)!.getPosition();
        this.unvisited.push({ name: start, cost: 0 });

        let iterations = 0;
        while (!this.unvisited.isEmpty()) {
            iterations++;
            const vertex = this.unvisited.pop();
            if (this.visited.has(vertex.name)) {
                continue;
            }
            this.visited.add(vertex.name);

            if (vertex.name === target) {
                console.log("iterations best-first search: ", iterations);
                return [
                    Array.from(this.visited.keys()),
                    this.pathToTarget(vertex.name),
                ];
            }

            for (const edge of this.graph.getEdges(vertex.name)) {
                const toVertex = this.graph.getVertex(edge.getTo());
                if (!this.visited.has(toVertex!.getName())) {
                    this.previous.set(toVertex!.getName(), vertex.name);
                }
                this.unvisited.push({
                    name: edge.getTo(),
                    cost: this.manhattanDistance(
                        toVertex!.getPosition(),
                        targetPos
                    ),
                });
            }
        }
        console.log("No path found");
        return [[], []];
    }
}

export default BestFirstSearch;
