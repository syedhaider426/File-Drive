import React, { Fragment, useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useHistory, useLocation } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import getData from "../helpers/getData";
import Axios from "axios";

const drawerWidth = 150;

const useStyles = makeStyles((theme) => ({
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
}));

export default function AutoComplete({
  setFileData,
  setContentType,
  setFileModalOpen,
}) {
  const [itemID, setItemID] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [files, setFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const history = useHistory();
  const location = useLocation();

  const fetchFilesFolders = () => {
    getData(`/api${location.pathname}`)
      .then((data) => {
        sortAlphabetically(data.files, data.folders);
      })
      .catch((err) => console.log("Err", err));
  };

  useEffect(fetchFilesFolders, []);

  const handleAutoComplete = (e, value) => {
    if (value === null) {
      setButtonDisabled(true);
      setItemID(undefined);
    } else {
      setButtonDisabled(false);
      setItemID(value);
    }
  };

  const handleSubmit = () => {
    document.body.style.cursor = "wait";
    if (itemID.foldername !== undefined)
      history.push(`/drive/folders/${itemID._id}`);
    else if (itemID.filename !== undefined) {
      Axios.get(`/api/files/${itemID._id}`).then((d) => {
        document.body.style.cursor = "default";
        setFileData(`/api/files/${itemID._id}`);
        setContentType(d.headers["content-type"]);
        setFileModalOpen(true);
      });
    }
  };

  const sortAlphabetically = (files, folders) => {
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
    setFiles(files);
    setFolders(folders);
  };

  let options = [];
  folders.forEach((folder) => {
    options.push({
      _id: folder._id,
      item: folder.foldername,
      foldername: folder.foldername,
    });
  });
  files.forEach((file) => {
    options.push({
      _id: file._id,
      item: file.filename,
      filename: file.filename,
    });
  });

  const classes = useStyles();

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
        onChange={(e, v) => handleAutoComplete(e, v)}
      />
      <IconButton disabled={buttonDisabled} onClick={handleSubmit}>
        <SearchIcon />
      </IconButton>
    </Fragment>
  );
}
