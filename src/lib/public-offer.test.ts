import { describe, expect, test } from "bun:test";
import { FREE_START_PATH, INPUT_LIMIT_MINUTES, PROJECT_RETENTION_HOURS, SUPPORT_EMAIL } from "./public-offer";

describe("Clipra's public offer", () => {
  test("Free input limit is 30 minutes", () => expect(INPUT_LIMIT_MINUTES.free).toBe(30));
  test("Starter input limit is 60 minutes", () => expect(INPUT_LIMIT_MINUTES.starter).toBe(60));
  test("Creator input limit is 120 minutes", () => expect(INPUT_LIMIT_MINUTES.creator).toBe(120));
  test("Projects last 24 hours on all plans", () => expect(PROJECT_RETENTION_HOURS).toBe(24));
  test("Contact destination is the support inbox", () => expect(SUPPORT_EMAIL).toBe("support@theclipra.com"));
  test("New visitors start at signup", () => expect(FREE_START_PATH).toBe("/signup"));
});