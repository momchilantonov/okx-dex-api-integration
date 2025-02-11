const querystring = require("querystring");

function getPreHash(timestamp, method, requestPath, params) {
  let queryString = "";
  if (method === "GET" && params) {
    queryString = "?" + querystring.stringify(params);
  }
  if (method === "POST" && params) {
    queryString = JSON.stringify(params);
  }
  return timestamp + method + requestPath + queryString;
}

module.exports = { getPreHash };
