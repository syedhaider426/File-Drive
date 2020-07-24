import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { withRouter } from "react-router-dom";
import ActionHeader from "./ActionHeader";
import postData from "../helpers/postData";
import Actions from "../panel_left/Actions";
import Snack from "./Snack";
import MainTable from "./MainTable";
import getData from "../helpers/getData";
import CssBaseline from "@material-ui/core/CssBaseline";
import ActionsDrawer from "./ActionsDrawer";
import Header from "./Header";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  Box,
} from "@material-ui/core";

const layout = (theme) => ({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
});

class FileTable extends Component {
  state = {
    files: [],
    folders: [],
    selectedFiles: [],
    selectedFolders: [],
    isFavorited: false,
    filesModified: 0,
    tempFiles: [],
    tempFolders: [],
    copySnackOpen: false,
    trashSnackOpen: false,
    favoritesSnackOpen: false,
    restoreSnackOpen: false,
    currentFolder: ["Home"],
    currentID: this.props.match.url,
    isLoaded: false,
    mobileOpen: false,
    restoreAllOpen: false,
    deleteAllOpen: false,
    trashMenuOpen: false,
    trashAnchorEl: undefined,
    moveMenuOpen: false,
    moveAnchorEl: undefined,
    fileData: undefined,
    contentType: "",
    sortColumn: {
      name: "Name",
      order: "asc",
    },
  };

