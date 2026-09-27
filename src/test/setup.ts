import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

interface GeolocationPositionErrorConstructor {
  new (message: string, code: number): GeolocationPositionError;
  readonly PERMISSION_DENIED: 1;
  readonly POSITION_UNAVAILABLE: 2;
  readonly TIMEOUT: 3;
}

if (typeof GeolocationPositionError === 'undefined') {
  class GeolocationPositionErrorPolyfill extends Error {
    static readonly PERMISSION_DENIED = 1;
    static readonly POSITION_UNAVAILABLE = 2;
    static readonly TIMEOUT = 3;
    code: number;
    constructor(message: string, code: number) {
      super(message);
      this.name = 'GeolocationPositionError';
      this.code = code;
    }
  }
  global.GeolocationPositionError = GeolocationPositionErrorPolyfill as GeolocationPositionErrorConstructor;
}

afterEach(() => {
  cleanup();
});