const { config } = require("../config/config");
const { getPreHash } = require("../utils/getPreHash");
const { getHmacSign } = require("../utils/getHmacSign");

function createSignature(method, requestPath, params) {
  const timestamp = new Date().toISOString();
  const message = getPreHash(timestamp, method, requestPath, params);
  const signature = getHmacSign(message, config.secretKey);
  return { signature, timestamp };
}

module.exports = { config, createSignature };
