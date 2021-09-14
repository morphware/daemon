import React from "react";
import EnhancedTable from "../components/TorrentsTable";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "../providers/MorphwareTheme";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 50px)",
      width: "90vw",
      // paddingTop: "50px",
      // paddingLeft: "50px",
      padding: "50px 50px 0px",
    },
  })
);

const Torrents = () => {
  const classes = styles();

  return (
    <div className={classes.root}>
      <EnhancedTable />
    </div>
  );
};

export default Torrents;
