import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { withRouter } from "react-router-dom";
import convertISODate from "../helpers/convertISODate";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import CloseIcon from "@material-ui/icons/Close";
import ActionHeader from "./ActionHeader";
import postData from "../helpers/postData";
import returnFileSize from "../helpers/returnFileSize";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import Actions from "../panel_left/Actions";
import StarIcon from "@material-ui/icons/Star";
import deleteData from "../helpers/deleteData";
import { Button, IconButton, Snackbar } from "@material-ui/core";

const styles = (theme) => ({
  tableRow: {
    tableRow: {
      "&$selected, &$selected:hover": {
        backgroundColor: "#e8f0fe",
        color: "#1967d2",
      },
    },
  },
  table: {
    minWidth: 650,
  },
});

class FileTable extends Component {
  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.handleSetState({ snackbarOpen: false });
  };
  handleFolderClick = (e, id, foldername) => {
    const { selectedFolders, handleSetState } = { ...this.props };
    if (selectedFolders.length === 0) {
      selectedFolders.push({ id, foldername });
      handleSetState({
        selectedFiles: [],
        selectedFolders,
      });
    } else if (selectedFolders[0].id === id) {
      this.props.history.push(`/folder/${id}`);
    } else {
      selectedFolders[0] = { id, foldername };
      handleSetState({
        selectedFiles: [],
        selectedFolders,
      });
    }
  };

  handleFileClick = (e, id, filename) => {
    const { selectedFiles, handleSetState } = { ...this.props };
    if (selectedFiles.length === 0) {
      selectedFiles.push({ id, filename });
      handleSetState({
        selectedFolders: [],
        selectedFiles,
      });
    } else if (selectedFiles[0].id === id) {
      this.props.history.push(`/file/${id}`);
    } else {
      selectedFiles[0] = { id, filename };
      handleSetState({
        selectedFolders: [],
        selectedFiles,
      });
    }
  };

  handleFileCopy = () => {
    const { selectedFiles, handleSetState } = { ...this.props };
    const data = { selectedFiles };
    postData("/api/files/copy", data)
      .then((data) => {
        const { files, selectedFiles } = { ...this.props };
        for (let file of data.files) {
          files.push(file);
        }
        //Slice will clone the array and return reference to new array
        const tempFiles = data.newFiles.slice();
        const filesModified = tempFiles.length;
        console.log("Copy", tempFiles);
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * Snackbaropen - Open Snackbar
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        handleSetState({
          snackbarOpen: true,
          selectedFiles: [],
          files,
          filesModified,
          tempFiles,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleTrash = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleFavoritesTrash = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles, isFavorited: true };
    postData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDeleteForever = () => {
    let { selectedFolders, selectedFiles, tempFiles } = { ...this.props };
    let data;
    if (tempFiles.length > 0) data = { selectedFolders, tempFiles };
    else data = { selectedFolders, selectedFiles };
    console.log("Tempfiles", tempFiles);
    postData("/api/files/delete", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Trashed files and folders
        console.log("made it here");
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
          tempFiles: [],
          tempFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestore = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/restore", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleFavorites = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/favorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleUnfavorited = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/unfavorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleSnackbarExit = () => {
    if (this.props.tempFiles) {
      this.props.handleSetState({ tempFiles: [], tempFolders: [] });
    }
    return;
  };

  render() {
    const {
      files,
      folders,
      classes,
      selectedFolders,
      selectedFiles,
      currentMenu,
      loaded,
      snackbarOpen,
      filesModified,
      foldersModified,
    } = {
      ...this.props,
    };

    const snack = (
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={this.handleSnackbarClose}
        onExit={this.handleSnackbarExit}
        message={`Copied ${filesModified} file(s).`}
        action={
          <React.Fragment>
            <Button
              onClick={this.handleDeleteForever}
              color="secondary"
              size="small"
            >
              Undo
            </Button>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={this.handleSnackbarClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    );

    return (
      <Fragment>
        <Grid item xs={12}>
          <PrimarySearchAppBar />
        </Grid>
        <Grid item xs={2}>
          <Actions />
        </Grid>
        <Grid item xs={10}>
          <ActionHeader
            selectedFiles={selectedFiles}
            selectedFolders={selectedFolders}
            handleTrash={this.handleTrash}
            handleFileCopy={this.handleFileCopy}
            handleDeleteForever={this.handleDeleteForever}
            handleRestore={this.handleRestore}
            handleFavorites={this.handleFavorites}
            handleUnfavorited={this.handleUnfavorited}
            handleFavoritesTrash={this.handleFavoritesTrash}
            currentMenu={currentMenu}
          />
          <Table
            className={classes.table}
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "33%" }}>Name</TableCell>
                <TableCell style={{ width: "33%" }}>Uploaded On</TableCell>
                <TableCell style={{ width: "33%" }}>File Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ width: "100%" }}>
              {folders.map((folder) => (
                <TableRow
                  key={folder._id}
                  className={classes.tableRow}
                  onClick={(e) =>
                    this.handleFolderClick(e, folder._id, folder.filename)
                  }
                  selected={
                    selectedFolders.length > 0
                      ? selectedFolders[0].id === folder._id
                      : false
                  }
                >
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FolderIcon style={{ fill: "#5f6368" }} />
                      <span className="data">{folder.foldername}</span>
                      {currentMenu === "Home" && folder.isFavorited && (
                        <StarIcon className="data" />
                      )}
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="details">
                      {convertISODate(folder.createdOn)}
                    </span>
                  </TableCell>
                  <TableCell align="left">—</TableCell>
                </TableRow>
              ))}
              {files.map((file) => (
                <TableRow
                  key={file._id}
                  className={classes.tableRow}
                  onClick={(e) =>
                    this.handleFileClick(e, file._id, file.filename)
                  }
                  selected={
                    selectedFiles.length > 0
                      ? selectedFiles[0].id === file._id
                      : false
                  }
                >
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FileIcon style={{ fill: "#5f6368" }} />
                      <span className="data">{file.filename}</span>
                      {currentMenu === "Home" && file.isFavorited && (
                        <StarIcon className="data" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="details">
                      {convertISODate(file.uploadDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="details">
                      {returnFileSize(file.length)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {snack}
        </Grid>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(FileTable));
