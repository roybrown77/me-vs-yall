const moment = require('moment-timezone');

const EASTERN = 'America/New_York';

const getEastCoastDateKey = (date = new Date()) =>
  moment(date).tz(EASTERN).format('YYYY-MM-DD');

const spreadSnapshotKey = (entry) =>
  `${String(entry?.teamId ?? '')}:${Number(entry?.amount ?? 0)}`;

const upsertSpreadHistory = (history = [], spread) => {
  if (!spread || spread.teamId == null) {
    return Array.isArray(history) ? [...history] : [];
  }

  const date = getEastCoastDateKey(new Date());
  const entry = {
    date,
    teamId: String(spread.teamId),
    amount: Number(spread.amount) || 0,
  };

  const list = Array.isArray(history) ? history.filter((row) => row?.date !== date) : [];
  list.push(entry);
  list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return list;
};

const upsertOverUnderHistory = (history = [], overUnder) => {
  const parsed = Number(overUnder);
  if (!Number.isFinite(parsed)) {
    return Array.isArray(history) ? [...history] : [];
  }

  const date = getEastCoastDateKey(new Date());
  const entry = { date, value: parsed };

  const list = Array.isArray(history) ? history.filter((row) => row?.date !== date) : [];
  list.push(entry);
  list.sort((a, b) => String(a.date).localeCompare(String(b.date)));
  return list;
};

const spreadHistoryHasMovement = (history = []) => {
  if (!Array.isArray(history) || history.length < 2) {
    return false;
  }
  const keys = new Set(history.map(spreadSnapshotKey));
  return keys.size > 1;
};

const overUnderHistoryHasMovement = (history = []) => {
  if (!Array.isArray(history) || history.length < 2) {
    return false;
  }
  const values = new Set(history.map((row) => Number(row?.value)));
  return values.size > 1;
};

module.exports = {
  EASTERN,
  getEastCoastDateKey,
  spreadSnapshotKey,
  upsertSpreadHistory,
  upsertOverUnderHistory,
  spreadHistoryHasMovement,
  overUnderHistoryHasMovement,
};
