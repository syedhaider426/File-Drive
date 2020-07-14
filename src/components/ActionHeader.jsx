import { withStyles } from "@material-ui/styles";
import React, { Component, Fragment } from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
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
import { Link } from "react-router-dom";

const styles = {
  // This group of buttons will be aligned to the right
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  menuButton: {
    marginRight: 16,
    marginLeft: -12,
  },
  flexContainer: {
    padding: 20,
  },
  root: {
    display: "flex",
  },
  item: {
    padding: 0,
  },
};

class ActionHeader extends Component {
  state = {
    renameFolderDialogOpen: false,
    renameFileDialogOpen: false,
    moveItemDialogOpen: false,
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

  /**
   *
   *{https://stackoverflow.com/questions/54416499/how-select-part-of-text-in-a-textfield-on-onfocus-event-with-material-ui-in-reac} event
   */
  handleFocus = (event) => {
    event.preventDefault();
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

    let menu = "";
    if (currentFolder !== undefined || currentMenu === "Folder") {
      menu = "1";
    }
    return (
      <AppBar position="static" color="transparent" elevation={3}>
        <Toolbar variant="dense">
          <Typography color="inherit">
            {menu !== "" ? (
              <Fragment>
                <Link to={`/drive/home`} key={"Home"}>
                  {currentFolder.length <= 0 ? `Home` : `Home > `}
                </Link>
                {currentFolder.map((folder, index) => (
                  <Link key={folder._id} to={`/drive/folders/${folder._id}`}>
                    {index === currentFolder.length - 1
                      ? `${folder.foldername}`
                      : `${folder.foldername} >`}
                  </Link>
                ))}
              </Fragment>
            ) : (
              currentMenu
            )}
          </Typography>
          <section className={classes.rightToolbar}>
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
            {renameFile}
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
            {selectedFiles.length >= 1 &&
              selectedFolders.length === 0 &&
              currentMenu !== "Trash" && (
                <Tooltip title="Copy">
                  <IconButton
                    color="inherit"
                    aria-label="Copy"
                    onClick={handleFileCopy}
                  >
                    <FileCopyIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu !== "Trash" && (
                <Tooltip title="Move">
                  <IconButton
                    color="inherit"
                    aria-label="Move"
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
                  <Tooltip title="Add to Starred">
                    <IconButton
                      color="inherit"
                      aria-label="Add to Starred"
                      onClick={handleFavorites}
                    >
                      <StarOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )
              : (selectedFiles.length > 0 || selectedFolders.length > 0) &&
                (currentMenu === "Home" || currentMenu === "Folder") && (
                  <Tooltip title="Remove from Starred">
                    <IconButton
                      color="inherit"
                      aria-label="Remove from Starred"
                      onClick={handleHomeUnfavorited}
                    >
                      <StarOutlineOutlinedIcon />
                    </IconButton>
                  </Tooltip>
                )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "Favorites" && (
                <Tooltip title="Remove from Starred">
                  <IconButton
                    color="inherit"
                    aria-label="Remove from Starred"
                    onClick={handleUnfavorited}
                  >
                    <StarOutlineOutlinedIcon />
                  </IconButton>
                </Tooltip>
              )}
            {(selectedFiles.length > 0 || selectedFolders.length > 0) &&
              currentMenu === "Trash" && (
                <Fragment>
                  <Tooltip title="Restore">
                    <IconButton
                      color="inherit"
                      aria-label="Restore"
                      onClick={handleRestore}
                    >
                      <RestoreIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete Forever">
                    <IconButton
                      color="inherit"
                      aria-label="Delete Forever"
                      onClick={handleDeleteForever}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </Fragment>
              )}
            {currentMenu === "Trash" && (
              <Fragment>
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
              </Fragment>
            )}
            {/* <Tooltip title="More Options">
              <IconButton color="inherit" aria-label="More Options">
                <MoreVertIcon />
              </IconButton>
            </Tooltip> */}
          </section>
        </Toolbar>
      </AppBar>
    );
  }
}

export default withStyles(styles)(ActionHeader);
