import { test } from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_CAR_MODEL,
  normalizeCarModel,
} from "../carModel.js";
test("normalizeCarModel accepts known ids and falls back to Tuff Truck", () => {
  assert.equal(DEFAULT_CAR_MODEL, "truck");
  assert.equal(normalizeCarModel("suv"), "suv");
  assert.equal(normalizeCarModel("truck"), "truck");
  assert.equal(normalizeCarModel("unknown"), DEFAULT_CAR_MODEL);
  assert.equal(normalizeCarModel(null), DEFAULT_CAR_MODEL);
});
