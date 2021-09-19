/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Typography,
} from "@material-ui/core";
import React, { useContext } from "react";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { theme } from "../providers/MorphwareTheme";
import { DaemonContext } from "../providers/ServiceProviders";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { copyToClipBoard, roundBalance, walletShortener } from "../utils";
import FileCopyIcon from "@material-ui/icons/FileCopy";

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
  network: string;
}

const ConnectionStatus = ({ connected, network }: ConnectionStatusProps) => {
  return connected ? (
    <Box display="flex">
      <Typography variant="body2">
        Connection:&nbsp;&nbsp;&nbsp;{network}&nbsp;
      </Typography>
      <CheckCircleIcon
        style={{ fontSize: 25, color: "green" }}
        color="secondary"
      />
    </Box>
  ) : (
    <Box display="flex">
      <Typography variant="body2">Connection:&nbsp;&nbsp;&nbsp;</Typography>
      <CancelIcon style={{ fontSize: 25, color: "red" }} color="secondary" />
    </Box>
  );
};

const WalletInfo = () => {
  const classes = styles();
  const daemonService = useContext(DaemonContext);
  const roundedBalance = roundBalance(daemonService.walletBalance);
  const shortenedAddress = walletShortener(daemonService.walletAddress, 5);

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
        <Typography variant="body2">
          Address:&nbsp;&nbsp;&nbsp;{shortenedAddress}
        </Typography>
        <IconButton
          onClick={() => copyToClipBoard(daemonService.walletAddress)}
        >
          <FileCopyIcon fontSize="small" color="secondary" />
        </IconButton>
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
          {roundedBalance}&nbsp;&nbsp;&nbsp;MWT
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
        {daemonService.connectionStatus && daemonService.network ? (
          <ConnectionStatus connected={true} network={daemonService.network} />
        ) : (
          <ConnectionStatus connected={false} network={""} />
        )}
      </Grid>
    </Grid>
  );
};

export default WalletInfo;
