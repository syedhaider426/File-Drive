import { withStyles } from "@material-ui/styles";
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
import postData from "../helpers/postData";
import RenameFolder from "./RenameFolder";
import RenameFile from "./RenameFile";

const styles = {
  // This group of buttons will be aligned to the right
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  menuButton: {
    marginRight: 16,
    marginLeft: -12,
  },
};

class ActionHeader extends Component {
  state = {
    renameFolderDialogOpen: false,
    renameFileDialogOpen: false,
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
      currentMenu,
      handleFavorites,
      handleRestore,
      handleUnfavorited,
      handleFavoritesTrash,
      isFavorited,
      handleHomeUnfavorited,
      handleRenameOpen,
      handleDeleteAll,
      handleRestoreAll,
    } = this.props;
    const { classes } = this.props;

    return (
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar variant="dense">
          <Typography color="inherit">{currentMenu}</Typography>

          <section className={classes.rightToolbar}>
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
            )}
            <RenameFile
              renameFileDialogOpen={this.state.renameFileDialogOpen}
              handleFileDialog={this.handleDialog}
              files={files}
              selectedFiles={selectedFiles}
              handleSetState={this.props.handleSetState}
              handleFocus={this.handleFocus}
            />
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
            <RenameFolder
              renameFolderDialogOpen={this.state.renameFolderDialogOpen}
              handleDialog={this.handleDialog}
              folders={folders}
              selectedFolders={selectedFolders}
              handleSetState={this.props.handleSetState}
              handleFocus={this.handleFocus}
            />
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "Home" && (
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
                  <IconButton color="inherit" aria-label="Move">
                    <MoveToInboxIcon />
                  </IconButton>
                </Tooltip>
              )}

            {!isFavorited
              ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
                currentMenu === "Home" && (
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
                currentMenu === "Home" && (
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
            {/* <Tooltip title="More Options">
              <IconButton color="inherit" aria-label="More Options">
                <MoreVertIcon />
              </IconButton>
            </Tooltip> */}
          </section>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(ActionHeader);
