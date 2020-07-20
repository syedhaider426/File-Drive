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

class RenameFile extends Component {
  state = {
    renamedSnack: false,
    filename: "",
    renamedFile: {},
  };

  handleRenameSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.handleSetState({
      renamedSnack: false,
    });
  };

  handleRenameFileClose = () => {
    this.setState(
      { filename: "" },
      this.props.handleDialog({ renameFileDialogOpen: false })
    );
  };

  handleFileOnChange = (e) => {
    if (e.target.value === "") this.setState({ filename: "" });
    else
      this.setState({
        filename: e.target.value,
      });
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
          return false;
        });
        this.setState(
          {
            renamedFile: selectedFiles[0],
            renamedSnack: true,
          },
          this.props.handleDialog(
            { renameFileDialogOpen: false },
            { files, selectedFiles }
          )
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
          return false;
        });
        const selectFiles = selectedFiles;
        selectFiles[0].filename = renamedFile.filename;
        this.setState(
          {
            renamedFile: {},
            renamedSnack: false,
            fileName: "",
          },
          this.props.handleSetState({ files, selectedFiles: selectFiles })
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleSnackbarExit = () => {
    if (this.state.renamedFile) {
      this.setState({
        renamedFile: {},
      });
    }
    return;
  };

  render() {
    const { renamedSnack, filename } = {
      ...this.state,
    };
    const { selectedFiles, classes } = { ...this.props };
    const renameSnack = (
      <Snack
        open={renamedSnack}
        onClose={this.handleRenameSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Renamed "${this.state.renamedFile.filename}" to "${this.state.filename}"`}
        onClick={this.handleUndoRenameFile}
      />
    );
    const defaultValue = selectedFiles[0] && selectedFiles[0].filename;
    const renameFileDialog = (
      <Dialog
        open={this.props.renameFileDialogOpen}
        onClose={this.handleRenameFileClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">
          Rename
          <IconButton
            aria-label="close"
            className={classes.closeButton}
            onClick={this.handleRenameFileClose}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={this.handleRenameFile} method="POST">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="file"
              fullWidth
              defaultValue={defaultValue}
              onFocus={this.props.handleFocus}
              onChange={this.handleFileOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleRenameFileClose} color="primary">
              Cancel
            </Button>
            <Button disabled={filename === ""} color="primary" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    return (
      <Fragment>
        {renameSnack}
        {renameFileDialog}
      </Fragment>
    );
  }
}

export default withStyles(styles)(RenameFile);
