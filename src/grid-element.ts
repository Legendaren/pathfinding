import { GridPosition } from "./grid";

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
}

export class GridElementFactory {
    private static createGridElement(
        position: GridPosition,
        type: GridElementType
    ) {
        return {
            position: position,
            type: type,
        };
    }

    static createDefault(position: GridPosition): GridElementState {
        return this.createGridElement(position, GridElementType.DEFAULT);
    }

    static createWall(position: GridPosition): GridElementState {
        return this.createGridElement(position, GridElementType.WALL);
    }

    static createStart(position: GridPosition): GridElementState {
        return this.createGridElement(position, GridElementType.START);
    }

    static createTarget(position: GridPosition): GridElementState {
        return this.createGridElement(position, GridElementType.TARGET);
    }

    static createPath(position: GridPosition): GridElementState {
        return this.createGridElement(position, GridElementType.PATH);
    }
}
