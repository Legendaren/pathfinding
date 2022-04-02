import React from "react";
import "./App.css";
import Grid from "./Components/Grid";
import Header from "./Components/Header";
import { Helmet } from "react-helmet";

function App() {
    return (
        <div>
            <Helmet>
                <title>Pathfinding</title>
                <meta name="description" content="Pathfinding Visualizer" />
            </Helmet>
            <Header />
            <Grid
                size={{ rows: 25, columns: 40 }}
                start={{ x: 4, y: 4 }}
                target={{ x: 15, y: 15 }}
            />
        </div>
    );
}

export default App;
