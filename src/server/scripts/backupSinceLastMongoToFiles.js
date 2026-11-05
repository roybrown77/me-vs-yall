/**
 * NFL incremental backup since last full/incremental manifest date (inclusive, ET).
 *
 *   npm run backup-since-last:mongo
 */
const {
  backupSinceLastMongoToFiles,
} = require("../utilities/backupSinceLastMongoToFiles");

const main = async () => {
  const result = await backupSinceLastMongoToFiles();
  console.log("[backupData] done:", result.dir);
};

main().catch((err) => {
  console.error("[backupData] failed:", err.message || err);
  process.exitCode = 1;
});
