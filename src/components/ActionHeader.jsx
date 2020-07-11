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
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@material-ui/core";
import postData from "../helpers/postData";
import Snack from "./Snack";

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
    filename: "",
    foldername: "",
    renamedFile: {},
    renamedFolder: {},
    fileButtonDisabled: true,
    renamedSnack: false,
    originalFileName: "",
  };

  handleRenameOpen = () => {
    this.setState({ renameOpen: true });
  };

  handleRenameFileClose = () => {
    this.setState({ renameOpen: false });
  };

  handleFileOnChange = (e) => {
    if (e.target.value === "") this.setState({ fileButtonDisabled: true });
    else this.setState({ filename: e.target.value, fileButtonDisabled: false });
  };

  handleRenameFile = (e) => {
    e.preventDefault();
    const { selectedFiles } = { ...this.props };
    const { filename } = { ...this.state };
    const data = {
      id: selectedFiles[0].id,
      newName: filename,
    };
    postData("/api/files/rename", data)
      .then((data) => {
        let files = this.props.files;
        files.find((o, i, arr) => {
          if (o._id === selectedFiles[0].id) {
            arr[i].filename = filename;
            return true;
          }
        });
        this.setState(
          {
            renameOpen: false,
            renamedFile: selectedFiles[0],
            renamedSnack: true,
          },
          this.props.handleSetState({ files })
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoRenameFile = () => {
    const { renamedFile } = { ...this.state };
    const { selectedFiles } = { ...this.props };
    const data = {
      id: renamedFile.id,
      newName: renamedFile.filename,
    };

    postData("/api/files/rename", data)
      .then((data) => {
        let files = this.props.files;
        files.find((o, i, arr) => {
          if (o._id === selectedFiles[0].id) {
            arr[i].filename = selectedFiles[0].filename;
            return true;
          }
        });
        this.setState(
          {
            renameOpen: false,
            renamedFile: {},
            renamedSnack: false,
            fileName: "",
          },
          this.props.handleSetState({ files })
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleSnackbarExit = () => {
    if (this.state.renamedFile || this.state.renamedFolder) {
      this.setState({
        renamedFile: {},
        renamedFolder: {},
      });
    }
    return;
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
    } = this.props;
    const { classes } = this.props;

    const {
      renameOpen,
      deleteOpen,
      copyOpen,
      moveOpen,
      renamedFile,
      renamedFolder,
      fileButtonDisabled,
      renamedSnack,
    } = { ...this.state };

    const renameSnack = (
      <Snack
        open={renamedSnack}
        onClose={this.handleRenameSnackClose}
        onExit={this.handleSnackbarExit}
        message={`Renamed "${this.state.renamedFile.filename}" to "${this.state.filename}"`}
        onClick={this.handleUndoRenameFile}
      />
    );

    const renameFileDialog = (
      <Dialog
        open={renameOpen}
        onClose={this.handleRenameFileClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Rename</DialogTitle>
        <form onSubmit={this.handleRenameFile} method="POST">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              onFocus={this.handleFocus}
              id="file"
              defaultValue={
                selectedFiles[0] === undefined ? "" : selectedFiles[0].filename
              }
              fullWidth
              onChange={this.handleFileOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRenameFileClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={fileButtonDisabled}
              onClick={this.handleRenameFileClose}
              color="primary"
              type="submit"
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    return (
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar variant="dense">
          <Typography color="inherit">{currentMenu}</Typography>

          <section className={classes.rightToolbar}>
            {(selectedFiles.length === 1 || selectedFolders.length === 1) &&
              !(selectedFolders.length === 1 && selectedFiles.length === 1) &&
              currentMenu !== "Trash" && (
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
            {renameFileDialog}
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
            {renameSnack}
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
