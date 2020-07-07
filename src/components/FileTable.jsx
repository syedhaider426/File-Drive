import React, { Fragment, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
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

class FileTable extends Component {
  returnFileSize = (fileSize) => {
    if (fileSize < 1024) return fileSize + " bytes";
    else if (fileSize >= 1024 && fileSize < 1048576)
      return Math.floor(fileSize / 1000) + "KB";
    else if (fileSize >= 1048576 && fileSize < 1073741824)
      return Math.floor(fileSize / 1000000) + "MB";
    else return Math.floor(fileSize / 1000000) + "GB";
  };
  render() {
    const { files, folders } = { ...this.props };
    return (
      <Grid item xs={10}>
        <ActionHeader />
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
              <TableRow key={folder._id}>
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
              <TableRow key={file._id}>
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

export default FileTable;
