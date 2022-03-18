import React, { useEffect, useState } from "react";
import { ShortestPathFinder } from "../grid";
import AStar from "../Pathfinding/astar";
import Dijkstras from "../Pathfinding/dijkstras";
import Graph from "../Pathfinding/graph";
import "./../App.css";

interface ControlPanelProps {
    calculatePath: (pathfindingFunc: ShortestPathFinder) => void;
    clearWalls: () => void;
    clearPath: () => void;
}

const ControlPanel = ({
    calculatePath,
    clearWalls,
    clearPath,
}: ControlPanelProps) => {
    const [pathfindingFuncName, setPathfindingFuncName] =
        useState("Dijkstra's");

    const nameToFunc = new Map<string, ShortestPathFinder>([
        ["Dijkstra's", new Dijkstras()],
        ["A*", new AStar()],
    ]);

    const calculateOnClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
        const pathfindingFunc = nameToFunc.get(pathfindingFuncName);
        if (pathfindingFunc) calculatePath(pathfindingFunc);
        else console.log("Pathfinding function not found");
    };

    return (
        <div className="control-panel">
            <select onChange={(e) => setPathfindingFuncName(e.target.value)}>
                {Array.from(nameToFunc.keys()).map((name, i) => (
                    <option value={name} key={i}>
                        {name}
                    </option>
                ))}
            </select>
            <button onClick={calculateOnClick} className="button">
                Calculate Path
            </button>
            <button onClick={clearWalls} className="button">
                Clear Walls
            </button>
            <button onClick={clearPath} className="button">
                Clear Path
            </button>
        </div>
    );
};

export default ControlPanel;
