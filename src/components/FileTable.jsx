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
import { CircularProgress, TableContainer } from "@material-ui/core";
import MainTable from "./MainTable";

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
    maxHeight: "85vh",
  },
  root: {
    width: "100%",
  },
  iconSpacing: {
    left: theme.spacing(1),
  },
});

const drawerWidth = 240;

const layout = (theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
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

  handleFolderClick = (e, folder) => {
    const { selectedFolders, handleSetState } = {
      ...this.props,
    };
    console.log("did i make it here2312");
    // No folders selected
    if (selectedFolders.length === 0 && !e.ctrlKey) {
      // Add selected folder to array
      selectedFolders.push({
        id: folder._id,
        foldername: folder.foldername,
        parent_id: folder.parent_id,
      });
      //Check if any of the folders are favorited
      const isFavorited = this.checkIsFavorited(selectedFolders);

      //Set state
      handleSetState({
        selectedFiles: [],
        selectedFolders,
        isFavorited,
      });
    } else if (
      /***
       * User double clicks the same folder and the current menu is not 'Trash',
       * If the folder was clicked without the ctrlkey and there is only one
       * value in the selectedfolders list, go to the next page
       */
      this.props.currentMenu !== "Trash" &&
      selectedFolders.length === 1 &&
      !e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id)
        this.props.history.push(`/drive/folders/${folder._id}`, {
          selectedFolders: [],
          selectedFiles: [],
        });
      else {
        let folders = [];
        folders[0] = {
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        };
        const isFavorited = this.checkIsFavorited(folders);
        handleSetState({
          selectedFiles: [],
          selectedFolders: folders,
          isFavorited,
        });
      }
    } else if (
      /**
       * Clear the list of folders if user ctrl clicks the same folder
       */
      this.props.currentMenu !== "Trash" &&
      selectedFolders.length === 1 &&
      e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id)
        handleSetState({ selectedFolders: [] });
      else {
        selectedFolders.push({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        });
        const isFavorited = this.checkIsFavorited(selectedFolders);
        handleSetState({
          selectedFolders,
          isFavorited,
        });
      }
    } else if (e.ctrlKey) {
      let folders = [];
      let count = 0;
      for (let i = 0; i < selectedFolders.length; ++i) {
        if (selectedFolders[i].id != folder._id) {
          folders.push(selectedFolders[i]);
          count++;
        }
      }
      if (count === selectedFolders.length)
        folders.push({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        });
      const isFavorited = this.checkIsFavorited(folders);
      handleSetState({ selectedFolders: folders, isFavorited });
    } else {
      let folders = [];
      folders[0] = {
        id: folder._id,
        foldername: folder.foldername,
        parent_id: folder.parent_id,
      };
      const isFavorited = this.checkIsFavorited(folders);
      handleSetState({
        selectedFiles: [],
        selectedFolders: folders,
        isFavorited,
      });
    }
  };

  handleFileClick = (e, file) => {
    const { selectedFiles, handleSetState } = { ...this.props };
    if (selectedFiles.length === 0 && !e.ctrlKey) {
      selectedFiles.push({
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      });
      const isFavorited = this.checkIsFavorited(selectedFiles);
      handleSetState({
        selectedFolders: [],
        selectedFiles,
        isFavorited,
      });
    } else if (
      selectedFiles.length == 1 &&
      selectedFiles[0].id === file._id &&
      !e.ctrlKey
    ) {
      this.props.history.push(`/file/${file._id}`);
    } else if (
      selectedFiles.length == 1 &&
      selectedFiles[0].id === file._id &&
      e.ctrlKey
    ) {
      handleSetState({ selectedFiles: [] });
    } else if (e.ctrlKey) {
      let files = [];
      let count = 0;
      for (let i = 0; i < selectedFiles.length; ++i) {
        if (selectedFiles[i].id != file._id) {
          files.push(selectedFiles[i]);
          count++;
        }
      }
      if (count === selectedFiles.length)
        files.push({
          id: file._id,
          filename: file.filename,
          isFavorited: file.metadata.isFavorited,
          folder_id: file.folder_id,
        });
      const isFavorited = this.checkIsFavorited(files);
      handleSetState({ selectedFiles: files, isFavorited });
    } else {
      let files = [];
      files[0] = {
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      };
      const isFavorited = this.checkIsFavorited(files);
      handleSetState({
        selectedFolders: [],
        selectedFiles: files,
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
    const folder = this.props.match.params.folder
      ? `/${this.props.match.params.folder}`
      : "";
    postData(`/api/files/trash${folder}`, data)
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
    const folder = this.props.match.params.folder
      ? `/${this.props.match.params.folder}`
      : "";
    postData(`/api/files/undoTrash${folder}`, data)
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
          isFavorited: true,
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
    console.log(items);
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
          isFavorited: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDeleteAll = () => {
    document.body.style.cursor = "wait";
    postData("/api/files/deleteAll")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestoreAll = () => {
    document.body.style.cursor = "wait";
    postData("/api/files/restoreAll")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
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
      currentFolder,
      isLoaded,
    } = {
      ...this.props,
    };
    const copySnack = (
      <Snack
        open={copySnackOpen}
        onClose={this.handleCopySnackClose}
        onExited={this.handleSnackbarExit}
        message={`Copied ${filesModified} file(s).`}
        onClick={this.handleUndoCopy}
      />
    );

    const trashSnack = (
      <Snack
        open={trashSnackOpen}
        onClose={this.handleTrashSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Trashed ${filesModified} item(s).`}
        onClick={this.handleUndoTrash}
      />
    );
    const favoritesSnack = (
      <Snack
        open={favoritesSnackOpen}
        onClose={this.handleFavoritesSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Favorited ${filesModified} item(s).`}
        onClick={this.handleUndoFavorite}
      />
    );
    console.log("SELECTED FILES", selectedFiles);
    return (
      <Fragment>
        <Grid item xs={12}>
          <PrimarySearchAppBar />
        </Grid>
        <Grid item xs={2}>
          <Actions
            handleSetState={handleSetState}
            menu={this.props.currentMenu}
          />
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
            currentFolder={currentFolder}
            handleDeleteAll={this.handleDeleteAll}
            handleRestoreAll={this.handleRestoreAll}
          />
          <MainTable
            handleFolderClick={this.handleFolderClick}
            handleFileClick={this.handleFileClick}
            folders={folders}
            files={files}
            currentMenu={currentMenu}
            isLoaded={isLoaded}
          />
          {copySnack}
          {trashSnack}
          {favoritesSnack}
        </Grid>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(FileTable));
