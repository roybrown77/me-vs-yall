const fs = require("fs");
const path = require("path");
const { finished } = require("stream/promises");

const { EJSON } = require("bson");
const moment = require("moment-timezone");

const gameRepository = require("../game/databaseRepositories/GameRepository");
const gameWeekRepository = require("../game/databaseRepositories/GameWeekRepository");
const pickRepository = require("../pick/PickRepository");
const userRepository = require("../user/UserRepository");

const {
  openBackupMongoConnection,
  closeBackupMongoConnection,
} = require("./backupMongoConnection");

const COLLECTIONS = [
  { name: "games", model: gameRepository },
  { name: "gameweeks", model: gameWeekRepository },
  { name: "picks", model: pickRepository },
  { name: "users", model: userRepository },
];

const defaultBackupRoot = () =>
  path.join(process.cwd(), "backups", "mongo");

/** Canonical Extended JSON line — one document per line for mongoimport. */
const serializeBackupLine = (doc) =>
  `${EJSON.stringify(doc, { relaxed: false })}\n`;

const CURSOR_BATCH_SIZE = 250;
const PROGRESS_EVERY_DOCS =
  Number(process.env.BACKUP_DATA_PROGRESS_EVERY) || 10_000;
const PROGRESS_EVERY_MS =
  Number(process.env.BACKUP_DATA_PROGRESS_MS) || 30_000;
const EXPORT_RETRIES = Number(process.env.BACKUP_DATA_EXPORT_RETRIES) || 2;

const isTransientMongoError = (err) => {
  const name = err?.name || "";
  return (
    name.includes("MongoNetwork") ||
    name.includes("MongoTimeout") ||
    /timed out/i.test(String(err?.message))
  );
};

const exportCollectionToNdjson = async (collection, filePath, { label } = {}) => {
  await fs.promises.mkdir(path.dirname(filePath), { recursive: true });
  const stream = fs.createWriteStream(filePath, { encoding: "utf8" });
  let count = 0;
  let lastProgressAt = Date.now();
  let estimatedTotal = null;

  try {
    try {
      estimatedTotal = await collection.estimatedDocumentCount();
      if (estimatedTotal >= 0) {
        console.log(
          `[backupData] ${label}: ~${estimatedTotal.toLocaleString()} documents (estimate)`
        );
      }
    } catch {
      estimatedTotal = null;
    }

    const cursor = collection.find(
      {},
      { batchSize: CURSOR_BATCH_SIZE, maxTimeMS: 0 }
    );
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
            ? ` / ~${estimatedTotal.toLocaleString()}`
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

const exportCollectionWithRetry = async (collection, filePath, meta) => {
  let lastErr;
  for (let attempt = 1; attempt <= EXPORT_RETRIES; attempt += 1) {
    try {
      return await exportCollectionToNdjson(collection, filePath, meta);
    } catch (err) {
      lastErr = err;
      if (!isTransientMongoError(err) || attempt >= EXPORT_RETRIES) {
        throw err;
      }
      console.warn(
        `[backupData] ${meta.label}: retry ${attempt}/${EXPORT_RETRIES - 1} after ${err.message}`
      );
      await closeBackupMongoConnection();
      await openBackupMongoConnection();
    }
  }
  throw lastErr;
};

let backupInFlight = null;
let backupSucceededThisProcess = false;

const runBackupExport = async (options) => {
  const root =
    options.rootDir || process.env.BACKUP_DATA_DIR || defaultBackupRoot();
  const stamp = moment().tz("America/New_York").format("YYYY-MM-DD_HH-mm-ss");
  const dir = path.join(root, stamp);
  const files = {};

  const conn = await openBackupMongoConnection();

  try {
    console.log(`[backupData] Export started → ${dir}`);

    for (const { name, model } of COLLECTIONS) {
      const filePath = path.join(dir, `${name}.jsonl`);
      const mongoCollection = model.collection.name;
      const collection = conn.db.collection(mongoCollection);
      console.log(`[backupData] ${name}…`);
      const count = await exportCollectionWithRetry(collection, filePath, {
        label: name,
      });
      files[name] = { path: filePath, count, mongoCollection };
      console.log(`[backupData] ${name}: ${count} documents`);
    }

    const manifest = {
      exportedAt: new Date().toISOString(),
      format: "mongoimport-ndjson-extended-json",
      collections: files,
      importExample: Object.entries(files).map(
        ([, meta]) =>
          `mongoimport --uri="$MONGODB_URI" --collection=${meta.mongoCollection} --file="${meta.path}"`
      ),
    };

    await fs.promises.writeFile(
      path.join(dir, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8"
    );

    console.log(
      `[backupData] Wrote ${COLLECTIONS.length} collections to ${dir} (see manifest.json for mongoimport commands)`
    );

    backupSucceededThisProcess = true;
    return { dir, files };
  } finally {
    await closeBackupMongoConnection();
  }
};

/**
 * Writes Mongo collections to NDJSON files (Extended JSON) for mongoimport.
 * @returns {Promise<{ dir: string, files: Record<string, { path: string, count: number }> }>}
 */
const backupDataToFiles = async (options = {}) => {
  if (!options.force && backupSucceededThisProcess) {
    console.log("[backupData] Skipping — backup already completed this process");
    return null;
  }

  if (backupInFlight) {
    return backupInFlight;
  }

  const run = runBackupExport(options);
  backupInFlight = run;

  try {
    return await run;
  } finally {
    if (backupInFlight === run) {
      backupInFlight = null;
    }
  }
};

module.exports = { backupDataToFiles, COLLECTIONS, serializeBackupLine };
