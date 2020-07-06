import React, { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import postData from "../helpers/postData";

class Actions extends Component {
  state = { open: false, newFolderOpen: false, errors: "", folder: "" };
  handleClickOpen = (e) => {
    this.setState({ open: true });
  };

  handleClose = (e) => {
    this.setState({ open: false });
  };

  handleCreateFolderOpen = () => {
    this.setState({ open: false, newFolderOpen: true });
  };

  handleCreateFolderClose = () => {
    this.setState({ newFolderOpen: false });
  };

  handleFolderOnChange = (e) => {
    this.setState({ folder: e.target.value });
  };

  handleCreateFolder = (e) => {
    e.preventDefault();
    const data = { folder: this.state.folder };
    postData("/api/folders/create", JSON.stringify(data))
      .then((data) => {
        console.log(data);
        this.setState({ newFolderOpen: false });
      })
      .catch((err) => console.log("Err", err));
  };

  handleFileUploadOpen = () => {
    document.getElementById("upload-file").click();
  };

  handleFileUpload = (e) => {
    const files = e.target.files;
    const form = new FormData();
    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i], files[i].name);
    }
    postData("/api/files/upload")
      .then((data) => console.log(data))
      .catch((err) => console.log("Errasdasdsa", err));
  };

  render() {
    const { open, newFolderOpen } = { ...this.state };
    const actionsDialog = (
      <Dialog
        open={open}
        onClose={this.handleClose}
        BackdropProps={{ style: { backgroundColor: "transparent" } }}
      >
        <List>
          <ListItem button onClick={this.handleCreateFolderOpen}>
            New Folder
          </ListItem>
          <ListItem button onClick={this.handleFileUploadOpen}>
            File upload
          </ListItem>
          <ListItem button onClick={this.handleFolderUpload}>
            Folder Upload
          </ListItem>
        </List>
      </Dialog>
    );

    const newFolderDialog = (
      <Dialog open={newFolderOpen} onClose={this.handleCreateFolderClose}>
        <form onSubmit={this.handleCreateFolder} method="POST">
          <TextField
            autoFocus
            id="folder"
            label="Folder"
            onChange={this.handleFolderOnChange}
          />
          <button onClick={this.handleCreateFolderClose}>Cancel</button>
          <button type="submit">Submit</button>
        </form>
      </Dialog>
    );

    return (
      <Fragment>
        <Button
          variant="outlined"
          color="primary"
          onClick={this.handleClickOpen}
        >
          New +
        </Button>
        {actionsDialog}
        {newFolderDialog}
        <input
          style={{ display: "none" }}
          id="upload-file"
          name="upload-file"
          type="file"
          multiple="multiple"
          onChange={(e) => this.handleFileUpload(e)}
        />
        <div>
          <Link to="/home">My Drive</Link>
        </div>
        <div>
          <Link to="/favorites">Starred</Link>
        </div>
        <div>
          <Link to="/trash">Trash</Link>
        </div>
      </Fragment>
    );
  }
}

export default Actions;
