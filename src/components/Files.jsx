import React, { Fragment, useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import { useHistory, useLocation, useParams } from "react-router-dom";
import axios from "axios";
import ActionHeader from "./top-panel-components/ActionHeader";
import postData from "../helpers/postData";
import deleteData from "../helpers/deleteData";
import getData from "../helpers/getData";
import sortFolders from "../helpers/sortFolders";
import getContentType from "../helpers/getContentType";
import patchData from "../helpers/patchData";
import sortFiles from "../helpers/sortFiles";
import Actions from "./left-panel-components/Actions";
import ActionsDrawer from "./left-panel-components/ActionsDrawer";
import Header from "./header-components/Header";
import Snack from "./reusable-components/Snack";
import MainTable from "./MainTable";
import CssBaseline from "@material-ui/core/CssBaseline";
import Dialog from "@material-ui/core/Dialog";
import DialogContent from "@material-ui/core/DialogContent";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    maxHeight: "100vh",
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
    maxHeight: "100vh",
  },
}));

/**
 * Files is responsible for getting the files/folders
 * based on the specific url path.
 * /drive/home - Returns files/folders that are not in any specific directory
 * /drive/folders/:folderid - Returns files/folders that are in a specific directory
 * /drive/favorites - Returns favorited files/folders
 * /drive/trash - Returns files/folders that are currently in the trash
 *
 * @param menu - Used to identify the current menu (Home,Favorites,Trash)
 */
