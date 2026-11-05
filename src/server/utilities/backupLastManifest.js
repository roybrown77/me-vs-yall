const fs = require("fs");
const path = require("path");
const moment = require("moment-timezone");

const defaultBackupRoot = () =>
  path.join(process.cwd(), "backups", "mongo");

/** Latest manifest `exportedAt` under backup root, or null. */
const findLatestBackupExportedAt = async (rootDir = defaultBackupRoot()) => {
  let entries;
  try {
    entries = await fs.promises.readdir(rootDir, { withFileTypes: true });
  } catch {
    return null;
  }

  let latest = null;
  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }
    const manifestPath = path.join(rootDir, entry.name, "manifest.json");
    try {
      const raw = await fs.promises.readFile(manifestPath, "utf8");
      const manifest = JSON.parse(raw);
      const at = manifest.exportedAt ? new Date(manifest.exportedAt) : null;
      if (at && !Number.isNaN(at.getTime()) && (!latest || at > latest)) {
        latest = at;
      }
    } catch {
      // skip folders without a readable manifest
    }
  }
  return latest;
};

/**
 * Inclusive calendar-day lower bound (America/New_York) from last backup instant.
 */
const sinceDateFromLastBackup = (exportedAt, timeZone = "America/New_York") =>
  moment(exportedAt).tz(timeZone).startOf("day").toDate();

const resolveIncrementalSinceDate = async (options = {}) => {
  if (options.sinceDate) {
    return new Date(options.sinceDate);
  }
  if (process.env.BACKUP_SINCE_DATE) {
    const parsed = moment.tz(
      process.env.BACKUP_SINCE_DATE,
      "YYYY-MM-DD",
      "America/New_York"
    );
    if (!parsed.isValid()) {
      throw new Error(
        `Invalid BACKUP_SINCE_DATE "${process.env.BACKUP_SINCE_DATE}" (use YYYY-MM-DD)`
      );
    }
    return parsed.startOf("day").toDate();
  }

  const root = options.rootDir || defaultBackupRoot();
  const latest = await findLatestBackupExportedAt(root);
  if (!latest) {
    throw new Error(
      `No backup manifest found under ${root}. Run npm run backup:mongo first, or set BACKUP_SINCE_DATE=YYYY-MM-DD.`
    );
  }

  return sinceDateFromLastBackup(latest);
};

module.exports = {
  defaultBackupRoot,
  findLatestBackupExportedAt,
  sinceDateFromLastBackup,
  resolveIncrementalSinceDate,
};
