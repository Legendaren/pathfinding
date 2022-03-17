import React, { useState } from "react";
import "./../App.css";

interface ControlPanelProps {
    calculatePathDijkstra: () => void;
    calculatePathAStar: () => void;
    reset: () => void;
    resetCalcPath: () => void;
}

const ControlPanel = ({
    calculatePathDijkstra,
    calculatePathAStar,
    reset,
    resetCalcPath,
}: ControlPanelProps) => {
    const [pathfindingFuncName, setPathfindingFuncName] = useState("Dijkstras");

    const nameToFunc: Map<string, () => void> = new Map();
    nameToFunc.set("Dijkstras", calculatePathDijkstra);
    nameToFunc.set("A*", calculatePathAStar);

    return (
        <div className="control-panel">
            <select onChange={(e) => setPathfindingFuncName(e.target.value)}>
                {Array.from(nameToFunc.entries()).map(([name, func], i) => (
                    <option value={name} key={i}>
                        {name}
                    </option>
                ))}
            </select>
            <button
                onClick={() => {
                    const pathfindingFunc = nameToFunc.get(pathfindingFuncName);
                    if (pathfindingFunc) pathfindingFunc();
                    else calculatePathDijkstra();
                }}
                className="button"
            >
                Calculate Path
            </button>
            <button onClick={reset} className="button">
                Reset
            </button>
            <button onClick={resetCalcPath} className="button">
                Reset Path
            </button>
        </div>
    );
};

export default ControlPanel;
