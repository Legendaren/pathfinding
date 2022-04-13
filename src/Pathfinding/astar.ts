import Graph from "./graph";
import { GridPosition, ShortestPathFinder } from "../Grid/grid";
import Heuristics from "./heuristics";
import Pathfinder from "./pathfinder";

class AStar extends Pathfinder implements ShortestPathFinder {
    calculateShortestPath(
        start: string,
        target: string,
        graph: Graph
    ): [string[], GridPosition[]] {
        this.graph = graph;
        this.initializeDistances();

        const startPos = this.graph.getVertex(start)!.getPosition();
        const targetPos = this.graph.getVertex(target)!.getPosition();

        this.distance.set(start, { position: startPos, weight: 0 });
        this.unvisited.push({
            name: start,
            cost: Heuristics.manhattanDistance(startPos, targetPos),
        });

        let iterations = 0;
        while (!this.unvisited.isEmpty()) {
            iterations++;
            const fromVertex = this.unvisited.pop();
            if (this.visited.has(fromVertex.name)) {
                continue;
            }
            this.visited.add(fromVertex.name);

            if (fromVertex.name === target) {
                console.log("iterations astar: ", iterations);
                return this.pathConstructor.generateResult(
                    this.visited,
                    this.distance.get(fromVertex.name)!
                );
            }

            this.checkNeighbors(fromVertex.name, targetPos);
        }

        return this.pathConstructor.generateEmptyResult(this.visited);
    }

    checkNeighbors(fromVertex: string, target: GridPosition) {
        for (const edge of this.graph.getEdges(fromVertex)) {
            const toVertex = this.graph.getVertex(edge.getTo())!;
            const newWeight =
                this.distance.get(fromVertex)!.weight + edge.getWeight();
            const oldWeight = this.distance.get(toVertex.getName())!.weight;

            if (newWeight < oldWeight) {
                this.distance.set(edge.getTo(), {
                    position: toVertex.getPosition(),
                    weight: newWeight,
                    previous: this.distance.get(fromVertex),
                });
            }

            const heuristic = Heuristics.manhattanDistance(
                toVertex.getPosition(),
                target
            );
            this.unvisited.push({
                name: edge.getTo(),
                cost: newWeight + heuristic,
            });
        }
    }
}

export default AStar;
