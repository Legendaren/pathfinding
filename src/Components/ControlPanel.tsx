import React, { useState } from "react";
import { ShortestPathFinder } from "../grid";
import AStar from "../Pathfinding/astar";
import BestFirstSearch from "../Pathfinding/best-first-search";
import DepthFirstSearch from "../Pathfinding/depth-first-search";
import Dijkstras from "../Pathfinding/dijkstras";
import "./../App.css";

interface ControlPanelProps {
    calculatePath: (pathfindingFunc: ShortestPathFinder) => void;
    clearWalls: () => void;
    clearPath: () => void;
    cancelCalculation: () => void;
    isCalculatingPath: boolean;
    isGridReset: boolean;
}

type AlgorithmName =
    | "Dijkstra's"
    | "A*"
    | "Best-First Search"
    | "Depth-First Search";

const ControlPanel = ({
    calculatePath,
    clearWalls,
    clearPath,
    cancelCalculation,
    isGridReset,
    isCalculatingPath,
}: ControlPanelProps) => {
    const [pathfindingFuncName, setPathfindingFuncName] = useState<
        AlgorithmName | undefined
    >(undefined);

    const nameToFunc = new Map<AlgorithmName, ShortestPathFinder>([
        ["A*", new AStar()],
        ["Dijkstra's", new Dijkstras()],
        ["Best-First Search", new BestFirstSearch()],
        ["Depth-First Search", new DepthFirstSearch()],
    ]);

    const calculateOnClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const pathfindingFunc = nameToFunc.get(pathfindingFuncName!);
        if (pathfindingFunc) calculatePath(pathfindingFunc);
        else throw Error("Pathfinding function not found");
    };

    return (
        <div className="control-panel">
            <select
                onChange={(e) => {
                    setPathfindingFuncName(e.target.value as AlgorithmName);
                }}
            >
                <option disabled={pathfindingFuncName !== undefined}>
                    -- Select algorithm --
                </option>
                {Array.from(nameToFunc.keys()).map((name, i) => (
                    <option value={name} key={i}>
                        {name}
                    </option>
                ))}
            </select>
            {isCalculatingPath ? (
                <button onClick={cancelCalculation} className="button">
                    Cancel Pathfinding
                </button>
            ) : (
                <button
                    onClick={calculateOnClick}
                    disabled={pathfindingFuncName === undefined || !isGridReset}
                    className="button"
                >
                    Calculate Path
                </button>
            )}
            <button
                onClick={clearWalls}
                className="button"
                disabled={isCalculatingPath || !isGridReset}
            >
                Clear Walls
            </button>
            <button
                onClick={clearPath}
                className="button"
                disabled={isCalculatingPath}
            >
                Clear Path
            </button>
        </div>
    );
};

export default ControlPanel;
