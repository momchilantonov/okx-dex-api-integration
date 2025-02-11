const nock = require("nock");
const {
  getSupportedChains,
} = require("../../src/api/wallet/getSupportedChains");

// Mock configuration
jest.mock("../../src/config/config", () => ({
  config: {
    apiKey: "test-api-key",
    secretKey: "test-secret-key",
    passphrase: "test-passphrase",
    projectId: "test-project-id",
    baseUrl: "https://www.okx.com",
  },
}));

describe("getSupportedChains", () => {
  beforeEach(() => {
    nock.cleanAll();
  });

  it("should successfully fetch supported chains", async () => {
    const mockResponse = {
      code: "0",
      data: [
        {
          name: "Ethereum",
          logoUrl: "http://www.eth.org/eth.png",
          shortName: "ETH",
          chainIndex: "1",
        },
      ],
      msg: "",
    };

    nock("https://www.okx.com")
      .get("/api/v5/wallet/chain/supported-chains")
      .reply(200, mockResponse);

    const result = await getSupportedChains();
    expect(result).toEqual(mockResponse.data);
  });

  it("should handle API error responses", async () => {
    const mockResponse = {
      code: "50026",
      data: [],
      msg: "System error. Try again later",
    };

    nock("https://www.okx.com")
      .get("/api/v5/wallet/chain/supported-chains")
      .reply(200, mockResponse);

    await expect(getSupportedChains()).rejects.toThrow(
      "API Error: System error. Try again later"
    );
  });

  it("should handle network errors", async () => {
    nock("https://www.okx.com")
      .get("/api/v5/wallet/chain/supported-chains")
      .replyWithError("Network error");

    await expect(getSupportedChains()).rejects.toThrow(
      "Failed to get supported chains"
    );
  });
});
