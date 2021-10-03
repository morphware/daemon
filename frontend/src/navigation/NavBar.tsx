/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from "react";
import logo from "../assets/logoV2.png";
import homeNav from "../assets/train.png";
import torrentsNav from "../assets/torrents.png";
import settings from "../assets/settings.png";
import stats from "../assets/stats.png";
import { Link } from "react-router-dom";
import { theme } from "../providers/MorphwareTheme";
import { Grid, makeStyles, Typography } from "@material-ui/core";
import WalletModal from "../components/WalletModal";

enum navOptions {
  Home = "Home",
  Train = "Train",
  Torrents = "Torrents",
  Settings = "Settings",
  Auctions = "Auctions",
}

interface NavLinkProps {
  to: string;
  icon: any;
  title: navOptions;
  setSelected: React.Dispatch<React.SetStateAction<navOptions>>;
  selected: boolean;
}

const styles = makeStyles({
  root: {
    flexGrow: 1,
  },
  paper: {
    // padding: theme.spacing(2),
    textAlign: "center",
    // color: theme.palette.text.secondary,
  },
  navContainer: {
    backgroundColor: theme.navBar?.main,
    height: "100vh",
    width: "10vw",
    minWidth: "100px",
    maxWidth: "230px",
    overflow: "auto",
  },
  navText: {
    fontSize: "19px",
    color: theme.navBar?.text,
  },
  navItemContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px 0px",
    userSelect: "none",
    borderRight: "6px solid transparent",
    "&:hover": {
      background: theme.navBar?.selected,
      curser: "pointer",
    },
  },
  selected: {
    backgroundColor: theme.navBar?.selected,
    borderRight: `6px solid ${theme.navBar?.innerBorder}`,
  },
  itemLink: {
    textDecoration: "none",
  },
  logoContainer: {
    paddingTop: "20px",
    paddingBottom: "20px",
    width: "100%",
    "&:hover": {
      curser: "pointer",
    },
  },
});

const NavLink = ({ to, icon, title, setSelected, selected }: NavLinkProps) => {
  const classes = styles();
  var className = classes.navItemContainer;

  if (selected) {
    className = `${classes.selected} ${className}`;
  }
  return (
    <Link className={classes.itemLink} to={to}>
      <div className={className} onClick={() => setSelected(title)}>
        <div>
          <img
            style={{ color: "white" }}
            src={icon}
            alt={title}
            width="35%"
            height="35%"
          />
        </div>
        <div className={classes.navText}>
          <Typography variant="h6">{title}</Typography>
        </div>
      </div>
    </Link>
  );
};

const NavBar = () => {
  const [selectedNavItem, setSelectedNavItem] = useState<navOptions>(
    navOptions.Train
  );

  const classes = styles();

  return (
    <Grid container direction="column" className={classes.navContainer}>
      <Grid
        item
        className={classes.logoContainer}
        onClick={() => setSelectedNavItem(navOptions.Home)}
      >
        <Link className={classes.itemLink} to={"/"}>
          <img src={logo} alt="Morphware Logo" width="85%" />
        </Link>
      </Grid>
      <Grid item className="navbar-content">
        <NavLink
          title={navOptions.Auctions}
          icon={stats}
          to="/auctions"
          setSelected={setSelectedNavItem}
          selected={navOptions.Auctions === selectedNavItem}
        ></NavLink>
        <NavLink
          title={navOptions.Train}
          icon={homeNav}
          to="/train"
          setSelected={setSelectedNavItem}
          selected={navOptions.Train === selectedNavItem}
        ></NavLink>
        <NavLink
          title={navOptions.Torrents}
          icon={torrentsNav}
          to="/torrents"
          setSelected={setSelectedNavItem}
          selected={navOptions.Torrents === selectedNavItem}
        ></NavLink>
        <NavLink
          title={navOptions.Settings}
          icon={settings}
          to="/settings"
          setSelected={setSelectedNavItem}
          selected={navOptions.Settings === selectedNavItem}
        ></NavLink>
      </Grid>
      <Grid
        container
        style={{
          flexGrow: 1,
          flexDirection: "column",
          justifyContent: "flex-end",
          alignContent: "center",
          padding: "20px",
        }}
      >
        {/* <IconButton
          style={{ width: "fit-content" }}
          // onClick={updateTorrents} disabled={fetchingTorrents}
        >
          <AccountBalanceWalletIcon
            style={{ fontSize: 48 }}
            color="secondary"
          />
        </IconButton> */}
        <WalletModal />
      </Grid>
    </Grid>
  );
};

export default NavBar;
