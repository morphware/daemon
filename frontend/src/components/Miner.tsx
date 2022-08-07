import {
  Button,
  createStyles,
  Grid,
  makeStyles,
  Typography,
  useTheme,
} from "@material-ui/core";
import React, { useContext } from "react";
import { ThemeProps } from "../providers/MorphwareTheme";
import { DaemonContext } from "../providers/ServiceProviders";
import { defaultMiningStats, UtilsContext } from "../providers/UtilsProvider";

const Miner = () => {
  const daemonService = useContext(DaemonContext);
  const { mining } = useContext(UtilsContext);
  const { currentlyMining } = mining;
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);
  const startMining = async () => {
    const resp = await daemonService.startMiner();
    await mining.getMiningStatus();
    console.log(resp);
  };

  const stopMining = async () => {
    const resp = await daemonService.stopMiner();
    await mining.getMiningStatus();
    mining.setMiningStats(defaultMiningStats);
    console.log(resp);
  };

  return (
    <Grid container>
      <Grid item xs={4}>
        <Typography
          variant="h5"
          style={{ padding: "20px" }}
          className={classes.header}
        >
          ETH Mining
        </Typography>
      </Grid>
      <Grid item xs={4} style={{ padding: "20px" }}>
        {currentlyMining ? (
          <Button
            variant="contained"
            color="primary"
            onClick={stopMining}
            size="large"
          >
            Stop Mining
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            onClick={startMining}
            size="large"
          >
            Mine
          </Button>
        )}

        {/* <Button variant="contained" color="primary" onClick={getStats}>
          Get Stats
        </Button> */}
      </Grid>
      <Grid item xs={4}>
        <Typography
          variant="h5"
          style={{ padding: "20px" }}
          className={classes.header}
        >
          Pool:
          <div />
          us-eth.2miners.com:2020
        </Typography>
      </Grid>
      <Grid container style={{ padding: "20px 0px" }}>
        <Grid item xs={4} style={{ paddingBottom: "15px" }}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {mining.miningStats?.eth.submittedShares || 0}
          </Typography>
          <Typography
            variant="h5"
            style={{ paddingBottom: "20px" }}
            className={classes.header}
          >
            Submitted Shares
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {mining.miningStats?.runningTime || 0}
          </Typography>
          <Typography
            variant="h5"
            style={{ paddingBottom: "20px" }}
            className={classes.header}
          >
            Minutes Run
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {mining.miningStats?.eth.hashRateInKhS || 0}
          </Typography>
          <Typography
            variant="h5"
            style={{ paddingBottom: "20px" }}
            className={classes.header}
          >
            Hash Rate KH/s
          </Typography>
        </Grid>
      </Grid>
    </Grid>
  );
};

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-around",
    },
    statisticNumber: {
      color: "#1aae9f",
      fontWeight: 700,
      fontSize: "50px",
    },
    header: {
      color: theme.text?.bold,
    },
  })
);

export default Miner;
