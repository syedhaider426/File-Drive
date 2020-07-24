import React, { Component, Fragment } from "react";
import { Link, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
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
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import CustomizedAccordions from "../components/Accordion";

class Actions extends Component {
  state = {
    menuOpen: false,
    newFolderOpen: false,
    folder: "",
    folderButtonDisabled: true,
    anchorEl: undefined,
    uploadedPercentage: 0,
    accordionOpen: false,
    uploadFiles: [],
    accordionMsg: "",
  };

  handleClickOpen = (e) => {
    this.setState({ menuOpen: true, anchorEl: e.currentTarget });
  };

  handleClose = (e) => {
    this.setState({ menuOpen: false });
  };

  handleCreateFolderOpen = () => {
    this.setState({ menuOpen: false, newFolderOpen: true });
  };

  handleCreateFolderClose = () => {
    this.setState({ newFolderOpen: false });
  };

  handleFolderOnChange = (e) => {
    if (e.target.value === "") this.setState({ folderButtonDisabled: true });
    else this.setState({ folder: e.target.value, folderButtonDisabled: false });
  };

  handleFileUploadOpen = () => {
    this.setState({ menuOpen: false });
    document.getElementById("upload-file").click();
  };

  handleCreateFolder = (e) => {
    e.preventDefault();
    const data = { folder: this.state.folder };
    const folder = this.props.match.params.folder
      ? `/${this.props.match.params.folder}`
      : "";
    postData(`/api/folders/create${folder}`, data)
      .then((data) => {
        const { folders, newFolder } = { ...data };
        this.setState(
          { newFolderOpen: false },
          this.props.handleSetState({
            folders,
            mobileOpen: false,
            selectedFolders: newFolder,
            selectedFiles: [],
          })
        );
      })
      .catch((err) => console.log("Err", err));
  };

  handleFileUpload = (e) => {
    const files = e.target.files;
    const form = new FormData();
    const uploadFiles = [];
    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i], files[i].name);
      uploadFiles.push(files[i].name);
    }
    this.setState({
      accordionOpen: true,
      accordionMsg: `Uploading ${files.length} files...`,
      uploadFiles,
      filesStatus: false,
    });
    const folder = this.props.match.params.folder
      ? `/${this.props.match.params.folder}`
      : "";
    axios
      .post(`/api/files/upload${folder}`, form)
      .then((d) => {
        const { data } = { ...d };
        const { files, uploadedFiles } = data;
        this.setState({
          menuOpen: false,
          filesStatus: true,
          accordionMsg: `Uploaded ${uploadedFiles.length} files`,
        });
        console.log(this.props.match.url);
        if (this.props.match.url !== "/drive/home") {
          this.props.history.push("/drive/home");
        }
        this.props.handleSetState({
          files,
          mobileOpen: false,
          selectedFiles: uploadedFiles,
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Error", err));
  };

  render() {
    const {
      menuOpen,
      newFolderOpen,
      folderButtonDisabled,
      accordionOpen,
      uploadFiles,
      accordionMsg,
      filesStatus,
    } = {
      ...this.state,
    };
    const {
      handleClose,
      handleClickOpen,
      handleFileUploadOpen,
      handleCreateFolderOpen,
      handleCreateFolderClose,
      handleCreateFolder,
      handleFolderOnChange,
      handleFileUpload,
    } = { ...this };

    const actionsMenu = (
      <Menu
        open={menuOpen}
        onClose={handleClose}
        anchorEl={this.state.anchorEl}
      >
        <MenuItem onClick={handleCreateFolderOpen}>
          <CreateNewFolderOutlinedIcon />
          <Typography variant="inherit">New Folder</Typography>
        </MenuItem>
        <MenuItem onClick={handleFileUploadOpen}>
          <FileIcon />
          <Typography variant="inherit">File Upload</Typography>
        </MenuItem>
      </Menu>
    );

    const newFolderDialog = (
      <Dialog
        open={newFolderOpen}
        onClose={handleCreateFolderClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create Folder </DialogTitle>
        <form onSubmit={handleCreateFolder} method="POST">
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              id="folder"
              label="Folder"
              fullWidth
              onChange={handleFolderOnChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCreateFolderClose} color="primary">
              Cancel
            </Button>
            <Button
              disabled={folderButtonDisabled}
              onClick={handleCreateFolderClose}
              color="primary"
              type="submit"
            >
              Confirm
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    );

    const HomeLink = React.forwardRef((props, ref) => (
      <Link to={"/drive/home"} {...props} ref={ref} />
    ));
    const FavoritesLink = React.forwardRef((props, ref) => (
      <Link to={"/drive/favorites"} {...props} ref={ref} />
    ));

    const TrashLink = React.forwardRef((props, ref) => (
      <Link to={"/drive/trash"} {...props} ref={ref} />
    ));
    return (
      <Fragment>
        {actionsMenu}
        {newFolderDialog}
        <input
          style={{ display: "none" }}
          id="upload-file"
          name="upload-file"
          type="file"
          multiple="multiple"
          onChange={(e) => handleFileUpload(e)}
        />

        <List>
          <ListItem>
            <Button
              variant="outlined"
              onClick={handleClickOpen}
              color="default"
              elevation={3}
              startIcon={<CloudUploadIcon />}
            >
              Upload
            </Button>
          </ListItem>
          <ListItem
            button
            component={HomeLink}
            selected={
              this.props.menu !== "Trash" && this.props.menu !== "Favorites"
            }
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
          <ListItem
            button
            component={FavoritesLink}
            selected={this.props.menu === "Favorites"}
          >
            <ListItemIcon>
              <StarIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
          </ListItem>
          <ListItem
            button
            component={TrashLink}
            selected={this.props.menu === "Trash"}
          >
            <ListItemIcon>
              <DeleteIcon />
            </ListItemIcon>
            <ListItemText primary="Trash" />
          </ListItem>
        </List>
        <Divider />
        <CustomizedAccordions
          accordionOpen={accordionOpen}
          uploadFiles={uploadFiles}
          accordionMsg={accordionMsg}
          filesStatus={filesStatus}
        />
      </Fragment>
    );
  }
}

export default withRouter(Actions);
