import { GridPosition } from "../grid";
import Default from "./default";
import {
    AbstractGridElement,
    Draggable,
    RefStates,
    SetElementFunc,
} from "./grid-element";

class Target extends AbstractGridElement implements Draggable {
    constructor(position: GridPosition) {
        super(position, "target", "walkable");
    }

    drag(
        toPos: GridPosition,
        setElement: SetElementFunc,
        refStates: RefStates
    ) {
        const newElem = new Target(toPos);
        setElement(this.position, new Default(this.position));
        setElement(toPos, newElem);
        refStates.draggedElementRef.current = newElem;
        refStates.targetRef.current = toPos;
    }

    onMouseDownLeft(setElement: SetElementFunc, refStates: RefStates): void {
        refStates.draggedElementRef.current = this;
    }
}

export default Target;
