import React, { Fragment, useState, useRef, useEffect } from "react";
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
import sortFiles from "../helpers/sortFiles";
import sortFolders from "../helpers/sortFolders";
import getContentType from "../helpers/getContentType";
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
  const [items, setItems] = useState({ files: [], folders: [] });
  const [selectedItems, setSelectedItems] = useState({
    selectedFiles: [],
    selectedFolders: [],
    isFavorited: false,
  });
  const [tempItems, setTempItems] = useState({
    tempFiles: [],
    tempFolders: [],
  });
  const [currentFolder, setCurrentFolder] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [drawerMobileOpen, setDrawerMobileOpen] = useState(false);
  const [fileData, setFileData] = useState(undefined);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");
  const [snackOpen, setSnackOpen] = useState({
    copy: false,
    trash: false,
    restore: false,
    favorite: false,
    unfavorite: false,
  });

  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [moveAnchorEl, setMoveAnchorEl] = useState(false);
  const [sortColumn, setSortColumn] = useState({
    name: "Name",
    order: "asc",
  });

  const { selectedFiles, selectedFolders } = { ...selectedItems };
  const { tempFiles, tempFolders } = { ...tempItems };
  const { copy, trash, restore, favorite, unfavorite } = { ...snackOpen };

  const getFilesFolders = async () => {
    try {
      const data = await getData(`/api${location.pathname}`);
      setItems({ files: data.files, folders: data.folders });
      setSelectedItems({
        ...selectedItems,
        selectedFiles: [],
        selectedFolders: [],
      });
      setCurrentFolder(data.folderPath);
      setIsLoaded(true);
    } catch (err) {
      console.log("Err", err);
    }
  };

  useEffect(() => {
    (async () => await getFilesFolders())();
  }, [location.pathname]);

  const handleSnackbarExit = () => {
    if (tempFiles || tempFolders) {
      setTempItems({ tempFiles: [], tempFolders: [] });
    }
  };

  const checkIsFavorited = (items) => {
    let isFavorited = 0;
    for (let i = 0; i < items.length; ++i) {
      if (items[i].isFavorited) isFavorited++;
    }
    if (isFavorited > 0 && isFavorited === items.length) return true;
    return false;
  };

  const handleSort = (column) => {
    let sort = { ...sortColumn };
    sort.order = sort.name === column && sort.order === "asc" ? "desc" : "asc";
    sort.name = column;
    let filesList = sortFiles(items.files, sort);
    let foldersList = sortFolders(items.filesfolders, sort);
    setItems({ files: filesList, folders: foldersList });
    setSortColumn(sort);
  };

  const selectFolder = (folder) => {
    selectedFolders.push({
      id: folder._id,
      foldername: folder.foldername,
      parent_id: folder.parent_id,
      isFavorited: folder.isFavorited,
    });
  };

  const handleFolderClick = (e, folder) => {
    const folderLength = selectedFolders.length;
    // No folders selected
    if (folderLength === 0 && !e.ctrlKey) {
      // Add selected folder to array
      selectFolder(folder);
      //Check if any of the folders are favorited
      const isFavorited = checkIsFavorited(selectedFolders);
      //Set state
      setSelectedItems({
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
      location.pathname !== "/drive/trash" &&
      folderLength === 1 &&
      !e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id) {
        setSelectedItems({
          selectedFiles: [],
          selectedFolders: [],
          isFavorited: false,
        });
        history.push(`/drive/folders/${folder._id}`);
      } else {
        let folders = [];
        folders[0] = {
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
          isFavorited: folder.isFavorited,
        };
        const isFavorited = checkIsFavorited(folders);
        setSelectedItems({
          selectedFiles: [],
          selectedFolders: folders,
          isFavorited,
        });
      }
    } else if (
      /**
       * Clear the list of folders if user ctrl clicks the same folder
       */
      location.pathname !== "/drive/trash" &&
      folderLength === 1 &&
      e.ctrlKey
    ) {
      if (selectedFolders[0].id === folder._id)
        setSelectedItems({ ...selectedItems, selectedFolders: [] });
      else {
        selectFolder(folder);
        const isFavorited = checkIsFavorited(selectedFolders);
        setSelectedItems({
          ...selectedItems,
          selectedFolders,
          isFavorited,
        });
      }
    } else if (e.ctrlKey) {
      let folders = [];
      let count = 0;
      for (let i = 0; i < folderLength; ++i) {
        if (selectedFolders[i].id !== folder._id) {
          folders.push(selectedFolders[i]);
          count++;
        }
      }
      if (count === folderLength)
        folders.push({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
          isFavorited: folder.isFavorited,
        });
      const isFavorited = checkIsFavorited(folders);
      setSelectedItems({
        ...selectedItems,
        selectedFolders: folders,
        isFavorited,
      });
    } else {
      let folders = [];
      folders[0] = {
        id: folder._id,
        foldername: folder.foldername,
        parent_id: folder.parent_id,
        isFavorited: folder.isFavorited,
      };
      const isFavorited = checkIsFavorited(folders);
      setSelectedItems({
        selectedFiles: [],
        selectedFolders: folders,
        isFavorited,
      });
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
      setSelectedItems({
        selectedFiles,
        selectedFolders: [],
        isFavorited,
      });
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
      setSelectedItems({ ...selectedItems, selectedFiles: [] });
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
      setSelectedItems({ ...selectedItems, selectedFiles: files, isFavorited });
    } else {
      let files = [];
      files[0] = {
        id: file._id,
        filename: file.filename,
        isFavorited: file.metadata.isFavorited,
        folder_id: file.folder_id,
      };
      const isFavorited = checkIsFavorited(files);
      setSelectedItems({
        selectedFiles: files,
        selectedFolders: [],
        isFavorited,
      });
    }
  };

  const handleFileCopy = () => {
    let urlParam = "";
    if (location.pathname !== "/drive/home") urlParam = `/${params.folder}`;
    const data = { selectedFiles };
    postData(`/api/files/copy${urlParam}`, data)
      .then((data) => {
        for (let file of data.files) {
          items.files.push(file);
        }
        const tempFiles = data.newFiles.id.slice();
        setItems({ ...items, files: items.files }); //updated files
        setSelectedItems({ ...selectedItems, selectedFiles: data.files[0] });
        setTempItems({ tempFiles }); //Reference to selected files (if user chooses to undo, reference the tempfiles)
        setSnackOpen({ ...snackOpen, copy: true });
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
        setItems({ ...items, files });
        setTempItems({ tempFiles: [] });
        setSnackOpen({ ...snackOpen, copy: false });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleTrash = () => {
    const data = {
      selectedFolders,
      selectedFiles,
      isFavorited: [false, true],
    };
    const folder = params.folder ? `/${params.folder}` : "";
    patchData(`/api/files/trash${folder}`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFolders: [],
          selectedFiles: [],
        });
        setTempItems({ tempFiles, tempFolders });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleUndoTrash = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    const folder = params.folder ? `/${params.folder}` : "";
    patchData(`/api/files/undo-trash${folder}`, data)
      .then((data) => {
        const { files, folders } = { ...data };
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
        setSnackOpen({ ...snackOpen, trash: true });
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
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFiles: [],
          selectedFolders: [],
        });
        setSnackOpen({ ...snackOpen, trash: true });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleRestore = () => {
    const data = {
      selectedFolders,
      selectedFiles,
    };
    patchData("/api/files/selected/restore", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFolders: [],
          selectedFiles: [],
        });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, restore: true });
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
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
        setSnackOpen({ ...snackOpen, restore: false });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you favorite an item from Home
  const handleFavorites = () => {
    const data = {
      selectedFolders,
      selectedFiles,
    };
    patchData("/api/files/favorites", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, favorite: true });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item from 'Home', and then click undo
  const handleUndoFavorite = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    patchData("/api/files/undo-favorites", data)
      .then((data) => {
        const { files, folders } = { ...data };
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
        setSnackOpen({ ...snackOpen, favorite: false });
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
        setItems({ files, folders });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, unfavorite: true });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item in 'Favorites', and then click undo
  const handleUndoUnfavorite = () => {
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
      favoritesMenu: [true, false],
    };
    patchData("/api/files/favorites", data)
      .then((data) => {
        const { files, folders } = { ...data };
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFiles: [],
          selectedFolders: [],
        });
        setTempItems({ tempFiles: [], tempFolders: [] });
        setSnackOpen({ ...snackOpen, unfavorite: true });
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
        setItems({ files, folders });
        setSelectedItems({ ...selectedItems, isFavorited: false });
        setSnackOpen({ ...snackOpen, unfavorite: true });
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
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFiles: [],
          selectedFolders: [],
        });
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

  const handleFavoritesSnackClose = () => {
    setSnackOpen({ ...snackOpen, favorite: false });
  };

  const handleCopySnackClose = () => {
    setSnackOpen({ ...snackOpen, copy: false });
  };

  const handleTrashSnackClose = () => {
    setSnackOpen({ ...snackOpen, trash: false });
  };

  const handleRestoreSnackClose = () => {
    setSnackOpen({ ...snackOpen, restore: false });
  };

  const handleUnFavoriteSnackClose = () => {
    setSnackOpen({ ...snackOpen, unfavorite: false });
  };
  const filesModified = selectedFiles?.length + selectedFolders?.length;

  const copySnack = (
    <Snack
      open={copy}
      onClose={handleCopySnackClose}
      onExited={handleSnackbarExit}
      message={`Copied ${filesModified} file(s).`}
      onClick={handleUndoCopy}
    />
  );

  const trashSnack = (
    <Snack
      open={trash}
      onClose={handleTrashSnackClose}
      onExited={handleSnackbarExit}
      message={`Trashed ${filesModified} item(s).`}
      onClick={handleUndoTrash}
    />
  );
  const favoritesSnack = (
    <Snack
      open={favorite}
      onClose={handleFavoritesSnackClose}
      onExited={handleSnackbarExit}
      message={`Favorited ${filesModified} item(s).`}
      onClick={handleUndoFavorite}
    />
  );

  const restoreSnack = (
    <Snack
      open={restore}
      onClose={handleRestoreSnackClose}
      onExited={handleSnackbarExit}
      message={`Restored ${filesModified} item(s).`}
      onClick={handleUndoRestore}
    />
  );

  const unfavoriteSnack = (
    <Snack
      open={unfavorite}
      onClose={handleUnFavoriteSnackClose}
      onExited={handleSnackbarExit}
      message={`Unfavorited ${filesModified} item(s).`}
      onClick={handleUndoUnfavorite}
    />
  );

  const actions = (
    <Actions
      setItems={setItems}
      setSelectedItems={setSelectedItems}
      menu={menu}
    />
  );

  // Handles the view/download for a file
  let [fileType, style] =
    fileData?.length > 0
      ? getContentType(
          fileData,
          contentType,
          selectedFiles,
          handleSingleDownload
        )
      : "";

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
  return (
    <Fragment>
      <div className={classes.root}>
        <CssBaseline />
        <Header
          setFileData={setFileData}
          setFileModalOpen={setFileModalOpen}
          setContentType={setContentType}
          handleDrawerToggle={handleDrawerToggle}
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
              files={items.files}
              folders={items.folders}
              selectedFiles={selectedFiles}
              selectedFolders={selectedFolders}
              setItems={setItems}
              isFavorited={selectedItems.isFavorited}
              handleTrash={handleTrash}
              handleFileCopy={handleFileCopy}
              handleDeleteForever={handleDeleteForever}
              handleRestore={handleRestore}
              handleFavorites={handleFavorites}
              handleUnfavorited={handleUnfavorited}
              handleFavoritesTrash={handleFavoritesTrash}
              handleHomeUnfavorited={handleHomeUnfavorited}
              currentMenu={menu}
              currentFolder={currentFolder}
              isLoaded={isLoaded}
              moveMenuOpen={moveMenuOpen}
              moveAnchorEl={moveAnchorEl}
              setMoveMenuOpen={setMoveMenuOpen}
              setMoveAnchorEl={setMoveAnchorEl}
              handleSingleDownload={handleSingleDownload}
            />
          }
          <MainTable
            handleFolderClick={handleFolderClick}
            handleFileClick={handleFileClick}
            handleSort={handleSort}
            items={items}
            selectedItems={selectedItems}
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
