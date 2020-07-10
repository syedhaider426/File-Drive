import React, { Fragment } from "react";
import { Button, IconButton, Snackbar } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

const Snack = ({ open, onClose, onExit, message, onClick }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      onExit={onExit}
      message={message}
      action={
        <Fragment>
          <Button onClick={onClick} color="secondary" size="small">
            Undo
          </Button>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Fragment>
      }
    />
  );
};

export default Snack;
