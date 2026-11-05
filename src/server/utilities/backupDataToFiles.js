const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const gameRepository = require("../game/databaseRepositories/GameRepository");
const gameWeekRepository = require("../game/databaseRepositories/GameWeekRepository");
const pickRepository = require("../pick/PickRepository");
const userRepository = require("../user/UserRepository");

const {
  openBackupMongoConnection,
  closeBackupMongoConnection,
} = require("./backupMongoConnection");
const { exportCollectionToNdjson, serializeBackupLine } = require("./backupMongoExport");
const { defaultBackupRoot } = require("./backupLastManifest");

const COLLECTIONS = [
  { name: "games", model: gameRepository },
  { name: "gameweeks", model: gameWeekRepository },
  { name: "picks", model: pickRepository },
  { name: "users", model: userRepository },
];

const EXPORT_RETRIES = Number(process.env.BACKUP_DATA_EXPORT_RETRIES) || 2;

const isTransientMongoError = (err) => {
  const name = err?.name || "";
  return (
    name.includes("MongoNetwork") ||
    name.includes("MongoTimeout") ||
    /timed out/i.test(String(err?.message))
  );
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
        query: {},
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
