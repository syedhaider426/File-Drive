import React, { Component, Fragment } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  MenuItem,
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
  handleOnClick = (id, selectedIndex) => {
    this.props.handleSetState({
      selectedIndex: selectedIndex,
      moveButtonDisabled: false,
      moveFolder: id,
    });
  };

  handleNextFolder = (folder) => {
    getData(`/api/drive/folders/${folder._id}`)
      .then((data) => {
        this.props.handleSetState({
          allFolders: data.folders,
          homeFolderStatus: false,
          moveFolder: "",
          selectedIndex: undefined,
          movedFolder: {
            id: folder._id,
            foldername: folder.foldername,
            parent_id: folder.parent_id,
          },
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handlePreviousFolder = (folder_id) => {
    const urlParam =
      folder_id === "" ? "drive/home" : `drive/folders/${folder_id}?move=true`;
    getData(`/api/${urlParam}`)
      .then((data) => {
        const { folders, moveTitleFolder } = { ...data };
        this.props.handleSetState({
          allFolders: folders,
          homeFolderStatus: folder_id === "",
          selectedIndex: undefined,
          movedFolder: {
            foldername: moveTitleFolder.foldername,
            parent_id: moveTitleFolder.parent_id,
          },
        });
      })
      .catch((err) => console.log("Err", err));
  };

  render() {
    const {
      allFolders,
      classes,
      homeFolderStatus,
      handleMoveItem,
      moveMenuOpen,
      handleMoveItemClose,
      onMoveExit,
      selectedIndex,
      moveFolder,
      movedFolder,
      selectedFolders,
      selectedFiles,
    } = {
      ...this.props,
    };
    console.log();
    const moveFileDialog = (
      <Dialog
        open={moveMenuOpen ? true : false}
        onClose={handleMoveItemClose}
        onExited={onMoveExit}
        className={classes.dialogPaper}
        style={{ padding: 0 }}
        fullWidth
        maxWidth={"xs"}
      >
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
            <MenuItem
              alignItems="center"
              key={folder._id}
              onClick={() => this.handleOnClick(folder, index)}
              selected={index === selectedIndex}
            >
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
          <Button
            onClick={handleMoveItem}
            color="primary"
            disabled={
              selectedFolders[0]?._id === movedFolder?.id && moveFolder === ""
            }
          >
            Move Here
          </Button>
        </DialogActions>
      </Dialog>
    );

    return <Fragment>{moveFileDialog}</Fragment>;
  }
}

export default withRouter(withStyles(styles)(MoveItem));
