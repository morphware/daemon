import React, { useContext } from "react";
import {
  Button,
  createStyles,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import { DaemonContext } from "../providers/ServiceProviders";
import { ThemeProps } from "../providers/MorphwareTheme";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    root: {
      height: "50px",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      padding: "5px",
    },
    trainModelText: {
      color: theme.text?.main,
    },
  })
);

const TrainModelTopBar = () => {
  const theme = useTheme();
  const classes = styles(theme);
  const daemonService = useContext(DaemonContext);

  return (
    <div className={classes.root}>
      <Typography
        variant="h6"
        style={{ height: "100%", display: "flex", alignItems: "center" }}
        className={classes.trainModelText}
      >
        Dont have a model? Write one up now
      </Typography>
      <Button
        style={{ height: "100%" }}
        onClick={daemonService.startJupyterLab}
      >
        <Typography
          style={{ borderBottom: "1px solid grey" }}
          variant="body1"
          className={classes.trainModelText}
        >
          Start JupyterLab™
        </Typography>
      </Button>
    </div>
  );
};

export default TrainModelTopBar;
