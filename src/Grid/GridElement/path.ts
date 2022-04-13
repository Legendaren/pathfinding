import { GridPosition } from "../grid";
import { AbstractGridElement } from "./grid-element";

class Path extends AbstractGridElement {
    constructor(position: GridPosition) {
        super(position, "path", "path");
    }
}

export default Path;
