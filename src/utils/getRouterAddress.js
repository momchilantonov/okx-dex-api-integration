const ROUTER_ADDRESSES = {
  1: "0x7D0CcAa3Fac1e5A943c5168b6CEd828691b46B36", // Ethereum
};

function getRouterAddress(chainId) {
  return ROUTER_ADDRESSES[chainId];
}

module.exports = { getRouterAddress, ROUTER_ADDRESSES };
