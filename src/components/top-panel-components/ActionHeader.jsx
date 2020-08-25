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
import Box from "@material-ui/core/Box";
import MoreIcon from "@material-ui/icons/MoreVert";
import GetAppIcon from "@material-ui/icons/GetApp";
import TrashMenu from "../trash-menu-components/TrashMenu";
import DeleteAllDialog from "../trash-menu-components/DeleteAllDialog";
import RestoreAllDialog from "../trash-menu-components/RestoreAllDialog";
import getData from "../../helpers/getData";
import MobileMenu from "./MobileMenu";
import sortFolders from "../../helpers/sortFolders";

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
  // Open/Close the Move Item dialog
  const [moveMenuOpen, setMoveMenuOpen] = useState(false);

  // Open/Close the Mobile Menu
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  // Anchor location for mobile menu
  const [mobileAnchorEl, setMobileAnchorEl] = useState(undefined);

  // Open/Close the Rename File/Folder Dialog
  const [renameFileDialogOpen, setRenameFileDialogOpen] = useState(false);
  const [renameFolderDialogOpen, setRenameFolderDialogOpen] = useState(false);

  const [trashMenuOpen, setTrashMenuOpen] = useState(false);
  const [deleteAllOpen, setDeleteAllOpen] = useState(false);
  const [restoreAllOpen, setRestoreAllOpen] = useState(false);
  const [trashAnchorEl, setTrashAnchorEl] = useState(undefined); //anchor for trash menu

  // Hooks related to moving an item to a specific menu
  const [allFolders, setAllFolders] = useState([]); //all folders possible that user can move item to
  const [homeFolderStatus, setHomeFolderStatus] = useState([]); // hides the 'previous' button if current folder is 'Home'/empty
  const [folderLocation, setFolderLocation] = useState(""); // name of the folder being moved to
  // when user navigates to the previous/next folder, the properties of current folder are stored in movedfolder
  const [movedFolder, setMovedFolder] = useState({});

  const location = useLocation();

  const {
    items,
    selectedFolders,
    selectedFiles,
    files,
    folders,
    currentMenu,
    isFavorited,
    currentFolder,
    setItems,
    setSelectedItems,
    sortColumn,
  } = {
    ...props,
  };

  // Cloes the mobile menu if its open
  const closeMobileMenu = () => {
    if (isMobileMenuOpen) setMobileMenuOpen(false);
  };

  // Opens the 'Rename File' dialog
  const handleRenameFileOpen = () => {
    closeMobileMenu();
    setRenameFileDialogOpen(true);
  };

  // Opens the 'Rename Folder' dialog
  const handleRenameFolderOpen = () => {
    closeMobileMenu();
    setRenameFolderDialogOpen(true);
  };

  const handleMove = (e) => {
    closeMobileMenu();
    const urlMove = location.pathname === "/drive/home" ? "" : "?move=true";
    getData(`/api${location.pathname}${urlMove}`).then((data) => {
      const { folders, moveTitleFolder } = { ...data };
      let homeFolderStatus;
      if (location.pathname === "/drive/home") homeFolderStatus = true;
      else homeFolderStatus = false;
      //user selects a file
      //file has a folder_id
      let sortedFolders = sortFolders(folders, sortColumn);
      setMoveMenuOpen(true);
      setMobileMenuOpen(false);
      setAllFolders(sortedFolders);
      setHomeFolderStatus(homeFolderStatus);
      setMovedFolder({
        id: selectedFiles[0]?.folder_id || selectedFolders[0]?._id,
        foldername: moveTitleFolder.foldername,
        parent_id: moveTitleFolder.parent_id,
      });
    });
  };

  // Opens the menu (which shows the Delete/Restore All buttons)
  const handleTrashMenuOpen = (e) => {
    setTrashMenuOpen(true);
    setTrashAnchorEl(e.currentTarget);
  };

  // Closes the 'Trash Menu'
  const handleTrashMenuClose = () => {
    setTrashMenuOpen(false);
  };

  // When user opens 'Rename File/Folder', it will only focus on a specific part of the text
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

  // Opens the confirmation for 'Delete All'
  const handleDeleteAllDialog = (e) => {
    setTrashMenuOpen(false);
    setDeleteAllOpen(true);
    setTrashAnchorEl(e.currentTarget);
  };

  // Closes the 'Delete All' dialog
  const handleDeleteAllClose = (e) => {
    setDeleteAllOpen(false);
  };

  // Opens the confirmation for 'Restore All'
  const handleRestoreAllDialog = (e) => {
    setTrashMenuOpen(false);
    setRestoreAllOpen(true);
    setTrashAnchorEl(e.currentTarget);
  };

  // Closes the 'Restore All' dialog
  const handleRestoreAllClose = (e) => {
    setRestoreAllOpen(false);
  };

  // When the screen width is a certain size, it will show a button that can opens up the Mobile Menu
  const handleMobileMenuOpen = (e) => {
    setMobileMenuOpen(true);
    setMobileAnchorEl(e.currentTarget);
  };

  // Create the 'Move Item' component
  const moveItem = (
    <MoveItem
      items={items}
      setItems={setItems}
      setSelectedItems={setSelectedItems}
      filterItems={props.filterItems}
      selectedFolders={selectedFolders}
      selectedFiles={selectedFiles}
      moveMenuOpen={moveMenuOpen}
      allFolders={allFolders}
      homeFolderStatus={homeFolderStatus}
      folderLocation={folderLocation}
      movedFolder={movedFolder}
      setMovedFolder={setMovedFolder}
      setMoveMenuOpen={setMoveMenuOpen}
      setAllFolders={setAllFolders}
      setHomeFolderStatus={setHomeFolderStatus}
      setFolderLocation={setFolderLocation}
    />
  );

  // Create the 'Rename File' component
  const renameFile = (
    <RenameFile
      renameFileDialogOpen={renameFileDialogOpen}
      setItems={setItems}
      files={files}
      folders={folders}
      selectedFiles={selectedFiles}
      setRenameFileDialogOpen={setRenameFileDialogOpen}
      handleFocus={handleFocus}
    />
  );

  // Create the 'Rename Folder' component
  const renameFolder = (
    <RenameFolder
      renameFolderDialogOpen={renameFolderDialogOpen}
      setItems={setItems}
      files={files}
      folders={folders}
      selectedFolders={selectedFolders}
      setRenameFolderDialogOpen={setRenameFolderDialogOpen}
      handleFocus={handleFocus}
    />
  );

  // Create the 'Trash Menu' component
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

  // Create the 'Delete All' component
  const deleteAllDialog = (
    <DeleteAllDialog
      deleteAllOpen={deleteAllOpen}
      handleDeleteAllClose={handleDeleteAllClose}
      setItems={setItems}
      setDeleteAllOpen={setDeleteAllOpen}
    />
  );

  // Create the 'Restore All' component
  const restoreAllDialog = (
    <RestoreAllDialog
      restoreAllOpen={restoreAllOpen}
      handleRestoreAllClose={handleRestoreAllClose}
      setItems={setItems}
      setRestoreAllOpen={setRestoreAllOpen}
    />
  );
  const classes = useStyles();
  const renderMobileMenu = (
    <MobileMenu
      closeMobileMenu={closeMobileMenu}
      selectedFiles={selectedFiles}
      selectedFolders={selectedFolders}
      mobileAnchorEl={mobileAnchorEl}
      mobileMenuId={"mobile-menu"}
      isMobileMenuOpen={isMobileMenuOpen}
      classes={classes}
      currentMenu={currentMenu}
      isFavorited={isFavorited}
      handleMove={handleMove}
      handleMobileMenuClose={closeMobileMenu}
      handleRenameFileOpen={handleRenameFileOpen}
      handleRenameFolderOpen={handleRenameFolderOpen}
      handleFavorites={props.handleFavorites}
      handleHomeUnfavorited={props.handleHomeUnfavorited}
      handleFileCopy={props.handleFileCopy}
      handleUnfavorited={props.handleUnfavorited}
      handleSingleDownload={props.handleSingleDownload}
      handleTrash={props.handleTrash}
      handleFavoritesTrash={props.handleFavoritesTrash}
      handleRestore={props.handleRestore}
      handleDeleteForever={props.handleDeleteForever}
    />
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

          {selectedFiles.length === 1 &&
            selectedFolders.length === 0 &&
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
                aria-controls={"mobile-menu"}
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
