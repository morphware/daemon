import { Grid, Typography } from "@material-ui/core";
import React, { useContext } from "react";
import { DaemonContext } from "../providers/ServiceProviders";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const ConnectedBanner = () => {
  const daemonService = useContext(DaemonContext);

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
            <Typography variant="h4">Connected to Morphware</Typography>{" "}
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
            <Typography variant="h4">Not Connected to Morphware</Typography>
          </Grid>
          <Grid xs={5} />
        </>
      )}
      <Grid item>
        <Typography variant="h6">
          Welcome to Morphware, you are now an integral part to the future of
          distributed computing.
        </Typography>
      </Grid>
    </Grid>
  );
};

export default ConnectedBanner;
