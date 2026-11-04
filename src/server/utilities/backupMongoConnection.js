const mongoose = require("mongoose");
const { dbConnectionString } = require("../../../config");

/** Long-running cursors; avoid inheriting app socketTimeoutMS (45s). */
const BACKUP_MONGO_OPTIONS = {
  autoIndex: false,
  family: 4,
  maxPoolSize: 1,
  minPoolSize: 1,
  serverSelectionTimeoutMS: 120_000,
  connectTimeoutMS: 120_000,
  socketTimeoutMS: 0,
};

let backupConnection = null;

const openBackupMongoConnection = async () => {
  if (backupConnection?.readyState === 1) {
    return backupConnection;
  }

  if (!dbConnectionString) {
    throw new Error("Missing DB_CONNECTION_STRING for backup");
  }

  backupConnection = mongoose.createConnection(
    dbConnectionString,
    BACKUP_MONGO_OPTIONS
  );
  await backupConnection.asPromise();
  return backupConnection;
};

const closeBackupMongoConnection = async () => {
  if (!backupConnection) {
    return;
  }
  const conn = backupConnection;
  backupConnection = null;
  await conn.close();
};

module.exports = {
  openBackupMongoConnection,
  closeBackupMongoConnection,
  BACKUP_MONGO_OPTIONS,
};
