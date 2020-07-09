import React, { Fragment, Component } from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import postData from "../helpers/postData";
import StarIcon from "@material-ui/icons/Star";
import HomeIcon from "@material-ui/icons/Home";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import { Grid, Divider } from "@material-ui/core";

class Actions extends Component {
  state = { open: false, newFolderOpen: false, folder: "" };
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
    postData("/api/folders/create", data)
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
    fetch("/api/files/upload", { method: "POST", body: form })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        this.setState({ open: false });
      })
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

    const HomeLink = React.forwardRef((props, ref) => (
      <Link to={"/home"} {...props} ref={ref} />
    ));
    const FavoritesLink = React.forwardRef((props, ref) => (
      <Link to={"/favorites"} {...props} ref={ref} />
    ));
    const TrashLink = React.forwardRef((props, ref) => (
      <Link to={"/trash"} {...props} ref={ref} />
    ));
    return (
      <Grid item xs={2}>
        <Button
          variant="outlined"
          onClick={this.handleClickOpen}
          color="default"
          elevation={3}
          startIcon={<CloudUploadIcon />}
        >
          Upload
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

        <List>
          <ListItem button component={HomeLink}>
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>

          <ListItem button component={FavoritesLink}>
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
          </ListItem>

          <ListItem button component={TrashLink}>
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Trash" />
          </ListItem>
        </List>
        <Divider />
      </Grid>
    );
  }
}

export default Actions;
