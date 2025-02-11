const { createSignature } = require("../src/auth/signature");
const { config } = require("../src/config/config");

// Mock config
jest.mock("../src/config/config", () => ({
  config: {
    secretKey: "test-secret-key",
  },
}));

describe("Signature Generation", () => {
  // Use fixed timestamp for consistent testing
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2025-01-01T00:00:00.000Z"));
  });

  // Restore real timers after each test
  afterEach(() => {
    jest.useRealTimers();
  });

  it("should create signature for GET request without params", () => {
    const { signature, timestamp } = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      null
    );

    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
    expect(signature.length).toBeGreaterThan(0);
    expect(timestamp).toBe("2025-01-01T00:00:00.000Z");
  });

  it("should create signature for GET request with params", () => {
    const params = {
      chainId: "1",
      limit: "100",
    };

    const { signature, timestamp } = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    );

    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
    expect(signature.length).toBeGreaterThan(0);
    expect(timestamp).toBe("2025-01-01T00:00:00.000Z");
  });

  it("should create signature for POST request with body", () => {
    const body = {
      chainId: "1",
      amount: "1000000",
    };

    const { signature, timestamp } = createSignature(
      "POST",
      "/api/v5/dex/aggregator/swap",
      body
    );

    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
    expect(signature.length).toBeGreaterThan(0);
    expect(timestamp).toBe("2025-01-01T00:00:00.000Z");
  });

  it("should create different signatures for different methods", () => {
    const params = { chainId: "1" };

    const getSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    const postSignature = createSignature(
      "POST",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    expect(getSignature).not.toBe(postSignature);
  });

  it("should create different signatures for different paths", () => {
    const params = { chainId: "1" };

    const tokensSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    const swapSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/swap",
      params
    ).signature;

    expect(tokensSignature).not.toBe(swapSignature);
  });

  it("should create different signatures for different timestamps", () => {
    const params = { chainId: "1" };

    const firstSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    // Move time forward
    jest.setSystemTime(new Date("2025-01-01T00:01:00.000Z"));

    const secondSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    expect(firstSignature).not.toBe(secondSignature);
  });

  it("should create consistent signatures for same inputs", () => {
    const params = { chainId: "1" };

    const firstSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    const secondSignature = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      params
    ).signature;

    expect(firstSignature).toBe(secondSignature);
  });

  it("should handle empty params", () => {
    const { signature, timestamp } = createSignature(
      "GET",
      "/api/v5/dex/aggregator/tokens",
      {}
    );

    expect(signature).toBeDefined();
    expect(typeof signature).toBe("string");
    expect(signature.length).toBeGreaterThan(0);
    expect(timestamp).toBe("2025-01-01T00:00:00.000Z");
  });
});
