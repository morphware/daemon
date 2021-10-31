import React, { useContext } from "react";
import {
  Button,
  createStyles,
  makeStyles,
  Typography,
} from "@material-ui/core";
import { DaemonContext } from "../providers/ServiceProviders";

const styles = makeStyles(() =>
  createStyles({
    root: {
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "5px",
    },
  })
);

const TrainModelTopBar = () => {
  const classes = styles();
  const daemonService = useContext(DaemonContext);

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        style={{ height: "100%", display: "flex", alignItems: "center" }}
      >
        Dont have a model? Write one up now
      </Typography>
      <Button
        style={{ height: "100%" }}
        onClick={daemonService.startJupyterLab}
      >
        <Typography style={{ borderBottom: "1px solid grey" }} variant="body1">
          Start JupyterLab™
        </Typography>
      </Button>
    </div>
  );
};

export default TrainModelTopBar;
