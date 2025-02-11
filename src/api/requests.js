const https = require("https");

const { config, createSignature } = require("../auth/signature");
const { getRequestHostname } = require("../utils/getRequestHostname");
const { getRequestUrlPath } = require("../utils/getRequestUrlPath");
const { getRequestHeaders } = require("../utils/getRequestHeaders");
const { getRequestOptions } = require("../utils/getRequestOptions");

function sendGetRequest(requestPath, params) {
  return new Promise((resolve, reject) => {
    const { signature, timestamp } = createSignature(
      "GET",
      requestPath,
      params
    );

    const hostname = getRequestHostname(config.baseUrl);
    const urlPath = getRequestUrlPath(config.baseUrl, requestPath, params);
    const headers = getRequestHeaders(signature, timestamp, config);
    const options = getRequestOptions(hostname, urlPath, "GET", headers);

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => reject(error));
    req.end();
  });
}

function sendPostRequest(requestPath, params) {
  return new Promise((resolve, reject) => {
    const { signature, timestamp } = createSignature(
      "POST",
      requestPath,
      params
    );

    const hostname = getRequestHostname(config.baseUrl);
    const urlPath = getRequestUrlPath(config.baseUrl, requestPath, params);
    const header = getRequestHeaders(signature, timestamp, config);
    const options = getRequestOptions(hostname, urlPath, "POST", header);

    const req = https.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on("error", (error) => reject(error));

    if (params) {
      req.write(JSON.stringify(params));
    }
    req.end();
  });
}

module.exports = { sendGetRequest, sendPostRequest };
