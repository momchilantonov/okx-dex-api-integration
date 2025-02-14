const { sendRequest } = require("./requestsHandler");

async function okx_request() {
  const okxRequest = await sendRequest(
    "src/api/wallet/PostTransactionOrderTODO_SIGNED_TX copy.json"
  );
}

okx_request().catch(console.error);
