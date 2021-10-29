import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import TrainModelForm from "../components/trainModelForm";
// import TrainModelForm from "../components/trainModelForm";
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

const TrainModel = () => {
  const classes = styles();

  return (
    <>
      <div className={classes.root}>
        <TrainModelForm />
      </div>
    </>
  );
};

export default TrainModel;
