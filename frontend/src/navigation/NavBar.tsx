import React, { useState } from "react";
import logo from "../assets/logoV2.png";
import homeNav from "../assets/train.png";
import { Link } from "react-router-dom";
import { theme } from "../providers/MorphwareTheme";
import { makeStyles } from "@material-ui/core";

enum navOptions {
  Train = "Train",
  Torrents = "Torrents",
  ShareCompute = "Share Compute",
  Activity = "Activity",
  Settings = "Settings",
}

interface NavLinkProps {
  to: string;
  icon: any;
  title: navOptions;
  setSelected: React.Dispatch<React.SetStateAction<navOptions>>;
  selected: boolean;
}

const styles = makeStyles({
  root: {},
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
          <img src={icon} alt={title} width="20%" height="20%" />
        </div>
        <div className={classes.navText}>{title}</div>
      </div>
    </Link>
  );
};

const NavBar = () => {
  const [selectedNavItem, setSelectedNavItem] = useState<navOptions>(
    navOptions.Train
  );

  const classes = styles();
  console.log("Classes: ", classes);
  console.log("theme: ", theme);

  return (
    <div className={classes.navContainer}>
      <div className={classes.logoContainer}>
        <img src={logo} alt="Morphware Logo" width="80%" />
      </div>
      <div className="navbar-content">
        <div className="nav-links-container">
          <NavLink
            title={navOptions.Train}
            icon={homeNav}
            to="/"
            setSelected={setSelectedNavItem}
            selected={navOptions.Train === selectedNavItem}
          ></NavLink>
          <NavLink
            title={navOptions.Torrents}
            icon={homeNav}
            to="/torrents"
            setSelected={setSelectedNavItem}
            selected={navOptions.Torrents === selectedNavItem}
          ></NavLink>
          <NavLink
            title={navOptions.Settings}
            icon={homeNav}
            to="/settings"
            setSelected={setSelectedNavItem}
            selected={navOptions.Settings === selectedNavItem}
          ></NavLink>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
