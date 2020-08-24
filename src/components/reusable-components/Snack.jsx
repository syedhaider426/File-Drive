import React, { Fragment } from "react";
import Button from "@material-ui/core/Button";
import IconButton from "@material-ui/core/IconButton";
import Snackbar from "@material-ui/core/Snackbar";
import CloseIcon from "@material-ui/icons/Close";

// Material-UI Reusable snackbar with custom implementation
const Snack = ({ open, onClose, onExited, message, onClick }) => {
  return (
    <Snackbar
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      onExited={onExited}
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

export default React.memo(Snack);
