import React from "react";
import "./App.css";
import NavBar from "./navigation/NavBar";
import TrainModel from "./screens/TrainModel";
import Settings from "./screens/Settings";
import Torrents from "./screens/Torrents";
import { Route, Switch } from "react-router-dom";
import ServiceProviders from "./providers/ServiceProviders";
import { MorphwareTheme } from "./providers/MorphwareTheme";
import { Box } from "@material-ui/core";
import WalletInfo from "./components/WalletInfo";

const App = () => {
  return (
    <MorphwareTheme>
      <div className="App">
        <ServiceProviders>
          <NavBar />
          <Box style={{ width: "90vw" }}>
            <Switch>
              <Route exact path="/" component={TrainModel} />
              <Route path="/torrents" component={Torrents} />
              <Route path="/settings" component={Settings} />
            </Switch>
            <WalletInfo />
          </Box>
        </ServiceProviders>
      </div>
    </MorphwareTheme>
  );
};

export default App;
