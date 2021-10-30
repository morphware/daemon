import { createStyles, makeStyles } from "@material-ui/core";
import React from "react";
import TrainModelForm from "../components/trainModelForm";
import { theme } from "../providers/MorphwareTheme";
import TrainModelTopBar from "../components/TrainModelTopBar";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 70px)",
      padding: "0px 50px 0px",
    },
    writeModel: {
      height: "50px",
    },
  })
);

const TrainModel = () => {
  const classes = styles();

  return (
    <>
      <div className={classes.root}>
        <TrainModelTopBar />
        <TrainModelForm />
      </div>
    </>
  );
};

export default TrainModel;
