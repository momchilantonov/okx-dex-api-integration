const { config } = require("../config/config");
const { getPreHash } = require("../utils/getPreHash");
const { getHmacSign } = require("../utils/getHmacSign");

function createSignature(method, requestPath, params) {
  const timestamp = new Date().toISOString();
  const message = getPreHash(timestamp, method, requestPath, params);
  console.log("---- Signature Creation Process ----");
  console.log("Timestamp:", timestamp);
  console.log("Method:", method);
  console.log("Path:", requestPath);
  console.log("Params:", JSON.stringify(params));
  console.log("PreHash Message:", message);
  console.log("Secret Key:", config.secretKey);
  const signature = getHmacSign(message, config.secretKey);
  console.log("Final Signature:", signature);
  return { signature, timestamp };
}

module.exports = { config, createSignature };
