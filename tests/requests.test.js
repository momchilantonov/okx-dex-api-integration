const nock = require("nock");
const { sendGetRequest, sendPostRequest } = require("../src/api/requests");
const { config } = require("../src/config/config");

// Mock config to avoid loading env variables in tests
jest.mock("../src/config/config", () => ({
  config: {
    apiKey: "test-api-key",
    secretKey: "test-secret-key",
    passphrase: "test-passphrase",
    baseUrl: "https://www.okx.com",
  },
}));

describe("API Requests", () => {
  // Clear all HTTP mocks after each test
  afterEach(() => {
    nock.cleanAll();
  });

  describe("sendGetRequest", () => {
    it("should successfully make a GET request", async () => {
      const mockResponse = {
        code: "0",
        data: [{ test: "data" }],
        msg: "",
      };

      nock("https://www.okx.com")
        .get("/api/v5/dex/aggregator/tokens")
        .query(true)
        .reply(200, mockResponse);

      const response = await sendGetRequest("/api/v5/dex/aggregator/tokens", {
        chainId: "1",
      });

      expect(response).toEqual(mockResponse);
    });

    it("should handle GET request errors", async () => {
      nock("https://www.okx.com")
        .get("/api/v5/dex/aggregator/tokens")
        .query(true)
        .replyWithError("Something went wrong");

      await expect(
        sendGetRequest("/api/v5/dex/aggregator/tokens", { chainId: "1" })
      ).rejects.toThrow();
    });

    it("should include correct headers in GET request", async () => {
      let capturedHeaders;

      nock("https://www.okx.com")
        .get("/api/v5/dex/aggregator/tokens")
        .query(true)
        .reply(function () {
          capturedHeaders = this.req.headers;
          return [200, { data: "success" }];
        });

      await sendGetRequest("/api/v5/dex/aggregator/tokens", { chainId: "1" });

      expect(capturedHeaders["ok-access-key"]).toBe("test-api-key");
      expect(capturedHeaders["ok-access-passphrase"]).toBe("test-passphrase");
      expect(capturedHeaders["ok-access-sign"]).toBeDefined();
      expect(capturedHeaders["ok-access-timestamp"]).toBeDefined();
    });
  });

  describe("sendPostRequest", () => {
    it("should successfully make a POST request", async () => {
      const mockResponse = {
        code: "0",
        data: [{ test: "data" }],
        msg: "",
      };

      const requestBody = {
        chainId: "1",
        amount: "1000000",
      };

      nock("https://www.okx.com")
        .post("/api/v5/dex/aggregator/swap")
        .query(requestBody) // Match query parameters
        .reply(200, mockResponse);

      const response = await sendPostRequest(
        "/api/v5/dex/aggregator/swap",
        requestBody
      );
      expect(response).toEqual(mockResponse);
    });

    it("should handle POST request errors", async () => {
      const requestBody = {
        chainId: "1",
        amount: "1000000",
      };

      nock("https://www.okx.com")
        .post("/api/v5/dex/aggregator/swap")
        .query(requestBody) // Match query parameters
        .replyWithError("Something went wrong");

      await expect(
        sendPostRequest("/api/v5/dex/aggregator/swap", requestBody)
      ).rejects.toThrow();
    });

    it("should include correct headers and body in POST request", async () => {
      let capturedHeaders;
      let capturedBody;

      const requestBody = {
        chainId: "1",
        amount: "1000000",
      };

      nock("https://www.okx.com")
        .post("/api/v5/dex/aggregator/swap")
        .query(requestBody) // Match query parameters
        .reply(function (uri, body) {
          capturedHeaders = this.req.headers;
          capturedBody = body;
          return [200, { data: "success" }];
        });

      await sendPostRequest("/api/v5/dex/aggregator/swap", requestBody);

      expect(capturedHeaders["ok-access-key"]).toBe("test-api-key");
      expect(capturedHeaders["ok-access-passphrase"]).toBe("test-passphrase");
      expect(capturedHeaders["ok-access-sign"]).toBeDefined();
      expect(capturedHeaders["ok-access-timestamp"]).toBeDefined();
      expect(capturedHeaders["content-type"]).toBe("application/json");
      expect(capturedBody).toEqual(requestBody);
    });
  });
});
