import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import postData from "../helpers/postData";
import Snack from "./Snack";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import FolderIcon from "@material-ui/icons/Folder";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  demo: {
    backgroundColor: theme.palette.background.paper,
  },
});

class MoveItem extends Component {
  state = {
    moveOpen: false,
    movedSnack: false,
    movedFolder: {},
    moveButtonDisabled: true,
    selectedFiles: [],
    selectedFolders: [],
    selectedIndex: undefined,
    tempSelectedFiles: {},
    tempSelectedFolders: {},
  };

  handleMoveSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      movedSnack: false,
    });
  };

  handleMoveItemClose = () => {
    this.setState(
      { selectedIndex: undefined, moveButtonDisabled: true },
      this.props.handleDialog({ moveItemDialogOpen: false })
    );
  };

  handleMoveItem = (e) => {
    e.preventDefault();
    const { movedFolder } = { ...this.state };
    const { selectedFolders, selectedFiles } = { ...this.props };
    const data = {
      movedFolder: movedFolder.id,
      selectedFolders,
      selectedFiles,
    };
    postData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      this.setState({
        movedSnack: true,
        tempSelectedFolders: selectedFolders,
        tempSelectedFiles: selectedFiles,
      });
      this.props.handleSetState({
        files,
        folders,
        selectedFiles: [],
        selectedFolders: [],
      });
    });
  };

  handleUndoMoveItem = (e) => {
    e.preventDefault();
    const { tempSelectedFolders, tempSelectedFiles } = {
      ...this.state,
    };
    let originalFolder;
    if (tempSelectedFolders.length > 0) {
      originalFolder = tempSelectedFolders[0].parent_id;
    } else originalFolder = tempSelectedFiles[0].folder_id;
    const data = {
      movedFolder: originalFolder,
      selectedFolders: tempSelectedFolders,
      selectedFiles: tempSelectedFiles,
    };
    postData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      this.setState({
        tempMovedFolder: {},
        movedSnack: false,
      });
      this.props.handleSetState({
        files,
        folders,
      });
    });
  };

  handleOnClick = (id, foldername, parent_id, selectedIndex) => {
    this.setState({
      selectedIndex: selectedIndex,
      moveButtonDisabled: false,
      movedFolder: { id, foldername },
    });
  };

  handleSnackbarExit = () => {
    if (this.state.tempMovedFolder) {
      this.setState({
        tempMovedFolder: {},
        movedFolder: {},
      });
    }
    return;
  };

  render() {
    const { movedSnack, moveButtonDisabled } = {
      ...this.state,
    };
    const { folders, classes } = {
      ...this.props,
    };
    const moveSnack = (
      <Snack
        open={movedSnack}
        onClose={this.handleMoveSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Moved to "${this.state.movedFolder.foldername}"`}
        onClick={this.handleUndoMoveItem}
      />
    );
    let moveFolders = folders;

    const moveFileDialog = (
      <Dialog
        open={this.props.moveItemDialogOpen}
        onClose={this.handleMoveItemClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={this.handleMoveItemClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={this.handleMoveItem} method="POST">
          <DialogContent>
            <div className={classes.demo}>
              <List dense={true}>
                {moveFolders.map((folder, index) => (
                  <ListItem
                    alignItems="center"
                    selected={index === this.state.selectedIndex}
                    onClick={() =>
                      this.handleOnClick(folder._id, folder.foldername, index)
                    }
                    key={folder._id}
                  >
                    <ListItemIcon>
                      <FolderIcon />
                    </ListItemIcon>
                    <ListItemText primary={folder.foldername} />
                  </ListItem>
                ))}
              </List>
            </div>
          </DialogContent>
          <DialogActions>
            <Button
              disabled={moveButtonDisabled}
              onClick={this.handleMoveItemClose}
              color="primary"
              type="submit"
            >
              Move Here
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    return (
      <Fragment>
        {moveSnack}
        {moveFileDialog}
      </Fragment>
    );
  }
}

export default withStyles(styles)(MoveItem);
