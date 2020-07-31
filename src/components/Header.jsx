import React, { Fragment, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import postData from "../helpers/postData";
import AutoComplete from "./AutoComplete";
import AccountCircle from "@material-ui/icons/AccountCircle";

const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  centeredContent: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
}));

export default function Header({ homePage, handleDrawerToggle }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(undefined);
  const history = useHistory();

  const handleProfileMenuOpen = (e) => {
    setProfileOpen(true);
    setProfileAnchorEl(e.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileOpen(false);
  };

  const handleLogOut = () => {
    postData("/logout")
      .then(() => {
        history.push("/");
      })
      .catch((err) => console.log(err));
  };

  const classes = useStyles();

  const profileMenu = (
    <Menu
      anchorEl={profileAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={"profile-menu"}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={profileOpen}
      onClose={handleProfileMenuClose}
    >
      <MenuItem component={Link} to="/drive/profile">
        Profile
      </MenuItem>
      <MenuItem onClick={handleLogOut}>Sign Out</MenuItem>
    </Menu>
  );

  return (
    <Fragment>
      <AppBar
        position="fixed"
        className={homePage === "Home" ? classes.appBar : ""}
      >
        <Toolbar>
          {homePage === "Home" && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              className={classes.menuButton}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" className={classes.content}>
            {homePage !== "Home" ? (
              <Link
                to="/drive/home"
                style={{ textDecoration: "none", color: "white" }}
              >
                G-Drive
              </Link>
            ) : (
              "G-Drive"
            )}
          </Typography>
          {homePage === "Home" && (
            <Fragment>
              <AutoComplete />
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={"profile-menu"}
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            </Fragment>
          )}
          {homePage !== "Home" && (
            <Button color="inherit" onClick={history.goBack}>
              Back
            </Button>
          )}
        </Toolbar>
      </AppBar>
      {profileMenu}
    </Fragment>
  );
}
