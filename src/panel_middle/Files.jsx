import React, { Fragment, Component } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";
import getData from "../helpers/getData";
class Files extends Component {
  state = { files: [], folders: [] };

  componentDidMount() {
    getData("/api/files/get")
      .then((data) => {
        console.log("Data", data);
        this.setState({ files: data.files, folders: data.folders });
      })
      .catch((err) => console.log("Err", err));
  }
  render() {
    const { files, folders } = { ...this.state };
    return (
      <Fragment>
        <div>Folders</div>
        {folders.map((folder) => (
          <label key={folder._id}>{folder.foldername}</label>
        ))}
        <div>Files</div>
        {files.map((file) => (
          <label key={file._id}>{file.filename}</label>
        ))}
      </Fragment>
    );
  }
}

export default Files;
