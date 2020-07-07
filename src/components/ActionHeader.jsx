import React from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import DeleteIcon from "@material-ui/icons/Delete";
import RenameIcon from "@material-ui/icons/Edit";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import Tooltip from "@material-ui/core/Tooltip";

const useStyles = makeStyles({
  // This group of buttons will be aligned to the right
  rightToolbar: {
    marginLeft: "auto",
    marginRight: -12,
  },
  menuButton: {
    marginRight: 16,
    marginLeft: -12,
  },
});

export default function ActionHeader() {
  const classes = useStyles();
  return (
    <AppBar position="static" color="transparent" elevation={3}>
      <Toolbar variant="dense">
        <Typography variant="title" color="inherit">
          My Drive
        </Typography>

        <section className={classes.rightToolbar}>
          <Tooltip title="Rename">
            <IconButton color="inherit" aria-label="Rename">
              <RenameIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton color="inherit" aria-label="Delete">
              <DeleteIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Copy">
            <IconButton color="inherit" aria-label="Copy">
              <FileCopyIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move">
            <IconButton color="inherit" aria-label="Move">
              <MoveToInboxIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="More Options">
            <IconButton color="inherit" aria-label="More Options">
              <MoreVertIcon />
            </IconButton>
          </Tooltip>
        </section>
      </Toolbar>
    </AppBar>
  );
}

ActionHeader.propTypes = {
  classes: PropTypes.object.isRequired,
};
