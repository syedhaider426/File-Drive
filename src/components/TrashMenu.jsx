import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

const TrashMenu = ({
  trashAnchorEl,
  trashMenuOpen,
  handleTrashMenuClose,
  handleDeleteAllDialog,
  files,
  folders,
  handleRestoreAllDialog,
}) => {
  return (
    <Menu
      anchorEl={trashAnchorEl}
      id={"trash-menu"}
      keepMounted
      open={trashMenuOpen}
      onClose={handleTrashMenuClose}
    >
      <MenuItem
        onClick={handleDeleteAllDialog}
        disabled={files?.length === 0 && folders?.length === 0}
      >
        Delete All Trash
      </MenuItem>
      <MenuItem
        onClick={handleRestoreAllDialog}
        disabled={files?.length === 0 && folders?.length === 0}
      >
        Restore All Items
      </MenuItem>
    </Menu>
  );
};

export default TrashMenu;
