function getRequestHostname(url) {
  const hostname = url.replace("https://", "").replace(/\/$/, "");

  return hostname;
}

module.exports = { getRequestHostname };
