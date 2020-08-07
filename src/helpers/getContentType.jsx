import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import Box from "@material-ui/core/Box";
import React from "react";
export default function getContentType(
  fileData,
  contentType,
  selectedFiles,
  handleSingleDownload
) {
  let fileType;
  let style = {
    backgroundColor: "transparent",
    boxShadow: "none",
  };
  if (contentType.startsWith("image"))
    fileType = (
      <img
        style={{
          width: "100%",
          height: "auto",
          maxWidth: "100%",
          objectFit: "cover",
        }}
        alt={selectedFiles[0]?.filename}
        src={fileData}
      ></img>
    );
  else if (contentType.startsWith("video"))
    fileType = (
      <video
        autoplay
        controls={true}
        muted={false}
        style={{
          width: "100%",
          height: "auto",
          maxHeight: "90vh",
          maxWidth: "100%",
          objectFit: "cover",
        }}
      >
        <source src={fileData} type={contentType} />
        Your browser does not support the video tag.
      </video>
    );
  else if (contentType.startsWith("audio"))
    fileType = (
      <audio controls>
        <source src={fileData} type={contentType} />
        Your browser does not support the audio element.
      </audio>
    );
  else {
    fileType = (
      <div>
        <Typography style={{ textAlign: "center" }}>
          <Box fontWeight="fontWeightMedium">{selectedFiles[0]?.filename} </Box>
        </Typography>
        <div style={{ textAlign: "center" }}>
          <Button
            color="primary"
            variant="contained"
            onClick={() => handleSingleDownload(selectedFiles[0])}
          >
            Download
          </Button>{" "}
        </div>
      </div>
    );
    style = {};
  }
  return [fileType, style];
}
