import React, { Fragment } from "react";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import Snack from "./Snack";
import makeStyles from "@material-ui/core/styles/makeStyles";
import FolderIcon from "@material-ui/icons/Folder";
import ArrowBackIcon from "@material-ui/icons/ArrowBack";
import ArrowForwardIcon from "@material-ui/icons/ArrowForward";
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

export default function MoveItem({
  allFolders,
  homeFolderStatus,
  handleMoveItem,
  moveMenuOpen,
  movedSnack,
  onMoveExit,
  selectedIndex,
  moveFolder,
  movedFolder,
  selectedFolders,
  handleMoveSnackClose,
  handleSnackbarExit,
  handleUndoMoveItem,
  handleOnClick,
  handleNextFolder,
  handlePreviousFolder,
  handleMoveItemClose,
}) {
  const moveSnack = (
    <Snack
      open={movedSnack}
      onClose={handleMoveSnackClose}
      onExited={handleSnackbarExit}
      message={`Moved to "${moveFolder.foldername}"`}
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
            <IconButton
              onClick={() => handlePreviousFolder(movedFolder.parent_id)}
            >
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
              selectedFolders.length > 0 && selectedFolders[0].id === folder._id
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
            selectedFolders[0]?._id === movedFolder?.id && moveFolder === ""
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
