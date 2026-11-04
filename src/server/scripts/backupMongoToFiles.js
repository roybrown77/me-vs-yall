/**
 * Standalone Mongo backup — dedicated connection, no socket read timeout.
 *
 *   npm run backup:mongo
 */
const { backupDataToFiles } = require("../utilities/backupDataToFiles");

const main = async () => {
  const result = await backupDataToFiles({ force: true });
  console.log("[backupData] done:", result?.dir);
};

main().catch((err) => {
  console.error("[backupData] failed:", err.message || err);
  process.exitCode = 1;
});
