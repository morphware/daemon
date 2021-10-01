import React from "react";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import { theme } from "../providers/MorphwareTheme";
import Statistics from "../components/Statistics";

const styles = makeStyles(() =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
    },
  })
);

const Home = () => {
  const classes = styles();

  return (
    <div className={classes.root}>
      <Statistics />
    </div>
  );
};

export default Home;
