import Graph from "./graph";
import { GridPosition, ShortestPathFinder } from "../Grid/grid";
import Pathfinder from "./pathfinder";

class Dijkstras extends Pathfinder implements ShortestPathFinder {
    calculateShortestPath(
        start: string,
        target: string,
        graph: Graph
    ): [string[], GridPosition[]] {
        this.graph = graph;
        this.initializeDistances();

        const startPos = this.graph.getVertex(start)!.getPosition();
        this.distance.set(start, { position: startPos, weight: 0 });
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
                console.log("iterations dijkstra: ", iterations);
                return this.pathConstructor.generateResult(
                    this.visited,
                    this.distance.get(vertex.name)!
                );
            }

            this.checkNeighbors(vertex.name);
        }
        return this.pathConstructor.generateEmptyResult(this.visited);
    }

    checkNeighbors(fromVertex: string) {
        for (const edge of this.graph.getEdges(fromVertex)) {
            const newWeight =
                this.distance.get(fromVertex)!.weight + edge.getWeight();
            const oldWeight = this.distance.get(edge.getTo())!.weight;

            if (newWeight < oldWeight) {
                this.distance.set(edge.getTo(), {
                    position: this.graph.getVertex(edge.getTo())!.getPosition(),
                    weight: newWeight,
                    previous: this.distance.get(fromVertex),
                });
            }

            this.unvisited.push({
                name: edge.getTo(),
                cost: newWeight,
            });
        }
    }
}

export default Dijkstras;
