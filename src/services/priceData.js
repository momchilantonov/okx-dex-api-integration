// src/market/priceData.js
const { validateTimeframe } = require("../utils/timeframes");
const { sendGetRequest } = require("../auth/requests");

class PriceData {
  constructor(chainId, timeframe) {
    this.chainId = chainId;
    this.timeframe = validateTimeframe(timeframe);
    this.candles = [];
    this.nextCandleTime = this.calculateNextCandleTime();
  }

  calculateNextCandleTime() {
    const now = Date.now();
    return Math.ceil(now / this.timeframe) * this.timeframe;
  }

  async getCurrentPrice(fromToken, toToken, amount = "1000000000000000000") {
    try {
      const quote = await sendGetRequest("/api/v5/dex/aggregator/quote", {
        chainId: this.chainId,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: amount,
      });

      if (!quote?.data?.[0]?.toTokenAmount) {
        throw new Error("Invalid quote response");
      }

      return quote.data[0].toTokenAmount / amount;
    } catch (error) {
      console.error("Price fetch error:", error);
      throw error;
    }
  }

  async getLiquidity(fromToken, toToken) {
    try {
      const quote = await sendGetRequest("/api/v5/dex/aggregator/quote", {
        chainId: this.chainId,
        fromTokenAddress: fromToken,
        toTokenAddress: toToken,
        amount: "1000000000000000000", // 1 ETH
      });
      return quote?.data?.[0]?.estimateGasFee || 0;
    } catch (error) {
      console.error("Liquidity fetch error:", error);
      return 0;
    }
  }

  async startMonitoring(fromToken, toToken) {
    console.log(
      `Waiting for next ${this.timeframe / 60000}M candle at ${new Date(
        this.nextCandleTime
      ).toISOString()}`
    );

    const waitTime = this.nextCandleTime - Date.now();
    await new Promise((resolve) => setTimeout(resolve, waitTime));

    while (true) {
      try {
        // Get open price
        const openPrice = await this.getCurrentPrice(fromToken, toToken);
        console.log(`Open price at ${new Date().toISOString()}: ${openPrice}`);

        // Wait until end of period
        await new Promise((resolve) =>
          setTimeout(resolve, this.timeframe - 2000)
        );

        // Get close price
        const closePrice = await this.getCurrentPrice(fromToken, toToken);
        console.log(
          `Close price at ${new Date().toISOString()}: ${closePrice}`
        );

        // Create candle
        const newCandle = {
          openTime: this.nextCandleTime,
          open: openPrice,
          high: Math.max(openPrice, closePrice),
          low: Math.min(openPrice, closePrice),
          close: closePrice,
          volume: await this.getLiquidity(fromToken, toToken),
        };

        this.candles.push(newCandle);
        console.log("New candle:", newCandle);

        this.nextCandleTime += this.timeframe;
      } catch (error) {
        console.error("Error in candle monitoring:", error);
        // Wait before retrying
        await new Promise((resolve) => setTimeout(resolve, 5000));
      }
    }
  }

  getLastCandle() {
    return this.candles[this.candles.length - 1] || null;
  }

  getCandles(limit) {
    return limit ? this.candles.slice(-limit) : [...this.candles];
  }
}

// Test
async function test() {
  try {
    const priceData = new PriceData("1", "5M");
    await priceData.startMonitoring(
      "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // ETH
      "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48" // USDC
    );
  } catch (error) {
    console.error("Test failed:", error);
  }
}

if (require.main === module) {
  test();
}

module.exports = PriceData;
