import React from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import DialogContentText from "@material-ui/core/DialogContentText";
import patchData from "../../helpers/patchData";

const RestoreAllDialog = ({
  restoreAllOpen,
  handleRestoreAllClose,
  setItems,
  setRestoreAllOpen,
}) => {
  const handleRestoreAll = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    patchData("/api/files/all/restore")
      .then((data) => {
        document.body.style.cursor = "default";
        const { files, folders } = { ...data };
        setItems({ files, folders });
        setRestoreAllOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

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
