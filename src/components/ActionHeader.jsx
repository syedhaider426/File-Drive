import makeStyles from "@material-ui/core/styles/makeStyles";
import React, { useState } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import Tooltip from "@material-ui/core/Tooltip";
import RestoreIcon from "@material-ui/icons/Restore";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlined";
import RenameFolder from "./RenameFolder";
import RenameFile from "./RenameFile";
import MoveItem from "./MoveItem";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import NavigateNextIcon from "@material-ui/icons/NavigateNext";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "@material-ui/core/Breadcrumbs";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Box from "@material-ui/core/Box";
import MoreIcon from "@material-ui/icons/MoreVert";
import getData from "../helpers/getData";
import GetAppIcon from "@material-ui/icons/GetApp";
import patchData from "../helpers/patchData";
import TrashMenu from "./trash-menu-components/TrashMenu";
import DeleteAllDialog from "./trash-menu-components/DeleteAllDialog";
import RestoreAllDialog from "./trash-menu-components/RestoreAllDialog";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  hover: {
    "&:hover": {
      cursor: "pointer",
      backgroundColor: "rgba(0, 0, 0, 0.10)",
    },
  },
  sectionDesktop: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "flex",
    },
  },
  sectionMobile: {
    display: "flex",
    [theme.breakpoints.up("md")]: {
      display: "none",
    },
  },
  font: {
    fontSize: "16px",
    fontWeight: "fontWeightBold",
  },
  smallIcon: {
    width: "1em",
    height: "1em",
  },
  menuItem: {
    padding: 0,
  },
  icons: { color: "#5f6368" },
}));

