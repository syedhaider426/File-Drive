import React, { useState, Fragment } from "react";
import { Link, useParams, useHistory, useLocation } from "react-router-dom";
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
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import CustomizedAccordions from "../components/Accordion";

export default function Actions({ handleSetState, menu }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [newFolderOpen, setNewFolderOpen] = useState(false);
  const [folder, setFolder] = useState("");
  const [folderButtonDisabled, setFolderButtonDisabled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(undefined);
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [uploadFiles, setUploadFiles] = useState([]);
  const [accordionMsg, setAccordionMsg] = useState("");
  const [filesStatus, setFilesStatus] = useState(false);
  const params = useParams();
  const history = useHistory();
  const location = useLocation();
  const handleClickOpen = (e) => {
    setMenuOpen(true);
    setAnchorEl(e.currentTarget);
  };

  const handleClose = (e) => {
    setMenuOpen(false);
  };

  const handleCreateFolderOpen = () => {
    setMenuOpen(false);
    setNewFolderOpen(true);
  };

  const handleCreateFolderClose = () => {
    setNewFolderOpen(false);
  };

  const handleFolderOnChange = (e) => {
    if (e.target.value === "") setFolderButtonDisabled(true);
    else {
      setFolder(e.target.value);
      setFolderButtonDisabled(false);
    }
  };

  const handleFileUploadOpen = () => {
    setMenuOpen(false);
    document.getElementById("upload-file").click();
  };

  const handleCreateFolder = (e) => {
    e.preventDefault();
    const data = { folder: folder };
    const folderId = params.folder ? `/${params.folder}` : "";
    postData(`/api/folders${folderId}`, data)
      .then((data) => {
        const { folders, newFolder } = { ...data };
        setNewFolderOpen(false);
        handleSetState({
          folders,
          mobileOpen: false,
          selectedFolders: newFolder,
          selectedFiles: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleFileUpload = (e) => {
    const files = e.target.files;
    const form = new FormData();
    const uploadFiles = [];
    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i], files[i].name);
      uploadFiles.push(files[i].name);
    }
    setAccordionOpen(true);
    setAccordionMsg(`Uploading ${files.length} files...`);
    setUploadFiles(uploadFiles);
    setFilesStatus(false);
    const folder = params.folder ? `/${params.folder}` : "";
    postData(`/api/files/upload${folder}`, form)
      .then((data) => {
        const { files, uploadedFiles } = data;
        setMenuOpen(false);
        setFilesStatus(true);
        setAccordionMsg(`Uploaded ${uploadedFiles.length} files`);
        if (location.pathname !== "/drive/home") {
          history.push("/drive/home");
        }
        handleSetState({
          files,
          mobileOpen: false,
          selectedFiles: uploadedFiles,
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Error", err));
  };

  const actionsMenu = (
    <Menu open={menuOpen} onClose={handleClose} anchorEl={anchorEl}>
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
          selected={menu !== "Trash" && menu !== "Favorites"}
        >
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem
          button
          component={FavoritesLink}
          selected={menu === "Favorites"}
        >
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Favorites" />
        </ListItem>
        <ListItem button component={TrashLink} selected={menu === "Trash"}>
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
