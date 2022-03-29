import { GridPosition } from "../grid";

class Heuristics {
    public manhattanDistance(from: GridPosition, to: GridPosition) {
        const { x: x0, y: y0 } = from;
        const { x: x1, y: y1 } = to;
        return Math.abs(x1 - x0) + Math.abs(y1 - y0);
    }
}

export default Heuristics;
