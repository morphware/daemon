import { createStyles, Grid, makeStyles, Typography } from "@material-ui/core";
import React from "react";

const styles = makeStyles(() =>
  createStyles({
    statisticNumber: {
      color: "#1aae9f",
      fontWeight: 700,
      fontSize: "50px",
    },
  })
);

const Statistics = () => {
  const classes = styles();

  const modelsTrained = 27;
  const earnedMWT = 1382;
  const liveJobs = 712;

  return (
    <React.Fragment>
      <Grid container style={{ height: "50%" }}>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {earnedMWT}
          </Typography>
          <Typography variant="h5">Earned MWT</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {modelsTrained}
          </Typography>
          <Typography variant="h5"> Models Trained</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {liveJobs}
          </Typography>
          <Typography variant="h5"> Live Morphware Jobs</Typography>
        </Grid>
      </Grid>
      <Grid container style={{ height: "50%" }}>
        <Grid item xs={6}>
          <Typography variant="h5">Placed Bids</Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography variant="h5"> Currently Training</Typography>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Statistics;
