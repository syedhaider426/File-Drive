export default function sortFiles(files, sortColumn) {
  let value = sortColumn.order === "asc" ? 1 : -1;
  if (sortColumn.name === "Name") {
    return files?.sort((a, b) => {
      /* Storing case insensitive comparison */
      var comparison = a.filename
        .toString()
        .toLowerCase()
        .localeCompare(b.filename.toString().toLowerCase());
      return value * comparison;
    });
  } else if (sortColumn.name === "Uploaded On") {
    return files?.sort((a, b) => {
      if (a.uploadDate > b.uploadDate) return 1 * value;
      if (a.uploadDate < b.uploadDate) return -1 * value;
      return 0;
    });
  } else if (sortColumn.name === "File Size") {
    return files?.sort((a, b) => {
      return value * (a.length - b.length);
    });
  } else return files;
}
