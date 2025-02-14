const https = require("https");
const { config, createSignature } = require("../auth/signature");
const { logger } = require("../utils/logger");
const { getRequestHostname } = require("../utils/getRequestHostname");
const { getRequestUrlPath } = require("../utils/getRequestUrlPath");
const { getRequestHeaders } = require("../utils/getRequestHeaders");
const { getRequestOptions } = require("../utils/getRequestOptions");
const { parseRequestConfig } = require("../utils/parseRequestConfig");

/**
 * Sends a GET request
 */
function sendGetRequest(requestPath, params) {
  return new Promise((resolve, reject) => {
    try {
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
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Sends a POST request
 */
function sendPostRequest(requestPath, params) {
  return new Promise((resolve, reject) => {
    try {
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
      const headers = getRequestHeaders(signature, timestamp, config);
      const options = getRequestOptions(hostname, urlPath, "POST", headers);

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
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Main request handler
 */
async function sendRequest(requestConfig) {
  try {
    const reqConf = parseRequestConfig(requestConfig);
    logger.request(reqConf.method, reqConf.endpoint, reqConf.params);

    const response =
      reqConf.method.toUpperCase() === "GET"
        ? await sendGetRequest(reqConf.endpoint, reqConf.params)
        : await sendPostRequest(reqConf.endpoint, reqConf.params);

    if (response.code !== "0") {
      const errorDetails = {
        timestamp: new Date().toISOString(),
        endpoint: reqConf.endpoint,
        error: `API Error: ${response.msg || "Unknown error"}`,
      };
      logger.response(reqConf.endpoint, null, errorDetails.error);
      throw errorDetails;
    }

    logger.response(reqConf.endpoint, response.data);
    return response.data;
  } catch (error) {
    const endpoint =
      requestConfig.endpoint ||
      (typeof requestConfig === "string" ? requestConfig : "Unknown");

    logger.response(
      endpoint,
      null,
      `Request failed: ${error.message || JSON.stringify(error)}`
    );
    throw error;
  }
}

module.exports = {
  sendRequest,
  sendPostRequest,
  sendGetRequest,
};
