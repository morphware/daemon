import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Typography,
} from "@material-ui/core";
import React from "react";
import { theme } from "../providers/MorphwareTheme";
// import { theme } from "../providers/MorphwareTheme";

const styles = makeStyles(() =>
  createStyles({
    statisticNumber: {
      color: "#1aae9f",
      fontWeight: 700,
      fontSize: "50px",
    },
    appRoles: {
      display: "inline",
      color: "#5B676D",
      fontWeight: 700,
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
          <Typography variant="h5">Total MWT Earned</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {modelsTrained}
          </Typography>
          <Typography variant="h5">Total Models Trained</Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            {liveJobs}
          </Typography>
          <Typography variant="h5">Live Morphware Jobs</Typography>
        </Grid>
      </Grid>
      <Grid container style={{ height: "50%" }} spacing={5}>
        <Grid item xs={6}>
          <Paper
            style={{
              padding: 30,
              backgroundColor: theme.formSectionBackground?.main,
              height: "80%",
            }}
            elevation={3}
          >
            <Typography variant="h5">In this app, you can …</Typography>
            <Typography variant="body2">
              Assume the role of either a Data Scientist End User or a Worker
              Node
              <ul>
                <li style={{ textAlign: "left" }}>
                  <Typography className={classes.appRoles}>End User</Typography>
                  — Submit machine learning models to be trained by the worker
                  nodes and tested by the validator nodes.
                </li>
                {/* <br /> */}
                <li style={{ textAlign: "left" }}>
                  <Typography className={classes.appRoles}>
                    Worker Node
                  </Typography>{" "}
                  — Earn tokens by training models submitted by the end users.
                </li>
                {/* <br /> */}
                <li style={{ textAlign: "left" }}>
                  <Typography className={classes.appRoles}>
                    Validator Node (Coming Soon)
                  </Typography>{" "}
                  — Earn tokens by testing models trained by the worker nodes.
                </li>
              </ul>
            </Typography>{" "}
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper
            style={{
              padding: 30,
              backgroundColor: theme.formSectionBackground?.main,
              height: "80%",
            }}
            elevation={3}
          >
            <Typography variant="h5">What is Morphware?</Typography>
            <Typography variant="body2" style={{ textAlign: "left" }}>
              <ul>
                <li>
                  <Typography className={classes.appRoles}>
                    An overlay network
                  </Typography>{" "}
                  that rides on top of Ethereum and BitTorrent
                </li>
                {/* <br /> */}
                <li>
                  <Typography className={classes.appRoles}>
                    Machine Learning platform
                  </Typography>{" "}
                  where data scientists utilise remote compute to train their
                  machine learning models
                  {/* where data scientists can pay people who own computers with
                dedicated graphics cards to train their machine learning models */}
                </li>
                <li>
                  <Typography className={classes.appRoles}>
                    A file sharing peer-to-peer network
                  </Typography>{" "}
                  that allows models, training and testing data to be transfered
                  in a decentralised architecture
                  {/* where data scientists can pay people who own computers with
                dedicated graphics cards to train their machine learning models */}
                </li>
              </ul>
              {/* An overlay network that rides on top of Ethereum and BitTorrent,
            where data scientists can pay people who own computers with
            dedicated graphics cards to train their machine learning models; in
            a native token called Morphware Token. */}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Statistics;
