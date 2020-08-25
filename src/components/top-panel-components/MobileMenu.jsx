import React from "react";
import IconButton from "@material-ui/core/IconButton";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import Tooltip from "@material-ui/core/Tooltip";
import RestoreIcon from "@material-ui/icons/Restore";
import StarOutlineOutlinedIcon from "@material-ui/icons/StarOutlined";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import GetAppIcon from "@material-ui/icons/GetApp";

// Mobile menu is rendered based on device width
export default function MobileMenu({
  mobileAnchorEl,
  mobileMenuId,
  isMobileMenuOpen,
  handleMobileMenuClose,
  selectedFiles,
  selectedFolders,
  classes,
  handleMove,
  currentMenu,
  isFavorited,
  handleFavorites,
  handleHomeUnfavorited,
  handleRenameFileOpen,
  handleRenameFolderOpen,
  handleFileCopy,
  handleUnfavorited,
  handleSingleDownload,
  handleTrash,
  handleFavoritesTrash,
  handleRestore,
  handleDeleteForever,
  closeMobileMenu,
}) {
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
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              closeMobileMenu();
              handleMove();
            }}
          >
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
            <MenuItem
              className={classes.menuItem}
              onClick={() => {
                closeMobileMenu();
                handleFavorites();
              }}
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
              onClick={() => {
                closeMobileMenu();
                handleHomeUnfavorited();
              }}
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
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              closeMobileMenu();
              handleFileCopy();
            }}
          >
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
            onClick={() => {
              closeMobileMenu();
              handleUnfavorited();
            }}
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
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              closeMobileMenu();
              handleTrash();
            }}
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
        currentMenu === "Favorites" && (
          <MenuItem
            className={classes.menuItem}
            onClick={() => {
              closeMobileMenu();
              handleFavoritesTrash();
            }}
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
            <MenuItem
              onClick={() => {
                closeMobileMenu();
                handleRestore();
              }}
            >
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
            <MenuItem
              onClick={() => {
                closeMobileMenu();
                handleDeleteForever();
              }}
            >
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
  return renderMobileMenu;
}
