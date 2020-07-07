import React, { Fragment, Component } from "react";
import getData from "../helpers/getData";
import FileTable from "../components/FileTable";
import ActionHeader from "../components/ActionHeader";

class Trash extends Component {
  state = {
    files: [],
    folders: [],
    selectedFiles: [],
    selectedFolders: [],
    currentMenu: "trash",
  };

  componentDidMount() {
    getData("/api/files/getTrash")
      .then((data) => {
        this.setState({ files: data.files, folders: data.folders });
      })
      .catch((err) => console.log("Err", err));
  }

  handleSetState = (value) => {
    this.setState(value);
  };

  render() {
    const { files, folders, selectedFiles, selectedFolders, currentMenu } = {
      ...this.state,
    };
    return (
      <FileTable
        files={files}
        folders={folders}
        selectedFiles={selectedFiles}
        selectedFolders={selectedFolders}
        handleSetState={this.handleSetState}
        currentMenu={currentMenu}
      />
    );
  }
}

export default Trash;