export default function Files({ menu }) {
  const history = useHistory();
  const location = useLocation();
  const params = useParams();

  const [items, setItems] = useState({ files: [], folders: [] });

  // Hook is used when user selects one or more records in the table
  const [selectedItems, setSelectedItems] = useState({
    selectedFiles: [],
    selectedFolders: [],
    isFavorited: false, //if this is false, then show 'Add Favorites' button; else, show 'Remove Favorites'
  });

  /***
   *  This hook is used when a user completes an action and wants to undo that specific action
   *  i.e. user favorites a file, and then decides to undo this action,
   */
  const [tempItems, setTempItems] = useState({
    tempFiles: [],
    tempFolders: [],
  });

  // This hook is used to reference the folder hierarchy
  const [currentFolder, setCurrentFolder] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // The actions panel on the left is a responsive drawer that opens based on screen width
  const [drawerMobileOpen, setDrawerMobileOpen] = useState(false);

  // FileData, FileModalOpen, and ContentType refer to viewing files in the browser
  const [fileData, setFileData] = useState(undefined);
  const [fileModalOpen, setFileModalOpen] = useState(false);
  const [contentType, setContentType] = useState("");

  // Refers to all the different snackbars used by specific actions
  const [snackOpen, setSnackOpen] = useState({
    copy: false,
    trash: false,
    restore: false,
    favorite: false,
    unfavorite: false,
    homeUnfavorite: false,
    favoritesTrash: false,
  });

  // Currently sorted column
  const [sortColumn, setSortColumn] = useState({
    name: "Name",
    order: "asc",
  });

  const { selectedFiles, selectedFolders } = { ...selectedItems };

  //temp files/folders references the recently selected files/folders
  const { tempFiles, tempFolders } = { ...tempItems };

  // Destructuring of all snacks
  const {
    copy,
    trash,
    restore,
    favorite,
    unfavorite,
    homeUnfavorite,
    favoritesTrash,
  } = {
    ...snackOpen,
  };

  /**
   * Gets the files/folders based on specific pathname
   * The pathname can be:
   *  -Home, Favorites, Trash, or a Specific Folder
   */
  const getFilesFolders = async () => {
    try {
      const data = await getData(`/api${location.pathname}`);
      let { files, folders } = { ...data };
      files = sortFiles(files, sortColumn);
      folders = sortFolders(folders, sortColumn);
      setItems({ files, folders });
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

  //Whenever the pathname changes, call getFilesFolders
  useEffect(() => {
    (async () => await getFilesFolders())();
  }, [location.pathname]);

  /**
   * When a user does an action such as Move/Trash, we want to remove the item from the list
   * of files and folders
   */
  const filterItems = () => {
    let folders = items.folders.slice();
    let files = items.files.slice();
    if (selectedFolders.length > 0) {
      let folderidList = [];
      selectedFolders.forEach((folder) => folderidList.push(folder._id));
      folders = items.folders.filter(
        (folder) => !folderidList.includes(folder._id)
      );
    }
    if (selectedFiles.length > 0) {
      let fileidList = [];
      selectedFiles.forEach((file) => fileidList.push(file._id));
      files = files.filter((file) => !fileidList.includes(file._id));
    }
    return { files, folders };
  };

  /**
   * When a user does an action such as Move/Trash and undoes the action,
   * we want to add the item from the list of files and folders
   */
  const addItems = () => {
    let { files, folders } = { ...items };
    if (tempFiles.length > 0) tempFiles.forEach((file) => files.push(file));
    if (tempFolders.length > 0)
      tempFolders.forEach((folder) => folders.push(folder));
    files = sortFiles(files, sortColumn);
    folders = sortFolders(folders, sortColumn);
    return { files, folders };
  };

  /**
   * Favorites or unfavorites the selected items
   * @param {*} favoriteFlag - true: favorites the items; false: unfavorites the items
   */
  const favoriteItems = (favoriteFlag) => {
    let { folders, files } = { ...items };
    if (selectedFolders.length > 0) {
      let folderidList = [];
      selectedFolders.forEach((folder) => folderidList.push(folder._id));
      folders.forEach((folder, index, arr) => {
        if (folderidList.includes(folder._id))
          arr[index].isFavorited = favoriteFlag;
      });
    }
    if (selectedFiles.length > 0) {
      let fileidList = [];
      selectedFiles.forEach((file) => fileidList.push(file._id));
      files.forEach((file, index, arr) => {
        if (fileidList.includes(file._id))
          arr[index].metadata.isFavorited = favoriteFlag;
      });
    }
    return { files, folders };
  };

  /**
   * When the snackbar closes, clear the values that are stored temporarily
   */
  const handleSnackbarExit = () => {
    if (tempFiles || tempFolders) {
      setTempItems({ tempFiles: [], tempFolders: [] });
    }
  };

  /**
   * If the user selects any non-favorited item, then show "Add Favorites" button
   * Else, if the user selects all favorited items, then show "Remove Favorites" button
   * @param {*} items - items are the selected items (files/folders)
   */
  const checkIsFavorited = (items) => {
    let isFavorited = 0;
    for (let i = 0; i < items.length; ++i) {
      if (items[i].isFavorited || items[i].metadata?.isFavorited) isFavorited++;
    }
    if (isFavorited > 0 && isFavorited === items.length) return true;
    return false;
  };

  /**
   * Sorts the files/folders based off the column
   * @param {*} column - Columnn is name, date, file-size
   */
  const handleSort = (column) => {
    let sort = { ...sortColumn };
    sort.order = sort.name === column && sort.order === "asc" ? "desc" : "asc";
    sort.name = column;
    let filesList = sortFiles(items.files, sort);
    let foldersList = sortFolders(items.folders, sort);
    setItems({ files: filesList, folders: foldersList });
    setSortColumn(sort);
  };

  /**
   * Selects the clicked folder
   * @param {*} e - event to track ctrl click
   * @param {*} folder - folder that has been selected
   */
  const handleFolderClick = (e, folder) => {
    const folderLength = selectedFolders.length;
    // No folders selected
    if (folderLength === 0 && !e.ctrlKey) {
      // Add selected folder to array
      selectedFolders.push(folder);
      //Check if any of the folders are favorited
      const isFavorited = checkIsFavorited(selectedFolders);
      //Set state
      setSelectedItems({
        selectedFiles: [],
        selectedFolders,
        isFavorited,
      });
    } else if (
      // User double clicks the same folder and the current menu is not 'Trash',
      location.pathname !== "/drive/trash" &&
      folderLength === 1 &&
      !e.ctrlKey
    ) {
      // If the selected folder has already been selected, remove from selected folders
      if (selectedFolders[0]._id === folder._id) {
        setSelectedItems({
          selectedFiles: [],
          selectedFolders: [],
          isFavorited: false,
        });
        history.push(`/drive/folders/${folder._id}`);
      }
      // If the selected folder has not already been selected, add to selected folders
      else {
        let folders = [];
        folders[0] = folder;
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
      if (selectedFolders[0]._id === folder._id)
        setSelectedItems({ ...selectedItems, selectedFolders: [] });
      // If the folder clicked is not the same, add folder to selected folders list
      else {
        selectedFolders.push(folder);
        const isFavorited = checkIsFavorited(selectedFolders);
        setSelectedItems({
          ...selectedItems,
          selectedFolders,
          isFavorited,
        });
      }
    }
    //Ctrl key was pressed
    else if (e.ctrlKey) {
      let folders = [];
      let count = 0;
      //Check to see if folder already exists
      for (let i = 0; i < folderLength; ++i) {
        if (selectedFolders[i]._id !== folder._id) {
          folders.push(selectedFolders[i]);
          count++;
        }
      }
      // If the folder has not been selected, add selected folder to selectedFolders list
      if (count === folderLength) folders.push(folder);
      const isFavorited = checkIsFavorited(folders);
      setSelectedItems({
        ...selectedItems,
        selectedFolders: folders,
        isFavorited,
      });
    } else {
      //If there are more than 1 selected folders, clear the list if ctrl is not pressed
      let folders = [];
      folders[0] = folder;
      const isFavorited = checkIsFavorited(folders);
      setSelectedItems({
        selectedFiles: [],
        selectedFolders: folders,
        isFavorited,
      });
    }
  };

  /**
   * Selects the clicked file
   * @param {*} e - event to track ctrl click
   * @param {*} file - file that has been selected
   */
  const handleFileClick = (e, file) => {
    // User selects a file in the table (with no selected files and ctrl key not pressed)
    if (selectedFiles.length === 0 && !e.ctrlKey) {
      selectedFiles.push(file);
      const isFavorited = checkIsFavorited(selectedFiles);
      setSelectedItems({
        selectedFiles,
        selectedFolders: [],
        isFavorited,
      });
    }
    // User double clicks a file in 'Home/Favorites'
    else if (
      selectedFiles.length === 1 &&
      selectedFiles[0]._id === file._id &&
      !e.ctrlKey &&
      location.pathname !== "/drive/trash"
    ) {
      document.body.style.cursor = "wait";
      axios.get(`/api/files/${file._id}`).then((d) => {
        setFileData(`/api/files/${file._id}`);
        setFileModalOpen(true);
        setContentType(d.headers["content-type"]);
        document.body.style.cursor = "default";
      });
    }
    // Clear out the selected files if the user presses 'ctrl' and the same item is selected
    else if (
      selectedFiles.length === 1 &&
      selectedFiles[0]._id === file._id &&
      e.ctrlKey
    ) {
      setSelectedItems({ ...selectedItems, selectedFiles: [] });
    }
    // Add file to selected items if ctrl key is pressed
    else if (e.ctrlKey) {
      let files = [];
      let count = 0;
      // Check that the item has not already been selected
      for (let i = 0; i < selectedFiles.length; ++i) {
        if (selectedFiles[i]._id !== file._id) {
          files.push(selectedFiles[i]);
          count++;
        }
      }
      // If the item has not been selected, add to selected files
      if (count === selectedFiles.length) files.push(file);
      const isFavorited = checkIsFavorited(files);
      setSelectedItems({ ...selectedItems, selectedFiles: files, isFavorited });
    }
    // If the selected files > 1, and ctrl key is not pressed, clear out the selected files and add the clicked file
    else {
      let files = [];
      files[0] = file;
      const isFavorited = checkIsFavorited(files);
      setSelectedItems({
        selectedFiles: files,
        selectedFolders: [],
        isFavorited,
      });
    }
  };

  // Copies the selected files to specific directory or to "Home"
  const handleFileCopy = () => {
    let urlParam = "";
    if (location.pathname !== "/drive/home") urlParam = `/${params.folder}`;
    const data = { selectedFiles };
    postData(`/api/files/copy${urlParam}`, data)
      .then((data) => {
        const { files } = { ...items };
        for (let file of data.files) {
          files.push(file); // Add the copied files
        }
        const tempFiles = data.newFiles.id.slice();
        let sortedFiles = sortFiles(files, sortColumn); //Sort all files
        setItems({ ...items, files: sortedFiles }); //updated files
        setSelectedItems({ ...selectedItems, selectedFiles: data.files });
        setTempItems({ ...tempItems, tempFiles }); //Reference to selected files (if user chooses to undo, reference the tempfiles)
        setSnackOpen({ ...snackOpen, copy: true });
      })
      .catch((err) => console.log("Err", err));
  };

  // Deletes the copied files from specific directory or "Home"
  const handleUndoCopy = () => {
    const data = { selectedFiles: tempFiles };
    let urlParam = "";
    if (location.pathname !== "/drive/home") urlParam = `/${params.folder}`;
    deleteData(`/api/files/copy${urlParam}`, data)
      .then((data) => {
        const { files } = { ...data };
        let tempFilesIdList = [];
        tempFiles.forEach((file) => tempFilesIdList.push(file._id));

        //Removes the copied files from the list of files
        let modifiedFiles = files.filter(
          (file) => !tempFilesIdList.includes(file._id)
        );
        setItems({ ...items, files: modifiedFiles });
        setTempItems({ tempFiles: [] });
        setSnackOpen({ ...snackOpen, copy: false });
      })
      .catch((err) => console.log("Err", err));
  };

  // Sends selected files/folders to trash
  const handleTrash = () => {
    const data = {
      selectedFolders,
      selectedFiles,
    };
    const folder = params.folder ? `/${params.folder}` : "";
    patchData(`/api/files/trash${folder}`, data)
      .then((data) => {
        const { files, folders } = filterItems(); //Removes the selected items from the list of files/folders
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
        setSnackOpen({ ...snackOpen, trash: true });
      })
      .catch((err) => console.log("Err", err));
  };

  // Restores selected files/folders that were initially in trash
  const handleUndoTrash = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    const folder = params.folder ? `/${params.folder}` : "";
    patchData(`/api/files/undo-trash${folder}`, data)
      .then((data) => {
        // Adds the tempfiles/folders back to the list of files/folders
        const { files, folders } = addItems();
        setSnackOpen({ ...snackOpen, trash: false });
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
      })
      .catch((err) => console.log("Err", err));
  };

  // Sends selected files/folders to trash when current menu is "Favorites"
  const handleFavoritesTrash = () => {
    const data = {
      selectedFolders: selectedFolders,
      selectedFiles: selectedFiles,
    };
    patchData("/api/files/trash", data)
      .then((data) => {
        // Removes the selectedfiles/folders from the list of files/folders
        const { files, folders } = filterItems();
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFiles: [],
          selectedFolders: [],
        });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, favoritesTrash: true });
      })
      .catch((err) => console.log("Err", err));
  };

  // Restores selected files/folders initially in trash when current menu is "Favorites"
  const handleUndoFavoritesTrash = () => {
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
    };
    patchData("/api/files/selected/restore", data)
      .then((data) => {
        // Adds the tempfiles/folders back to the list of files/folders
        const { files, folders } = addItems();
        setSnackOpen({ ...snackOpen, favoritesTrash: false });
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
      })
      .catch((err) => console.log("Err", err));
  };

  // Restores the selected files/folders in 'Trash' menu
  const handleRestore = () => {
    const data = {
      selectedFolders,
      selectedFiles,
    };
    patchData("/api/files/selected/restore", data)
      .then((data) => {
        // Removes files/folders from 'Trash' menu
        const { files, folders } = filterItems();
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setSnackOpen({ ...snackOpen, restore: true });
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

  // Trashes the selected files/folders that were initally restored in 'Trash' menu
  const handleUndoRestore = () => {
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
    };
    patchData(`/api/files/trash`, data)
      .then((data) => {
        // Adds files/folders to the 'Trash' menu
        const { files, folders } = addItems();
        setSnackOpen({ ...snackOpen, restore: false });
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you favorite an item from 'Home' menu
  const handleFavorites = () => {
    const data = {
      selectedFolders,
      selectedFiles,
    };
    patchData("/api/files/favorites", data)
      .then((data) => {
        // Favorites the selected files/folders
        const { files, folders } = favoriteItems(true);
        //Slice will clone the array and return reference to new array
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setSelectedItems({ ...selectedItems, isFavorited: true });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, favorite: true, homeUnfavorite: false });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you favorite an item from 'Home', and then click undo
  const handleUndoFavorite = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    patchData("/api/files/undo-favorites", data)
      .then((data) => {
        // Unfavorites the selected files/folders
        const { files, folders } = favoriteItems(false);
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
        setSnackOpen({ ...snackOpen, favorite: false });
      })
      .catch((err) => console.log("Err", err));
  };

  // When you unfavorite an item from 'Home'
  const handleHomeUnfavorited = () => {
    const data = { selectedFolders, selectedFiles };
    patchData("/api/files/home-undo-favorite", data)
      .then((data) => {
        const { files, folders } = favoriteItems(false);
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setSelectedItems({ ...selectedItems, isFavorited: false });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, homeUnfavorite: true, favorite: false });
      })
      .catch((err) => console.log("Err", err));
  };

  // When you unfavorite an item from 'Home' and then click undo
  const handleHomeUndoUnfavorite = () => {
    const data = { selectedFolders: tempFolders, selectedFiles: tempFiles };
    patchData("/api/files/favorites", data)
      .then((data) => {
        // Favorites the selected files/folders
        const { files, folders } = favoriteItems(true);
        setItems({ files, folders });
        setTempItems({ tempFiles: [], tempFolders: [] });
        setSnackOpen({ ...snackOpen, homeUnfavorite: false });
      })
      .catch((err) => console.log("Err", err));
  };

  //When you unfavorite an item in 'Favorites'
  const handleUnfavorited = () => {
    const data = { selectedFolders, selectedFiles };
    patchData("/api/files/unfavorite", data)
      .then((data) => {
        // Unfavorites the selected files/folders
        let { files, folders } = favoriteItems(false);
        // Removes the unfavorited items from the list
        if (selectedFolders.length > 0) {
          let folderidList = [];
          selectedFolders.forEach((folder) => folderidList.push(folder._id));
          folders = items.folders.filter(
            (folder) => !folderidList.includes(folder._id)
          );
        }
        if (selectedFiles.length > 0) {
          let fileidList = [];
          selectedFiles.forEach((file) => fileidList.push(file._id));
          files = items.files.filter((file) => !fileidList.includes(file._id));
        }
        const tempFiles = selectedFiles.slice();
        const tempFolders = selectedFolders.slice();
        setItems({ files, folders });
        setTempItems({ tempFiles, tempFolders });
        setSnackOpen({ ...snackOpen, unfavorite: true, favorite: false });
      })
      .catch((err) => console.log("Err", err));
  };

  /**
   * Action is called  when 'Unfavorite' button in 'Favorites' is clicked
   * and user clicks 'Undo' in the Snackbar.
   * The selected folders/files are unfavorited temporarily and then are
   * favorited again
   */
  const handleUndoUnfavorite = () => {
    const data = {
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
      favoritesMenu: [true, false],
    };
    patchData("/api/files/favorites", data)
      .then((data) => {
        // Favorites the recently 'unfavorited' selected items
        let { files, folders } = favoriteItems(true);
        // Add the items to the favorited list
        if (tempFiles.length > 0) tempFiles.forEach((file) => files.push(file));
        if (tempFolders.length > 0)
          tempFolders.forEach((folder) => folders.push(folder));
        files = sortFiles(files, sortColumn);
        folders = sortFolders(folders, sortColumn);
        setSnackOpen({ ...snackOpen, unfavorite: false });
        setItems({ files, folders });
        setSelectedItems({
          ...selectedItems,
          selectedFiles: [],
          selectedFolders: [],
        });
        setTempItems({ tempFiles: [], tempFolders: [] });
      })
      .catch((err) => console.log("Err", err));
  };

  /**
   * Action is called when 'Delete Forever' button in 'Trash' is clicked.
   * The selected folders/files are deleted forever
   * and cannot be restored
   */
  const handleDeleteForever = () => {
    const data = { selectedFolders, selectedFiles };
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

  // When user double clicks a file, the modal will close when user clicks on background
  const handleFileClose = () => {
    setFileModalOpen(false);
  };

  // Actions drawer on the left is opened/closed based on width of screen
  const handleDrawerToggle = () => {
    setDrawerMobileOpen((open) => !open);
  };

  // Downloads the selected file
  const handleSingleDownload = (file) => {
    fetch(`/api/files/${file._id}`)
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

  // Close the "Favorites" snack in 'Home' menu
  const handleFavoritesSnackClose = () => {
    setSnackOpen({ ...snackOpen, favorite: false });
  };

  // Close the "Copy" snack in 'Home Menu'
  const handleCopySnackClose = () => {
    setSnackOpen({ ...snackOpen, copy: false });
  };

  // Close the "Trash" snack in 'Home' menu
  const handleTrashSnackClose = () => {
    setSnackOpen({ ...snackOpen, trash: false });
  };

  // Close the "Unfavorite" snack in 'Home' menu
  const handleHomeUnFavoriteSnackClose = () => {
    setSnackOpen({ ...snackOpen, homeUnfavorite: false });
  };

  // Close the "Unfavorite" snack in 'Favorites' menu
  const handleUnFavoriteSnackClose = () => {
    setSnackOpen({ ...snackOpen, unfavorite: false });
  };

  // Close the "Trash" snack in 'Favorites' menu
  const handleFavoritesTrashSnackClose = () => {
    setSnackOpen({ ...snackOpen, favoritesTrash: false });
  };

  // Close the "Restore" snack in 'Trash' menu
  const handleRestoreSnackClose = () => {
    setSnackOpen({ ...snackOpen, restore: false });
  };

  // When an action (Move,Favorite,Trash,etc.), keep track of how many items were modified
  let itemsModified = selectedFiles?.length + selectedFolders?.length;

  // If the user undos a specific action, use the tempfiles/tempfolders length
  if (itemsModified === 0) {
    itemsModified = tempFiles?.length + tempFolders?.length;
  }

  const copySnack = (
    <Snack
      open={copy}
      onClose={handleCopySnackClose}
      onExited={handleSnackbarExit}
      message={`Copied ${itemsModified} file(s).`}
      onClick={handleUndoCopy}
    />
  );

  const trashSnack = (
    <Snack
      open={trash}
      onClose={handleTrashSnackClose}
      onExited={handleSnackbarExit}
      message={`Trashed ${itemsModified} item(s).`}
      onClick={handleUndoTrash}
    />
  );

  const favoritesTrashSnack = (
    <Snack
      open={favoritesTrash}
      onClose={handleFavoritesTrashSnackClose}
      onExited={handleSnackbarExit}
      message={`Trashed ${itemsModified} item(s).`}
      onClick={handleUndoFavoritesTrash}
    />
  );

  const favoritesSnack = (
    <Snack
      open={favorite}
      onClose={handleFavoritesSnackClose}
      onExited={handleSnackbarExit}
      message={`Favorited ${itemsModified} item(s).`}
      onClick={handleUndoFavorite}
    />
  );

  const restoreSnack = (
    <Snack
      open={restore}
      onClose={handleRestoreSnackClose}
      onExited={handleSnackbarExit}
      message={`Restored ${itemsModified} item(s).`}
      onClick={handleUndoRestore}
    />
  );

  const unfavoriteSnack = (
    <Snack
      open={unfavorite}
      onClose={handleUnFavoriteSnackClose}
      onExited={handleSnackbarExit}
      message={`Unfavorited ${itemsModified} item(s).`}
      onClick={handleUndoUnfavorite}
    />
  );

  const homeUnfavoriteSnack = (
    <Snack
      open={homeUnfavorite}
      onClose={handleHomeUnFavoriteSnackClose}
      onExited={handleSnackbarExit}
      message={`Unfavorited ${itemsModified} item(s).`}
      onClick={handleHomeUndoUnfavorite}
    />
  );

  const actions = (
    <Actions
      setItems={setItems}
      setSelectedItems={setSelectedItems}
      items={items}
      menu={menu}
      drawerMobileOpen={drawerMobileOpen}
      setDrawerMobileOpen={setDrawerMobileOpen}
      sortColumn={sortColumn}
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

  // If the user double clicks a file, it will show a download link or the original file
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
          files={items.files}
          folders={items.folders}
          items={items}
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
              items={items}
              files={items.files}
              folders={items.folders}
              selectedFiles={selectedFiles}
              selectedFolders={selectedFolders}
              isFavorited={selectedItems.isFavorited}
              sortColumn={sortColumn}
              filterItems={filterItems}
              setItems={setItems}
              setSelectedItems={setSelectedItems}
              handleTrash={handleTrash}
              handleFileCopy={handleFileCopy}
              handleDeleteForever={handleDeleteForever}
              handleRestore={handleRestore}
              handleFavorites={handleFavorites}
              handleUnfavorited={handleUnfavorited}
              handleFavoritesTrash={handleFavoritesTrash}
              handleHomeUnfavorited={handleHomeUnfavorited}
              handleSingleDownload={handleSingleDownload}
              currentMenu={menu}
              currentFolder={currentFolder}
              isLoaded={isLoaded}
            />
          }
          <MainTable
            handleFolderClick={handleFolderClick}
            handleFileClick={handleFileClick}
            handleSort={handleSort}
            items={items}
            selectedItems={selectedItems}
            isLoaded={isLoaded}
            sortColumn={sortColumn}
          />
          {copySnack}
          {trashSnack}
          {favoritesSnack}
          {restoreSnack}
          {unfavoriteSnack}
          {homeUnfavoriteSnack}
          {favoritesTrashSnack}
        </main>
      </div>
    </Fragment>
  );
}
