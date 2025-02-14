const ERROR_CODES = {
  0: "Succeeded",
  50011:
    "429	Rate limit reached. Please refer to API documentation and throttle requests accordingly",
  50014: "400	Parameter {param0} cannot be empty",
  50026: "500	System error. Try again later",
  50103: "401	Request header 'OK-ACCESS-KEY' cannot be empty",
  50104: "401	Request header 'OK-ACCESS-PASSPHRASE' cannot be empty",
  50105: "401	Request header 'OK-ACCESS-PASSPHRASE' incorrect",
  50106: "401	Request header 'OK-ACCESS-SIGN' cannot be empty",
  50107: "401	Request header 'OK-ACCESS-TIMESTAMP' cannot be empty",
  50111: "401	Invalid OK-ACCESS-KEY",
  50112: "401	Invalid OK-ACCESS-TIMESTAMP",
  50113: "401	Invalid signature",
  51000: "400	Parameter {param0} error",
  80000: "200	Repeated request",
  80001: "200	CallData exceeds the maximum limit. Try again in 5 minutes",
  80002: "200	Requested token Object count has reached the limit",
  80003: "200	Requested native token Object count has reached the limit",
  80004: "200	Timeout when querying SUI Object",
  80005: "200	Not enough Sui objects under the address for swapping",
  82000: "200	Insufficient liquidity",
  82001: "500	The commission service is not available during the upgrade",
  82102: "200	Less than the minimum quantity limit,the minimum amount is {0}",
  82103: "200	Exceeds than the maximum quantity limit,the maximum amount is {0}",
  82104: "200	This token is not supported",
  82105: "200	This chain is not supported",
  82112:
    "200	The value difference from this transaction’s quote route is higher than {num}, which may cause asset loss,The default value is 90%. It can be adjusted using the string priceImpactProtectionPercentage",
  82116: "200	callData exceeds the maximum limit. Try again in 5 minutes",
  82120:
    "200	Detected honeypot tokens or high-risk tokens with a 100% buy/sell tax. Transactions have been intercepted",
};

function handleErrors(code) {
  return ERROR_CODES[code] || "Unknown error";
}

module.exports = { getErrorCode: handleErrors, ERROR_CODES };
