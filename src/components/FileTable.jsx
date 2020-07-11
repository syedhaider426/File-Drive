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
import ActionHeader from "./ActionHeader";
import postData from "../helpers/postData";
import returnFileSize from "../helpers/returnFileSize";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import Actions from "../panel_left/Actions";
import StarIcon from "@material-ui/icons/Star";
import Snack from "./Snack";

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
  handleFavoritesSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.handleSetState({
      favoritesSnackOpen: false,
    });
  };

  handleCopySnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.handleSetState({
      copySnackOpen: false,
    });
  };

  handleTrashSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.props.handleSetState({
      trashSnackOpen: false,
    });
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

  handleFileClick = (e, file) => {
    const { selectedFiles, handleSetState } = { ...this.props };
    if (selectedFiles.length === 0) {
      selectedFiles.push({
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
      });
      const isFavorited = this.checkIsFavorited(selectedFiles);
      handleSetState({
        selectedFolders: [],
        selectedFiles,
        isFavorited,
      });
    } else if (selectedFiles[0].id === file._id) {
      this.props.history.push(`/file/${file._id}`);
    } else {
      selectedFiles[0] = {
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
      };
      const isFavorited = this.checkIsFavorited(selectedFiles);
      handleSetState({
        selectedFolders: [],
        selectedFiles,
        isFavorited,
      });
    }
  };

  handleFileCopy = () => {
    const { selectedFiles, handleSetState } = { ...this.props };
    const data = { selectedFiles };
    postData("/api/files/copy", data)
      .then((data) => {
        const { files } = { ...this.props };
        for (let file of data.files) {
          files.push(file);
        }
        //Slice will clone the array and return reference to new array
        const tempFiles = data.newFiles.slice();
        const filesModified = tempFiles.length;
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * Snackbaropen - Open Snackbar
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        handleSetState({
          trashSnackOpen: false,
          copySnackOpen: true,
          favoritesSnackOpen: false,
          selectedFiles: [],
          files,
          filesModified,
          tempFiles,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoCopy = () => {
    const { tempFiles } = { ...this.props };
    const data = { selectedFiles: tempFiles };
    postData("/api/files/undoCopy", data)
      .then((data) => {
        const { files } = { ...data };
        this.props.handleSetState({
          files,
          tempFiles: [],
          filesModified: 0,
          copySnackOpen: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleTrash = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles, isFavorited: [false, true] };
    postData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * Snackbaropen - Open Snackbar
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */

        this.props.handleSetState({
          files,
          folders,
          trashSnackOpen: true,
          copySnackOpen: false,
          favoritesSnackOpen: false,
          selectedFiles: [],
          selectedFolders: [],
          tempFiles,
          tempFolders,
          filesModified,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoTrash = () => {
    let { tempFolders, tempFiles } = { ...this.props };
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    postData("/api/files/undoTrash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          tempFiles: [],
          tempFolders: [],
          filesModified: 0,
          trashSnackOpen: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleFavoritesTrash = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles, isFavorited: [true] };
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
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
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
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestore = () => {
    const { selectedFolders, selectedFiles } = { ...this.props };
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
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * Snackbaropen - Open Snackbar
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        this.props.handleSetState({
          files,
          folders,
          favoritesSnackOpen: true,
          tempFiles,
          tempFolders,
          filesModified,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoFavorite = () => {
    const { tempFolders, tempFiles } = { ...this.props };
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    postData("/api/files/undoFavorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          tempFiles: [],
          tempFolders: [],
          filesModified: 0,
          favoritesSnackOpen: false,
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
    if (this.props.tempFiles || this.props.tempFolders) {
      this.props.handleSetState({
        tempFiles: [],
        tempFolders: [],
      });
    }
    return;
  };

  checkIsFavorited = (items) => {
    let isFavorited = 0;
    for (let i = 0; i < items.length; ++i) {
      if (items[i].isFavorited) isFavorited++;
    }
    if (isFavorited > 0 && isFavorited === items.length) return true;
    return false;
  };

  handleHomeUnfavorited = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/homeUnfavorite", data)
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

  render() {
    const {
      files,
      folders,
      classes,
      selectedFolders,
      selectedFiles,
      currentMenu,
      filesModified,
      copySnackOpen,
      trashSnackOpen,
      favoritesSnackOpen,
      isFavorited,
      handleSetState,
    } = {
      ...this.props,
    };

    const copySnack = (
      <Snack
        open={copySnackOpen}
        onClose={this.handleCopySnackClose}
        onExit={this.handleSnackbarExit}
        message={`Copied ${filesModified} file(s).`}
        onClick={this.handleUndoCopy}
      />
    );

    const trashSnack = (
      <Snack
        open={trashSnackOpen}
        onClose={this.handleTrashSnackClose}
        onExit={this.handleSnackbarExit}
        message={`Trashed ${filesModified} item(s).`}
        onClick={this.handleUndoTrash}
      />
    );
    const favoritesSnack = (
      <Snack
        open={favoritesSnackOpen}
        onClose={this.handleFavoritesSnackClose}
        onExit={this.handleSnackbarExit}
        message={`Favorited ${filesModified} item(s).`}
        onClick={this.handleUndoFavorite}
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
            files={files}
            folders={folders}
            selectedFiles={selectedFiles}
            selectedFolders={selectedFolders}
            handleTrash={this.handleTrash}
            handleFileCopy={this.handleFileCopy}
            handleDeleteForever={this.handleDeleteForever}
            handleRestore={this.handleRestore}
            handleFavorites={this.handleFavorites}
            handleUnfavorited={this.handleUnfavorited}
            handleFavoritesTrash={this.handleFavoritesTrash}
            handleHomeUnfavorited={this.handleHomeUnfavorited}
            currentMenu={currentMenu}
            isFavorited={isFavorited}
            handleSetState={handleSetState}
            handleRenameFile={this.handleRenameFile}
            handleRenameFolder={this.handleRenameFolder}
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
                  onClick={(e) => this.handleFileClick(e, file)}
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
                      {currentMenu === "Home" && file.metadata.isFavorited && (
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
          {copySnack}
          {trashSnack}
          {favoritesSnack}
        </Grid>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(FileTable));
