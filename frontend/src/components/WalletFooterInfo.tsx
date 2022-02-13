/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Box,
  createStyles,
  Grid,
  IconButton,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { DaemonContext } from "../providers/ServiceProviders";
import CheckCircleIcon from "@material-ui/icons/CheckCircle";
import CancelIcon from "@material-ui/icons/Cancel";
import { copyToClipBoard, roundBalance, walletShortener } from "../utils";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import Identicon from "./Identicon";
import { ThemeProps } from "../providers/MorphwareTheme";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    root: {
      height: "70px",
      backgroundColor: theme.WalletFooterInfo?.main,
    },
    footerText: {
      color: theme.WalletFooterInfo?.text,
      fontWeight: 700,
      // fontSize: "50px",
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
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);
  return connected ? (
    <Box display="flex">
      <Typography variant="body2" className={classes.footerText}>
        {text}:&nbsp;&nbsp;&nbsp;{network}&nbsp;
      </Typography>
      <CheckCircleIcon
        style={{ fontSize: 25, color: "#6ACE6D" }}
        color="secondary"
      />
    </Box>
  ) : (
    <Box display="flex">
      <Typography variant="body2" className={classes.footerText}>
        {text}:&nbsp;&nbsp;&nbsp;
      </Typography>
      <CancelIcon
        style={{ fontSize: 25, color: "#FF6666" }}
        color="secondary"
      />
    </Box>
  );
};

const WalletInfo = () => {
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);
  const daemonService = useContext(DaemonContext);
  const roundedBalance = roundBalance(daemonService.walletBalance);

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
          <Typography variant="body2" className={classes.footerText}>
            Address:&nbsp;&nbsp;&nbsp;
            <Identicon
              address={
                daemonService.walletAddress ? daemonService.walletAddress : "-"
              }
              size={15}
            />
            &nbsp;&nbsp;
            {walletShortener(daemonService.walletAddress, 4, 4)}
          </Typography>
        </span>
        <IconButton
          onClick={() => copyToClipBoard(daemonService.walletAddress)}
        >
          <FileCopyIcon
            fontSize="small"
            // color="secondary"
            color="secondary"
          />
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
        <Typography variant="body2" className={classes.footerText}>
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
