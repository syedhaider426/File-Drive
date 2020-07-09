import React, { Fragment, Component } from "react";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import getData from "../helpers/getData";
import convertISODate from "../helpers/convertISODate";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import ActionHeader from "./ActionHeader";
import postData from "../helpers/postData";
import returnFileSize from "../helpers/returnFileSize";
import PrimarySearchAppBar from "./PrimarySearchAppBar";
import Actions from "../panel_left/Actions";
const styles = (theme) => ({
  tableRow: {
    "&:hover": {
      backgroundColor: "#e8f0fe !important",
      color: "#1967d2 !important",
    },
  },
  table: {
    minWidth: 650,
  },
});

class FileTable extends Component {
  handleFolderClick = (e, id, foldername) => {
    const { selectedFolders, handleSetState } = { ...this.props };
    if (selectedFolders.length === 0) {
      selectedFolders.push({ id, foldername });
      handleSetState({
        selectedFiles: [],
        selectedFolders,
      });
    } else {
      selectedFolders[0] = { id, foldername };
      handleSetState({
        selectedFiles: [],
        selectedFolders,
      });
    }
  };

  handleFileClick = (e, id, filename) => {
    const { selectedFiles, handleSetState } = { ...this.props };
    if (selectedFiles.length === 0) {
      selectedFiles.push({ id, filename });
      handleSetState({
        selectedFolders: [],
        selectedFiles,
      });
    } else {
      selectedFiles[0] = { id, filename };
      handleSetState({
        selectedFolders: [],
        selectedFiles,
      });
    }
  };

  handleFileCopy = () => {
    const { selectedFiles, handleSetState } = { ...this.props };
    const data = { selectedFiles };
    postData("/api/files/copy", data)
      .then((data) => {
        const { files } = { ...this.props };
        for (let file of data.files) {
          files.push(file);
        }
        handleSetState({ selectedFiles: [], files });
      })
      .catch((err) => console.log("Err", err));
  };

  handleTrash = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDeleteForever = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/delete", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Trashed files and folders
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestore = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/restore", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  handleFavorites = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/favorite", data)
      .then((data) => {
        const { files, folders } = { ...data };
        this.props.handleSetState({
          files,
          folders,
          selectedFiles: [],
          selectedFolders: [],
        });
      })
      .catch((err) => console.log("Err", err));
  };

  render() {
    const {
      files,
      folders,
      classes,
      selectedFolders,
      selectedFiles,
      currentMenu,
    } = {
      ...this.props,
    };
    return (
      <Fragment>
        <Grid item xs={12}>
          <PrimarySearchAppBar />
        </Grid>
        <Grid item xs={2}>
          <Actions />
        </Grid>
        <Grid item xs={10}>
          <ActionHeader
            selectedFiles={selectedFiles}
            selectedFolders={selectedFolders}
            handleTrash={this.handleTrash}
            handleFileCopy={this.handleFileCopy}
            handleDeleteForever={this.handleDeleteForever}
            handleRestore={this.handleRestore}
            currentMenu={currentMenu}
          />
          <Table
            className={classes.table}
            size="medium"
            aria-label="a dense table"
          >
            <TableHead>
              <TableRow>
                <TableCell style={{ width: "33%" }}>Name</TableCell>
                <TableCell style={{ width: "33%" }}>Uploaded On</TableCell>
                <TableCell style={{ width: "33%" }}>File Size</TableCell>
              </TableRow>
            </TableHead>
            <TableBody style={{ width: "100%" }}>
              {folders.map((folder) => (
                <TableRow
                  key={folder._id}
                  className={classes.tableRow}
                  onClick={(e) =>
                    this.handleFolderClick(e, folder._id, folder.filename)
                  }
                >
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FolderIcon style={{ fill: "#5f6368" }} />
                      <span className="data">{folder.foldername}</span>
                    </div>
                  </TableCell>

                  <TableCell>
                    <span className="details">
                      {convertISODate(folder.createdOn)}
                    </span>
                  </TableCell>
                  <TableCell align="left">—</TableCell>
                </TableRow>
              ))}
              {files.map((file) => (
                <TableRow
                  key={file._id}
                  className={classes.tableRow}
                  onClick={(e) =>
                    this.handleFileClick(e, file._id, file.filename)
                  }
                >
                  <TableCell>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <FileIcon style={{ fill: "#5f6368" }} />
                      <span className="data">{file.filename}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="details">
                      {convertISODate(file.uploadDate)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="details">
                      {returnFileSize(file.length)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Fragment>
    );
  }
}

export default withStyles(styles)(FileTable);
