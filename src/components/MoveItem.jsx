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
  MenuItem,
  Menu,
  ListSubheader,
  Typography,
} from "@material-ui/core";
import { Link, withRouter } from "react-router-dom";
import postData from "../helpers/postData";
import Snack from "./Snack";
import { withStyles } from "@material-ui/core/styles";
import CloseIcon from "@material-ui/icons/Close";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import getData from "../helpers/getData";

const styles = (theme) => ({
  dialogPaper: {
    height: "100%",
    minHeight: "49vh",
    maxHeight: "50vh",
    padding: 0,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  smallIcon: {
    width: "1em",
    height: "1em",
    "&:hover": {
      backgroundColor: "#5f6368",
    },
  },
  textContainer: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "35vw",
  },
});

class MoveItem extends Component {
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
      const filesModified = selectedFolders.length + selectedFiles.length;
      this.setState({
        movedSnack: true,
        tempSelectedFolders: selectedFolders,
        tempSelectedFiles: selectedFiles,
      });
      this.props.handleSetState({
        files,
        folders,
        filesModified,
        selectedFiles: [],
        selectedFolders: [],
      });
    });
  };

  handleNextFolder = (folder) => {
    getData(`/api/drive/folders/${folder._id}`)
      .then((data) => {
        this.props.handleSetState({
          allFolders: data.folders,
          homeFolderStatus: false,
          movedFolder: { id: folder._id, foldername: folder.foldername },
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handlePreviousFolder = (folder_id) => {
    console.log("folder_id", folder_id);

    const urlParam =
      folder_id === "" ? "drive/home" : `drive/folders/${folder_id}`;
    getData(`/api/${urlParam}`)
      .then((data) => {
        this.props.handleSetState({
          allFolders: data.folders,
          homeFolderStatus: folder_id === "",
          movedFolder: {},
        });
      })
      .catch((err) => console.log("Err", err));
  };

  render() {
    const {
      allFolders,
      classes,
      homeFolderStatus,
      selectedFolders,
      movedFolder,
    } = {
      ...this.props,
    };
    console.log(movedFolder);
    const moveFileDialog = (
      <Dialog
        open={this.props.moveMenuOpen ? true : false}
        onClose={this.props.handleMoveItemClose}
        onExited={this.props.onMoveExit}
        className={classes.dialogPaper}
        style={{ padding: 0 }}
        fullWidth
        maxWidth={"xs"}
      >
        {" "}
        <DialogTitle style={{ padding: 0 }}>
          {!homeFolderStatus ? (
            <Fragment>
              <IconButton
                onClick={() => this.handlePreviousFolder(movedFolder.parent_id)}
              >
                <ArrowBackIcon />
              </IconButton>
              {movedFolder?.foldername}
            </Fragment>
          ) : (
            <Fragment>
              <IconButton style={{ visibility: "hidden" }}>
                <ArrowBackIcon />
              </IconButton>
              My Drive
            </Fragment>
          )}
        </DialogTitle>
        <DialogContent style={{ padding: 0 }}>
          {allFolders?.map((folder, index) => (
            <MenuItem alignItems="center" key={folder._id}>
              <IconButton>
                <FolderIcon />
              </IconButton>
              <span className={classes.textContainer}>{folder.foldername}</span>
              <IconButton onClick={() => this.handleNextFolder(folder)}>
                <ArrowForwardIcon />
              </IconButton>
            </MenuItem>
          ))}
        </DialogContent>
        <DialogActions style={{ padding: 0 }}>
          <Button onClick={this.handleMoveItem} color="primary">
            Move Here
          </Button>
        </DialogActions>
      </Dialog>
    );

    return <Fragment>{moveFileDialog}</Fragment>;
  }
}

export default withRouter(withStyles(styles)(MoveItem));
