import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { ThemeProps } from "../providers/MorphwareTheme";
import TorrentsTable from "../components/TorrentsTable";
import { Grid, Paper, Typography, useTheme } from "@material-ui/core";
import { DaemonContext } from "../providers/ServiceProviders";

const styles = makeStyles((theme: ThemeProps) =>
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
    header: {
      color: theme.text?.bold,
    },
  })
);

const Torrents = () => {
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);
  const daemonService = useContext(DaemonContext);
  const torrents = daemonService.torrents;

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
          <Grid item xs={4} style={{ paddingBottom: "15px" }}>
            <Typography variant="h4" className={classes.statisticNumber}>
              {torrents?.download}
            </Typography>
            <Typography
              variant="h5"
              style={{ paddingBottom: "20px" }}
              className={classes.header}
            >
              Download
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" className={classes.statisticNumber}>
              {torrents?.upload}
            </Typography>
            <Typography
              variant="h5"
              style={{ paddingBottom: "20px" }}
              className={classes.header}
            >
              Upload
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography variant="h4" className={classes.statisticNumber}>
              {torrents?.port}
            </Typography>
            <Typography
              variant="h5"
              style={{ paddingBottom: "20px" }}
              className={classes.header}
            >
              Port
            </Typography>
          </Grid>
          <Grid
            item
            xs={12}
            style={{ display: "flex", justifyContent: "center" }}
          >
            <TorrentsTable />
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
};

export default Torrents;
