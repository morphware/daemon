import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "../providers/MorphwareTheme";
import AuctionsTable from "../components/AuctionsTable";
import { Grid, Paper, Typography } from "@material-ui/core";
import { DaemonContext } from "../providers/ServiceProviders";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
    },
    statisticNumber: {
      color: "#1aae9f",
      fontWeight: 700,
      fontSize: "50px",
    },
  })
);

const Auctions = () => {
  const daemonService = useContext(DaemonContext);
  const activeJobs = daemonService.activeJobs?.jobs
    ? Object.values(daemonService.activeJobs.jobs).length
    : 0;

  const classes = styles();

  return (
    <div className={classes.root}>
      <Paper
        style={{
          backgroundColor: theme.formSectionBackground?.main,
          paddingTop: 30,
        }}
        elevation={0}
      >
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h4" className={classes.statisticNumber}>
              {activeJobs}
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h5" style={{ paddingBottom: "20px" }}>
              Live Morphware Auctions
            </Typography>
          </Grid>
          <AuctionsTable />
        </Grid>
      </Paper>
    </div>
  );
};

export default Auctions;
