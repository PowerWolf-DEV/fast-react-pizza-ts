import "@testing-library/jest-dom";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

if (typeof GeolocationPositionError === "undefined") {
  class GeolocationPositionErrorPolyfill extends Error {
    code: number;
    constructor(message?: string, code?: number) {
      super(message);
      this.name = "GeolocationPositionError";
      this.code = code ?? 0;
    }
  }

  Object.defineProperty(GeolocationPositionErrorPolyfill, "PERMISSION_DENIED", {
    value: 1,
    writable: false,
    enumerable: false,
    configurable: false,
  });
  Object.defineProperty(
    GeolocationPositionErrorPolyfill,
    "POSITION_UNAVAILABLE",
    {
      value: 2,
      writable: false,
      enumerable: false,
      configurable: false,
    },
  );
  Object.defineProperty(GeolocationPositionErrorPolyfill, "TIMEOUT", {
    value: 3,
    writable: false,
    enumerable: false,
    configurable: false,
  });

  global.GeolocationPositionError = GeolocationPositionErrorPolyfill;
}

afterEach(() => {
  cleanup();
});
