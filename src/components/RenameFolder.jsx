import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
  IconButton,
} from "@material-ui/core";
import postData from "../helpers/postData";
import Snack from "./Snack";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";

const styles = (theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
});

class RenameFolder extends Component {
  state = {
    renamedSnack: false,
    folderButtonDisabled: true,
    foldername: "",
    renamedFolder: {},
  };

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.renameFolderDialogOpen != nextProps.renameFolderDialogOpen)
      return true;
    return false;
  }

  handleRenameSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      renamedSnack: false,
    });
  };

  handleRenameFolderClose = () => {
    this.setState(
      { folderButtonDisabled: true },
      this.props.handleDialog({ renameFolderDialogOpen: false })
    );
  };

  handleFolderOnChange = (e) => {
    console.log(e.target.value);
    if (e.target.value === "") this.setState({ folderButtonDisabled: true });
    else {
      console.log(this.state.foldername);
      this.setState({
        foldername: e.target.value,
        folderButtonDisabled: false,
      });
    }
  };

  handleRenameFolder = (e) => {
    e.preventDefault();
    const { selectedFolders } = { ...this.props };
    const { foldername } = { ...this.state };
    const data = {
      id: selectedFolders[0].id,
      newName: foldername,
    };

    postData("/api/folders/rename", data)
      .then((data) => {
        let folders = this.props.folders;
        folders.find((o, i, arr) => {
          if (o._id === selectedFolders[0].id) {
            arr[i].foldername = foldername;
            return true;
          }
          return false;
        });
        this.setState(
          {
            renamedFolder: selectedFolders[0],
            renamedSnack: true,
          },
          this.props.handleSetState({ folders })
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoRenameFolder = () => {
    const { renamedFolder } = { ...this.state };
    const { selectedFolders } = { ...this.props };
    const data = {
      id: renamedFolder.id,
      newName: renamedFolder.foldername,
    };

    postData("/api/folders/rename", data)
      .then((data) => {
        let folders = this.props.folders;
        folders.find((o, i, arr) => {
          if (o._id === selectedFolders[0].id) {
            arr[i].foldername = selectedFolders[0].foldername;
            return true;
          }
          return false;
        });
        this.setState(
          {
            renamedFolder: {},
            renamedSnack: false,
            folderName: "",
          },
          this.props.handleSetState({ folders })
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleSnackbarExit = () => {
    if (this.state.renamedFolder) {
      this.setState({
        renamedFolder: {},
      });
    }
    return;
  };
  render() {
    const { renamedSnack, folderButtonDisabled } = {
      ...this.state,
    };
    const { selectedFolders, classes } = { ...this.props };
    const renameSnack = (
      <Snack
        open={renamedSnack}
        onClose={this.handleRenameSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Renamed "${this.state.renamedFolder.foldername}" to "${this.state.foldername}"`}
        onClick={this.handleUndoRenameFolder}
      />
    );
    console.log("Folders", this.state.foldername);
    const renameFolderDialog = (
      <Dialog
        open={this.props.renameFolderDialogOpen}
        onClose={this.handleRenameFolderClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Rename
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={this.handleRenameFolderClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={this.handleRenameFolder} method="POST">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              onFocus={this.props.handleFocus}
              id="folder"
              defaultValue={
                selectedFolders[0] === undefined
                  ? ""
                  : selectedFolders[0].foldername
              }
              fullWidth
              onChange={this.handleFolderOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRenameFolderClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={this.state.foldername === ""}
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
      <Fragment>
        {renameSnack}
        {renameFolderDialog}
      </Fragment>
    );
  }
}

export default withStyles(styles)(RenameFolder);
