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
    animationDelay: number;
}

export class GridElementFactory {
    private static createGridElement(
        position: GridPosition,
        type: GridElementType
    ) {
        return {
            position: position,
            type: type,
            animationDelay: 50,
        };
    }

    static createWithAnimationDelay(
        state: GridElementState,
        animDelay: number
    ): GridElementState {
        return {
            ...state,
            animationDelay: animDelay,
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
