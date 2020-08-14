import React, { Fragment, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Button from "@material-ui/core/Button";
import MenuIcon from "@material-ui/icons/Menu";
import { Link, useHistory, useLocation } from "react-router-dom";
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

function Header({
  handleDrawerToggle,
  setFileData,
  setFileModalOpen,
  setContentType,
}) {
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileAnchorEl, setProfileAnchorEl] = useState(undefined);
  const history = useHistory();
  const location = useLocation();

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

  const handleProfileClick = () => {
    setProfileOpen(false);
    history.push("/user/profile");
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
      <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
      <MenuItem onClick={handleLogOut}>Sign Out</MenuItem>
    </Menu>
  );

  const loc = location.pathname.startsWith("/drive/");

  return (
    <Fragment>
      <AppBar position="fixed" className={loc ? classes.appBar : ""}>
        <Toolbar>
          {loc && (
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
            {loc ? (
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
          {loc && (
            <Fragment>
              <AutoComplete
                setFileData={setFileData}
                setFileModalOpen={setFileModalOpen}
                setContentType={setContentType}
              />
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
          {!loc && (
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

export default Header;
