const TIMEFRAMES = {
  "1M": 60000, // 1 minute in ms
  "5M": 300000, // 5 minutes
  "15M": 900000, // 15 minutes
  "1H": 3600000, // 1 hour
  "4H": 14400000, // 4 hours
  "1D": 86400000, // 1 day
  "1W": 604800000, // 1 week
};

function validateTimeframe(timeframe) {
  if (!TIMEFRAMES[timeframe]) {
    throw new Error(
      `Invalid timeframe. Supported: ${Object.keys(TIMEFRAMES).join(", ")}`
    );
  }
  return TIMEFRAMES[timeframe];
}

module.exports = { TIMEFRAMES, validateTimeframe };
