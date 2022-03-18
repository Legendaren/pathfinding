import React from "react";
import "./App.css";
import Grid from "./Components/Grid";

function App() {
    return (
        <div>
            <Grid
                size={{ rows: 40, columns: 40 }}
                start={{ x: 4, y: 4 }}
                target={{ x: 15, y: 15 }}
            />
        </div>
    );
}

export default App;
