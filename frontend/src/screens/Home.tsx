import React from "react";
import { createStyles, makeStyles, useTheme } from "@material-ui/core/styles";
import { ThemeProps } from "../providers/MorphwareTheme";
import Statistics from "../components/Statistics";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
    },
  })
);

const Home = () => {
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);

  return (
    <div className={classes.root}>
      <Statistics />
    </div>
  );
};

export default Home;
