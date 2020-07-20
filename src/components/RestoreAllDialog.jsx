import React from "react";
import {
  DialogContent,
  Dialog,
  DialogTitle,
  Button,
  DialogActions,
  DialogContentText,
} from "@material-ui/core";

const RestoreAllDialog = ({
  restoreAllOpen,
  handleRestoreAll,
  handleRestoreAllClose,
}) => {
  return (
    <Dialog
      open={restoreAllOpen}
      onClose={handleRestoreAllClose}
      aria-labelledby="restore-all-trash"
      aria-describedby="restore-all-trash"
    >
      <DialogTitle>Restore All</DialogTitle>
      <DialogContent>
        <form onSubmit={handleRestoreAll}>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to restore all files and folders?
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleRestoreAllClose} color="primary">
              Cancel
            </Button>
            <Button color="primary" type="submit">
              Confirm
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default RestoreAllDialog;
