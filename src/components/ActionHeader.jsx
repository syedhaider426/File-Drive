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
    renameOpen: false,
    deleteOpen: false,
    copyOpen: false,
    moveOpen: false,
    renamedFile: "",
    renamedFolder: "",
  };

  render() {
    const {
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
    } = this.props;
    const { classes } = this.props;
    return (
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar variant="dense">
          <Typography color="inherit">{currentMenu}</Typography>

          <section className={classes.rightToolbar}>
            {(selectedFiles.length === 1 || selectedFolders.length === 1) &&
              !(selectedFolders.length === 1 && selectedFiles.length === 1) &&
              currentMenu !== "Trash" && (
                <Tooltip title="Rename">
                  <IconButton color="inherit" aria-label="Rename">
                    <RenameIcon />
                  </IconButton>
                </Tooltip>
              )}
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

            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
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
