function getRequestOptions(hostname, path, method, headers) {
  const options = {
    hostname: hostname,
    path: path,
    method: method,
    headers: headers,
  };

  return options;
}

module.exports = { getRequestOptions };
