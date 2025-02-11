const { getRequestUrl } = require("./getRequestUrl");

function getRequestUrlPath(url, request_path, params) {
  const urlPath = new URL(getRequestUrl(url, request_path, params));

  return urlPath.pathname + urlPath.search;
}

module.exports = { getRequestUrlPath };
