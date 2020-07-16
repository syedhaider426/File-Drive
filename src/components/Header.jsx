import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
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
import { withRouter } from "react-router-dom";
import postData from "../helpers/postData";

const drawerWidth = 150;

const styles = (theme) => ({
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
});

class Header extends Component {
  state = { profileOpen: false };

  handleProfileMenuOpen = (e) => {
    this.setState({ profileOpen: true, profileAnchorEl: e.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ profileOpen: false });
  };

  handleLogOut = () => {
    postData("/logout").then(() => {
      this.props.history.push("/");
    });
  };

  render() {
    const { profileOpen, profileAnchorEl } = { ...this.state };
    const { classes, homePage } = { ...this.props };

    const profileMenu = (
      <Menu
        anchorEl={profileAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={"profile-menu"}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={profileOpen}
        onClose={this.handleProfileMenuClose}
      >
        <MenuItem component={Link} to="/drive/profile">
          Profile
        </MenuItem>
        <MenuItem onClick={this.handleLogOut}>Sign Out</MenuItem>
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
                onClick={this.handleDrawerToggle}
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
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-controls={"profile-menu"}
                aria-haspopup="true"
                onClick={this.handleProfileMenuOpen}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
            )}
            {homePage !== "Home" && (
              <Button color="inherit" onClick={this.props.history.goBack}>
                Back
              </Button>
            )}
          </Toolbar>
        </AppBar>
        {profileMenu}
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(Header));
