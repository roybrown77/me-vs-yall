import assert from "node:assert/strict";
import { test } from "node:test";

import { pickRandomStadiumBlurb } from "../pickRandomStadiumBlurb.js";

test("returns null for empty locations", () => {
  assert.equal(pickRandomStadiumBlurb([]), null);
  assert.equal(pickRandomStadiumBlurb(null), null);
});

test("returns the only line when length is 1", () => {
  assert.equal(pickRandomStadiumBlurb(["Only line"]), "Only line");
});

test("picks from the array using rng", () => {
  const lines = ["a", "b", "c"];
  assert.equal(pickRandomStadiumBlurb(lines, () => 0), "a");
  assert.equal(pickRandomStadiumBlurb(lines, () => 0.99), "c");
});