  fetchData = () => {
    getData(`/api${this.props.match.url}`)
      .then((data) => {
        this.setState({
          files: data.files,
          folders: data.folders,
          selectedFolders: [],
          selectedFiles: [],
          currentFolder: data.folderPath,
          currentID: this.props.match.url,
          isLoaded: true,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  componentDidMount() {
    this.fetchData();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.match.url !== prevState.currentID) {
      this.fetchData();
    }
  }

  handleSetState = (value) => {
    this.setState(value);
  };

  handleFavoritesSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      favoritesSnackOpen: false,
    });
  };

  handleCopySnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      copySnackOpen: false,
    });
  };

  handleTrashSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      trashSnackOpen: false,
    });
  };

  handleRestoreSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      restoreSnackOpen: false,
    });
  };

  handleUnFavoriteSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      undoFavoriteSnackOpen: false,
    });
  };

  handleFolderClick = (e, folder) => {
    const { selectedFolders } = { ...this.state };
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
      this.setState({
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
        this.setState({
          selectedFiles: [],
          selectedFolders: folders,
          isFavorited,
        });
      }
    } else if (
      /**
       * Clear the list of folders if user ctrl clicks the same folder
       */
      this.props.menu !== "Trash" &&
      selectedFolders.length === 1 &&
      e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id)
        this.setState({ selectedFolders: [] });
      else {
        selectedFolders.push({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        });
        const isFavorited = this.checkIsFavorited(selectedFolders);
        this.setState({
          selectedFolders,
          isFavorited,
        });
      }
    } else if (e.ctrlKey) {
      let folders = [];
      let count = 0;
      for (let i = 0; i < selectedFolders.length; ++i) {
        if (selectedFolders[i].id !== folder._id) {
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
      this.setState({ selectedFolders: folders, isFavorited });
    } else {
      let folders = [];
      folders[0] = {
        id: folder._id,
        foldername: folder.foldername,
        parent_id: folder.parent_id,
      };
      const isFavorited = this.checkIsFavorited(folders);
      this.setState({
        selectedFiles: [],
        selectedFolders: folders,
        isFavorited,
      });
    }
  };

  handleFileClick = (e, file) => {
    const { selectedFiles } = { ...this.state };
    if (selectedFiles.length === 0 && !e.ctrlKey) {
      selectedFiles.push({
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      });
      const isFavorited = this.checkIsFavorited(selectedFiles);
      this.setState({
        selectedFolders: [],
        selectedFiles,
        isFavorited,
      });
    } else if (
      selectedFiles.length === 1 &&
      selectedFiles[0].id === file._id &&
      !e.ctrlKey
    ) {
      axios.get(`/api/files/${file._id}`).then((d) => {
        this.setState({
          fileData: `/api/files/${file._id}`,
          modalOpen: true,
          contentType: d.headers["content-type"],
        });
      });
      //this.props.history.push(`/file/${file._id}`);
    } else if (
      selectedFiles.length === 1 &&
      selectedFiles[0].id === file._id &&
      e.ctrlKey
    ) {
      this.setState({ selectedFiles: [] });
    } else if (e.ctrlKey) {
      let files = [];
      let count = 0;
      for (let i = 0; i < selectedFiles.length; ++i) {
        if (selectedFiles[i].id !== file._id) {
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
      this.setState({ selectedFiles: files, isFavorited });
    } else {
      let files = [];
      files[0] = {
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      };
      const isFavorited = this.checkIsFavorited(files);
      this.setState({
        selectedFolders: [],
        selectedFiles: files,
        isFavorited,
      });
    }
  };

  handleFileCopy = () => {
    const { selectedFiles } = { ...this.state };
    let urlParam = "";
    if (this.props.match.url !== "/drive/home")
      urlParam = `/${this.props.match.params.folder}`;
    const data = { selectedFiles };
    postData(`/api/files/copy${urlParam}`, data)
      .then((data) => {
        const { files } = { ...this.state };
        for (let file of data.files) {
          files.push(file);
        }
        console.log("newfiles", data.newFiles);
        console.log("files", data.files);
        //Slice will clone the array and return reference to new array
        //id is an array of new files
        const tempFiles = data.newFiles.id.slice();
        const filesModified = tempFiles.length;
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        this.setState({
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
    const { tempFiles } = { ...this.state };
    const data = { selectedFiles: tempFiles };
    let urlParam = "";
    if (this.props.match.url !== "/drive/home")
      urlParam = `/${this.props.match.params.folder}`;
    postData(`/api/files/undoCopy${urlParam}`, data)
      .then((data) => {
        const { files } = { ...data };
        this.setState({
          files,
          tempFiles: [],
          filesModified: 0,
          copySnackOpen: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleTrash = () => {
    let { selectedFolders, selectedFiles } = { ...this.state };
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
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */

        this.setState({
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
    let { tempFolders, tempFiles } = { ...this.state };
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    const folder = this.props.match.params.folder
      ? `/${this.props.match.params.folder}`
      : "";
    postData(`/api/files/undoTrash${folder}`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.setState({
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
    let { selectedFolders, selectedFiles } = { ...this.state };
    const data = { selectedFolders, selectedFiles, isFavorited: [true] };
    postData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.setState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDeleteForever = () => {
    let { selectedFolders, selectedFiles } = { ...this.state };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/delete", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Trashed files and folders
        this.setState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestore = () => {
    const { selectedFolders, selectedFiles } = { ...this.state };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/restore", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        this.setState({
          files,
          folders,
          trashSnackOpen: false,
          copySnackOpen: false,
          favoritesSnackOpen: false,
          restoreSnackOpen: true,
          selectedFiles: [],
          selectedFolders: [],
          tempFiles,
          tempFolders,
          filesModified,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleUndoRestore = () => {
    let { tempFolders, tempFiles } = { ...this.state };
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
      isFavorited: [false, true],
      trashMenu: true,
    };
    postData(`/api/files/trash`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.setState({
          files,
          folders,
          restoreSnackOpen: false,
          tempFiles: [],
          tempFolders: [],
          filesModified: 0,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you favorite an item from Home
  handleFavorites = () => {
    let { selectedFolders, selectedFiles } = { ...this.state };
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
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        this.setState({
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

  //When you unfavorite an item from 'Home', and then click undo
  handleUndoFavorite = () => {
    const { tempFolders, tempFiles } = { ...this.state };
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    postData("/api/files/undoFavorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.setState({
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

  //When you unfavorite an item in 'Favorites'
  handleUnfavorited = () => {
    let { selectedFolders, selectedFiles } = { ...this.state };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/unfavorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        /***
         * Files - Updated files
         * Files Modified - Length of selected files that were copied
         * TempFiles - Reference to selected files (if user chooses to undo, reference the tempfiles)
         */
        this.setState({
          files,
          folders,
          undoFavoriteSnackOpen: true,
          tempFiles,
          tempFolders,
          filesModified,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item in 'Favorites', and then click undo
  handleUndoUnfavorite = () => {
    const { tempFolders, tempFiles } = { ...this.state };
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
      favoritesMenu: true,
    };
    postData("/api/files/favorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.setState({
          files,
          folders,
          tempFiles: [],
          tempFolders: [],
          filesModified: 0,
          undoFavoriteSnackOpen: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleSnackbarExit = () => {
    if (this.props.tempFiles || this.props.tempFolders) {
      this.setState({
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
    let { selectedFolders, selectedFiles } = { ...this.state };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/homeUnfavorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.setState({
          files,
          folders,
          isFavorited: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDeleteAll = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    postData("/api/files/deleteAll")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        this.setState({
          files,
          folders,
          deleteAllOpen: false,
          trashMenuOpen: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestoreAll = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    postData("/api/files/restoreAll")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        this.setState({
          files,
          folders,
          restoreAllOpen: false,
          trashMenuOpen: false,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDrawerToggle = () => {
    this.setState({ mobileOpen: !this.state.mobileOpen });
  };

  handleFileClose = () => {
    this.setState({ modalOpen: false });
  };

  handleSingleDownload = (file) => {
    let id = file.id || file._id;
    fetch(`/api/files/${id}`)
      .then((response) => response.blob())
      .then((blob) => {
        const url = URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", file.filename);
        document.body.appendChild(link);
        link.click();
        link.parentNode.removeChild(link);
      });
  };

  handleSort = (column) => {
    const { sortColumn } = { ...this.state };
    sortColumn.order =
      sortColumn.name === column && sortColumn.order === "asc" ? "desc" : "asc";
    sortColumn.name = column;
    this.setState({ sortColumn });
  };

  sortFolders = (folders) => {
    const { sortColumn } = { ...this.state };
    let value = sortColumn.order === "asc" ? 1 : -1;
    console.log(sortColumn);
    if (sortColumn.name === "Name") {
      return folders.sort((a, b) => {
        /* Storing case insensitive comparison */
        var comparison = a.foldername
          .toString()
          .toLowerCase()
          .localeCompare(b.foldername.toString().toLowerCase());
        return value * comparison;
      });
    } else if (sortColumn.name === "Uploaded On") {
      return folders.sort((a, b) => {
        if (a.createdOn > b.createdOn) return 1 * value;
        if (a.createdOn < b.createdOn) return -1 * value;
        return 0;
      });
    } else return folders;
  };

  sortFiles = (files) => {
    const { sortColumn } = { ...this.state };
    let value = sortColumn.order === "asc" ? 1 : -1;
    if (sortColumn.name === "Name") {
      return files.sort((a, b) => {
        /* Storing case insensitive comparison */
        var comparison = a.filename
          .toString()
          .toLowerCase()
          .localeCompare(b.filename.toString().toLowerCase());
        return value * comparison;
      });
    } else if (sortColumn.name === "Uploaded On") {
      return files.sort((a, b) => {
        if (a.uploadDate > b.uploadDate) return 1 * value;
        if (a.uploadDate < b.uploadDate) return -1 * value;
        return 0;
      });
    } else if (sortColumn.name === "File Size") {
      return files.sort((a, b) => {
        return value * (a.length - b.length);
      });
    } else return files;
  };

  render() {
    const {
      folders,
      files,
      selectedFolders,
      selectedFiles,
      filesModified,
      copySnackOpen,
      trashSnackOpen,
      favoritesSnackOpen,
      restoreSnackOpen,
      undoFavoriteSnackOpen,
      isFavorited,
      currentFolder,
      isLoaded,
      mobileOpen,
      restoreAllOpen,
      deleteAllOpen,
      trashMenuOpen,
      trashAnchorEl,
      moveMenuOpen,
      moveAnchorEl,
      modalOpen,
      fileData,
      contentType,
      sortColumn,
    } = {
      ...this.state,
    };

    const { classes } = { ...this.props };

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

    const restoreSnack = (
      <Snack
        open={restoreSnackOpen}
        onClose={this.handleRestoreSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Restored ${filesModified} item(s).`}
        onClick={this.handleUndoRestore}
      />
    );

    const unfavoriteSnack = (
      <Snack
        open={undoFavoriteSnackOpen}
        onClose={this.handleUnFavoriteSnackClose}
        onExited={this.handleSnackbarExit}
        message={`Unfavorited ${filesModified} item(s).`}
        onClick={this.handleUndoUnfavorite}
      />
    );

    const actions = (
      <Actions handleSetState={this.handleSetState} menu={this.props.menu} />
    );

    let fileType;
    let style = {
      backgroundColor: "transparent",
      boxShadow: "none",
    };
    if (contentType.startsWith("image"))
      fileType = (
        <img
          style={{
            width: "100%",
            height: "auto",
            maxWidth: "100%",
            objectFit: "cover",
          }}
          alt={selectedFiles[0].filename}
          src={fileData}
        ></img>
      );
    else if (contentType.startsWith("video"))
      fileType = (
        <video
          autoplay
          controls={true}
          muted={false}
          style={{
            width: "100%",
            height: "auto",
            maxHeight: "90vh",
            maxWidth: "100%",
            objectFit: "cover",
          }}
        >
          <source src={fileData} type={contentType} />
          Your browser does not support the video tag.
        </video>
      );
    else if (contentType.startsWith("audio"))
      fileType = (
        <audio controls>
          <source src={fileData} type={contentType} />
          Your browser does not support the audio element.
        </audio>
      );
    else {
      fileType = (
        <div>
          <Typography style={{ textAlign: "center" }}>
            <Box fontWeight="fontWeightMedium">
              {selectedFiles[0]?.filename}{" "}
            </Box>
          </Typography>
          <div style={{ textAlign: "center" }}>
            <Button
              color="primary"
              variant="contained"
              onClick={() => this.handleSingleDownload(selectedFiles[0])}
            >
              Download
            </Button>{" "}
          </div>
        </div>
      );
      style = {};
    }
    const fileModal = (
      <Dialog
        open={modalOpen}
        onClose={this.handleFileClose}
        PaperProps={(style = { style })}
      >
        <DialogContent>{fileType}</DialogContent>
      </Dialog>
    );

    let sortedFolders = this.sortFolders(folders);
    let sortedFiles = this.sortFiles(files);
    return (
      <Fragment>
        <div className={classes.root}>
          <CssBaseline />
          <Header
            homePage={"Home"}
            handleDrawerToggle={this.handleDrawerToggle}
          />
          <ActionsDrawer
            actions={actions}
            mobileOpen={mobileOpen}
            handleDrawerToggle={this.handleDrawerToggle}
          />
          <main className={classes.content}>
            {fileModal}
            <div className={classes.toolbar} />
            <ActionHeader
              files={sortedFiles}
              folders={sortedFolders}
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
              currentMenu={this.props.menu}
              isFavorited={isFavorited}
              handleSetState={this.handleSetState}
              currentFolder={currentFolder}
              isLoaded={isLoaded}
              handleDeleteAll={this.handleDeleteAll}
              handleRestoreAll={this.handleRestoreAll}
              restoreAllOpen={restoreAllOpen}
              deleteAllOpen={deleteAllOpen}
              trashMenuOpen={trashMenuOpen}
              trashAnchorEl={trashAnchorEl}
              moveMenuOpen={moveMenuOpen}
              moveAnchorEl={moveAnchorEl}
              handleSingleDownload={this.handleSingleDownload}
            />
            <MainTable
              handleFolderClick={this.handleFolderClick}
              handleFileClick={this.handleFileClick}
              handleSort={this.handleSort}
              folders={sortedFolders}
              files={sortedFiles}
              selectedFolders={selectedFolders}
              selectedFiles={selectedFiles}
              currentMenu={this.props.menu}
              isLoaded={isLoaded}
              sortColumn={sortColumn}
            />
            {copySnack}
            {trashSnack}
            {favoritesSnack}
            {restoreSnack}
            {unfavoriteSnack}
          </main>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(layout)(FileTable));
