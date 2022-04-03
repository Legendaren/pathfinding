import Graph from "./graph";
import { GridPosition, ShortestPathFinder } from "../grid";
import Heuristics from "./heuristics";
import Pathfinder from "./pathfinder";

class BestFirstSearch extends Pathfinder implements ShortestPathFinder {
    calculateShortestPath(
        start: string,
        target: string,
        graph: Graph
    ): [string[], GridPosition[]] {
        this.graph = graph;
        this.initializeDistances();
        const targetPos = this.graph.getVertex(target)!.getPosition();
        this.distance.set(start, {
            position: graph.getVertex(start)!.getPosition(),
            weight: 0,
            previous: undefined,
        });
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
                return this.pathConstructor.generateResult(
                    this.visited,
                    this.distance.get(vertex.name)!
                );
            }

            for (const edge of this.graph.getEdges(vertex.name)) {
                const toVertex = this.graph.getVertex(edge.getTo());
                const oldWeight = this.distance.get(edge.getTo())!.weight;
                const newWeight =
                    this.distance.get(vertex.name)!.weight + edge.getWeight();

                if (newWeight < oldWeight) {
                    this.distance.set(edge.getTo(), {
                        position: toVertex!.getPosition(),
                        weight: newWeight,
                        previous: this.distance.get(vertex.name),
                    });
                }

                this.unvisited.push({
                    name: edge.getTo(),
                    cost: Heuristics.manhattanDistance(
                        toVertex!.getPosition(),
                        targetPos
                    ),
                });
            }
        }

        return this.pathConstructor.generateEmptyResult(this.visited);
    }
}

export default BestFirstSearch;
