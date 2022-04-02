import Graph, { DistanceVertex } from "./graph";
import PathConstructor from "./path-constructor";
import PriorityQueue from "./priority-queue/priority-queue";

class Pathfinder {
    protected unvisited: PriorityQueue;
    protected visited: Set<string>;
    protected graph: Graph;
    protected distance: Map<string, DistanceVertex>;
    protected pathConstructor: PathConstructor;

    constructor() {
        this.unvisited = new PriorityQueue();
        this.visited = new Set();
        this.graph = new Graph();
        this.distance = new Map();
        this.pathConstructor = new PathConstructor();
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