export default function ActionHeader(props) {
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [renameFileDialogOpen, setRenameFileDialogOpen] = useState(false);
  const [renameFolderDialogOpen, setRenameFolderDialogOpen] = useState(false);
  const [allFolders, setAllFolders] = useState([]);
  const [homeFolderStatus, setHomeFolderStatus] = useState([]);
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);
  const [moveFolder, setMoveFolder] = useState("");
  const [movedFolder, setMovedFolder] = useState({});
  const [movedSnack, setMovedSnack] = useState(false);
  const [mobileAnchorEl, setMobileAnchorEl] = useState(undefined);
  const [tempSelectedFolders, setTempSelectedFolders] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [tempSelectedFiles, setTempSelectedFiles] = useState([]);
  const [moveButtonDisabled, setMoveButtonDisabled] = useState(true);
  const location = useLocation();

  const {
    setFiles,
    setFolders,
    setSelectedFiles,
    setSelectedFolders,
    selectedFolders,
    selectedFiles,
    files,
    folders,
    currentMenu,
    isFavorited,
    currentFolder,
  } = {
    ...props,
  };
  const {
    deleteAllOpen,
    trashMenuOpen,
    setTrashMenuOpen,
    setDeleteAllOpen,
    setRestoreAllOpen,
    restoreAllOpen,
    handleRestoreAll,
    setTrashAnchorEl,
    trashAnchorEl,
    handleDeleteAll,
  } = { ...props };

  const handleRenameFileOpen = () => {
    setMobileMenuOpen(false);
    setRenameFileDialogOpen(true);
  };

  const handleRenameFolderOpen = () => {
    setMobileMenuOpen(false);
    setRenameFolderDialogOpen(true);
  };

  const handleMove = (e) => {
    const { selectedFolders, selectedFiles } = { ...props };
    const urlMove = location.pathname === "/drive/home" ? "" : "?move=true";
    getData(`/api${location.pathname}${urlMove}`).then((data) => {
      const { folders, moveTitleFolder } = { ...data };
      let homeFolderStatus;
      if (location.pathname === "/drive/home") homeFolderStatus = true;
      else homeFolderStatus = false;
      //user selects a file
      //file has a folder_id
      setAllFolders(folders);
      setHomeFolderStatus(homeFolderStatus);
      setMoveMenuOpen(true);
      setMobileMenuOpen(false);
      setMoveFolder({
        id: selectedFiles[0]?.folder_id || selectedFolders[0]?._id,
        foldername: moveTitleFolder.foldername,
        parent_id: moveTitleFolder.parent_id,
      });
    });
  };

  const onMoveExit = () => {
    setAllFolders([]);
    setHomeFolderStatus(false);
  };

  const handleMoveSnackClose = (event, reason) => {
    if (reason !== "clickaway") setMovedSnack(false);
  };

  const handleMoveItem = (e) => {
    e.preventDefault();
    const { selectedFolders, selectedFiles } = { ...props };
    const data = { moveFolder: moveFolder.id, selectedFolders, selectedFiles };
    patchData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      setMoveMenuOpen(false);
      setMovedFolder({});
      setSelectedIndex(undefined);
      setMoveButtonDisabled(true);
      setMovedSnack(true);
      setTempSelectedFolders(selectedFolders);
      setTempSelectedFiles(selectedFiles);
      setFiles(files);
      setFolders(folders);
      setSelectedFiles([]);
      setSelectedFolders([]);
    });
  };

  const handleUndoMoveItem = (e) => {
    e.preventDefault();
    let originalFolder =
      tempSelectedFolders[0]?.parent_id || tempSelectedFiles[0]?.folder_id;
    const data = {
      movedFolder: originalFolder,
      selectedFolders: tempSelectedFolders,
      selectedFiles: tempSelectedFiles,
    };
    patchData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      setMovedSnack(false);
      setFiles(files);
      setFolders(folders);
      setSelectedFolders(tempSelectedFolders);
      setSelectedFiles(tempSelectedFiles);
    });
  };

  const handleSnackbarExit = () => {
    if (tempSelectedFolders || tempSelectedFiles) {
      setTempSelectedFolders([]);
      setTempSelectedFiles([]);
      setMoveFolder("");
    }
    return;
  };

  const handleMobileMenuOpen = (e) => {
    setMobileMenuOpen(true);
    setMobileAnchorEl(e.currentTarget);
  };

  const handleTrashMenuOpen = (e) => {
    setTrashMenuOpen(true);
    setTrashAnchorEl(e.currentTarget);
  };

  const handleTrashMenuClose = (e) => {
    setTrashMenuOpen(false);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  /**
   *
   *{https://stackoverflow.com/questions/54416499/how-select-part-of-text-in-a-textfield-on-onfocus-event-with-material-ui-in-reac} event
   */
  const handleFocus = (event) => {
    event.preventDefault();
    const { target } = event;
    const extensionStarts = target.value.lastIndexOf(".");
    if (extensionStarts < 0) target.focus();
    else {
      target.focus();
      target.setSelectionRange(0, extensionStarts);
    }
  };

  const handleDeleteAllDialog = (e) => {
    setTrashMenuOpen(false);
    setDeleteAllOpen(true);
    setTrashAnchorEl(e.currentTarget);
  };

  const handleDeleteAllClose = (e) => {
    setDeleteAllOpen(false);
  };
  const handleRestoreAllDialog = (e) => {
    setTrashMenuOpen(false);
    setRestoreAllOpen(true);
    setTrashAnchorEl(e.currentTarget);
  };

  const handleRestoreAllClose = (e) => {
    setRestoreAllOpen(false);
  };

  const handleOnClick = (folder, selectedIndex) => {
    setSelectedIndex(selectedIndex);
    setMoveButtonDisabled(false);
    setMoveFolder({ id: folder._id, foldername: folder.foldername });
  };

  const handleNextFolder = (folder) => {
    getData(`/api/users/folders/${folder._id}`)
      .then((data) => {
        setAllFolders(data.folders);
        setHomeFolderStatus(false);
        setMoveFolder("");
        setSelectedIndex(undefined);
        setMovedFolder({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  const handlePreviousFolder = (folder_id) => {
    const urlParam =
      folder_id === "" ? "drive/home" : `users/folders/${folder_id}?move=true`;
    getData(`/api/${urlParam}`)
      .then((data) => {
        const { folders, moveTitleFolder } = { ...data };
        setAllFolders(folders);
        setHomeFolderStatus(folder_id === "");
        setSelectedIndex(undefined);
        setMovedFolder({
          foldername: moveTitleFolder.foldername,
          parent_id: moveTitleFolder.parent_id,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleMoveItemClose = () => {
    setMoveMenuOpen(false);
    setMovedFolder({});
    setSelectedIndex(undefined);
    setMoveButtonDisabled(true);
    setMoveFolder("");
  };

  const renameFile = (
    <RenameFile
      renameFileDialogOpen={renameFileDialogOpen}
      setFiles={setFiles}
      setSelectedFiles={setSelectedFiles}
      setRenameFileDialogOpen={setRenameFileDialogOpen}
      files={files}
      selectedFiles={selectedFiles}
      handleFocus={handleFocus}
    />
  );

  const renameFolder = (
    <RenameFolder
      renameFolderDialogOpen={renameFolderDialogOpen}
      setFolders={setFolders}
      setSelectedFolders={setSelectedFolders}
      setRenameFolderDialogOpen={setRenameFolderDialogOpen}
      folders={folders}
      selectedFolders={selectedFolders}
      handleFocus={handleFocus}
    />
  );
  const moveItem = (
    <MoveItem
      moveMenuOpen={moveMenuOpen}
      allFolders={allFolders}
      selectedFolders={selectedFolders}
      selectedFiles={selectedFiles}
      onMoveExit={onMoveExit}
      homeFolderStatus={homeFolderStatus}
      movedFolder={movedFolder}
      selectedIndex={selectedIndex}
      moveButtonDisabled={moveButtonDisabled}
      moveFolder={moveFolder}
      handleMoveItem={handleMoveItem}
      movedSnack={movedSnack}
      handleUndoMoveItem={handleUndoMoveItem}
      handleSnackbarExit={handleSnackbarExit}
      handleMoveSnackClose={handleMoveSnackClose}
      handleNextFolder={handleNextFolder}
      handlePreviousFolder={handlePreviousFolder}
      handleMoveItemClose={handleMoveItemClose}
      handleOnClick={handleOnClick}
    />
  );
  const trashMenu = (
    <TrashMenu
      trashAnchorEl={trashAnchorEl}
      trashMenuOpen={trashMenuOpen}
      handleTrashMenuClose={handleTrashMenuClose}
      handleDeleteAllDialog={handleDeleteAllDialog}
      handleRestoreAllDialog={handleRestoreAllDialog}
      files={files}
      folders={folders}
    />
  );

  const deleteAllDialog = (
    <DeleteAllDialog
      deleteAllOpen={deleteAllOpen}
      handleDeleteAllClose={handleDeleteAllClose}
      handleDeleteAll={handleDeleteAll}
    />
  );
  const restoreAllDialog = (
    <RestoreAllDialog
      restoreAllOpen={restoreAllOpen}
      handleRestoreAllClose={handleRestoreAllClose}
      handleRestoreAll={handleRestoreAll}
    />
  );
  const classes = useStyles();
  const mobileMenuId = "mobile-menu";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileAnchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
        currentMenu !== "Trash" && (
          <MenuItem className={classes.menuItem} onClick={handleMove}>
            <Tooltip title="Move To">
              <IconButton style={{ color: "gray" }} aria-label="Move To">
                <MoveToInboxIcon />
              </IconButton>
            </Tooltip>
            Move To
          </MenuItem>
        )}
      {!props.isFavorited
        ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
          (currentMenu === "Home" || currentMenu === "Folder") && (
            <MenuItem
              className={classes.menuItem}
              onClick={props.handleFavorites}
            >
              <Tooltip title="Add to Favorites">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Add to Favorites"
                >
                  <StarOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
              Add to Favorites
            </MenuItem>
          )
        : (selectedFiles.length > 0 || selectedFolders.length > 0) &&
          (currentMenu === "Home" || currentMenu === "Folder") && (
            <MenuItem
              className={classes.menuItem}
              onClick={props.handleHomeUnfavorited}
            >
              <Tooltip title="Remove from Favorites">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Remove from Favorites"
                >
                  <StarOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
              Remove from Favorites
            </MenuItem>
          )}
      {selectedFiles.length === 1 && currentMenu !== "Trash" && (
        <MenuItem className={classes.menuItem} onClick={handleRenameFileOpen}>
          <Tooltip title="Rename">
            <IconButton style={{ color: "gray" }} aria-label="Rename">
              <RenameIcon />
            </IconButton>
          </Tooltip>
          Rename File
        </MenuItem>
      )}

      {selectedFolders.length === 1 && currentMenu !== "Trash" && (
        <MenuItem className={classes.menuItem} onClick={handleRenameFolderOpen}>
          <Tooltip title="Rename">
            <IconButton style={{ color: "gray" }} aria-label="Rename">
              <RenameIcon />
            </IconButton>
          </Tooltip>
          Rename Folder
        </MenuItem>
      )}
      {selectedFiles.length >= 1 &&
        selectedFolders.length === 0 &&
        currentMenu !== "Trash" && (
          <MenuItem className={classes.menuItem} onClick={props.handleFileCopy}>
            <Tooltip title="Make a Copy">
              <IconButton style={{ color: "gray" }} aria-label="Make a Copy">
                <FileCopyIcon />
              </IconButton>
            </Tooltip>
            Make a Copy
          </MenuItem>
        )}
      {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
        currentMenu === "Favorites" && (
          <MenuItem
            className={classes.menuItem}
            onClick={props.handleUnfavorited}
          >
            <Tooltip title="Remove from Favorites">
              <IconButton
                style={{ color: "gray" }}
                aria-label="Remove from Favorites"
              >
                <StarOutlineOutlinedIcon />
              </IconButton>
            </Tooltip>
            Remove from Favorites
          </MenuItem>
        )}

      {selectedFiles.length > 0 &&
        selectedFolders.length <= 0 &&
        currentMenu !== "Trash" && (
          <MenuItem
            className={classes.menuItem}
            onClick={() => props.handleSingleDownload(selectedFiles[0])}
          >
            <Tooltip title="Download">
              <IconButton style={{ color: "gray" }} aria-label="Download">
                <GetAppIcon />
              </IconButton>
            </Tooltip>
            Download
          </MenuItem>
        )}
      {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
        (currentMenu === "Home" || currentMenu === "Folder") && (
          <MenuItem className={classes.menuItem} onClick={props.handleTrash}>
            <Tooltip title="Trash">
              <IconButton style={{ color: "gray" }} aria-label="Trash">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            Trash
          </MenuItem>
        )}
      {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
        currentMenu === "Favorites" && (
          <MenuItem
            className={classes.menuItem}
            onClick={props.handleFavoritesTrash}
          >
            <Tooltip title="Trash">
              <IconButton style={{ color: "gray" }} aria-label="Trash">
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            Trash
          </MenuItem>
        )}
      {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
        currentMenu === "Trash" && (
          <div>
            <MenuItem onClick={props.handleRestore}>
              <Tooltip title="Restore from trash">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Restore from trash"
                >
                  <RestoreIcon />
                </IconButton>
              </Tooltip>
              Restore from trash
            </MenuItem>
            <MenuItem onClick={props.handleDeleteForever}>
              <Tooltip title="Delete forever">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Delete forever"
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
              Delete forever
            </MenuItem>
          </div>
        )}
    </Menu>
  );

  let menu = "";
  if (currentFolder !== undefined || currentMenu === "Folder") {
    menu = "1";
  }
  return (
    <AppBar position="static" color="transparent" elevation={3}>
      <Toolbar variant="dense">
        {menu !== "" ? (
          <Breadcrumbs
            separator={<NavigateNextIcon fontSize="small" />}
            aria-label="breadcrumb"
          >
            {currentFolder?.length === 0 ? (
              <Box color="text.primary" fontSize={20}>
                Home
              </Box>
            ) : (
              <Box
                fontSize={20}
                className={classes.hover}
                component={Link}
                to={`/drive/home`}
                key={"Home"}
                style={{ textDecoration: "none", color: "black" }}
              >
                Home
              </Box>
            )}
            {currentFolder?.map((folder, index) => (
              <Box
                fontSize={20}
                className={classes.hover}
                component={Link}
                to={`/drive/folders/${folder._id}`}
                key={index}
                style={{ textDecoration: "none", color: "black" }}
              >
                {folder.foldername}
              </Box>
            ))}
          </Breadcrumbs>
        ) : currentMenu === "Trash" ? (
          <Box
            className={classes.hover}
            style={{ fontSize: "20px" }}
            aria-controls="simple-menu"
            aria-haspopup="true"
            onClick={handleTrashMenuOpen}
          >
            Trash
            <IconButton className={classes.smallIcon}>
              <ArrowDropDownIcon />
            </IconButton>
          </Box>
        ) : (
          <Box fontSize={20}>{currentMenu}</Box>
        )}
        {trashMenu}

        <div className={classes.grow} />
        {renameFile}
        {renameFolder}
        {moveItem}
        {deleteAllDialog}
        {restoreAllDialog}
        <div className={classes.sectionDesktop}>
          {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
            currentMenu !== "Trash" && (
              <Tooltip title="Move To">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Move To"
                  onClick={handleMove}
                >
                  <MoveToInboxIcon />
                </IconButton>
              </Tooltip>
            )}

          {!isFavorited
            ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
              (currentMenu === "Home" || currentMenu === "Folder") && (
                <Tooltip title="Add to Favorites">
                  <IconButton
                    style={{ color: "gray" }}
                    aria-label="Add to Favorites"
                    onClick={props.handleFavorites}
                  >
                    <StarOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )
            : (selectedFiles.length > 0 || selectedFolders.length > 0) &&
              (currentMenu === "Home" || currentMenu === "Folder") && (
                <Tooltip title="Remove from Favorites">
                  <IconButton
                    style={{ color: "gray" }}
                    aria-label="Remove from Favorites"
                    onClick={props.handleHomeUnfavorited}
                  >
                    <StarOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
          {selectedFiles.length === 1 && currentMenu !== "Trash" && (
            <Tooltip title="Rename">
              <IconButton
                style={{ color: "gray" }}
                aria-label="Rename"
                onClick={handleRenameFileOpen}
              >
                <RenameIcon />
              </IconButton>
            </Tooltip>
          )}

          {selectedFolders.length === 1 && currentMenu !== "Trash" && (
            <Tooltip title="Rename">
              <IconButton
                style={{ color: "gray" }}
                aria-label="Rename"
                onClick={handleRenameFolderOpen}
              >
                <RenameIcon />
              </IconButton>
            </Tooltip>
          )}
          {renameFolder}
          {selectedFiles.length >= 1 &&
            selectedFolders.length === 0 &&
            currentMenu !== "Trash" && (
              <Tooltip title="Make a Copy">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Make a Copy"
                  onClick={props.handleFileCopy}
                >
                  <FileCopyIcon />
                </IconButton>
              </Tooltip>
            )}

          {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
            currentMenu === "Favorites" && (
              <Tooltip title="Remove from Favorites">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Remove from Favorites"
                  onClick={props.handleUnfavorited}
                >
                  <StarOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
            )}

          {selectedFiles.length > 0 &&
            selectedFolders.length <= 0 &&
            currentMenu !== "Trash" && (
              <Tooltip title="Download">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Download"
                  onClick={() => props.handleSingleDownload(selectedFiles[0])}
                >
                  <GetAppIcon />
                </IconButton>
              </Tooltip>
            )}
          {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
            (currentMenu === "Home" || currentMenu === "Folder") && (
              <Tooltip title="Trash">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Trash"
                  onClick={props.handleTrash}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
            currentMenu === "Favorites" && (
              <Tooltip title="Trash">
                <IconButton
                  style={{ color: "gray" }}
                  aria-label="Trash"
                  onClick={props.handleFavoritesTrash}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            )}
          {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
            currentMenu === "Trash" && (
              <div>
                <Tooltip title="Restore from trash">
                  <IconButton
                    style={{ color: "gray" }}
                    aria-label="Restore from trash"
                    onClick={props.handleRestore}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete forever">
                  <IconButton
                    style={{ color: "gray" }}
                    aria-label="Delete forever"
                    onClick={props.handleDeleteForever}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
        </div>
        <div className={classes.sectionMobile}>
          {(selectedFiles.length > 0 || selectedFolders.length > 0) && (
            <Tooltip title="More Options">
              <IconButton
                style={{ color: "gray" }}
                aria-label="show more"
                aria-controls={mobileMenuId}
                aria-haspopup="true"
                onClick={handleMobileMenuOpen}
              >
                <MoreIcon />
              </IconButton>
            </Tooltip>
          )}
          {renderMobileMenu}
        </div>
      </Toolbar>
    </AppBar>
  );
}
