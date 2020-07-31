import React, { Fragment } from "react";
import convertISODate from "../helpers/convertISODate";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import FileIcon from "@material-ui/icons/InsertDriveFile";
import FolderIcon from "@material-ui/icons/Folder";
import returnFileSize from "../helpers/returnFileSize";
import { CircularProgress, TableContainer } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import StarIcon from "@material-ui/icons/Star";
import selectedIndex from "../helpers/selectedIndex";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

const useStyles = makeStyles((theme) => ({
  tableRow: {
    tableRow: {
      "&$selected, &$selected:hover": {
        backgroundColor: "#e8f0fe",
        color: "#1967d2",
      },
    },
  },
  table: {
    maxHeight: "85vh",
  },
  root: {
    width: "100%",
  },
  iconSpacing: {
    left: theme.spacing(1),
  },
  textContainer: {
    display: "flex",
    width: "40vw",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    alignItems: "center",
  },
  fileSize: {
    [theme.breakpoints.down("sm")]: {
      display: "none",
    },
  },
}));

const renderSortIcon = (sortColumn, column) => {
  if (sortColumn.name === column && sortColumn.order === "asc")
    return <ArrowUpwardIcon fontSize="small" />;
  else if (sortColumn.name === column && sortColumn.order === "desc")
    return <ArrowDownwardIcon fontSize="small" />;
};

export default function MainTable({
  handleFolderClick,
  handleFileClick,
  folders,
  files,
  selectedFolders,
  selectedFiles,
  currentMenu,
  isLoaded,
  handleSort,
  sortColumn,
}) {
  const classes = useStyles();
  const headerList = ["Name", "Uploaded On", "File Size"];
  return (
    <Fragment>
      {isLoaded ? (
        <TableContainer id="table-container" className={classes.table}>
          <Table size="small" aria-label="a dense table" stickyHeader>
            <TableHead>
              <TableRow>
                {headerList.map((header, index) => (
                  <TableCell
                    onClick={() => handleSort(header)}
                    className={header === "File Size" ? classes.fileSize : ""}
                    key={header}
                    style={{ width: "33.33%" }}
                  >
                    <span style={{ display: "flex" }}>
                      {header} {renderSortIcon(sortColumn, header)}
                    </span>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody style={{ width: "100%" }}>
              {folders?.map((folder) => (
                <TableRow
                  key={folder._id}
                  className={classes.tableRow}
                  onClick={(e) => handleFolderClick(e, folder)}
                  selected={selectedIndex(selectedFolders, folder._id)}
                >
                  <TableCell>
                    <div className={classes.textContainer}>
                      <FolderIcon style={{ fill: "#5f6368" }} />
                      <span className="data">{folder.foldername}</span>
                      {currentMenu === "Home" && folder.isFavorited && (
                        <StarIcon className="data" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="details">
                      {convertISODate(folder.createdOn)}
                    </span>
                  </TableCell>
                  <TableCell className={classes.fileSize} align="left">
                    {"—"}
                  </TableCell>
                </TableRow>
              ))}
              {files?.map((file) => (
                <TableRow
                  key={file._id}
                  className={classes.tableRow}
                  onClick={(e) => handleFileClick(e, file)}
                  selected={selectedIndex(selectedFiles, file._id)}
                >
                  <TableCell>
                    <div className={classes.textContainer}>
                      <FileIcon style={{ fill: "#5f6368" }} />

                      <span className="data">{file.filename}</span>
                      {currentMenu === "Home" && file.metadata.isFavorited && (
                        <StarIcon className="data" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="details">
                      {convertISODate(file.uploadDate)}
                    </span>
                  </TableCell>
                  <TableCell className={classes.fileSize}>
                    <span className="details">
                      {returnFileSize(file.length)}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </div>
      )}
    </Fragment>
  );
}
