require("dotenv").config();

const config = {
  apiKey: process.env.API_KEY,
  secretKey: process.env.SECRET_KEY,
  passphrase: process.env.PASSPHRASE,
  baseUrl: process.env.API_BASE_URL,
  rpcUrl: process.env.WEB3_RPC_URL,
  privateKey: process.env.PRIVATE_KEY,
  projectId: process.env.PROJECT_ID,
};

module.exports = { config };
