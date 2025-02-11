const nock = require("nock");
const {
  getTokenIndexPrice,
} = require("../../src/api/wallet/getTokenIndexPrice");

jest.mock("../../src/config/config", () => ({
  config: {
    apiKey: "test-api-key",
    secretKey: "test-secret-key",
    passphrase: "test-passphrase",
    baseUrl: "https://www.okx.com",
    projectId: "test-project-id",
  },
}));

describe("getTokenIndexPrice", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it("should successfully fetch token prices", async () => {
    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "", // ETH
      },
      {
        chainIndex: "1",
        tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7", // USDT
      },
    ];

    const mockResponse = {
      code: "0",
      data: [
        {
          chainIndex: "1",
          tokenAddress: "",
          time: "1716892020000",
          price: "3642.87",
        },
        {
          chainIndex: "1",
          tokenAddress: "0xdac17f958d2ee523a2206206994597c13d831ec7",
          time: "1716892020000",
          price: "1.00",
        },
      ],
      msg: "",
    };

    nock("https://www.okx.com")
      .post("/api/v5/wallet/token/current-price")
      .reply(200, mockResponse);

    const result = await getTokenIndexPrice(tokenRequests);
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle API error responses", async () => {
    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "",
      },
    ];

    const mockResponse = {
      code: "50026",
      data: [],
      msg: "System error. Try again later",
    };

    nock("https://www.okx.com")
      .post("/api/v5/wallet/token/current-price")
      .reply(200, mockResponse);

    await expect(getTokenIndexPrice(tokenRequests)).rejects.toThrow(
      "API Error: System error. Try again later"
    );
  });

  it("should handle network errors", async () => {
    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "",
      },
    ];

    nock("https://www.okx.com")
      .post("/api/v5/wallet/token/current-price")
      .replyWithError("Network error");

    await expect(getTokenIndexPrice(tokenRequests)).rejects.toThrow(
      "Failed to get token index prices"
    );
  });

  it("should enforce maximum token request limit", async () => {
    const tokenRequests = new Array(101).fill({
      chainIndex: "1",
      tokenAddress: "",
    });

    await expect(getTokenIndexPrice(tokenRequests)).rejects.toThrow(
      "Maximum 100 token requests allowed"
    );
  });
});
