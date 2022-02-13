import {
  CircularProgress,
  createStyles,
  makeStyles,
  useTheme,
} from "@material-ui/core";
import React, { useState } from "react";
import TrainModelForm from "../components/trainModelForm";
import { ThemeProps } from "../providers/MorphwareTheme";
import TrainModelTopBar from "../components/TrainModelTopBar";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 70px)",
      padding: "0px 50px 0px",
    },
    writeModel: {
      height: "50px",
    },
    loader: {
      width: "100%",
      height: "100%",
      left: "50%",
      top: "50%",
      position: "absolute",
    },
  })
);

const TrainModel = () => {
  const theme: ThemeProps = useTheme();

  const classes = styles(theme);
  const [sendingRequest, setSendingRequest] = useState(false);

  return (
    <>
      <div className={classes.root}>
        {sendingRequest && (
          <CircularProgress className={classes.loader} color="secondary" />
        )}
        <TrainModelTopBar />
        <TrainModelForm setSendingRequest={setSendingRequest} />
      </div>
    </>
  );
};

export default TrainModel;
