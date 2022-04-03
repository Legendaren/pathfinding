import Graph, { DistanceVertex } from "./graph";
import { GridPosition, ShortestPathFinder, stringToPos } from "../grid";
import Pathfinder from "./pathfinder";

class DepthFirstSearch extends Pathfinder implements ShortestPathFinder {
    calculateShortestPath(
        start: string,
        target: string,
        graph: Graph
    ): [string[], GridPosition[]] {
        this.graph = graph;
        this.initializeDistances();

        // [visited, path]
        const stack: [Set<string>, string[]][] = [[new Set([start]), [start]]];
        let iterations = 0;
        while (stack.length > 0) {
            iterations++;
            const [visited, path] = stack.pop()!;
            const lastPathVertex = path[path.length - 1];

            if (lastPathVertex === target) {
                return [
                    Array.from(visited),
                    path.map((v) => stringToPos(v)).reverse(),
                ];
            }

            for (const edge of this.graph.getEdges(lastPathVertex)) {
                if (visited.has(edge.getTo())) {
                    continue;
                }
                const newPath = [...path, edge.getTo()];
                const newVisited = new Set(visited);
                newVisited.add(edge.getTo());
                stack.push([newVisited, newPath]);
            }
        }

        return this.pathConstructor.generateEmptyResult(this.visited);
    }
}

export default DepthFirstSearch;
