import { describe, it, expect } from "vitest";
import { formatCurrency, formatDate, calcMinutesLeft } from "./helpers";

describe("helpers", () => {
  describe("formatCurrency", () => {
    it("formats number as EUR currency", () => {
      expect(formatCurrency(10)).toBe("€10.00");
      expect(formatCurrency(10.5)).toBe("€10.50");
      expect(formatCurrency(0)).toBe("€0.00");
    });
  });

  describe("formatDate", () => {
    it("formats date string to locale string", () => {
      const dateStr = "2024-01-15T14:30:00.000Z";
      const result = formatDate(dateStr);
      expect(result).toContain("Jan");
      expect(result).toContain("15");
      expect(result).toContain("30");
    });
  });

  describe("calcMinutesLeft", () => {
    it("calculates minutes between now and future date", () => {
      const futureDate = new Date(Date.now() + 5 * 60 * 1000).toISOString();
      const minutes = calcMinutesLeft(futureDate);
      expect(minutes).toBeGreaterThanOrEqual(4);
      expect(minutes).toBeLessThanOrEqual(6);
    });

    it("returns negative for past date", () => {
      const pastDate = new Date(Date.now() - 5 * 60 * 1000).toISOString();
      const minutes = calcMinutesLeft(pastDate);
      expect(minutes).toBeLessThan(0);
    });
  });
});
