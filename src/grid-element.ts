import { GridPosition } from "./Pathfinding/grid";

export enum GridElementType {
    DEFAULT,
    START,
    TARGET,
    WALL,
    PATH,
}

export interface GridElementState {
    position: GridPosition;
    type: GridElementType;
    classNames: string[];
}

export const createDefault = (position: GridPosition): GridElementState => {
    return {
        position: position,
        type: GridElementType.DEFAULT,
        classNames: [],
    };
};

export const createWall = (position: GridPosition): GridElementState => {
    return {
        position: position,
        type: GridElementType.WALL,
        classNames: ["wall"],
    };
};

export const createStart = (position: GridPosition): GridElementState => {
    return {
        position: position,
        type: GridElementType.START,
        classNames: ["start"],
    };
};

export const createTarget = (position: GridPosition): GridElementState => {
    return {
        position: position,
        type: GridElementType.TARGET,
        classNames: ["target"],
    };
};

export const createPath = (position: GridPosition): GridElementState => {
    return {
        position: position,
        type: GridElementType.PATH,
        classNames: ["path"],
    };
};
