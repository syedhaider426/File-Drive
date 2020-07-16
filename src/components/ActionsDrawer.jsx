import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {
  Hidden,
  Drawer,
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { Link } from "react-router-dom";

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

class ActionsDrawer extends Component {
  state = { mobileOpen: false, profileOpen: false };

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
    });
  };

  handleProfileMenuOpen = (e) => {
    this.setState({ profileOpen: true, profileAnchorEl: e.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ profileOpen: false });
  };

  render() {
    const { mobileOpen, profileOpen, profileAnchorEl } = { ...this.state };
    const { actions, classes } = { ...this.props };

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
        <MenuItem>
          <Link to="/drive/profile">Profile</Link>
        </MenuItem>
      </Menu>
    );

    return (
      <Fragment>
        <nav className={classes.drawer}>
          <Hidden smUp implementation="css">
            <Drawer
              variant="temporary"
              open={mobileOpen}
              onClose={this.handleDrawerToggle}
              classes={{
                paper: classes.drawerPaper,
              }}
              ModalProps={{
                keepMounted: true, // Better open performance on mobile.
              }}
            >
              <div className={classes.toolbar} />
              <Divider />
              {actions}
            </Drawer>
          </Hidden>
          <Hidden xsDown implementation="css">
            <Drawer
              classes={{
                paper: classes.drawerPaper,
              }}
              variant="permanent"
              open
            >
              <div className={classes.toolbar} />
              <Divider />
              {actions}
            </Drawer>
          </Hidden>
        </nav>
        {profileMenu}
      </Fragment>
    );
  }
}

export default withStyles(styles)(ActionsDrawer);
