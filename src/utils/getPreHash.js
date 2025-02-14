const querystring = require("querystring");

function getPreHash(timestamp, method, requestPath, params) {
  if (method === "GET" && params && Object.keys(params).length > 0) {
    // Build querystring without encoding the comma
    const formattedParams = Object.entries(params)
      .map(([key, value]) => {
        // Special handling for chains parameter
        if (key === "chains") {
          return `${key}=${value}`; // Don't encode the comma
        }
        return `${key}=${encodeURIComponent(value)}`;
      })
      .join("&");

    return timestamp + method + requestPath + "?" + formattedParams;
  }

  if (method === "POST" && params) {
    return timestamp + method + requestPath + JSON.stringify(params);
  }

  return timestamp + method + requestPath;
}

module.exports = { getPreHash };
