import React from "react";
import "./../App.css";

interface ControlPanelProps {
    onClickHandler: () => void;
}

const ControlPanel = ({ onClickHandler }: ControlPanelProps) => {
    return (
        <div className="control-panel">
            <button onClick={onClickHandler}>Calculate Path</button>
        </div>
    );
};

export default ControlPanel;
