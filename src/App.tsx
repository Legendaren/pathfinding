import React from "react";
import "./App.css";
import ControlPanel from "./Components/ControlPanel";
import Grid from "./Components/Grid";

function App() {
    return (
        <div>
            <Grid
                size={{ rows: 20, columns: 20 }}
                start={{ x: 4, y: 4 }}
                target={{ x: 15, y: 15 }}
            />
            <ControlPanel />
        </div>
    );
}

export default App;
