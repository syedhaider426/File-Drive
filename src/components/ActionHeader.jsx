import { withStyles } from "@material-ui/core/styles";
import React, { Component, div } from "react";
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
import { Link } from "react-router-dom";
import { Breadcrumbs, Menu, MenuItem, Box } from "@material-ui/core";

import MoreIcon from "@material-ui/icons/MoreVert";

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
});

class ActionHeader extends Component {
  state = {
    renameFolderDialogOpen: false,
    renameFileDialogOpen: false,
    moveItemDialogOpen: false,
    isMobileMenuOpen: false,
    trashMenuOpen: false,
  };

  handleRenameOpen = () => {
    this.setState({ renameFileDialogOpen: true });
  };

  handleRenameFolderOpen = () => {
    this.setState({ renameFolderDialogOpen: true });
  };

  handleDialog = (value) => {
    this.setState(value);
  };

  handleMove = () => {
    this.setState({ moveItemDialogOpen: true });
  };

  handleMobileMenuOpen = (e) => {
    this.setState({
      isMobileMenuOpen: true,
      mobileMoreAnchorEl: e.currentTarget,
    });
  };

  handleTrashMenuOpen = (e) => {
    this.setState({
      trashMenuOpen: true,
      trashAnchorEl: e.currentTarget,
    });
  };

