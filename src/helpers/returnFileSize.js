function returnFileSize(fileSize) {
  if (fileSize < 1024) return fileSize + " bytes";
  else if (fileSize >= 1024 && fileSize < 1048576)
    return Math.ceil(fileSize / 1000) + " KB";
  else if (fileSize >= 1048576 && fileSize < 1073741824)
    return Math.ceil(fileSize / 1000000) + " MB";
  else return Math.ceil(fileSize / 1000000) + " GB";
}

export default returnFileSize;
