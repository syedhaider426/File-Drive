import React, { useState, Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snack from "../reusable-components/Snack";
import makeStyles from "@material-ui/core/styles/makeStyles";
import CloseIcon from "@material-ui/icons/Close";
import patchData from "../../helpers/patchData";

const useStyles = makeStyles((theme) => ({
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
}));

function RenameFolder({
  handleFocus,
  renameFolderDialogOpen,
  files,
  folders,
  selectedFolders,
  setRenameFolderDialogOpen,
  setItems,
}) {
  const [renamedFolder, setRenamedFolder] = useState();
  const [renamedSnack, setRenamedSnack] = useState(false);
  const [folderName, setFolderName] = useState("");

  const handleRenameSnackClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setRenamedSnack(false);
  };

  const handleRenameFolderClose = () => {
    setFolderName("");
    setRenameFolderDialogOpen(false);
  };

  const handleFolderOnChange = (e) => {
    setFolderName(e.target.value);
  };

  const handleRenameFolderr = (e) => {
    e.preventDefault();
    const oldName = selectedFolders[0].foldername;
    const data = {
      id: selectedFolders[0]._id,
      newName: folderName,
    };
    patchData("/api/folders/name", data)
      .then((data) => {
        folders.forEach((o, i, arr) => {
          if (o._id === selectedFolders[0]._id) {
            arr[i].foldername = folderName;
          }
        });
        setRenamedSnack(true);
        setRenamedFolder(oldName);
        setRenameFolderDialogOpen(false);
        setItems({ files, folders });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleUndoRenameFolder = () => {
    const data = {
      id: selectedFolders[0]._id,
      newName: renamedFolder,
    };
    patchData("/api/folders/name", data)
      .then((data) => {
        folders.forEach((o, i, arr) => {
          if (o._id === selectedFolders[0]._id) {
            arr[i].foldername = renamedFolder;
          }
        });
        const selectFolders = selectedFolders;
        selectFolders[0].foldername = renamedFolder;
        setRenamedSnack(false);
        setRenamedFolder("");
        setFolderName("");
        setItems({ files, folders });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleSnackbarExit = () => {
    if (renamedFolder) setRenamedFolder({});
  };

  const classes = useStyles();
  const defaultValue = selectedFolders[0] && selectedFolders[0].foldername;
  const renameSnack = (
    <Snack
      open={renamedSnack}
      onClose={handleRenameSnackClose}
      onExited={handleSnackbarExit}
      message={`Renamed "${renamedFolder}" to "${folderName}"`}
      onClick={handleUndoRenameFolder}
    />
  );
  const renameFolderDialog = (
    <Dialog
      open={renameFolderDialogOpen}
      onClose={handleRenameFolderClose}
      aria-labelledby="form-dialog-title"
    >
      <DialogTitle id="form-dialog-title">
        Rename
        <IconButton
          aria-label="close"
          className={classes.closeButton}
          onClick={handleRenameFolderClose}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <TextField
          id="folder"
          defaultValue={defaultValue}
          onChange={handleFolderOnChange}
          onFocus={handleFocus}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleRenameFolderClose} color="primary">
          Cancel
        </Button>
        <Button
          disabled={folderName === ""}
          color="primary"
          onClick={handleRenameFolderr}
          type="submit"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Fragment>
      {renameSnack}
      {renameFolderDialog}
    </Fragment>
  );
}

export default RenameFolder;
