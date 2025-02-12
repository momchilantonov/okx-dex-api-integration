require("dotenv").config();
const { postTokenIndexPrice } = require("../api/wallet/postTokenIndexPrice");

async function testGetTokenIndexPrice() {
  try {
    console.log("\n🚀 Testing getTokenIndexPrice endpoint...");

    // Test with ETH and USDT
    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "0x40aA958dd87FC8305b97f2BA922CDdCa374bcD7f",
      },
    ];

    console.log("\nRequesting prices for:", tokenRequests);
    const prices = await postTokenIndexPrice(tokenRequests);

    console.log("\n✅ Successfully retrieved prices:");
    prices.forEach((price) => {
      console.log(`\n- Chain ${price.chainIndex}:`);
      console.log(`  Token: ${price.tokenAddress || "NATIVE ETH"}`);
      console.log(`  Price: $${price.price}`);
      console.log(`  Time: ${new Date(parseInt(price.time)).toISOString()}`);
    });
  } catch (error) {
    console.error("\n❌ Test failed:", {
      message: error.message,
      stack: error.stack,
    });

    console.log("\nEnvironment Check:");
    console.log("API Key:", process.env.API_KEY ? "✓ Found" : "✗ Missing");
    console.log(
      "Project ID:",
      process.env.PROJECT_ID ? "✓ Found" : "✗ Missing"
    );
  }
}

testGetTokenIndexPrice()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
