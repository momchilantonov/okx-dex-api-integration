require("dotenv").config();
const { getHistoricalPrice } = require("../api/wallet/getHistoricalPrice");

async function testGetHistoricalPrice() {
  try {
    console.log("\n🚀 Testing getHistoricalPrice endpoint...");

    const params = {
      chainIndex: "1", // Ethereum
      tokenAddress: "", // Native ETH
      limit: "10", // Get 10 entries
      period: "1h", // 1 hour intervals
      begin: "1707717600000", // Example past timestamp
      end: "1707804000000", // Example end timestamp
    };

    console.log("\nRequesting historical prices for:");
    console.log(`- Chain ${params.chainIndex} (Ethereum)`);
    console.log(`- Token: ${params.tokenAddress || "NATIVE (ETH)"}`);
    console.log(`- Period: ${params.period}`);
    console.log(`- From: ${params.begin}`);
    console.log(`- To: ${params.end}`);

    const prices = await getHistoricalPrice(params);

    console.log("\n✅ Successfully retrieved prices:");
    if (Array.isArray(prices) && prices.length > 0) {
      prices.forEach((price) => {
        if (price.time && price.price) {
          console.log(`\n- Time: ${price.time}`);
          console.log(`  Price: $${price.price}`);
        }
      });
    } else {
      console.log("No prices returned");
    }

    // Print raw response for debugging
    console.log("\nRaw response data:", JSON.stringify(prices, null, 2));
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

testGetHistoricalPrice()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
