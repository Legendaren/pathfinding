import { GridPosition } from "../grid";
import { AbstractGridElement, RefStates, SetElementFunc } from "./grid-element";
import Wall from "./wall";

class Default extends AbstractGridElement {
    constructor(position: GridPosition) {
        super(position, "", "walkable");
    }

    onMouseDownLeft(setElement: SetElementFunc, refStates: RefStates) {
        setElement(this.position, new Wall(this.position));
    }

    onMouseEnterLeft(setElement: SetElementFunc, refStates: RefStates): void {
        if (refStates.draggedElementRef.current) {
            this.handleDrag(setElement, refStates);
            return;
        }
        setElement(this.position, new Wall(this.position));
    }

    private handleDrag(setElement: SetElementFunc, refStates: RefStates) {
        const draggableElement = refStates.draggedElementRef.current;
        if (draggableElement) {
            draggableElement.drag(this.position, setElement, refStates);
        }
    }
}

export default Default;
