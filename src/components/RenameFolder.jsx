import React, { Component, Fragment } from "react";
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

class RenameFolder extends Component {
  state = {
    renamedSnack: false,
    folderButtonDisabled: false,
    foldername: "",
    renamedFolder: {},
  };

  handleRenameSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      renamedSnack: false,
    });
  };

  handleRenameFolderClose = () => {
    this.props.handleDialog({ renameFolderDialogOpen: false });
  };

  handleFolderOnChange = (e) => {
    if (e.target.value === "") this.setState({ folderButtonDisabled: true });
    else
      this.setState({
        foldername: e.target.value,
        folderButtonDisabled: false,
      });
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
    const { selectedFolders } = { ...this.props };
    const renameSnack = (
      <Snack
        open={renamedSnack}
        onClose={this.handleRenameSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Renamed "${this.state.renamedFolder.foldername}" to "${this.state.foldername}"`}
        onClick={this.handleUndoRenameFolder}
      />
    );

    const renameFolderDialog = (
      <Dialog
        open={this.props.renameFolderDialogOpen}
        onClose={this.handleRenameFolderClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Rename</DialogTitle>
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
              disabled={folderButtonDisabled}
              onClick={this.handleRenameFolderClose}
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

export default RenameFolder;
