const { sendPostRequest } = require("../requests");
const { logger } = require("../../utils/logger");

const ENDPOINT = "/api/v5/wallet/token/current-price";

async function getTokenIndexPrice(tokenRequests) {
  try {
    if (Array.isArray(tokenRequests) && tokenRequests.length > 100) {
      throw new Error("Maximum 100 token requests allowed");
    }

    logger.request("POST", ENDPOINT, tokenRequests);

    const response = await sendPostRequest(ENDPOINT, tokenRequests);

    if (response.code !== "0") {
      logger.response(
        ENDPOINT,
        null,
        `API Error: ${response.msg || "Unknown error"}`
      );
      throw new Error(`API Error: ${response.msg || "Unknown error"}`);
    }

    logger.response(ENDPOINT, response.data);
    return response.data;
  } catch (error) {
    logger.response(ENDPOINT, null, error);
    throw new Error(`Failed to get token index prices: ${error.message}`);
  }
}

module.exports = { getTokenIndexPrice };
