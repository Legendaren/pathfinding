import Graph from "./graph";
import { GridPosition, ShortestPathFinder } from "../grid";
import PriorityQueue from "./priority-queue/priority-queue";

export interface DistanceVertex {
    position: GridPosition;
    weight: number;
    previous?: string;
}

class AStar implements ShortestPathFinder {
    unvisited: PriorityQueue;
    visited: Set<string>;
    graph: Graph;
    distance: Map<string, DistanceVertex>;

    constructor() {
        this.unvisited = new PriorityQueue();
        this.visited = new Set();
        this.graph = new Graph();
        this.distance = new Map();
    }

    private pathToTarget(target: string): DistanceVertex[] {
        const path: DistanceVertex[] = [];
        let vertexIterator: DistanceVertex | undefined =
            this.distance.get(target);
        while (vertexIterator) {
            path.push(vertexIterator);
            vertexIterator = this.distance.get(vertexIterator.previous!);
        }
        return path;
    }

    private manhattanDistance(from: GridPosition, to: GridPosition) {
        const { x: x0, y: y0 } = from;
        const { x: x1, y: y1 } = to;
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }

    private initializeDistances() {
        this.graph.getVertices().forEach((vertexName) => {
            this.distance.set(vertexName, {
                position: this.graph.getVertex(vertexName)!.getPosition(),
                weight: Infinity,
            });
        });
    }

    calculateShortestPath(
        start: string,
        target: string,
        graph: Graph
    ): [string[], DistanceVertex[]] {
        this.graph = graph;
        this.initializeDistances();

        const startPos = this.graph.getVertex(start)!.getPosition();
        const targetPos = this.graph.getVertex(target)!.getPosition();

        this.distance.set(start, { position: startPos, weight: 0 });
        this.unvisited.push({
            name: start,
            cost: this.manhattanDistance(startPos, targetPos),
        });

        let iterations = 0;
        while (!this.unvisited.isEmpty()) {
            iterations++;
            const fromVertex = this.unvisited.pop();
            this.visited.add(fromVertex.name);

            if (fromVertex.name === target) {
                console.log("iterations astar: ", iterations);
                return [
                    Array.from(this.visited),
                    this.pathToTarget(fromVertex.name),
                ];
            }

            for (const edge of this.graph.getEdges(fromVertex.name)) {
                const toVertex = this.graph.getVertex(edge.getTo())!;
                const newWeight =
                    this.distance.get(fromVertex.name)!.weight +
                    edge.getWeight();
                const oldWeight = this.distance.get(toVertex.getName())!.weight;
                const heuristic = this.manhattanDistance(
                    toVertex.getPosition(),
                    targetPos
                );

                if (newWeight < oldWeight) {
                    this.distance.set(edge.getTo(), {
                        position: toVertex.getPosition(),
                        weight: newWeight,
                        previous: fromVertex.name,
                    });
                }

                if (!this.visited.has(toVertex.getName())) {
                    this.unvisited.push({
                        name: edge.getTo(),
                        cost: newWeight + heuristic,
                    });
                }
            }
        }
        console.log("No path found");
        return [[], []];
    }
}

export default AStar;
