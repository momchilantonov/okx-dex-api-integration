function getRequestUrlPath(url, request_path, params, method) {
  let urlPath = "";

  if (method == "GET") {
    const getReqParams = new URLSearchParams(params).toString();
    urlPath = encodeURI(url + request_path + "?" + getReqParams);
  } else if (method == "POST") {
    urlPath = encodeURI(url + request_path);
  }

  return new URL(urlPath).pathname + new URL(urlPath).search;
}

module.exports = { getRequestUrlPath };
