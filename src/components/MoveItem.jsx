import React, { Fragment, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Snack from "./reusable-components/Snack";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
import patchData from "../helpers/patchData";
import getData from "../helpers/getData";

const useStyles = makeStyles((theme) => ({
  dialogPaper: {
    height: "100%",
    minHeight: "49vh",
    maxHeight: "50vh",
    padding: 0,
  },
  closeButton: {
    position: "absolute",
    right: theme.spacing(1),
    top: theme.spacing(1),
    color: theme.palette.grey[500],
  },
  smallIcon: {
    width: "1em",
    height: "1em",
    "&:hover": {
      backgroundColor: "#5f6368",
    },
  },
  textContainer: {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    width: "35vw",
  },
}));

function MoveItem({
  selectedFolders,
  selectedFiles,
  setItems,
  setSelectedItems,
  setMoveMenuOpen,
  moveMenuOpen,
  setAllFolders,
  setHomeFolderStatus,
  allFolders,
  homeFolderStatus,
  folderLocation,
  setFolderLocation,
  movedFolder,
  setMovedFolder,
  items,
  filterItems,
}) {
  const [selectedIndex, setSelectedIndex] = useState(undefined);
  const [movedSnack, setMovedSnack] = useState(false);
  const [tempItems, setTempItems] = useState({
    tempFiles: [],
    tempFolders: [],
  });
  const { tempFiles, tempFolders } = { ...tempItems };

  const onMoveExit = () => {
    setAllFolders([]);
    setHomeFolderStatus(false);
  };

  const handleMoveSnackClose = (event, reason) => {
    if (reason !== "clickaway") setMovedSnack(false);
  };

  const handleMoveItem = (e) => {
    e.preventDefault();
    const data = {
      moveFolder: folderLocation.id || movedFolder.id,
      selectedFolders,
      selectedFiles,
    };
    patchData("/api/files/move", data).then((data) => {
      const { files, folders } = filterItems();
      setMovedSnack(true);
      setMoveMenuOpen(false);
      setItems({
        files,
        folders,
      });
      setSelectedItems({
        selectedFiles: [],
        selectedFolders: [],
      });
      setTempItems({
        tempFiles: selectedFiles,
        tempFolders: selectedFolders,
      });
      setSelectedIndex(undefined);
    });
  };

  const handleUndoMoveItem = (e) => {
    e.preventDefault();
    let originalFolder = tempFolders[0]?.parent_id || tempFiles[0]?.folder_id;
    const data = {
      movedFolder: originalFolder,
      selectedFolders: tempFolders,
      selectedFiles: tempFiles,
    };
    patchData("/api/files/move", data).then((data) => {
      const { files, folders } = { ...data };
      setMovedSnack(false);
      setItems({
        files,
        folders,
      });
      setSelectedItems({
        selectedFiles: tempFiles,
        selectedFolders: tempFolders,
      });
    });
  };

  const handleSnackbarExit = () => {
    if (tempFolders || tempFiles) {
      setTempItems({
        tempFiles: [],
        tempFolders: [],
      });
      setFolderLocation("");
    }
    return;
  };

  const handleOnClick = (folder, selectedIndex) => {
    setSelectedIndex(selectedIndex);
    setFolderLocation({ id: folder._id, foldername: folder.foldername });
  };

  const handleNextFolder = (folder) => {
    getData(`/api/drive/folders/${folder._id}`)
      .then((data) => {
        setAllFolders(data.folders);
        setHomeFolderStatus(false);
        setFolderLocation("");
        setSelectedIndex(undefined);
        setMovedFolder({
          id: folder._id,
          foldername: folder.foldername,
          parent_id: folder.parent_id,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  const handlePreviousFolder = () => {
    const folder_id = movedFolder.parent_id;
    const urlParam =
      folder_id === "" || folder_id === undefined
        ? "drive/home"
        : `drive/folders/${folder_id}?move=true`;
    getData(`/api/${urlParam}`)
      .then((data) => {
        const { folders, moveTitleFolder } = { ...data };
        setAllFolders(folders);
        setHomeFolderStatus(folder_id === "");
        setSelectedIndex(undefined);
        setMovedFolder({
          ...movedFolder,
          foldername: moveTitleFolder.foldername,
          parent_id: moveTitleFolder.parent_id,
        });
      })
      .catch((err) => console.log("Err", err));
  };

  const handleMoveItemClose = () => {
    setSelectedIndex(undefined);
    setFolderLocation("");
    setMoveMenuOpen(false);
    setMovedFolder({});
  };
  const moveSnack = (
    <Snack
      open={movedSnack}
      onClose={handleMoveSnackClose}
      onExited={handleSnackbarExit}
      message={`Moved to "${
        folderLocation.foldername || movedFolder.foldername
      }"`}
      onClick={handleUndoMoveItem}
    />
  );
  const classes = useStyles();
  const moveFileDialog = (
    <Dialog
      open={moveMenuOpen ? true : false}
      onClose={handleMoveItemClose}
      onExited={onMoveExit}
      className={classes.dialogPaper}
      style={{ padding: 0 }}
      fullWidth
      maxWidth={"xs"}
    >
      <DialogTitle style={{ padding: 0 }}>
        {!homeFolderStatus ? (
          <Fragment>
            <IconButton onClick={handlePreviousFolder}>
              <ArrowBackIcon />
            </IconButton>
            {movedFolder?.foldername}
          </Fragment>
        ) : (
          <Fragment>
            <IconButton style={{ visibility: "hidden" }}>
              <ArrowBackIcon />
            </IconButton>
            My Drive
          </Fragment>
        )}
      </DialogTitle>
      <DialogContent style={{ padding: 0 }}>
        {allFolders?.map((folder, index) => (
          <MenuItem
            alignItems="center"
            key={folder._id}
            onClick={() => handleOnClick(folder, index)}
            selected={index === selectedIndex}
            disabled={
              (selectedFolders.length > 0 &&
                selectedFolders[0]._id === folder._id) ||
              (selectedFiles.length > 0 &&
                selectedFiles[0].folder_id === folder._id)
            }
          >
            <IconButton>
              <FolderIcon />
            </IconButton>
            <span className={classes.textContainer}>{folder.foldername}</span>
            <IconButton onClick={() => handleNextFolder(folder)}>
              <ArrowForwardIcon />
            </IconButton>
          </MenuItem>
        ))}
      </DialogContent>
      <DialogActions style={{ padding: 0 }}>
        <Button
          onClick={handleMoveItem}
          color="primary"
          disabled={
            selectedFolders[0]?._id === movedFolder?.id && folderLocation === ""
          }
        >
          Move Here
        </Button>
      </DialogActions>
    </Dialog>
  );

  return (
    <Fragment>
      {moveFileDialog}
      {moveSnack}
    </Fragment>
  );
}

export default MoveItem;
