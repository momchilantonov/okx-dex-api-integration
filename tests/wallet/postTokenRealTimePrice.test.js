const nock = require("nock");
const {
  postTokenRealTimePrice,
} = require("../../src/api/wallet/postTokenRealTimePrice");

// Mock configuration
jest.mock("../../src/config/config", () => ({
  config: {
    apiKey: "test-api-key",
    secretKey: "test-secret-key",
    passphrase: "test-passphrase",
    baseUrl: "https://www.okx.com",
    projectId: "test-project-id",
  },
}));

describe("postTokenRealTimePrice", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it("should successfully fetch token prices", async () => {
    const mockResponse = {
      code: "0",
      data: [
        {
          chainIndex: "1",
          tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
          time: "1716892020000",
          price: "26.458143090226812",
        },
      ],
      msg: "",
    };

    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      },
    ];

    nock("https://www.okx.com")
      .post("/api/v5/wallet/token/real-time-price")
      .reply(200, mockResponse);

    const result = await postTokenRealTimePrice(tokenRequests);
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle API error responses", async () => {
    const mockResponse = {
      code: "50026",
      data: [],
      msg: "System error. Try again later",
    };

    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      },
    ];

    nock("https://www.okx.com")
      .post("/api/v5/wallet/token/real-time-price")
      .reply(200, mockResponse);

    await expect(postTokenRealTimePrice(tokenRequests)).rejects.toThrow(
      "API Error: System error. Try again later"
    );
  });

  it("should handle network errors", async () => {
    const tokenRequests = [
      {
        chainIndex: "1",
        tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
      },
    ];

    nock("https://www.okx.com")
      .post("/api/v5/wallet/token/real-time-price")
      .replyWithError("Network error");

    await expect(postTokenRealTimePrice(tokenRequests)).rejects.toThrow(
      "Failed to get token index prices"
    );
  });

  it("should enforce maximum token request limit", async () => {
    const tokenRequests = new Array(101).fill({
      chainIndex: "1",
      tokenAddress: "0x6982508145454ce325ddbe47a25d4ec3d2311933",
    });

    await expect(postTokenRealTimePrice(tokenRequests)).rejects.toThrow(
      "Maximum 100 token requests allowed"
    );
  });
});