  handleTrashMenuClose = (e) => {
    this.setState({
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
    console.log("CALLED");
    const { target } = event;
    const extensionStarts = target.value.lastIndexOf(".");
    target.focus();
    target.setSelectionRange(0, extensionStarts);
  };

  render() {
    const {
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
    } = this.props;
    const { classes } = this.props;
    const { isMobileMenuOpen, trashMenuOpen } = this.state;
    const renameFile = (
      <RenameFile
        renameFileDialogOpen={this.state.renameFileDialogOpen}
        handleDialog={this.handleDialog}
        files={files}
        selectedFiles={selectedFiles}
        handleSetState={this.props.handleSetState}
        handleFocus={this.handleFocus}
      />
    );

    const renameFolder = (
      <RenameFolder
        renameFolderDialogOpen={this.state.renameFolderDialogOpen}
        handleDialog={this.handleDialog}
        folders={folders}
        selectedFolders={selectedFolders}
        handleSetState={this.props.handleSetState}
        handleFocus={this.handleFocus}
      />
    );

    const moveItem = (
      <MoveItem
        moveItemDialogOpen={this.state.moveItemDialogOpen}
        handleDialog={this.handleDialog}
        files={files}
        folders={folders}
        selectedFiles={selectedFiles}
        selectedFolders={selectedFolders}
        handleSetState={this.props.handleSetState}
      />
    );
    const trashMenu = (
      <Menu
        anchorEl={this.state.trashAnchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        id={"trash-menu"}
        keepMounted
        open={trashMenuOpen}
        onClose={this.handleTrashMenuClose}
      >
        <MenuItem>Delete All Trash</MenuItem>
        <MenuItem>Restore All Items</MenuItem>
      </Menu>
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
        {renameFile}
        {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
          currentMenu !== "Trash" && (
            <MenuItem className={classes.menuItem} onClick={this.handleMove}>
              <Tooltip title="Move To">
                <IconButton color="inherit" aria-label="Move To">
                  <MoveToInboxIcon />
                </IconButton>
              </Tooltip>
              Move To
            </MenuItem>
          )}
        {moveItem}
        {!isFavorited
          ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
            (currentMenu === "Home" || currentMenu === "Folder") && (
              <MenuItem className={classes.menuItem} onClick={handleFavorites}>
                <Tooltip title="Add to Favorites">
                  <IconButton color="inherit" aria-label="Add to Favorites">
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
                    color="inherit"
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
            onClick={this.handleRenameOpen}
          >
            <Tooltip title="Rename">
              <IconButton color="inherit" aria-label="Rename">
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
              <IconButton color="inherit" aria-label="Rename">
                <RenameIcon />
              </IconButton>
            </Tooltip>
            Rename Folder
          </MenuItem>
        )}
        {renameFolder}
        {selectedFiles.length >= 1 &&
          selectedFolders.length === 0 &&
          currentMenu !== "Trash" && (
            <MenuItem className={classes.menuItem} onClick={handleFileCopy}>
              <Tooltip title="Make a Copy">
                <IconButton color="inherit" aria-label="Make a Copy">
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
                <IconButton color="inherit" aria-label="Remove from Favorites">
                  <StarOutlineOutlinedIcon />
                </IconButton>
              </Tooltip>
              Remove from Favorites
            </MenuItem>
          )}
        {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
          (currentMenu === "Home" || currentMenu === "Folder") && (
            <MenuItem className={classes.menuItem} onClick={handleTrash}>
              <Tooltip title="Trash">
                <IconButton color="inherit" aria-label="Trash">
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
                <IconButton color="inherit" aria-label="Trash">
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
                  <IconButton color="inherit" aria-label="Restore from trash">
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
                Restore from trash
              </MenuItem>
              <MenuItem onClick={handleDeleteForever}>
                <Tooltip title="Delete forever">
                  <IconButton color="inherit" aria-label="Delete forever">
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
                <Box fontSize={20} className={classes.hover}>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/drive/home`}
                    key={"Home"}
                  >
                    Home
                  </Link>
                </Box>
              )}
              {currentFolder?.map((folder, index) => (
                <Box key={index} fontSize={20} className={classes.hover}>
                  <Link
                    style={{ textDecoration: "none", color: "black" }}
                    to={`/drive/folders/${folder._id}`}
                  >
                    {folder.foldername}
                  </Link>
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
          {renameFile}
          <div className={classes.grow} />
          <div className={classes.sectionDesktop}>
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu !== "Trash" && (
                <Tooltip title="Move To">
                  <IconButton
                    color="inherit"
                    aria-label="Move To"
                    onClick={this.handleMove}
                  >
                    <MoveToInboxIcon />
                  </IconButton>
                </Tooltip>
              )}
            {moveItem}
            {!isFavorited
              ? (selectedFiles.length > 0 || selectedFolders.length > 0) &&
                (currentMenu === "Home" || currentMenu === "Folder") && (
                  <Tooltip title="Add to Favorites">
                    <IconButton
                      color="inherit"
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
                      color="inherit"
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
                  color="inherit"
                  aria-label="Rename"
                  onClick={this.handleRenameOpen}
                >
                  <RenameIcon />
                </IconButton>
              </Tooltip>
            )}

            {selectedFolders.length === 1 && currentMenu !== "Trash" && (
              <Tooltip title="Rename">
                <IconButton
                  color="inherit"
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
                    color="inherit"
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
                    color="inherit"
                    aria-label="Remove from Favorites"
                    onClick={handleUnfavorited}
                  >
                    <StarOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              (currentMenu === "Home" || currentMenu === "Folder") && (
                <Tooltip title="Trash">
                  <IconButton
                    color="inherit"
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
                    color="inherit"
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
                      color="inherit"
                      aria-label="Restore from trash"
                      onClick={handleRestore}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete forever">
                    <IconButton
                      color="inherit"
                      aria-label="Delete forever"
                      onClick={handleDeleteForever}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </div>
              )}
            {currentMenu === "Trash" && (
              <div>
                <Tooltip title="Delete All">
                  <IconButton
                    color="inherit"
                    aria-label="Delete All"
                    onClick={handleDeleteAll}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Restore All">
                  <IconButton
                    color="inherit"
                    aria-label="Restore All"
                    onClick={handleRestoreAll}
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
              </div>
            )}
          </div>
          <div className={classes.sectionMobile}>
            {(selectedFiles.length > 0 || selectedFolders.length > 0) && (
              <Tooltip title="More Options">
                <IconButton
                  color="inherit"
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

export default withStyles(styles)(ActionHeader);
