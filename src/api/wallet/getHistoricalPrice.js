const { sendGetRequest } = require("../requests");
const { logger } = require("../../utils/logger");

const ENDPOINT = "/api/v5/wallet/token/historical-price";

async function getHistoricalPrice(params) {
  try {
    logger.request("GET", ENDPOINT, params);

    const response = await sendGetRequest(ENDPOINT, params);

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
    throw new Error(`Failed to get historical token prices: ${error.message}`);
  }
}

module.exports = { getHistoricalPrice };
