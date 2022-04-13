import { GridPosition } from "../grid";
import { AbstractGridElement } from "./grid-element";

class Visited extends AbstractGridElement {
    constructor(position: GridPosition) {
        super(position, "visited", "path");
    }
}

export default Visited;
