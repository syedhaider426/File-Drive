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
    movedFolder: "",
    moveButtonDisabled: true,
    selectedFiles: [],
    selectedFolders: [],
    selectedIndex: undefined,
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
    const data = { movedFolder, selectedFolders, selectedFiles };
    if (this.state.movedFolder.length > 0)
      postData("/api/files/move", data).then((data) => {
        console.log(data);
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      });
  };

  handleOnClick = (id, selectedIndex) => {
    console.log("index", id);
    this.setState({
      selectedIndex: selectedIndex,
      moveButtonDisabled: false,
      movedFolder: id,
    });
  };

  handleSnackbarExit = () => {
    if (this.state.movedFolder) {
      this.setState({
        movedFolder: {},
      });
    }
    return;
  };

  render() {
    const { movedSnack, moveButtonDisabled } = {
      ...this.state,
    };
    const { selectedFiles, selectedFolders, classes } = { ...this.props };
    const moveSnack = (
      <Snack
        open={movedSnack}
        onClose={this.handleMoveSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Moved to "${this.state.movedFolder.foldername}"`}
        onClick={this.handleUndoMoveFile}
      />
    );
    let moveFolders = [];
    if (selectedFolders.length > 0) {
      moveFolders = this.props.folders.filter(
        (folder) => folder._id != selectedFolders[0].id
      );
    }

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
                    selected={index == this.state.selectedIndex}
                    onClick={() => this.handleOnClick(folder._id, index)}
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
