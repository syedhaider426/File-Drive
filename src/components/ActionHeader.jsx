import { withStyles } from "@material-ui/core/styles";
import React, { Component, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import Tooltip from "@material-ui/core/Tooltip";
import RestoreIcon from "@material-ui/icons/Restore";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlined";
import RenameFolder from "./RenameFolder";
import RenameFile from "./RenameFile";
import MoveItem from "./MoveItem";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link } from "react-router-dom";
import { Breadcrumbs, Menu, MenuItem } from "@material-ui/core";

import MoreIcon from "@material-ui/icons/MoreVert";

const styles = (theme) => ({
  // This group of buttons will be aligned to the right
  // rightToolbar: {
  //   marginLeft: "auto",
  //   marginRight: -12,
  // },
  menuButton: {
    marginRight: 16,
    marginLeft: -12,
  },
  flexContainer: {
    padding: 20,
  },
  root: {
    display: "flex",
  },
  item: {
    padding: 0,
  },
  grow: {
    flexGrow: 1,
  },

  title: {
    display: "none",
    [theme.breakpoints.up("sm")]: {
      display: "block",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
});

class ActionHeader extends Component {
  state = {
    renameFolderDialogOpen: false,
    renameFileDialogOpen: false,
    moveItemDialogOpen: false,
    isMobileMenuOpen: false,
  };

  handleRenameOpen = () => {
    this.setState({ renameFileDialogOpen: true });
  };

  handleRenameFolderOpen = () => {
    this.setState({ renameFolderDialogOpen: true });
  };

  handleDialog = (value) => {
    this.setState(value);
  };

  handleMove = () => {
    this.setState({ moveItemDialogOpen: true });
  };

  handleMobileMenuOpen = (e) => {
    this.setState({
      isMobileMenuOpen: true,
      mobileMoreAnchorEl: e.currentTarget,
    });
  };

  handleMobileMenuClose = () => {
    this.setState({ isMobileMenuOpen: false });
  };

  /**
   *
   *{https://stackoverflow.com/questions/54416499/how-select-part-of-text-in-a-textfield-on-onfocus-event-with-material-ui-in-reac} event
   */
  handleFocus = (event) => {
    event.preventDefault();
    const { target } = event;
    const extensionStarts = target.value.lastIndexOf(".");
    target.focus();
    target.setSelectionRange(0, extensionStarts);
  };

  render() {
    const {
      files,
      folders,
      selectedFiles,
      selectedFolders,
      handleTrash,
      handleDeleteForever,
      handleFileCopy,
      handleFavorites,
      handleRestore,
      handleUnfavorited,
      handleFavoritesTrash,
      isFavorited,
      handleHomeUnfavorited,
      handleDeleteAll,
      handleRestoreAll,
      currentFolder,
      currentMenu,
    } = this.props;
    const { classes } = this.props;
    const { isMobileMenuOpen } = this.state;
    const renameFile = (
      <RenameFile
        renameFileDialogOpen={this.state.renameFileDialogOpen}
        handleDialog={this.handleDialog}
        files={files}
        selectedFiles={selectedFiles}
        handleSetState={this.props.handleSetState}
        handleFocus={this.handleFocus}
      />
    );

    const renameFolder = (
      <RenameFolder
        renameFolderDialogOpen={this.state.renameFolderDialogOpen}
        handleDialog={this.handleDialog}
        folders={folders}
        selectedFolders={selectedFolders}
        handleSetState={this.props.handleSetState}
        handleFocus={this.handleFocus}
      />
    );

    const moveItem = (
      <MoveItem
        moveItemDialogOpen={this.state.moveItemDialogOpen}
        handleDialog={this.handleDialog}
        files={files}
        folders={folders}
        selectedFiles={selectedFiles}
        selectedFolders={selectedFolders}
        handleSetState={this.props.handleSetState}
      />
    );

    const menuId = "primary-search-account-menu";

    const mobileMenuId = "primary-search-account-menu-mobile";
    const renderMobileMenu = (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        <MenuItem dense={true}>
          <p>Messages</p>
        </MenuItem>
        <MenuItem dense={true} onClick={this.handleFocus}>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    let menu = "";
    if (currentFolder !== undefined || currentMenu === "Folder") {
      menu = "1";
    }
    return (
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar variant="dense">
          {menu !== "" ? (
            <Breadcrumbs
              separator={<NavigateNextIcon fontSize="small" />}
              aria-label="breadcrumb"
            >
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={`/drive/home`}
                key={"Home"}
              >
                Home
              </Link>
              {currentFolder !== undefined &&
                currentFolder.map((folder, index) => (
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    key={index}
                    to={`/drive/folders/${folder._id}`}
                  >
                    {folder.foldername}
                  </Link>
                ))}
            </Breadcrumbs>
          ) : (
            currentMenu
          )}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {selectedFiles.length === 1 && currentMenu !== "Trash" && (
              <Tooltip title="Rename">
                <IconButton
                  color="inherit"
                  aria-label="Rename"
                  onClick={this.handleRenameOpen}
                >
                  <RenameIcon />
                </IconButton>
              </Tooltip>
            )}{" "}
            {selectedFolders.length === 1 && currentMenu !== "Trash" && (
              <Tooltip title="Rename">
                <IconButton
                  color="inherit"
                  aria-label="Rename"
                  onClick={this.handleRenameFolderOpen}
                >
                  <RenameIcon />
                </IconButton>
              </Tooltip>
            )}
            {renameFolder}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              (currentMenu === "Home" || currentMenu === "Folder") && (
                <Tooltip title="Trash">
                  <IconButton
                    color="inherit"
                    aria-label="Trash"
                    onClick={handleTrash}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "Favorites" && (
                <Tooltip title="Trash">
                  <IconButton
                    color="inherit"
                    aria-label="Trash"
                    onClick={handleFavoritesTrash}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            {selectedFiles.length >= 1 &&
              selectedFolders.length === 0 &&
              currentMenu !== "Trash" && (
                <Tooltip title="Copy">
                  <IconButton
                    color="inherit"
                    aria-label="Copy"
                    onClick={handleFileCopy}
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu !== "Trash" && (
                <Tooltip title="Move">
                  <IconButton
                    color="inherit"
                    aria-label="Move"
                    onClick={this.handleMove}
                  >
                    <MoveToInboxIcon />
                  </IconButton>
                </Tooltip>
              )}
            {moveItem}
            {!isFavorited
              ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
                (currentMenu === "Home" || currentMenu === "Folder") && (
                  <Tooltip title="Add to Starred">
                    <IconButton
                      color="inherit"
                      aria-label="Add to Starred"
                      onClick={handleFavorites}
                    >
                      <StarOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )
              : (selectedFiles.length > 0 || selectedFolders.length > 0) &&
                (currentMenu === "Home" || currentMenu === "Folder") && (
                  <Tooltip title="Remove from Starred">
                    <IconButton
                      color="inherit"
                      aria-label="Remove from Starred"
                      onClick={handleHomeUnfavorited}
                    >
                      <StarOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "Favorites" && (
                <Tooltip title="Remove from Starred">
                  <IconButton
                    color="inherit"
                    aria-label="Remove from Starred"
                    onClick={handleUnfavorited}
                  >
                    <StarOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "Trash" && (
                <Fragment>
                  <Tooltip title="Restore">
                    <IconButton
                      color="inherit"
                      aria-label="Restore"
                      onClick={handleRestore}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Forever">
                    <IconButton
                      color="inherit"
                      aria-label="Delete Forever"
                      onClick={handleDeleteForever}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Fragment>
              )}
            {currentMenu === "Trash" && (
              <Fragment>
                <Tooltip title="Delete All">
                  <IconButton
                    color="inherit"
                    aria-label="Delete All"
                    onClick={handleDeleteAll}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Restore All">
                  <IconButton
                    color="inherit"
                    aria-label="Restore All"
                    onClick={handleRestoreAll}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              </Fragment>
            )}
          </div>{" "}
          <div className={classes.sectionMobile}>
            {
              <Tooltip title="More Options">
                <IconButton
                  color="inherit"
                  aria-label="show more"
                  aria-controls={mobileMenuId}
                  aria-haspopup="true"
                  onClick={this.handleMobileMenuOpen}
                >
                  <MoreIcon />
                </IconButton>
              </Tooltip>
            }{" "}
            {renderMobileMenu}
          </div>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(ActionHeader);
