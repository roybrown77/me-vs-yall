const assert = require("node:assert/strict");
const { test } = require("node:test");
const { EJSON } = require("bson");
const mongoose = require("mongoose");

const { serializeBackupLine } = require("../backupDataToFiles");

test("serializeBackupLine emits mongoimport-friendly extended JSON", () => {
  const id = new mongoose.Types.ObjectId("507f1f77bcf86cd799439011");
  const line = serializeBackupLine({ _id: id, name: "test" }).trim();
  const parsed = EJSON.parse(line);
  assert.equal(String(parsed._id), String(id));
  assert.equal(parsed.name, "test");
});
