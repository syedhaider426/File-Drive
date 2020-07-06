// Example DELETE method implementation:
async function deleteData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

export default deleteData;
