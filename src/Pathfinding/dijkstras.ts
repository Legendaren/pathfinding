import Graph from "./graph";
import { GridPosition } from "./grid";
import PriorityQueue from "./priority-queue/priority-queue";

export interface DistanceVertex {
    position: GridPosition;
    weight: number;
    previous?: string;
}

class Dijkstras {
    unvisited: PriorityQueue;
    visited: Set<string>;
    graph: Graph;
    distance: Map<string, DistanceVertex>;

    constructor(graph: Graph) {
        this.unvisited = new PriorityQueue();
        this.visited = new Set();
        this.graph = graph;
        this.distance = new Map();
        this.graph.getVertices().forEach((vertexName) => {
            this.distance.set(vertexName, {
                position: this.graph.getVertex(vertexName)!.getPosition(),
                weight: Infinity,
            });
        });
    }

    private pathToTarget(target: string) {
        const path: DistanceVertex[] = [];
        let vertexIterator: DistanceVertex | undefined =
            this.distance.get(target);
        while (vertexIterator) {
            path.push(vertexIterator);
            vertexIterator = this.distance.get(vertexIterator.previous || "");
        }
        // console.log("distance:", this.distance);
        return path;
    }

    calculateShortestPath(start: string, target: string) {
        const distVertex = this.distance.get(start);
        if (!distVertex) {
            throw new Error("Start vertex not found");
        }
        const pos = this.graph.getVertex(start)!.getPosition();
        this.distance.set(start, { position: pos, weight: 0 });
        this.unvisited.push({ name: start, cost: 0 });

        while (!this.unvisited.isEmpty()) {
            const vertex = this.unvisited.pop();

            if (this.visited.has(vertex.name)) {
                continue;
            }
            this.visited.add(vertex.name);

            if (vertex.name === target) {
                console.log(this.visited);
                return this.pathToTarget(vertex.name);
            }

            for (const edge of this.graph.getEdges(vertex.name)) {
                const newWeight =
                    this.distance.get(vertex.name)!.weight + edge.getWeight();
                const oldWeight = this.distance.get(edge.getTo())!.weight;

                if (newWeight < oldWeight) {
                    this.distance.set(edge.getTo(), {
                        position: this.graph
                            .getVertex(edge.getTo())!
                            .getPosition(),
                        weight: newWeight,
                        previous: vertex.name,
                    });
                }

                this.unvisited.push({
                    name: edge.getTo(),
                    cost: vertex.cost + newWeight,
                });
            }
        }
        console.log("No path found");
        return [];
    }
}

export default Dijkstras;
