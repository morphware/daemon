import { createStyles, makeStyles, useTheme } from "@material-ui/core";
import React from "react";
import SettingsForm from "../components/SettingsForm";
import { ThemeProps } from "../providers/MorphwareTheme";

const styles = makeStyles((theme: ThemeProps) =>
  createStyles({
    root: {
      backgroundColor: theme.background?.main,
      height: "calc(100vh - 120px)",
      padding: "50px 50px 0px",
    },
  })
);

const Settings = () => {
  const theme: ThemeProps = useTheme();
  const classes = styles(theme);
  return (
    <div className={classes.root}>
      <SettingsForm />
    </div>
  );
};

export default Settings;
