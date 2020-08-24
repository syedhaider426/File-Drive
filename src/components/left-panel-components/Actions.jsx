import React, { useState, Fragment } from "react";
import { Link, useParams, useLocation, useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import TextField from "@material-ui/core/TextField";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import Divider from "@material-ui/core/Divider";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Typography from "@material-ui/core/Typography";
import StarIcon from "@material-ui/icons/Star";
import HomeIcon from "@material-ui/icons/Home";
import DeleteIcon from "@material-ui/icons/Delete";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import CreateNewFolderOutlinedIcon from "@material-ui/icons/CreateNewFolderOutlined";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import CustomizedAccordions from "../reusable-components/Accordion";
import Axios from "axios";
import postData from "../../helpers/postData";
import sortFolders from "../../helpers/sortFolders";
import sortFiles from "../../helpers/sortFiles";

// User will utilize this drawer/panel to upload files, create new folders, and navigate between menus (Home, Favorites, Trash)
function Actions({
  setItems,
  setSelectedItems,
  items,
  menu,
  drawerMobileOpen,
  setDrawerMobileOpen,
  sortColumn,
}) {
  // When user clicks 'Upload', it opens a menu
  const [menuOpen, setMenuOpen] = useState(false);
  // When the clicks the 'Upload', this anchors the menu at the button
  const [anchorEl, setAnchorEl] = useState(undefined);

  // When user clicks 'New Folder', it opens a menu
  const [newFolderOpen, setNewFolderOpen] = useState(false);

  // When creating a new folder, this represents the new folder name
  const [folder, setFolder] = useState("");

  // When a user uploads a file, the accordion is displayed
  const [accordionOpen, setAccordionOpen] = useState(false);

  // uploadfiles represents the list of files being uploaded
  const [uploadFiles, setUploadFiles] = useState([]);

  // the title of the accordion
  const [accordionMsg, setAccordionMsg] = useState("");

  // when all files are uploaded, set files status to true
  const [filesStatus, setFilesStatus] = useState(false);
  const params = useParams();
  const location = useLocation();
  const history = useHistory();

  // User clicks 'Upload' and opens the 'Menu' at anchor location
  const handleClickOpen = (e) => {
    setMenuOpen(true);
    setAnchorEl(e.currentTarget);
  };

  // Close 'Upload' menu
  const handleClose = (e) => {
    setMenuOpen(false);
  };

  // User clicks 'New Folder' and opens the new folder dialog
  const handleCreateFolderOpen = () => {
    setMenuOpen(false);
    setNewFolderOpen(true);
  };

  // Closes the new folder dialog
  const handleCreateFolderClose = () => {
    setNewFolderOpen(false);
  };

  // When the value for the folder changes, update the folder hook
  const handleFolderOnChange = (e) => {
    setFolder(e.target.value);
  };

  // Close the accordion
  const handleCloseAccordion = () => {
    setAccordionOpen(false);
  };

  // When user selects 'New File', it closes current menu and opens user's file explorer
  const handleFileUploadOpen = () => {
    setMenuOpen(false);
    document.getElementById("upload-file").click();
  };

  // Creates a folder based off name provided in specific directory or just in 'Home' if params is empty
  const handleCreateFolder = (e) => {
    e.preventDefault();
    const data = { folder: folder };
    const folderId = params.folder ? `/${params.folder}` : "";
    postData(`/api/folders${folderId}`, data)
      .then((data) => {
        const { newFolder } = { ...data };
        const { folders } = { ...items };
        // Adds new folder to list of folders
        folders.push(newFolder[0]);
        // Actions drawer will be closed if it is open
        if (drawerMobileOpen) setDrawerMobileOpen(false);
        // Closes 'Create Folder' dialog
        setNewFolderOpen(false);
        // Sorts files
        let sortedFolders = sortFolders(folders, sortColumn);
        setItems({ ...items, folders: sortedFolders });
        setSelectedItems({ selectedFiles: [], selectedFolders: newFolder });
        // If the current path is not in home or folders, go to home
        if (
          location.pathname !== "/drive/home" &&
          !location.pathname.startsWith("/drive/folders")
        )
          history.push("/drive/home");
      })
      .catch((err) => console.log("Err", err));
  };

  // Uploads a file in a specific directory or just in 'Home' if params is empty
  const handleFileUpload = (e) => {
    const files = e.target.files;
    const form = new FormData();
    const uploadFiles = [];
    // Append uploaded files to form and pass it to the request with content-type multipart/form-data
    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i], files[i].name);
      uploadFiles.push(files[i].name);
    }
    const folder = params.folder ? `/${params.folder}` : "";
    setAccordionOpen(true); //Open accordion
    setAccordionMsg(
      `Uploading ${files.length} file${files.length > 1 ? "s" : ""}...`
    ); // Title shown in Accordion
    setUploadFiles(uploadFiles); // Files shown in accordion
    setFilesStatus(false); // Files have not been uploaded
    Axios.post(`/api/files/upload${folder}`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
      .then((d) => {
        const { data } = { ...d };
        const { files, uploadedFiles } = { ...data };
        if (drawerMobileOpen) setDrawerMobileOpen(false);
        setMenuOpen(false); // Close 'Upload' menu
        setFilesStatus(true); // All files have been uploaded
        setAccordionMsg(
          `Uploaded ${uploadedFiles.length} file${files.length > 1 ? "s" : ""}`
        ); //Title shown in Accordion
        let sortedFiles = sortFiles(files, sortColumn); // Sort files
        setItems({ ...items, files: sortedFiles });
        setSelectedItems({ selectedFiles: uploadedFiles, selectedFolders: [] });
        // If the current path is not in home or folders, go to home
        if (
          location.pathname !== "/drive/home" &&
          !location.pathname.startsWith("/drive/folders")
        )
          history.push("/drive/home");
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
            disabled={folder.length === 0}
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
        handleCloseAccordion={handleCloseAccordion}
      />
    </Fragment>
  );
}

export default React.memo(Actions);
