require("dotenv").config();
const { getSupportedChains } = require("../api/wallet/getSupportedChains"); // Updated path

async function testGetSupportedChains() {
  try {
    console.log(
      "\n🚀 Testing getSupportedChains endpoint with real credentials..."
    );
    console.log("API Key:", process.env.API_KEY ? "✓ Found" : "✗ Missing");
    console.log(
      "Secret Key:",
      process.env.SECRET_KEY ? "✓ Found" : "✗ Missing"
    );
    console.log(
      "Passphrase:",
      process.env.PASSPHRASE ? "✓ Found" : "✗ Missing"
    );

    const chains = await getSupportedChains();

    console.log("\n✅ Successfully retrieved chains:");
    console.log("Total chains:", chains.length);
    console.log("\nSample of first 3 chains:");
    chains.slice(0, 3).forEach((chain) => {
      console.log(
        `- ${chain.name} (${chain.shortName}), Chain Index: ${chain.chainIndex}`
      );
    });
  } catch (error) {
    console.error("\n❌ Test failed:", {
      message: error.message,
      stack: error.stack,
    });

    console.log("\nEnvironment Check:");
    console.log("BASE_URL:", process.env.API_BASE_URL);
    console.log("Headers present:", {
      apiKey: !!process.env.API_KEY,
      secretKey: !!process.env.SECRET_KEY,
      passphrase: !!process.env.PASSPHRASE,
    });
  }
}

// Run the test
testGetSupportedChains();
