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
import sortFiles from "../helpers/sortFiles";
import sortFolders from "../helpers/sortFolders";
import getData from "../helpers/getData";

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
  search: {
    backgroundColor: "white",
  },
  inputRoot: {
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "white",
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

function AutoComplete({ setFileData, setContentType, setFileModalOpen }) {
  const [itemID, setItemID] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [options, setOptions] = useState([]);

  const history = useHistory();

  const fetchData = () => {
    getData(`/api/drive/all`).then((data) => {
      let { files, folders } = { ...data };
      files = sortFiles(files, {
        name: "Name",
        order: "asc",
      });
      folders = sortFolders(folders, {
        name: "Name",
        order: "asc",
      });
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
    });
  };

  // useEffect(() => {
  //   (async () => await fetchData())();
  // }, [options]);

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
        id="autcomplete"
        options={options}
        getOptionLabel={(option) => option.item}
        style={{ width: 300 }}
        renderInput={(params) => (
          <Fragment>
            <TextField
              {...params}
              className={classes.search}
              size="small"
              placeholder="Search..."
              variant="outlined"
            />
          </Fragment>
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

      <IconButton
        style={{ color: "white", backgroundColor: "blue" }}
        size="medium"
        edge="start"
        disabled={buttonDisabled}
        onClick={handleSubmit}
      >
        <SearchIcon />
      </IconButton>
    </Fragment>
  );
}

export default React.memo(AutoComplete);
