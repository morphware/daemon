import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import { theme } from "../providers/MorphwareTheme";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
    },
  })
);

const Settings = () => {
  const classes = styles();
  return <div className={classes.root}></div>;
};

export default Settings;
