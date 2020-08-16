import React, { Fragment, useState, useEffect } from "react";
import makeStyles from "@material-ui/core/styles/makeStyles";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import { useHistory } from "react-router-dom";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchIcon from "@material-ui/icons/Search";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
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

function AutoComplete({
  setFileData,
  setContentType,
  setFileModalOpen,
  files,
  folders,
}) {
  const [itemID, setItemID] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [options, setOptions] = useState([]);
  const history = useHistory();

  useEffect(() => {
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
    setOptions(options);
  }, [files, folders]);

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
    if (itemID.foldername !== undefined)
      history.push(`/drive/folders/${itemID._id}`);
    else if (itemID.filename !== undefined) {
      Axios.get(`/api/files/${itemID._id}`).then((d) => {
        setFileData(`/api/files/${itemID._id}`);
        setContentType(d.headers["content-type"]);
        setFileModalOpen(true);
      });
    }
  };

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

export default React.memo(AutoComplete);
