import { GridPosition } from "../Grid/grid";
import { DistanceVertex } from "./graph";

class PathConstructor {
    public pathToTarget(distanceVertex: DistanceVertex): GridPosition[] {
        const path: GridPosition[] = [];
        let vertexIterator: DistanceVertex | undefined = distanceVertex;
        while (vertexIterator) {
            path.push(vertexIterator.position);
            vertexIterator = vertexIterator.previous;
        }
        return path;
    }

    public generateResult(
        visited: Set<string>,
        distanceVertex: DistanceVertex
    ): [string[], GridPosition[]] {
        return [Array.from(visited), this.pathToTarget(distanceVertex)];
    }

    public generateEmptyResult(
        visited: Set<string>
    ): [string[], GridPosition[]] {
        return [Array.from(visited), []];
    }
}

export default PathConstructor;
