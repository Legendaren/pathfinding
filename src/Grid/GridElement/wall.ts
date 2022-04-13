import { GridPosition } from "../grid";
import Default from "./default";
import { AbstractGridElement, RefStates, SetElementFunc } from "./grid-element";

class Wall extends AbstractGridElement {
    constructor(position: GridPosition) {
        super(position, "wall", "obstacle");
    }

    onMouseDownRight(setElement: SetElementFunc, refStates: RefStates): void {
        setElement(this.position, new Default(this.position));
    }

    onMouseEnterRight(setElement: SetElementFunc, refStates: RefStates): void {
        setElement(this.position, new Default(this.position));
    }
}

export default Wall;
