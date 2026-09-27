import { describe, it, expect, vi } from "vitest";
import userReducer, { updateName, fetchAddress } from "./userSlice";

describe("userSlice", () => {
  const initialState = {
    username: "",
    status: "idle" as const,
    position: null,
    address: "",
    error: "",
  };

  describe("reducers", () => {
    it("should update username", () => {
      const state = userReducer(initialState, updateName("Test User"));
      expect(state.username).toBe("Test User");
    });
  });

  describe("fetchAddress thunk", () => {
    it("should set status to loading when pending", () => {
      const state = userReducer(
        initialState,
        fetchAddress.pending("", undefined),
      );
      expect(state.status).toBe("loading");
    });

    it("should update position and address when fulfilled", () => {
      const payload = {
        position: { latitude: 10, longitude: 20 },
        address: "Test Address",
      };
      const state = userReducer(
        initialState,
        fetchAddress.fulfilled(payload, "", undefined),
      );
      expect(state.status).toBe("idle");
      expect(state.position).toEqual({ latitude: 10, longitude: 20 });
      expect(state.address).toBe("Test Address");
      expect(state.error).toBe("");
    });

    it("should set error when rejected with payload", () => {
      const state = userReducer(
        initialState,
        fetchAddress.rejected(
          new Error("test"),
          "",
          undefined,
          "Permission denied",
        ),
      );
      expect(state.status).toBe("error");
      expect(state.error).toBe("Permission denied");
    });

    it("should set default error when rejected without payload", () => {
      const state = userReducer(
        initialState,
        fetchAddress.rejected(new Error("test"), "", undefined, undefined),
      );
      expect(state.status).toBe("error");
      expect(state.error).toBe(
        "There was a problem getting your address. Make sure to fill this field!",
      );
    });
  });

  describe("fetchAddress async thunk - geolocation errors", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("should handle PERMISSION_DENIED error", async () => {
      const geolocationError = new Error(
        "Permission denied",
      ) as GeolocationPositionError;
      Object.defineProperty(geolocationError, "code", {
        value: 1,
        writable: true,
      });
      Object.defineProperty(geolocationError, "PERMISSION_DENIED", {
        value: 1,
        writable: true,
      });

      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, reject) => reject(geolocationError)),
      };
      vi.stubGlobal("navigator", { geolocation: mockGeolocation });
      global.fetch = vi.fn();

      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({ user: initialState });

      const thunk = fetchAddress();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.payload).toBe("Please enable location access");
      expect(result.meta.rejectedWithValue).toBe(true);
    });

    it("should handle TIMEOUT error", async () => {
      const geolocationError = new Error("Timeout") as GeolocationPositionError;
      Object.defineProperty(geolocationError, "code", {
        value: 3,
        writable: true,
      });
      Object.defineProperty(geolocationError, "TIMEOUT", {
        value: 3,
        writable: true,
      });

      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, reject) => reject(geolocationError)),
      };
      vi.stubGlobal("navigator", { geolocation: mockGeolocation });
      global.fetch = vi.fn();

      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({ user: initialState });

      const thunk = fetchAddress();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.payload).toBe("Location request timed out");
      expect(result.meta.rejectedWithValue).toBe(true);
    });

    it("should handle unknown geolocation error code (default case)", async () => {
      const geolocationError = new Error(
        "Unknown error",
      ) as GeolocationPositionError;
      Object.defineProperty(geolocationError, "code", {
        value: 999,
        writable: true,
      });

      const mockGeolocation = {
        getCurrentPosition: vi.fn((_, reject) => reject(geolocationError)),
      };
      vi.stubGlobal("navigator", { geolocation: mockGeolocation });
      global.fetch = vi.fn();

      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({ user: initialState });

      const thunk = fetchAddress();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.payload).toBe("Failed to get your location");
      expect(result.meta.rejectedWithValue).toBe(true);
    });

    it("should handle successful geolocation and address fetch", async () => {
      const mockPositionObj = {
        coords: { latitude: 40.7128, longitude: -74.006 },
      };

      const mockGeolocation = {
        getCurrentPosition: vi.fn((resolve) => resolve(mockPositionObj)),
      };
      vi.stubGlobal("navigator", { geolocation: mockGeolocation });

      const mockAddressResponse = {
        locality: "Manhattan",
        city: "New York",
        postcode: "10001",
        countryName: "United States",
      };
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: () => Promise.resolve(mockAddressResponse),
      });

      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({ user: initialState });

      const thunk = fetchAddress();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.payload).toEqual({
        position: { latitude: 40.7128, longitude: -74.006 },
        address: "Manhattan, New York 10001, United States",
      });
      expect(result.meta.requestStatus).toBe("fulfilled");
    });

    it("should handle geocoding API failure as rejected action", async () => {
      const mockPositionObj = {
        coords: { latitude: 40.7128, longitude: -74.006 },
      };

      const mockGeolocation = {
        getCurrentPosition: vi.fn((resolve) => resolve(mockPositionObj)),
      };
      vi.stubGlobal("navigator", { geolocation: mockGeolocation });

      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        statusText: "Internal Server Error",
      });

      const dispatch = vi.fn();
      const getState = vi.fn().mockReturnValue({ user: initialState });

      const thunk = fetchAddress();
      const result = await thunk(dispatch, getState, undefined);

      expect(result.meta.requestStatus).toBe("rejected");
      expect(result.error.message).toBe(
        "Geocoding failed: Failed getting address: 500 Internal Server Error",
      );
      expect(result.meta.rejectedWithValue).toBe(false);
    });
  });
});
