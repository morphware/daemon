import React from "react";
// import EnhancedTable from "../components/TorrentsTable";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "../providers/MorphwareTheme";
import TorrentsTableV2 from "../components/TorrentsTableV2";
import { Grid, Typography } from "@material-ui/core";

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

const Torrents = () => {
  const classes = styles();

  return (
    <div className={classes.root}>
      <Grid container>
        <Grid item xs={4} style={{ paddingBottom: "15px" }}>
          <Typography variant="h4" className={classes.statisticNumber}>
            10
          </Typography>
          <Typography variant="h5" style={{ paddingBottom: "20px" }}>
            Download
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            41
          </Typography>
          <Typography variant="h5" style={{ paddingBottom: "20px" }}>
            Upload
          </Typography>
        </Grid>
        <Grid item xs={4}>
          <Typography variant="h4" className={classes.statisticNumber}>
            46049
          </Typography>
          <Typography variant="h5" style={{ paddingBottom: "20px" }}>
            Port
          </Typography>
        </Grid>
      </Grid>

      <TorrentsTableV2 />
    </div>
  );
};

export default Torrents;
