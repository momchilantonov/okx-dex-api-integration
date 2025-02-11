/**
 * Simple logging utility for API requests and responses
 */
const logger = {
  request: (method, endpoint, params = null) => {
    console.log("\n🔄 Request:", {
      timestamp: new Date().toISOString(),
      method,
      endpoint,
      params: params || "No parameters",
    });
  },

  response: (endpoint, data, error = null) => {
    if (error) {
      console.error("\n❌ Response Error:", {
        timestamp: new Date().toISOString(),
        endpoint,
        error: error.message || error,
      });
    } else {
      console.log("\n✅ Response:", {
        timestamp: new Date().toISOString(),
        endpoint,
        data,
      });
    }
  },
};

module.exports = { logger };
