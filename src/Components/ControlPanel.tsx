import React from "react";
import "./../App.css";

interface ControlPanelProps {
    calculatePath: () => void;
    reset: () => void;
}

const ControlPanel = ({ calculatePath, reset }: ControlPanelProps) => {
    return (
        <div className="control-panel">
            <button onClick={calculatePath} className="button">
                Calculate Path
            </button>
            <button onClick={reset} className="button">
                Reset
            </button>
        </div>
    );
};

export default ControlPanel;
