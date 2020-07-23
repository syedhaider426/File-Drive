import Axios from "axios";

import axios from "axios";

// Example GET method implementation:
async function getData(url = "") {
  // Default options are marked with *
  const response = await axios.get(url);
  return response.data;
}

export default getData;
