import React, { Fragment, useState } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory, useLocation, useParams } from "react-router-dom";
import ActionHeader from "./ActionHeader";
import postData from "../helpers/postData";
import deleteData from "../helpers/deleteData";
import Actions from "./Actions";
import Snack from "./Snack";
import MainTable from "./MainTable";
import getData from "../helpers/getData";
import CssBaseline from "@material-ui/core/CssBaseline";
import ActionsDrawer from "./ActionsDrawer";
import Header from "./Header";
import axios from "axios";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";
import { useEffect } from "react";
import sortFiles from "../helpers/sortFiles";
import sortFolders from "../helpers/sortFolders";
import getContentType from "../helpers/getContentType";
import { useRef } from "react";
import patchData from "../helpers/patchData";
const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
}));

export default function Files({ menu }) {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolders, setSelectedFolders] = useState([]);
  const [tempFiles, setTempFiles] = useState([]);
  const [tempFolders, setTempFolders] = useState([]);
  const [currentFolder, setCurrentFolder] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [drawerMobileOpen, setDrawerMobileOpen] = useState(false);
  const [fileData, setFileData] = useState(undefined);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [trashSnackOpen, setTrashSnackOpen] = useState(false);
  const [copySnackOpen, setCopySnackOpen] = useState(false);
  const [restoreSnackOpen, setRestoreSnackOpen] = useState(false);
  const [favoritesSnackOpen, setFavoritesSnackOpen] = useState(false);
  const [unfavoriteSnackOpen, setUnfavoriteSnackOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [restoreAllOpen, setRestoreAllOpen] = useState(false);
  const [trashMenuOpen, setTrashMenuOpen] = useState(false);
  const [filesModified, setFilesModified] = useState(0);
  const [trashAnchorEl, setTrashAnchorEl] = useState(undefined);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [moveAnchorEl, setMoveAnchorEl] = useState(false);
  const [sortColumn, setSortColumn] = useState({
    name: "Name",
    order: "asc",
  });
  const handleSnackbarExit = () => {
    if (tempFiles || tempFolders) {
      setTempFiles([]);
      setTempFolders([]);
    }
    return;
  };

  const openSnack = (currentSnack) => {
    if (currentSnack === "Copy") {
      setCopySnackOpen(true);
      setTrashSnackOpen(false);
      setFavoritesSnackOpen(false);
      setUnfavoriteSnackOpen(false);
      setRestoreSnackOpen(false);
    } else if (currentSnack === "Favorites") {
      setFavoritesSnackOpen(true);
      setCopySnackOpen(false);
      setTrashSnackOpen(false);
      setUnfavoriteSnackOpen(false);
      setRestoreSnackOpen(false);
    } else if (currentSnack === "Trash") {
      setTrashSnackOpen(true);
      setFavoritesSnackOpen(false);
      setCopySnackOpen(false);
      setUnfavoriteSnackOpen(false);
      setRestoreSnackOpen(false);
    } else if (currentSnack === "Unfavorites") {
      setUnfavoriteSnackOpen(true);
      setFavoritesSnackOpen(false);
      setCopySnackOpen(false);
      setTrashSnackOpen(false);
      setRestoreSnackOpen(false);
    } else if (currentSnack === "Restore") {
      setRestoreSnackOpen(true);
      setFavoritesSnackOpen(false);
      setCopySnackOpen(false);
      setTrashSnackOpen(false);
      setUnfavoriteSnackOpen(false);
    }
  };

  const getFilesFolders = async () => {
    try {
      const data = await getData(`/api${location.pathname}`);
      setFiles(data.files);
      setFolders(data.folders);
      setSelectedFiles([]);
      setSelectedFolders([]);
      setCurrentFolder(data.folderPath);
      setIsLoaded(true);
    } catch (err) {
      console.log("Err", err);
    }
  };
  const mounted = useRef();
  useEffect(() => {
    document.body.style.cursor = "wait";
    if (!mounted.current) {
      mounted.current = false;
      (async () => await getFilesFolders())();
      document.body.style.cursor = "default";
      return;
    } else {
      setIsLoaded(false);
      (async () => await getFilesFolders())();
      document.body.style.cursor = "default";
    }
  }, [location.pathname, isLoaded]);

  const checkIsFavorited = (items) => {
    let isFavorited = 0;
    for (let i = 0; i < items.length; ++i) {
      if (items[i].isFavorited) isFavorited++;
    }
    if (isFavorited > 0 && isFavorited === items.length) return true;
    return false;
  };

  const handleSort = (column) => {
    sortColumn.order =
      sortColumn.name === column && sortColumn.order === "asc" ? "desc" : "asc";
    sortColumn.name = column;
    setSortColumn(sortColumn);
  };

  const handleFolderClick = (e, folder) => {
    // No folders selected
    if (selectedFolders.length === 0 && !e.ctrlKey) {
      // Add selected folder to array
      selectedFolders.push({
        id: folder._id,
        foldername: folder.foldername,
        parent_id: folder.parent_id,
      });
      //Check if any of the folders are favorited
      const isFavorited = checkIsFavorited(selectedFolders);
      //Set state
      setSelectedFiles([]);
      setSelectedFolders(selectedFolders);
      setIsFavorited(isFavorited);
    } else if (
      /***
       * User double clicks the same folder and the current menu is not 'Trash',
       * If the folder was clicked without the ctrlkey and there is only one
       * value in the selectedfolders list, go to the next page
       */
      menu !== "Trash" &&
      selectedFolders.length === 1 &&
      !e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id) {
        setSelectedFolders([]);
        setSelectedFiles([]);
        history.push(`/drive/folders/${folder._id}`);
      } else {
        let folders = [];
        folders[0] = {
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        };
        const isFavorited = checkIsFavorited(folders);
        setSelectedFiles([]);
        setSelectedFolders(folders);
        setIsFavorited(isFavorited);
      }
    } else if (
      /**
       * Clear the list of folders if user ctrl clicks the same folder
       */
      menu !== "Trash" &&
      selectedFolders.length === 1 &&
      e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id) setSelectedFolders([]);
      else {
        selectedFolders.push({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        });
        const isFavorited = checkIsFavorited(selectedFolders);
        setSelectedFolders(selectedFolders);
        setIsFavorited(isFavorited);
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
      const isFavorited = checkIsFavorited(folders);
      setSelectedFolders(folders);
      setIsFavorited(isFavorited);
    } else {
      let folders = [];
      folders[0] = {
        id: folder._id,
        foldername: folder.foldername,
        parent_id: folder.parent_id,
      };
      const isFavorited = checkIsFavorited(folders);
      setSelectedFiles([]);
      setSelectedFolders(folders);
      setIsFavorited(isFavorited);
    }
  };

  const handleFileClick = (e, file) => {
    if (selectedFiles.length === 0 && !e.ctrlKey) {
      selectedFiles.push({
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      });
      const isFavorited = checkIsFavorited(selectedFiles);
      setSelectedFiles(selectedFiles);
      setSelectedFolders([]);
      setIsFavorited(isFavorited);
    } else if (
      selectedFiles.length === 1 &&
      selectedFiles[0].id === file._id &&
      !e.ctrlKey
    ) {
      axios.get(`/api/files/${file._id}`).then((d) => {
        setFileData(`/api/files/${file._id}`);
        setFileModalOpen(true);
        setContentType(d.headers["content-type"]);
      });
    } else if (
      selectedFiles.length === 1 &&
      selectedFiles[0].id === file._id &&
      e.ctrlKey
    ) {
      setSelectedFiles([]);
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
      const isFavorited = checkIsFavorited(files);
      setSelectedFiles(files);
      setIsFavorited(isFavorited);
    } else {
      let files = [];
      files[0] = {
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      };
      const isFavorited = checkIsFavorited(files);
      setSelectedFolders([]);
      setSelectedFiles(files);
      setIsFavorited(isFavorited);
    }
  };

  const handleFileCopy = () => {
    let urlParam = "";
    if (location.pathname !== "/drive/home") urlParam = `/${params.folder}`;
    const data = { selectedFiles: selectedFiles };
    postData(`/api/files/copy${urlParam}`, data)
      .then((data) => {
        for (let file of data.files) {
          files.push(file);
        }
        const tempFiles = data.newFiles.id.slice();
        const filesModified = tempFiles.length;
        setFiles(files); //updated files
        setFilesModified(filesModified); //Length of selected files that were copied
        setTempFiles(tempFiles); //Reference to selected files (if user chooses to undo, reference the tempfiles)
        setSelectedFiles([]);
        openSnack("Copy");
      })
      .catch((err) => console.log("Err", err));
  };

  const handleUndoCopy = () => {
    const data = { selectedFiles: tempFiles };
    let urlParam = "";
    if (location.pathname !== "/drive/home") urlParam = `/${params.folder}`;
    deleteData(`/api/files/copy${urlParam}`, data)
      .then((data) => {
        const { files } = { ...data };
        setFiles(files);
        setTempFiles([]);
        setFilesModified(0);
        setCopySnackOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleTrash = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
      isFavorited: [false, true],
    };
    const folder = params.folder ? `/${params.folder}` : "";
    patchData(`/api/files/trash${folder}`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        setFiles(files);
        setFolders(folders);
        setSelectedFolders([]);
        setSelectedFiles([]);
        setTempFiles(tempFiles);
        setTempFolders(tempFolders);
        setFilesModified(filesModified);
        openSnack("Trash");
      })
      .catch((err) => console.log("Err", err));
  };

  const handleUndoTrash = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    const folder = params.folder ? `/${params.folder}` : "";
    postData(`/api/files/undoTrash${folder}`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setTrashSnackOpen(false);
        setTempFiles([]);
        setTempFolders([]);
        setFilesModified(0);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleFavoritesTrash = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
      isFavorited: [true],
    };
    patchData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setSelectedFiles([]);
        setSelectedFolders([]);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleRestore = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
    };
    patchData("/api/files/restore", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        setFiles(files);
        setFolders(folders);
        setSelectedFolders([]);
        setSelectedFiles([]);
        setTempFiles(tempFiles);
        setTempFolders(tempFolders);
        setFilesModified(filesModified);
        openSnack("Restore");
      })
      .catch((err) => console.log("Err", err));
  };

  const handleUndoRestore = () => {
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
      isFavorited: [false, true],
      trashMenu: true,
    };
    patchData(`/api/files/trash`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setRestoreSnackOpen(false);
        setTempFiles([]);
        setTempFolders([]);
        setFilesModified(0);
      })
      .catch((err) => console.log("Err", err));
  };

  //When you favorite an item from Home
  const handleFavorites = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
    };
    patchData("/api/files/favorites", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        setFiles(files);
        setFolders(folders);
        setIsFavorited(true);
        setFavoritesSnackOpen(true);
        setTempFiles(tempFiles);
        setTempFolders(tempFolders);
        setFilesModified(filesModified);
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item from 'Home', and then click undo
  const handleUndoFavorite = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    patchData("/api/files/undo-favorites", data)
      .then((data) => {
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setTempFiles([]);
        setTempFolders([]);
        setFilesModified(0);
        setFavoritesSnackOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item in 'Favorites'
  const handleUnfavorited = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
    };
    patchData("/api/files/unfavorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        const filesModified = tempFiles.length + tempFolders.length;
        setFiles(files);
        setFolders(folders);
        setTempFiles(tempFiles);
        setTempFolders(tempFolders);
        setUnfavoriteSnackOpen(true);
        setFilesModified(filesModified);
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item in 'Favorites', and then click undo
  const handleUndoUnfavorite = () => {
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
      favoritesMenu: true,
    };
    patchData("/api/files/favorites", data)
      .then((data) => {
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setSelectedFiles([]);
        setSelectedFolders([]);
        setTempFolders([]);
        setTempFiles([]);
        setFilesModified(0);
        setUnfavoriteSnackOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleHomeUnfavorited = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
    };
    patchData("/api/files/home-undo-favorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setIsFavorited(false);
      })
      .catch((err) => console.log("Err", err));
  };
  const handleDeleteForever = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
    };
    deleteData("/api/files/selected", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Trashed files and folders
        setFiles(files);
        setFolders(folders);
        setSelectedFiles([]);
        setSelectedFolders([]);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleDeleteAll = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    deleteData("/api/files/all")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setDeleteAllOpen(false);
        setTrashMenuOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleRestoreAll = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    patchData("/api/files/all/restore")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        setFiles(files);
        setFolders(folders);
        setRestoreAllOpen(false);
        setTrashMenuOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

  const handleFileClose = () => {
    setFileModalOpen(false);
  };

  const handleDrawerToggle = () => {
    setDrawerMobileOpen((open) => !open);
  };

  const handleSingleDownload = (file) => {
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

  const handleFavoritesSnackClose = (event, reason) => {
    setFavoritesSnackOpen(false);
  };

  const handleCopySnackClose = (event, reason) => {
    setCopySnackOpen(false);
  };

  const handleTrashSnackClose = (event, reason) => {
    setTrashSnackOpen(false);
  };

  const handleRestoreSnackClose = (event, reason) => {
    setRestoreSnackOpen(false);
  };

  const handleUnFavoriteSnackClose = (event, reason) => {
    setUnfavoriteSnackOpen(false);
  };

  const copySnack = (
    <Snack
      open={copySnackOpen}
      onClose={handleCopySnackClose}
      onExited={handleSnackbarExit}
      message={`Copied ${filesModified} file(s).`}
      onClick={handleUndoCopy}
    />
  );

  const trashSnack = (
    <Snack
      open={trashSnackOpen}
      onClose={handleTrashSnackClose}
      onExited={handleSnackbarExit}
      message={`Trashed ${filesModified} item(s).`}
      onClick={handleUndoTrash}
    />
  );
  const favoritesSnack = (
    <Snack
      open={favoritesSnackOpen}
      onClose={handleFavoritesSnackClose}
      onExited={handleSnackbarExit}
      message={`Favorited ${filesModified} item(s).`}
      onClick={handleUndoFavorite}
    />
  );

  const restoreSnack = (
    <Snack
      open={restoreSnackOpen}
      onClose={handleRestoreSnackClose}
      onExited={handleSnackbarExit}
      message={`Restored ${filesModified} item(s).`}
      onClick={handleUndoRestore}
    />
  );

  const unfavoriteSnack = (
    <Snack
      open={unfavoriteSnackOpen}
      onClose={handleUnFavoriteSnackClose}
      onExited={handleSnackbarExit}
      message={`Unfavorited ${filesModified} item(s).`}
      onClick={handleUndoUnfavorite}
    />
  );

  const actions = (
    <Actions
      setFiles={setFiles}
      setFolders={setFolders}
      setSelectedFiles={setSelectedFiles}
      setSelectedFolders={setSelectedFolders}
      menu={menu}
    />
  );

  let [fileType, style] = getContentType(
    fileData,
    contentType,
    selectedFiles,
    handleSingleDownload
  );

  const fileModal = (
    <Dialog
      open={fileModalOpen}
      onClose={handleFileClose}
      PaperProps={(style = { style })}
    >
      <DialogContent>{fileType}</DialogContent>
    </Dialog>
  );
  const classes = useStyles();
  const filesList = sortFiles(files, sortColumn);
  const foldersList = sortFolders(folders, sortColumn);
  return (
    <Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <Header
          homePage={"Home"}
          handleDrawerToggle={handleDrawerToggle}
          setFileData={setFileData}
          setFileModalOpen={setFileModalOpen}
          setContentType={setContentType}
        />
        <ActionsDrawer
          actions={actions}
          mobileOpen={drawerMobileOpen}
          handleDrawerToggle={handleDrawerToggle}
        />
        <main className={classes.content}>
          {fileModal}
          <div className={classes.toolbar} />
          {
            <ActionHeader
              files={files}
              folders={folders}
              selectedFiles={selectedFiles}
              selectedFolders={selectedFolders}
              handleTrash={handleTrash}
              handleFileCopy={handleFileCopy}
              handleDeleteForever={handleDeleteForever}
              handleRestore={handleRestore}
              handleFavorites={handleFavorites}
              handleUnfavorited={handleUnfavorited}
              handleFavoritesTrash={handleFavoritesTrash}
              handleHomeUnfavorited={handleHomeUnfavorited}
              currentMenu={menu}
              isFavorited={isFavorited}
              currentFolder={currentFolder}
              isLoaded={isLoaded}
              handleDeleteAll={handleDeleteAll}
              handleRestoreAll={handleRestoreAll}
              restoreAllOpen={restoreAllOpen}
              deleteAllOpen={deleteAllOpen}
              trashMenuOpen={trashMenuOpen}
              trashAnchorEl={trashAnchorEl}
              moveMenuOpen={moveMenuOpen}
              moveAnchorEl={moveAnchorEl}
              setTrashAnchorEl={setTrashAnchorEl}
              setMoveMenuOpen={setMoveMenuOpen}
              setMoveAnchorEl={setMoveAnchorEl}
              handleSingleDownload={handleSingleDownload}
            />
          }
          <MainTable
            handleFolderClick={handleFolderClick}
            handleFileClick={handleFileClick}
            handleSort={handleSort}
            folders={foldersList}
            files={filesList}
            selectedFolders={selectedFolders}
            selectedFiles={selectedFiles}
            currentMenu={menu}
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
