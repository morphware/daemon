import {
  createStyles,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { DaemonContext } from "../providers/ServiceProviders";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { ThemeProps } from "../providers/MorphwareTheme";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    headerText: {
      color: theme.text?.bold,
    },
    contentText: {
      color: theme.text?.main,
    },
  })
);

const ConnectedBanner = () => {
  const daemonService = useContext(DaemonContext);
  const theme = useTheme();
  const classes = styles(theme);
  return (
    <Grid
      container
      spacing={3}
      style={{ display: "flex", alignContent: "center" }}
    >
      {daemonService.connectionStatus ? (
        <>
          <Grid item xs={1}>
            <CheckCircleIcon
              style={{ fontSize: 50, color: "#6ACE6D" }}
              color="secondary"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4" className={classes.headerText}>
              Connected to Morphware
            </Typography>{" "}
          </Grid>
          <Grid xs={5} />
        </>
      ) : (
        <>
          <Grid item xs={1}>
            <CancelIcon
              style={{ fontSize: 50, color: "#FF6666" }}
              color="secondary"
            />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h4" className={classes.headerText}>
              Not Connected to Morphware
            </Typography>
          </Grid>
          <Grid xs={5} />
        </>
      )}
      <Grid item>
        <Typography variant="h6" className={classes.contentText}>
          Welcome to Morphware, you are now an integral part to the future of
          distributed computing.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ConnectedBanner;
