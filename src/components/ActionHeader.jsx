import { withStyles } from "@material-ui/styles";
import React, { Component } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import Tooltip from "@material-ui/core/Tooltip";
import { Dialog, TextField } from "@material-ui/core";
// import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlineOutlined";

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
    const { renameOpen, moveOpen } = this.state;
    const {
      selectedFiles,
      selectedFolders,
      handleDelete,
      handleDeleteForever,
      handleFileCopy,
      currentMenu,
      handleRestore,
    } = this.props;
    const { classes } = this.props;
    return (
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar variant="dense">
          <Typography color="inherit">My Drive</Typography>

          <section className={classes.rightToolbar}>
            {(selectedFiles.length === 1 || selectedFolders.length === 1) &&
              !(selectedFolders.length === 1 && selectedFiles.length === 1) &&
              currentMenu !== "trash" && (
                <Tooltip title="Rename">
                  <IconButton color="inherit" aria-label="Rename">
                    <RenameIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu !== "trash" && (
                <Tooltip title="Delete">
                  <IconButton
                    color="inherit"
                    aria-label="Delete"
                    onClick={handleDelete}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            {selectedFiles.length >= 1 &&
              selectedFolders.length === 0 &&
              currentMenu !== "trash" && (
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
              currentMenu !== "trash" && (
                <Tooltip title="Move">
                  <IconButton color="inherit" aria-label="Move">
                    <MoveToInboxIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "trash" && (
                <Tooltip title="Delete Forever">
                  <IconButton
                    color="inherit"
                    aria-label="Delete Forever"
                    onClick={handleDeleteForever}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "trash" && (
                <Tooltip title="Restore">
                  <IconButton
                    color="inherit"
                    aria-label="Restore"
                    onClick={handleRestore}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
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
