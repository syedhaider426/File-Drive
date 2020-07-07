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

const styles = (theme) => ({
  tableRow: {
    "&:hover": {
      backgroundColor: "#e8f0fe !important",
      color: "#1967d2 !important",
    },
  },
});

class FileTable extends Component {
  returnFileSize = (fileSize) => {
    if (fileSize < 1024) return fileSize + " bytes";
    else if (fileSize >= 1024 && fileSize < 1048576)
      return Math.floor(fileSize / 1000) + "KB";
    else if (fileSize >= 1048576 && fileSize < 1073741824)
      return Math.floor(fileSize / 1000000) + "MB";
    else return Math.floor(fileSize / 1000000) + "GB";
  };

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
    console.log("copy", data);
    postData("/api/files/copy", data)
      .then((data) => {
        console.log(data);
        const { files } = { ...this.props };
        for (let file of data.files) {
          files.push(file);
        }
        handleSetState({ selectedFiles: [], files });
      })
      .catch((err) => console.log("Err", err));
  };

  handleDelete = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    console.log(selectedFiles);
    const data = { selectedFolders, selectedFiles };
    postData("/api/files/trash", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Deleted files and folders
        if (files.length > 0 && folders.length > 0)
          this.props.handleSetState({
            files,
            folders,
            selectedFiles: [],
            selectedFolders: [],
          });
        //Deleted only folders
        else if (folders.length > 0)
          this.props.handleSetState({
            folders,
            selectedFiles: [],
            selectedFolders: [],
          });
        //Deleted only files
        else {
          this.props.handleSetState({
            files,
            selectedFiles: [],
            selectedFolders: [],
          });
        }
      })
      .catch((err) => console.log("Err", err));
  };

  handleDeleteForever = () => {
    console.log("Clicked");
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    console.log(data);
    postData("/api/files/delete", data)
      .then((data) => {
        const { files, folders } = { ...data };
        console.log(files);
        console.log(folders);
        //Trashed files and folders
        if (files.length > 0 && folders.length > 0)
          this.props.handleSetState({
            files,
            folders,
            selectedFiles: [],
            selectedFolders: [],
          });
        //Trashed only folders
        else if (folders.length > 0)
          this.props.handleSetState({
            folders,
            selectedFiles: [],
            selectedFolders: [],
          });
        //Trashed only files
        else {
          console.log("files", files);
          this.props.handleSetState({
            files,
            selectedFiles: [],
            selectedFolders: [],
          });
        }
      })
      .catch((err) => console.log("Err", err));
  };

  handleRestore = () => {
    let { selectedFolders, selectedFiles } = { ...this.props };
    const data = { selectedFolders, selectedFiles };
    console.log(data);
    postData("/api/files/restore", data)
      .then((data) => {
        const { files, folders } = { ...data };
        //Trashed files and folders
        if (files.length > 0 && folders.length > 0)
          this.props.handleSetState({
            files,
            folders,
            selectedFiles: [],
            selectedFolders: [],
          });
        //Trashed only folders
        else if (folders.length > 0)
          this.props.handleSetState({
            folders,
            selectedFiles: [],
            selectedFolders: [],
          });
        //Trashed only files
        else {
          console.log("files", files);
          this.props.handleSetState({
            files,
            selectedFiles: [],
            selectedFolders: [],
          });
        }
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
      <Grid item xs={10}>
        <ActionHeader
          selectedFiles={selectedFiles}
          selectedFolders={selectedFolders}
          handleDelete={this.handleDelete}
          handleFileCopy={this.handleFileCopy}
          handleDeleteForever={this.handleDeleteForever}
          handleRestore={this.handleRestore}
          currentMenu={currentMenu}
        />
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Uploaded On</TableCell>
              <TableCell>File Size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
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
                    {this.returnFileSize(file.length)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Grid>
    );
  }
}

export default withStyles(styles)(FileTable);
