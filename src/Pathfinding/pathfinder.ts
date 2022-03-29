import Graph, { DistanceVertex } from "./graph";
import PriorityQueue from "./priority-queue/priority-queue";

class Pathfinder {
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

    protected initializeDistances() {
        this.graph.getVertices().forEach((vertexName) => {
            this.distance.set(vertexName, {
                position: this.graph.getVertex(vertexName)!.getPosition(),
                weight: Infinity,
            });
        });
    }
}

export default Pathfinder;
