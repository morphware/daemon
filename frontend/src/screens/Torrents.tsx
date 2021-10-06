import React from "react";
// import EnhancedTable from "../components/TorrentsTable";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "../providers/MorphwareTheme";
import TorrentsTableV2 from "../components/TorrentsTableV2";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
    },
  })
);

const Torrents = () => {
  const classes = styles();

  return (
    <div className={classes.root}>
      {/* <EnhancedTable /> */}
      <TorrentsTableV2 />
    </div>
  );
};

export default Torrents;
