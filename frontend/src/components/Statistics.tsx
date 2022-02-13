import {
  createStyles,
  Grid,
  makeStyles,
  Paper,
  Typography,
  useTheme,
} from "@material-ui/core";
import React from "react";
import { ThemeProps } from "../providers/MorphwareTheme";
import ConnectedBanner from "./ConnectedBanner";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    statisticNumber: {
      color: "#1aae9f",
      fontWeight: 700,
      fontSize: "50px",
    },
    appRoles: {
      display: "inline",
      color: theme.text?.bold,
      fontWeight: 700,
    },
    headerText: {
      color: theme.text?.bold,
    },
    contentText: {
      color: theme.text?.main,
    },
  })
);

const Statistics = () => {
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);

  return (
    <React.Fragment>
      <Grid container style={{ height: "50%" }}>
        <Paper
          style={{
            padding: 30,
            backgroundColor: theme.formSectionBackground?.main,
            height: "80%",
            display: "flex",
            alignContent: "center",
          }}
          elevation={0}
        >
          <ConnectedBanner />
        </Paper>
        {/* <Grid item xs={4}>
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
        </Grid> */}
      </Grid>
      <Grid container style={{ height: "50%" }} spacing={5}>
        <Grid item xs={6}>
          <Paper
            style={{
              padding: 30,
              backgroundColor: theme.formSectionBackground?.main,
              height: "80%",
            }}
            elevation={0}
          >
            <Typography variant="h5" className={classes.headerText}>
              In this app, you can …
            </Typography>
            <Typography variant="body2" className={classes.headerText}>
              Assume the role of either a Data Scientist, Worker Node or
              Validator Node
              <ul>
                <li style={{ textAlign: "left" }}>
                  <Typography
                    className={classes.appRoles}
                    style={{ display: "inline" }}
                  >
                    End User
                  </Typography>
                  <Typography
                    style={{ display: "inline" }}
                    className={classes.contentText}
                  >
                    — Submit machine learning models to be trained by the worker
                    nodes and tested by the validator nodes.
                  </Typography>
                </li>
                <li style={{ textAlign: "left" }}>
                  <Typography className={classes.appRoles}>
                    Worker Node
                  </Typography>
                  <Typography
                    style={{ display: "inline" }}
                    className={classes.contentText}
                  >
                    — Earn tokens by training models submitted by the end users.{" "}
                  </Typography>
                </li>
                <li style={{ textAlign: "left" }}>
                  <Typography className={classes.appRoles}>
                    Validator Node
                  </Typography>
                  <Typography
                    style={{ display: "inline" }}
                    className={classes.contentText}
                  >
                    — Earn tokens by testing models trained by the worker nodes.
                  </Typography>
                </li>
              </ul>
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={6}>
          <Paper
            style={{
              padding: 30,
              backgroundColor: theme.formSectionBackground?.main,
              height: "80%",
            }}
            elevation={0}
          >
            <Typography variant="h5" className={classes.headerText}>
              What is Morphware?
            </Typography>
            <Typography
              variant="body2"
              style={{ textAlign: "left" }}
              className={classes.headerText}
            >
              <ul>
                <li>
                  <Typography className={classes.appRoles}>
                    An overlay network
                  </Typography>{" "}
                  <Typography
                    style={{ display: "inline" }}
                    className={classes.contentText}
                  >
                    that rides on top of Ethereum and BitTorrent{" "}
                  </Typography>
                </li>
                <li>
                  <Typography className={classes.appRoles}>
                    Machine Learning platform where data scientists utilise
                    remote compute to train their machine learning models
                  </Typography>
                </li>
                <li>
                  <Typography className={classes.appRoles}>
                    A file sharing peer-to-peer network
                  </Typography>{" "}
                  <Typography
                    style={{ display: "inline" }}
                    className={classes.contentText}
                  >
                    that allows models, training and testing data to be
                    transfered in a decentralised architecture
                  </Typography>
                </li>
              </ul>
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </React.Fragment>
  );
};

export default Statistics;
