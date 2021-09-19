/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  createStyles,
  Grid,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { theme } from "../providers/MorphwareTheme";
import { DaemonContext } from "../providers/ServiceProviders";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";

const styles = makeStyles(() =>
  createStyles({
    root: {
      //   backgroundColor: theme.background?.main,
      height: "70px",
      //   padding: "50px 50px 0px",
    },
  })
);

interface ConnectionStatusProps {
  connected: boolean;
}

const ConnectionStatus = (connected: ConnectionStatusProps) => {
  return connected ? (
    <Box display="flex">
      <Typography variant="body2">Connection :</Typography>
      <CheckCircleIcon
        style={{ fontSize: 25, color: "green" }}
        color="secondary"
      />
    </Box>
  ) : (
    <Box>
      <Typography variant="body2">Connection</Typography>
      <CancelIcon style={{ fontSize: 25, color: "red" }} color="secondary" />
    </Box>
  );
};

const WalletInfo = () => {
  const classes = styles();
  const daemonService = useContext(DaemonContext);

  return (
    <Grid container className={classes.root}>
      <Grid
        xs={4}
        item
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2">{daemonService.walletAddress}</Typography>
      </Grid>
      <Grid
        xs={4}
        item
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="body2">
          {daemonService.walletBalance} MWT
        </Typography>
      </Grid>
      <Grid
        xs={4}
        item
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {daemonService.connectionStatus ? (
          <ConnectionStatus connected={true} />
        ) : (
          <ConnectionStatus connected={false} />
        )}
      </Grid>
    </Grid>
  );
};

export default WalletInfo;
