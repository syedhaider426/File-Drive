import React from "react";
import DialogContent from "@material-ui/core/DialogContent";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContentText from "@material-ui/core/DialogContentText";
import deleteData from "../../helpers/deleteData";

const DeleteAllDialog = ({
  deleteAllOpen,
  handleDeleteAllClose,
  setItems,
  setDeleteAllOpen,
}) => {
  const handleDeleteAll = (e) => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    deleteData("/api/files/all")
      .then((data) => {
        document.body.style.cursor = "default";
        setItems({ files: [], folders: [] });
        setDeleteAllOpen(false);
      })
      .catch((err) => console.log("Err", err));
  };

  return (
    <Dialog
      open={deleteAllOpen}
      onClose={handleDeleteAllClose}
      aria-labelledby="restore-all-trash"
      aria-describedby="restore-all-trash"
    >
      <DialogTitle>Delete All</DialogTitle>
      <DialogContent>
        <form onSubmit={handleDeleteAll}>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete all files and folders?
          </DialogContentText>
          <DialogActions>
            <Button onClick={handleDeleteAllClose} color="primary">
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

export default DeleteAllDialog;
