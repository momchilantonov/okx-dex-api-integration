const { sendGetRequest } = require("../requests");
const { logger } = require("../../utils/logger");

const ENDPOINT = "/api/v5/wallet/chain/supported-chains";

async function getSupportedChains() {
  try {
    logger.request("GET", ENDPOINT);

    const response = await sendGetRequest(ENDPOINT);

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
    throw new Error(`Failed to get supported chains: ${error.message}`);
  }
}

module.exports = { getSupportedChains };
