import React, { Component } from "react";
import getData from "../helpers/getData";
import FileTable from "../components/FileTable";

class Files extends Component {
  state = {
    files: [],
    folders: [],
    selectedFiles: [],
    selectedFolders: [],
    currentMenu: this.props.path,
    loaded: false,
    snackbarOpen: false,
    filesModified: 0,
    foldersModified: 0,
    tempFiles: [],
    tempFolders: [],
  };

  componentDidMount() {
    console.log(`/api/files/${this.props.path}`);
    getData(`/api/files/${this.props.path}`)
      .then((data) => {
        console.log(data);
        this.setState({
          files: data.files,
          folders: data.folders,
        });
      })
      .catch((err) => console.log("Err", err));
  }

  handleSetState = (value) => {
    this.setState(value);
  };

  render() {
    const {
      files,
      folders,
      selectedFiles,
      selectedFolders,
      currentMenu,
      loaded,
      snackbarOpen,
      filesModified,
      foldersModified,
      tempFiles,
      tempFolders,
    } = {
      ...this.state,
    };
    console.log(this.props.path);
    return (
      <FileTable
        files={files}
        folders={folders}
        selectedFiles={selectedFiles}
        selectedFolders={selectedFolders}
        handleSetState={this.handleSetState}
        currentMenu={currentMenu}
        loaded={loaded}
        snackbarOpen={snackbarOpen}
        filesModified={filesModified}
        foldersModified={foldersModified}
        tempFiles={tempFiles}
        tempFolders={tempFolders}
      />
    );
  }
}

export default Files;
