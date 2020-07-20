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
  handleOnClick = (folder, selectedIndex) => {
    this.props.handleSetState({
      selectedIndex: selectedIndex,
      moveButtonDisabled: false,
      moveFolder: { id: folder._id, foldername: folder.foldername },
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

  handleMoveItemClose = () => {
    this.props.handleSetState({
      moveMenuOpen: false,
      movedFolder: {},
      selectedIndex: undefined,
      moveButtonDisabled: true,
      moveFolder: "",
    });
  };

  render() {
    const {
      allFolders,
      classes,
      homeFolderStatus,
      handleMoveItem,
      moveMenuOpen,
      movedSnack,
      onMoveExit,
      selectedIndex,
      moveFolder, //menu clicked folder
      movedFolder, //title folder
      selectedFolders,
      handleMoveSnackClose,
      handleSnackbarExit,
      handleUndoMoveItem,
    } = {
      ...this.props,
    };
    console.log("movednsack", movedSnack);
    const moveSnack = (
      <Snack
        open={movedSnack}
        onClose={handleMoveSnackClose}
        onExited={handleSnackbarExit}
        message={`Moved to "${moveFolder.foldername}"`}
        onClick={handleUndoMoveItem}
      />
    );

    const moveFileDialog = (
      <Dialog
        open={moveMenuOpen ? true : false}
        onClose={this.handleMoveItemClose}
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
              disabled={
                selectedFolders.length > 0 &&
                selectedFolders[0].id === folder._id
              }
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

    return (
      <Fragment>
        {moveFileDialog}
        {moveSnack}
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(MoveItem));
