// Example PUT method implementation:
async function patchData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json();
}

export default patchData;
