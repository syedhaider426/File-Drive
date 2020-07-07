import React, { Fragment, Component } from "react";
import getData from "../helpers/getData";
import FileTable from "../components/FileTable";
import ActionHeader from "../components/ActionHeader";

class Files extends Component {
  state = { files: [], folders: [] };

  componentDidMount() {
    getData("/api/files/getAll")
      .then((data) => {
        this.setState({ files: data.files, folders: data.folders });
      })
      .catch((err) => console.log("Err", err));
  }

  returnFileSize = (fileSize) => {
    if (fileSize < 1024) return fileSize + " bytes";
    else if (fileSize >= 1024 && fileSize < 1048576)
      return Math.floor(fileSize / 1000) + "KB";
    else if (fileSize >= 1048576 && fileSize < 1073741824)
      return Math.floor(fileSize / 1000000) + "MB";
    else return Math.floor(fileSize / 1000000) + "GB";
  };
  render() {
    const { files, folders } = { ...this.state };
    return <FileTable files={files} folders={folders} />;
  }
}

export default Files;
