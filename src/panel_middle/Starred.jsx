import React, { Fragment, Component } from "react";
import getData from "../helpers/getData";
import FileTable from "../components/FileTable";

class Starred extends Component {
  state = { files: [], folders: [] };

  componentDidMount() {
    getData("/api/files/getFavorite")
      .then((data) => {
        console.log("Data", data);
        this.setState({ files: data.files, folders: data.folders });
      })
      .catch((err) => console.log("Err", err));
  }
  render() {
    const { files, folders } = { ...this.state };
    return <FileTable files={files} folders={folders} />;
  }
}

export default Starred;
