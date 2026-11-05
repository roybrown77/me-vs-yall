const assert = require("node:assert/strict");
const { test } = require("node:test");
const moment = require("moment-timezone");

const {
  NFL_LEAGUE_ID,
  buildNflIncrementalQueries,
} = require("../nflIncrementalBackupQueries");
const { sinceDateFromLastBackup } = require("../backupLastManifest");

test("buildNflIncrementalQueries scopes NFL league and since date", () => {
  const since = new Date("2026-11-04T05:00:00.000Z");
  const q = buildNflIncrementalQueries(since);
  assert.equal(q.leagueId.toString(), NFL_LEAGUE_ID);
  assert.equal(q.games.leagueId.toString(), NFL_LEAGUE_ID);
  assert.deepEqual(q.games.$or[0], { startDateTime: { $gte: since } });
  assert.ok(q.picks.$or.some((clause) => clause.createDateTime));
});

test("sinceDateFromLastBackup uses start of ET day inclusive", () => {
  const exportedAt = new Date("2026-11-04T21:29:44.000Z");
  const since = sinceDateFromLastBackup(exportedAt);
  assert.equal(
    moment(since).tz("America/New_York").format("YYYY-MM-DD HH:mm"),
    "2026-11-04 00:00"
  );
});
