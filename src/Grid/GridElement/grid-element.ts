import { GridPosition } from "../grid";

export type SetElementFunc = (
    pos: GridPosition,
    state: GridElementState
) => void;
export type MouseHandler = (
    setElement: SetElementFunc,
    refStates: RefStates
) => void;
export type ElementType = "walkable" | "obstacle" | "path";

export interface RefStates {
    startRef: React.MutableRefObject<GridPosition>;
    targetRef: React.MutableRefObject<GridPosition>;
    draggedElementRef: React.MutableRefObject<Draggable | undefined>;
}

export interface GridElementState {
    readonly className: string;
    position: GridPosition;
    type: ElementType;
    onMouseDownLeft: MouseHandler;
    onMouseDownRight: MouseHandler;
    onMouseEnterLeft: MouseHandler;
    onMouseEnterRight: MouseHandler;
}

export interface Draggable extends GridElementState {
    drag: (
        toPos: GridPosition,
        setElement: SetElementFunc,
        refStates: RefStates
    ) => void;
}

export abstract class AbstractGridElement implements GridElementState {
    position: GridPosition;
    className: string;
    type: ElementType;
    constructor(position: GridPosition, className: string, type: ElementType) {
        this.position = position;
        this.className = className;
        this.type = type;
    }

    onMouseDownLeft(setElement: SetElementFunc, refStates: RefStates) {}
    onMouseDownRight(setElement: SetElementFunc, refStates: RefStates) {}
    onMouseEnterLeft(setElement: SetElementFunc, refStates: RefStates) {}
    onMouseEnterRight(setElement: SetElementFunc, refStates: RefStates) {}
}
