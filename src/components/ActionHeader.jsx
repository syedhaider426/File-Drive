import { withStyles } from "@material-ui/core/styles";
import React, { Component } from "react";
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
import { Link, withRouter } from "react-router-dom";
import { Breadcrumbs, Menu, MenuItem, Box } from "@material-ui/core";
import MoreIcon from "@material-ui/icons/MoreVert";
import getData from "../helpers/getData";
import postData from "../helpers/postData";
import CloseIcon from "@material-ui/icons/Close";
import RestoreAllDialog from "./RestoreAllDialog";
import DeleteAllDialog from "./DeleteAllDialog";
import TrashMenu from "./TrashMenu";
import GetAppIcon from "@material-ui/icons/GetApp";

const styles = (theme) => ({
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
});

class ActionHeader extends Component {
  state = {
    renameFileDialogOpen: false,
    renameFolderDialogOpen: false,
    // Mobile related state
    isMobileMenuOpen: false,
    mobileMoreAnchorEl: undefined,
    // Move file/folder related state
    moveMenuOpen: false,
    allFolders: [],
    moveButtonDisabled: true,
    homeFolderStatus: false,
    selectedIndex: undefined,
    moveFolder: "",
    movedSnack: false,
    tempSelectedFolders: [],
    tempSelectedFiles: [],
  };

  handleRenameFileOpen = () => {
    this.setState({ isMobileMenuOpen: false, renameFileDialogOpen: true });
  };

  handleRenameFolderOpen = () => {
    this.setState({ renameFolderDialogOpen: true });
  };

  handleDialog = (value, item) => {
    this.setState(value, this.props.handleSetState(item));
  };

  handleMove = (e) => {
    const { selectedFolders, selectedFiles } = { ...this.props };
    const urlMove = this.props.match.url === "/drive/home" ? "" : "?move=true";
    getData(`/api${this.props.match.url}${urlMove}`).then((data) => {
      const { folders, moveTitleFolder } = { ...data };
      let homeFolderStatus;
      if (this.props.match.url === "/drive/home") homeFolderStatus = true;
      else homeFolderStatus = false;
      //user selects a file
      //file has a folder_id
      this.setState({
        allFolders: folders,
        homeFolderStatus,
        moveMenuOpen: true,
        isMobileMenuOpen: false,
        movedFolder: {
          id: selectedFiles[0]?.folder_id || selectedFolders[0]?._id,
          foldername: moveTitleFolder.foldername,
          parent_id: moveTitleFolder.parent_id,
        },
      });
    });
  };

  onMoveExit = () => {
    this.setState({
      allFolders: [],
      homeFolderStatus: false,
    });
  };

  handleMoveSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    this.setState({
      movedSnack: false,
    });
  };

  handleMoveItem = (e) => {
    e.preventDefault();
    const { moveFolder } = { ...this.state };
    const { selectedFolders, selectedFiles } = { ...this.props };
    const data = { moveFolder: moveFolder.id, selectedFolders, selectedFiles };
    postData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      this.setState(
        {
          moveMenuOpen: false,
          movedFolder: {},
          selectedIndex: undefined,
          moveButtonDisabled: true,

          movedSnack: true,
          tempSelectedFolders: selectedFolders,
          tempSelectedFiles: selectedFiles,
        },
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        })
      );
    });
  };

  handleUndoMoveItem = (e) => {
    e.preventDefault();
    const { tempSelectedFolders, tempSelectedFiles } = {
      ...this.state,
    };
    let originalFolder =
      tempSelectedFolders[0]?.parent_id || tempSelectedFiles[0]?.folder_id;
    const data = {
      movedFolder: originalFolder,
      selectedFolders: tempSelectedFolders,
      selectedFiles: tempSelectedFiles,
    };
    postData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      this.setState({
        movedSnack: false,
      });
      this.props.handleSetState({
        files,
        folders,
        selectedFolders: tempSelectedFolders,
        selectedFiles: tempSelectedFiles,
      });
    });
  };

  handleSnackbarExit = () => {
    if (this.state.tempSelectedFolders || this.state.tempSelectedFiles) {
      this.setState({
        tempSelectedFolders: [],
        tempSelectedFiles: [],
        moveFolder: "",
      });
    }
    return;
  };

  handleActionsSetState = (value) => {
    this.setState(value);
  };

  handleMobileMenuOpen = (e) => {
    this.setState({
      isMobileMenuOpen: true,
      mobileMoreAnchorEl: e.currentTarget,
    });
  };

  handleTrashMenuOpen = (e) => {
    this.props.handleSetState({
      trashMenuOpen: true,
      trashAnchorEl: e.currentTarget,
    });
  };

  handleTrashMenuClose = (e) => {
    this.props.handleSetState({
      trashMenuOpen: false,
    });
  };

  handleMobileMenuClose = () => {
    this.setState({ isMobileMenuOpen: false });
  };

  /**
   *
   *{https://stackoverflow.com/questions/54416499/how-select-part-of-text-in-a-textfield-on-onfocus-event-with-material-ui-in-reac} event
   */
  handleFocus = (event) => {
    event.preventDefault();
    const { target } = event;
    const extensionStarts = target.value.lastIndexOf(".");
    console.log("extensionStarts", extensionStarts);
    if (extensionStarts < 0) target.focus();
    else {
      target.focus();
      target.setSelectionRange(0, extensionStarts);
    }
  };

  handleDeleteAllDialog = (e) => {
    this.props.handleSetState({
      trashMenuOpen: false,
      deleteAllOpen: true,
      trashAnchorEl: e.target,
    });
  };

  handleDeleteAllClose = (e) => {
    this.props.handleSetState({ trashMenuOpen: false, deleteAllOpen: false });
  };
  handleRestoreAllDialog = (e) => {
    this.props.handleSetState({
      trashMenuOpen: false,
      restoreAllOpen: true,
      trashAnchorEl: e.target,
    });
  };

  handleRestoreAllClose = (e) => {
    this.props.handleSetState({ trashMenuOpen: false, restoreAllOpen: false });
  };

  handleRenameFileClose = () => {
    this.setState({
      fileButtonDisabled: true,
      filename: "",
      renameFileDialogOpen: false,
    });
  };

  render() {
    const {
      classes,
      files,
      folders,
      selectedFiles,
      selectedFolders,
      handleTrash,
      handleDeleteForever,
      handleFileCopy,
      handleFavorites,
      handleRestore,
      handleUnfavorited,
      handleFavoritesTrash,
      isFavorited,
      handleHomeUnfavorited,
      handleDeleteAll,
      handleRestoreAll,
      currentFolder,
      currentMenu,
      trashMenuOpen,
      trashAnchorEl,
      restoreAllOpen,
      handleSetState,
      deleteAllOpen,
      handleSingleDownload,
    } = this.props;
    const {
      isMobileMenuOpen,
      moveMenuOpen,
      allFolders,
      homeFolderStatus,
      movedFolder,
      selectedIndex,
      moveButtonDisabled,
      moveFolder,
      movedSnack,
      renameFileDialogOpen,
      renameFolderDialogOpen,
    } = this.state;
    const renameFile = (
      <RenameFile
        renameFileDialogOpen={renameFileDialogOpen}
        handleDialog={this.handleDialog}
        files={files}
        selectedFiles={selectedFiles}
        handleSetState={handleSetState}
        handleFocus={this.handleFocus}
      />
    );

    const renameFolder = (
      <RenameFolder
        renameFolderDialogOpen={renameFolderDialogOpen}
        handleDialog={this.handleDialog}
        folders={folders}
        selectedFolders={selectedFolders}
        handleSetState={handleSetState}
        handleFocus={this.handleFocus}
      />
    );
    const moveItem = (
      <MoveItem
        moveMenuOpen={moveMenuOpen}
        handleSetState={this.handleActionsSetState}
        allFolders={allFolders}
        selectedFolders={selectedFolders}
        selectedFiles={selectedFiles}
        handleMoveItemClose={this.handleMoveItemClose}
        onMoveExit={this.onMoveExit}
        homeFolderStatus={homeFolderStatus}
        movedFolder={movedFolder}
        selectedIndex={selectedIndex}
        moveButtonDisabled={moveButtonDisabled}
        moveFolder={moveFolder}
        handleMoveItem={this.handleMoveItem}
        movedSnack={movedSnack}
        handleUndoMoveItem={this.handleUndoMoveItem}
        handleSnackbarExit={this.handleSnackbarExit}
        handleMoveSnackClose={this.handleMoveSnackClose}
      />
    );
    const trashMenu = (
      <TrashMenu
        trashAnchorEl={trashAnchorEl}
        trashMenuOpen={trashMenuOpen}
        handleTrashMenuClose={this.handleTrashMenuClose}
        handleDeleteAllDialog={this.handleDeleteAllDialog}
        handleRestoreAllDialog={this.handleRestoreAllDialog}
        files={files}
        folders={folders}
      />
    );

    const deleteAllDialog = (
      <DeleteAllDialog
        deleteAllOpen={deleteAllOpen}
        handleDeleteAllClose={this.handleDeleteAllClose}
        handleDeleteAll={handleDeleteAll}
      />
    );
    const restoreAllDialog = (
      <RestoreAllDialog
        restoreAllOpen={restoreAllOpen}
        handleRestoreAllClose={this.handleRestoreAllClose}
        handleRestoreAll={handleRestoreAll}
      />
    );

    const mobileMenuId = "mobile-menu";
    const renderMobileMenu = (
      <Menu
        anchorEl={this.state.mobileMoreAnchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={isMobileMenuOpen}
        onClose={this.handleMobileMenuClose}
      >
        {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
          currentMenu !== "Trash" && (
            <MenuItem className={classes.menuItem} onClick={this.handleMove}>
              <Tooltip title="Move To">
                <IconButton style={{ color: "gray" }} aria-label="Move To">
                  <MoveToInboxIcon />
                </IconButton>
              </Tooltip>
              Move To
            </MenuItem>
          )}
        {!isFavorited
          ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
            (currentMenu === "Home" || currentMenu === "Folder") && (
              <MenuItem className={classes.menuItem} onClick={handleFavorites}>
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
                onClick={handleHomeUnfavorited}
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
          <MenuItem
            className={classes.menuItem}
            onClick={this.handleRenameFileOpen}
          >
            <Tooltip title="Rename">
              <IconButton style={{ color: "gray" }} aria-label="Rename">
                <RenameIcon />
              </IconButton>
            </Tooltip>
            Rename File
          </MenuItem>
        )}

        {selectedFolders.length === 1 && currentMenu !== "Trash" && (
          <MenuItem
            className={classes.menuItem}
            onClick={this.handleRenameFolderOpen}
          >
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
            <MenuItem className={classes.menuItem} onClick={handleFileCopy}>
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
            <MenuItem className={classes.menuItem} onClick={handleUnfavorited}>
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
              onClick={() => handleSingleDownload(selectedFiles[0])}
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
            <MenuItem className={classes.menuItem} onClick={handleTrash}>
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
              onClick={handleFavoritesTrash}
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
              <MenuItem onClick={handleRestore}>
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
              <MenuItem onClick={handleDeleteForever}>
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
              {currentFolder.length === 0 ? (
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
              onClick={this.handleTrashMenuOpen}
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
                    onClick={this.handleMove}
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
                      onClick={handleFavorites}
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
                      onClick={handleHomeUnfavorited}
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
                  onClick={this.handleRenameFileOpen}
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
                  onClick={this.handleRenameFolderOpen}
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
                    onClick={handleFileCopy}
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
                    onClick={handleUnfavorited}
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
                    onClick={() => handleSingleDownload(selectedFiles[0])}
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
                    onClick={handleTrash}
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
                    onClick={handleFavoritesTrash}
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
                      onClick={handleRestore}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete forever">
                    <IconButton
                      style={{ color: "gray" }}
                      aria-label="Delete forever"
                      onClick={handleDeleteForever}
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
                  onClick={this.handleMobileMenuOpen}
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
}

export default withRouter(withStyles(styles)(ActionHeader));
