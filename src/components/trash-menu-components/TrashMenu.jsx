import React from "react";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";

/* Menu is shown when user clicks 'Trash' in ActionHeader
 * in 'Trash' menu
 */
export default function TrashMenu({
  trashAnchorEl,
  trashMenuOpen,
  handleTrashMenuClose,
  handleDeleteAllDialog,
  files,
  folders,
  handleRestoreAllDialog,
}) {
  const disabled = files?.length === 0 && folders?.length === 0;
  return (
    <Menu
      anchorEl={trashAnchorEl}
      id={"trash-menu"}
      keepMounted
      open={trashMenuOpen}
      onClose={handleTrashMenuClose}
    >
      <MenuItem onClick={handleDeleteAllDialog} disabled={disabled}>
        Delete All Trash
      </MenuItem>
      <MenuItem onClick={handleRestoreAllDialog} disabled={disabled}>
        Restore All Items
      </MenuItem>
    </Menu>
  );
}
