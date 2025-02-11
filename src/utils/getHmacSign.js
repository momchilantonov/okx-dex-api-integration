const crypto = require("crypto");

function getHmacSign(message, secretKey) {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(message);
  return hmac.digest("base64");
}

module.exports = { getHmacSign };
