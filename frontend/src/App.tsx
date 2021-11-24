import React from "react";
import NavBar from "./navigation/NavBar";
import TrainModel from "./screens/TrainModel";
import Settings from "./screens/Settings";
import Torrents from "./screens/Torrents";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import Home from "./screens/Home";
import { Route, Switch } from "react-router-dom";
import ServiceProviders from "./providers/ServiceProviders";
import { MorphwareTheme } from "./providers/MorphwareTheme";
import { Box, createStyles, makeStyles } from "@material-ui/core";
import WalletInfo from "./components/WalletFooterInfo";
import Auctions from "./screens/Auctions";

const styles = makeStyles(() =>
  createStyles({
    root: {
      display: "flex",
      textAlign: "center",
      height: "100vh",
      width: "100vw",
      backgroundColor: "#f7f9fa",
    },
  })
);

const App = () => {
  const classes = styles();

  return (
    <MorphwareTheme>
      <div className={classes.root}>
        <ServiceProviders>
          <NavBar />
          <Box style={{ width: "90vw" }}>
            <Switch>
              <Route exact path="/" component={Auctions} />
              {/* <Route path="/auctions" component={Auctions} /> */}
              <Route path="/train" component={TrainModel} />
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
