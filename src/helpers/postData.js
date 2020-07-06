// Example POST method implementation:
async function postData(url = "", data) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data, // body data type must match "Content-Type" header
  });
  return response.json();
}

export default postData;
