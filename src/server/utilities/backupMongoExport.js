const fs = require("fs");
const path = require("path");
const { finished } = require("stream/promises");

const { EJSON } = require("bson");

const CURSOR_BATCH_SIZE = 250;
const PROGRESS_EVERY_DOCS =
  Number(process.env.BACKUP_DATA_PROGRESS_EVERY) || 10_000;
const PROGRESS_EVERY_MS =
  Number(process.env.BACKUP_DATA_PROGRESS_MS) || 30_000;

const serializeBackupLine = (doc) =>
  `${EJSON.stringify(doc, { relaxed: false })}\n`;

const exportCollectionToNdjson = async (
  collection,
  filePath,
  { label, query = {} } = {}
) => {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
  let count = 0;
  let lastProgressAt = Date.now();
  let estimatedTotal = null;

  try {
    try {
      estimatedTotal = await collection.countDocuments(query);
      console.log(
        `[backupData] ${label}: ${estimatedTotal.toLocaleString()} documents matched`
      );
    } catch {
      estimatedTotal = null;
    }

    const cursor = collection.find(query, {
      batchSize: CURSOR_BATCH_SIZE,
      maxTimeMS: 0,
    });
    for await (const doc of cursor) {
      if (!stream.write(serializeBackupLine(doc))) {
        await new Promise((resolve) => stream.once("drain", resolve));
      }
      count += 1;

      const now = Date.now();
      const docMilestone = count % PROGRESS_EVERY_DOCS === 0;
      const timeMilestone = now - lastProgressAt >= PROGRESS_EVERY_MS;
      if (docMilestone || (count > 0 && timeMilestone)) {
        lastProgressAt = now;
        const totalHint =
          estimatedTotal != null
            ? ` / ${estimatedTotal.toLocaleString()}`
            : "";
        console.log(
          `[backupData] ${label}: ${count.toLocaleString()}${totalHint} written…`
        );
      }
    }
    stream.end();
    await finished(stream);
    return count;
  } catch (err) {
    stream.destroy();
    try {
      await fs.promises.unlink(filePath);
    } catch {
      // ignore partial file cleanup errors
    }
    throw err;
  }
};

module.exports = {
  exportCollectionToNdjson,
  serializeBackupLine,
  CURSOR_BATCH_SIZE,
};
