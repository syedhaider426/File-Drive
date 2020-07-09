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
      />
    );
  }
}

export default Files;
