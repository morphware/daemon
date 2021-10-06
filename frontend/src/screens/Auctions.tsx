import React, { useContext } from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "../providers/MorphwareTheme";
import PeersTable from "../components/PeersTable";
import { Typography } from "@material-ui/core";
import { DaemonContext } from "../providers/ServiceProviders";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
      display: "flex",
      // justifyContent: "center",
      flexDirection: "column",
      alignItems: "center",
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
      <Typography variant="h4" className={classes.statisticNumber}>
        {activeJobs}
      </Typography>
      <Typography variant="h5" style={{ paddingBottom: "20px" }}>
        Live Morphware Auctions
      </Typography>
      <PeersTable />
    </div>
  );
};

export default Auctions;
