/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { createStyles, makeStyles, Typography } from "@material-ui/core";
import { Alert as AlertMUI, AlertTitle } from "@material-ui/lab";

const useStyles = makeStyles(() =>
  createStyles({
    root: {
      position: "absolute",
      zIndex: 1,
      right: "10px",
      top: "10px",
    },
  })
);

interface IJobCreationAlert {
  showAlert: boolean;
  variant: "success" | "info" | "warning" | "error";
  alertText: string;
  hidePrompt: () => void;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const JobCreationAlert = () => {
  const classes = useStyles();

  return (
    <AlertMUI
      onClose={() => {}}
      variant="filled"
      severity="success"
      className={classes.root}
    >
      <AlertTitle>
        <Typography variant="body1">Success! Created JobID: 19</Typography>
      </AlertTitle>
    </AlertMUI>
  );
};

export default JobCreationAlert;
