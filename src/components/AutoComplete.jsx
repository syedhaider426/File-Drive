import React, { Fragment, Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import { IconButton, Typography, Menu, MenuItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import getData from "../helpers/getData";
import postData from "../helpers/postData";

const drawerWidth = 150;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  drawer: {
    [theme.breakpoints.up("sm")]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  appBar: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up("sm")]: {
      display: "none",
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(1),
  },
  centeredContent: {
    display: "flex",
    alignItems: "center",
    textAlign: "center",
  },
});

class AutoComplete extends Component {
  state = { profileOpen: false, item: "", itemID: "", buttonDisabled: true };

  componentDidMount() {
    getData(`/api${this.props.match.url}`)
      .then((data) => {
        this.sortAlphabetically(data.files, data.folders);
      })
      .catch((err) => console.log("Err", err));
  }

  handleProfileMenuOpen = (e) => {
    this.setState({ profileOpen: true, profileAnchorEl: e.currentTarget });
  };

  handleProfileMenuClose = () => {
    this.setState({ profileOpen: false });
  };

  handleLogOut = () => {
    postData("/logout")
      .then(() => {
        this.props.history.push("/");
      })
      .catch((err) => console.log(err));
  };

  handleAutoComplete = (e, value) => {
    if (value === null)
      return this.setState({ buttonDisabled: true, itemID: undefined });
    this.setState({ buttonDisabled: false, itemID: value });
  };

  handleSubmit = () => {
    const { itemID } = { ...this.state };
    document.body.style.cursor = "wait";
    if (itemID.foldername !== undefined)
      this.props.history.push(`/drive/folders/${itemID._id}`);
    else if (itemID.filename !== undefined) {
      getData(`/api/files/${itemID._id}`).then((d) => {
        document.body.style.cursor = "default";
        this.props.handleSetState({
          fileData: `/api/files/${itemID._id}`,
          modalOpen: true,
          contentType: d.headers["content-type"],
        });
      });
    }
  };

  sortAlphabetically = (files, folders) => {
    files.sort((a, b) => {
      /* Storing case insensitive comparison */
      var comparison = a.filename
        .toString()
        .toLowerCase()
        .localeCompare(b.filename.toString().toLowerCase());
      return comparison;
    });
    folders.sort((a, b) => {
      /* Storing case insensitive comparison */
      var comparison = a.foldername
        .toString()
        .toLowerCase()
        .localeCompare(b.foldername.toString().toLowerCase());
      return comparison;
    });
    return this.setState({ files, folders });
  };

  render() {
    const { buttonDisabled, files, folders } = {
      ...this.state,
    };
    const { classes } = { ...this.props };

    let options = [];
    for (let i = 0; i < folders?.length; ++i) {
      options.push({
        _id: folders[i]._id,
        item: folders[i].foldername,
        foldername: folders[i].foldername,
      });
    }
    for (let i = 0; i < files?.length; ++i) {
      options.push({
        _id: files[i]._id,
        item: files[i].filename,
        filename: files[i].filename,
      });
    }

    return (
      <Fragment>
        <Autocomplete
          id="combo-box-demo"
          options={options}
          getOptionLabel={(option) => option.item}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Search..." variant="outlined" />
          )}
          renderOption={(option) => {
            return (
              <Typography>
                {option.filename !== undefined ? (
                  <div className={classes.centeredContent}>
                    <FileIcon></FileIcon>
                    {option.filename}
                  </div>
                ) : (
                  <div className={classes.centeredContent}>
                    <FolderIcon></FolderIcon>
                    {option.foldername}
                  </div>
                )}
              </Typography>
            );
          }}
          onChange={(e, v) => this.handleAutoComplete(e, v)}
        />
        <IconButton disabled={buttonDisabled} onClick={this.handleSubmit}>
          <SearchIcon />
        </IconButton>
      </Fragment>
    );
  }
}

export default withRouter(withStyles(styles)(AutoComplete));
