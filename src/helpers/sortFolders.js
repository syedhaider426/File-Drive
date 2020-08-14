export default function sortFolders(folders, sortColumn) {
  let value = sortColumn.order === "asc" ? 1 : -1;
  if (sortColumn.name === "Name") {
    return folders?.sort((a, b) => {
      /* Storing case insensitive comparison */
      var comparison = a.foldername
        .toString()
        .toLowerCase()
        .localeCompare(b.foldername.toString().toLowerCase());
      return value * comparison;
    });
  } else if (sortColumn.name === "Uploaded On") {
    return folders?.sort((a, b) => {
      if (a.createdOn > b.createdOn) return 1 * value;
      if (a.createdOn < b.createdOn) return -1 * value;
      return 0;
    });
  } else return folders;
}
