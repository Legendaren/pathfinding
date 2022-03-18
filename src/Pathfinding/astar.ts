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
    heuristic: Map<string, DistanceVertex>;

    constructor() {
        this.unvisited = new PriorityQueue();
        this.visited = new Set();
        this.graph = new Graph();
        this.distance = new Map();
        this.heuristic = new Map();
    }

    private pathToTarget(target: string) {
        const path: DistanceVertex[] = [];
        let vertexIterator: DistanceVertex | undefined =
            this.distance.get(target);
        while (vertexIterator) {
            path.push(vertexIterator);
            vertexIterator = this.distance.get(vertexIterator.previous || "");
        }
        return path;
    }

    private manhattanDistance(from: GridPosition, to: GridPosition) {
        const { x: x0, y: y0 } = from;
        const { x: x1, y: y1 } = to;
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }

    calculateShortestPath(start: string, target: string, graph: Graph) {
        this.graph = graph;
        this.graph.getVertices().forEach((vertexName) => {
            this.distance.set(vertexName, {
                position: this.graph.getVertex(vertexName)!.getPosition(),
                weight: Infinity,
            });
        });
        const distVertex = this.distance.get(start);
        if (!distVertex) {
            throw new Error("Start vertex not found");
        }
        const startPos = this.graph.getVertex(start)!.getPosition();
        const targetPos = this.graph.getVertex(target)!.getPosition();
        this.distance.set(start, { position: startPos, weight: 0 });
        this.heuristic.set(start, {
            position: startPos,
            weight: this.manhattanDistance(startPos, targetPos),
        });
        this.unvisited.push({
            name: start,
            cost: this.manhattanDistance(startPos, targetPos),
        });

        let iterations = 0;
        while (!this.unvisited.isEmpty()) {
            iterations++;
            const vertex = this.unvisited.pop();

            if (this.visited.has(vertex.name)) {
                continue;
            }
            this.visited.add(vertex.name);

            if (vertex.name === target) {
                console.log(this.visited);
                console.log("iterations astar: ", iterations);
                console.log(this.heuristic);
                return this.pathToTarget(vertex.name);
            }

            for (const edge of this.graph.getEdges(vertex.name)) {
                const toPos = this.graph.getVertex(edge.getTo())!.getPosition();
                const newWeight =
                    this.distance.get(vertex.name)!.weight + edge.getWeight();
                const oldWeight = this.distance.get(edge.getTo())!.weight;
                const newWeightHeuristic =
                    newWeight + this.manhattanDistance(toPos, targetPos);

                if (newWeight < oldWeight) {
                    this.distance.set(edge.getTo(), {
                        position: toPos,
                        weight: newWeight,
                        previous: vertex.name,
                    });
                    this.heuristic.set(edge.getTo(), {
                        position: toPos,
                        weight: newWeightHeuristic,
                        previous: vertex.name,
                    });
                }

                this.unvisited.push({
                    name: edge.getTo(),
                    cost: newWeightHeuristic,
                });
            }
        }
        console.log("No path found");
        return [];
    }
}

export default AStar;
