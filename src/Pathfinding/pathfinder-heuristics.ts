import Heuristics from "./heuristics";
import Pathfinder from "./pathfinder";

class PathfinderHeuristics extends Pathfinder {
    protected heuristics: Heuristics;

    constructor() {
        super();
        this.heuristics = new Heuristics();
    }
}

export default PathfinderHeuristics;
