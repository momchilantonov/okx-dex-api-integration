const getRequestUrl = (apiBaseUrl, api, queryParams) => {
  return apiBaseUrl + api + "?" + new URLSearchParams(queryParams).toString();
};

module.exports = { getRequestUrl };
