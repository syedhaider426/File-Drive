// Example GET method implementation:
async function getData(url = "") {
  // Default options are marked with *
  const response = await fetch(url);
  return response.json();
}

export default getData;
