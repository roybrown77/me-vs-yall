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
const { exportCollectionToNdjson } = require("./backupMongoExport");
const {
  defaultBackupRoot,
  resolveIncrementalSinceDate,
} = require("./backupLastManifest");
const {
  NFL_LEAGUE_ID,
  buildNflIncrementalQueries,
} = require("./nflIncrementalBackupQueries");

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

const backupSinceLastMongoToFiles = async (options = {}) => {
  const root =
    options.rootDir || process.env.BACKUP_DATA_DIR || defaultBackupRoot();
  const sinceDate = await resolveIncrementalSinceDate({ rootDir: root, ...options });
  const queries = buildNflIncrementalQueries(sinceDate);
  const stamp = moment().tz("America/New_York").format("YYYY-MM-DD_HH-mm-ss");
  const dir = path.join(root, `nfl-incremental_${stamp}`);
  const files = {};

  const conn = await openBackupMongoConnection();

  try {
    console.log(
      `[backupData] NFL incremental export → ${dir}\n` +
        `[backupData] leagueId=${NFL_LEAGUE_ID} since=${moment(sinceDate).tz("America/New_York").format("YYYY-MM-DD")} (inclusive, ET)`
    );

    const steps = [
      {
        name: "gameweeks",
        model: gameWeekRepository,
        query: queries.gameweeks,
      },
      { name: "games", model: gameRepository, query: queries.games },
      { name: "picks", model: pickRepository, query: queries.picks },
    ];

    for (const { name, model, query } of steps) {
      const filePath = path.join(dir, `${name}.jsonl`);
      const mongoCollection = model.collection.name;
      const collection = conn.db.collection(mongoCollection);
      console.log(`[backupData] ${name}…`);
      const count = await exportCollectionWithRetry(collection, filePath, {
        label: name,
        query,
      });
      files[name] = { path: filePath, count, mongoCollection, query };
      console.log(`[backupData] ${name}: ${count} documents`);
    }

    const picksColl = conn.db.collection(pickRepository.collection.name);
    const userIds = await picksColl.distinct("userId", queries.picks);
    const usersColl = conn.db.collection(userRepository.collection.name);
    const usersQuery =
      userIds.length > 0 ? { authServiceId: { $in: userIds } } : { _id: null };
    const usersPath = path.join(dir, "users.jsonl");
    console.log(`[backupData] users… (${userIds.length} pickers)`);
    const userCount = await exportCollectionWithRetry(usersColl, usersPath, {
      label: "users",
      query: usersQuery,
    });
    files.users = {
      path: usersPath,
      count: userCount,
      mongoCollection: userRepository.collection.name,
      query: usersQuery,
    };
    console.log(`[backupData] users: ${userCount} documents`);

    const manifest = {
      exportedAt: new Date().toISOString(),
      format: "mongoimport-ndjson-extended-json",
      incremental: true,
      leagueId: NFL_LEAGUE_ID,
      sinceDateInclusive: sinceDate.toISOString(),
      sinceDateLabelET: moment(sinceDate)
        .tz("America/New_York")
        .format("YYYY-MM-DD"),
      collections: files,
      importExample: Object.entries(files).map(
        ([, meta]) =>
          `mongoimport --uri="$MONGODB_URI" --collection=${meta.mongoCollection} --file="${meta.path}" --mode=upsert`
      ),
    };

    await fs.promises.writeFile(
      path.join(dir, "manifest.json"),
      `${JSON.stringify(manifest, null, 2)}\n`,
      "utf8"
    );

    console.log(
      `[backupData] Wrote NFL incremental backup to ${dir} (manifest.json)`
    );

    return { dir, files, sinceDate, leagueId: NFL_LEAGUE_ID };
  } finally {
    await closeBackupMongoConnection();
  }
};

module.exports = { backupSinceLastMongoToFiles };
