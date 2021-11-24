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
import Identicon from "./Identicon";

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
  text: string;
  connected: boolean;
  network: string;
}

export const ConnectionStatus = ({
  text,
  connected,
  network,
}: ConnectionStatusProps) => {
  return connected ? (
    <Box display="flex">
      <Typography variant="body2">
        {text}:&nbsp;&nbsp;&nbsp;{network}&nbsp;
      </Typography>
      <CheckCircleIcon
        style={{ fontSize: 25, color: "#6ACE6D" }}
        color="secondary"
      />
    </Box>
  ) : (
    <Box display="flex">
      <Typography variant="body2">{text}:&nbsp;&nbsp;&nbsp;</Typography>
      <CancelIcon
        style={{ fontSize: 25, color: "#FF6666" }}
        color="secondary"
      />
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
        <span>
          <Typography variant="body2">
            Address:&nbsp;&nbsp;&nbsp;
            <Identicon
              address={
                daemonService.walletAddress ? daemonService.walletAddress : "-"
              }
              size={15}
            />
            &nbsp;&nbsp;
            {walletShortener(daemonService.walletAddress, 4, 4)}
          </Typography>{" "}
        </span>
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
          <ConnectionStatus
            text="Connection"
            connected={true}
            network={daemonService.network}
          />
        ) : (
          <ConnectionStatus text="Connection" connected={false} network={""} />
        )}
      </Grid>
    </Grid>
  );
};

export default WalletInfo;
