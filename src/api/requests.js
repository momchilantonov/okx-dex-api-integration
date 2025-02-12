const https = require("https");

const { logger } = require("../utils/logger");
const { config, createSignature } = require("../auth/signature");
const { getRequestHostname } = require("../utils/getRequestHostname");
const { getRequestUrlPath } = require("../utils/getRequestUrlPath");
const { getRequestHeaders } = require("../utils/getRequestHeaders");
const { getRequestOptions } = require("../utils/getRequestOptions");

async function makeRequest(method, endpoint, params) {
  try {
    logger.request(method, endpoint, params);

    const response =
      method === "GET"
        ? await sendGetRequest(endpoint, params)
        : await sendPostRequest(endpoint, params);

    if (response.code !== "0") {
      logger.response(
        endpoint,
        null,
        `API Error: ${response.msg || "Unknown error"}`
      );
      throw new Error(`API Error: ${response.msg || "Unknown error"}`);
    }

    logger.response(endpoint, response.data);
    return response.data;
  } catch (error) {
    logger.response(endpoint, null, error);
    throw new Error(`Request failed: ${error.message}`);
  }
}

function sendGetRequest(requestPath, params) {
  return new Promise((resolve, reject) => {
    const { signature, timestamp } = createSignature(
      "GET",
      requestPath,
      params
    );

    const hostname = getRequestHostname(config.baseUrl);

    const urlPath = getRequestUrlPath(
      config.baseUrl,
      requestPath,
      params,
      "GET"
    );

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

    const urlPath = getRequestUrlPath(
      config.baseUrl,
      requestPath,
      params,
      "POST"
    );
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
