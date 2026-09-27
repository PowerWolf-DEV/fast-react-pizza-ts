import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getAddress } from "./apiGeocoding";
import type { Position } from "./apiGeocoding";

const mockPosition: Position = {
  latitude: 40.7128,
  longitude: -74.006,
};

const mockAddressResponse = {
  locality: "Manhattan",
  city: "New York",
  postcode: "10001",
  countryName: "United States",
};

describe("apiGeocoding", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  describe("getAddress", () => {
    it("fetches and returns address data", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAddressResponse),
      });

      const result = await getAddress(mockPosition);

      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining("bigdatacloud.net"),
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`latitude=${mockPosition.latitude}`),
      );
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining(`longitude=${mockPosition.longitude}`),
      );
      expect(result).toEqual(mockAddressResponse);
    });

    it("throws error when response is not ok", async () => {
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      await expect(getAddress(mockPosition)).rejects.toThrow(
        "Failed getting address: 500 Internal Server Error",
      );
    });

    it("handles partial address response (optional fields)", async () => {
      const partialResponse = {
        city: "New York",
        countryName: "United States",
        // locality and postcode are optional/missing
      };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(partialResponse),
      });

      const result = await getAddress(mockPosition);
      expect(result).toEqual(partialResponse);
    });

    it("propagates network errors", async () => {
      const networkError = new Error("Network error");
      global.fetch = vi.fn().mockRejectedValue(networkError);

      await expect(getAddress(mockPosition)).rejects.toThrow(
        "Geocoding failed: Network error",
      );
    });
  });
});
