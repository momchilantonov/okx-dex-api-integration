function getRequestHeaders(signature, timestamp, config) {
  const headers = {
    "OK-ACCESS-KEY": config.apiKey,
    "OK-ACCESS-SIGN": signature,
    "OK-ACCESS-TIMESTAMP": timestamp,
    "OK-ACCESS-PASSPHRASE": config.passphrase,
    "OK-ACCESS-PROJECT": config.projectId,
    "Content-Type": "application/json",
  };
  return headers;
}

module.exports = { getRequestHeaders };
