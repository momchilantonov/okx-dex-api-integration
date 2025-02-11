function validateFeePercent(percent) {
  const fee = parseFloat(percent);
  if (isNaN(fee) || fee < 0 || fee > 3) {
    throw new Error("Fee must be between 0 and 3%");
  }
  return fee.toFixed(2); // Max 2 decimal points
}

function addFeeParams(params, feePercent, referrerAddress) {
  return {
    ...params,
    feePercent: validateFeePercent(feePercent),
    fromTokenReferrerWalletAddress: referrerAddress,
  };
}

module.exports = { validateFeePercent, addFeeParams };
