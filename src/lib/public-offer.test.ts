import { describe, test } from "node:test";
import { strict as assert } from "node:assert";
import { FREE_START_PATH, INPUT_LIMIT_MINUTES, PROJECT_RETENTION_HOURS, SUPPORT_EMAIL } from "./public-offer";

describe("Clipra's public offer", () => {
  test("Free input limit is 30 minutes", () => assert.equal(INPUT_LIMIT_MINUTES.free, 30));
  test("Starter input limit is 60 minutes", () => assert.equal(INPUT_LIMIT_MINUTES.starter, 60));
  test("Creator input limit is 120 minutes", () => assert.equal(INPUT_LIMIT_MINUTES.creator, 120));
  test("Projects last 24 hours on all plans", () => assert.equal(PROJECT_RETENTION_HOURS, 24));
  test("Contact destination is the support inbox", () => assert.equal(SUPPORT_EMAIL, "support@theclipra.com"));
  test("New visitors start at signup", () => assert.equal(FREE_START_PATH, "/signup"));
});