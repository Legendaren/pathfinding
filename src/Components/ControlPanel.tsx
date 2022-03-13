import { stringify } from "querystring";
import React, { useState } from "react";
import "./../App.css";

interface ControlPanelProps {
    calculatePathDijkstra: () => void;
    calculatePathAStar: () => void;
    reset: () => void;
}

const ControlPanel = ({
    calculatePathDijkstra,
    calculatePathAStar,
    reset,
}: ControlPanelProps) => {
    const [pathfindingFuncName, setPathfindingFuncName] = useState("Dijkstras");

    const nameToFunc = new Map<string, () => void>();
    nameToFunc.set("Dijkstras", calculatePathDijkstra);
    nameToFunc.set("A*", calculatePathAStar);

    return (
        <div className="control-panel">
            <select onChange={(e) => setPathfindingFuncName(e.target.value)}>
                <option value="Dijkstras">Dijkstras</option>
                <option value="A*">A*</option>
            </select>
            <button
                onClick={() => nameToFunc.get(pathfindingFuncName)!()}
                className="button"
            >
                Calculate Path
            </button>
            <button onClick={reset} className="button">
                Reset
            </button>
        </div>
    );
};

export default ControlPanel;
