import React from "react";
import "./App.css";
import NavBar from "./navigation/NavBar";
import TrainModel from "./screens/TrainModel";
import Settings from "./screens/Settings";
import Torrents from "./screens/Torrents";
import { Route, Switch } from "react-router-dom";
import ServiceProviders from "./providers/ServiceProviders";
import { MorphwareTheme } from "./providers/MorphwareTheme";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import conf from "../../daemon";

const App = () => {
  return (
    <MorphwareTheme>
      <div className="App">
        <ServiceProviders>
          <NavBar />
          <Switch>
            <Route exact path="/" component={TrainModel} />
            <Route path="/torrents" component={Torrents} />
            <Route path="/settings" component={Settings} />
          </Switch>
        </ServiceProviders>
      </div>
    </MorphwareTheme>
  );
};

export default App;
