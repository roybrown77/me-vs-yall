const test = require('node:test');
const assert = require('node:assert/strict');

const {
  filterDbGamesForGameWeek,
  filterDbGamesForScoreboardWeek,
  reconcileScoreboardGameCounts,
} = require('../scoreboardGameCountCheck');

const kcId = '19823783734d1d04a1b39001';
const seaId = '19823783734d1d04a1b3901f';

test('filterDbGamesForScoreboardWeek keeps games near scoreboard kickoffs', () => {
  const kickoffTimesMs = [new Date('2026-10-25T17:00:00.000Z').getTime()];
  const dbGames = [
    { startDateTime: new Date('2026-10-25T20:20:00.000Z') },
    { startDateTime: new Date('2026-11-08T18:00:00.000Z') },
  ];

  const filtered = filterDbGamesForScoreboardWeek(dbGames, kickoffTimesMs);
  assert.equal(filtered.length, 1);
});

test('reconcileScoreboardGameCounts passes when scrape and db counts align', () => {
  const kickoff = new Date('2026-10-26T00:20:00.000Z');
  const scraped = {
    game: [
      { teamDetails: { _id: kcId, location: 'Kansas City', name: 'Chiefs' } },
      { teamDetails: { _id: seaId, location: 'Seattle', name: 'Seahawks' } },
    ],
  };
  const dbGame = {
    startDateTime: kickoff,
    competitors: [
      { _id: kcId, name: 'Kansas City Chiefs' },
      { _id: seaId, name: 'Seattle Seahawks' },
    ],
  };

  const result = reconcileScoreboardGameCounts({
    results: [scraped],
    dbGames: [dbGame],
    events: [{ startDateTime: kickoff }],
    resolveScrapedKickoff: () => kickoff,
  });

  assert.equal(result.ok, true);
  assert.equal(result.scrapedCount, 1);
  assert.equal(result.dbCount, 1);
});

test('reconcileScoreboardGameCounts matches live/final scrape when kickoff day keys differ', () => {
  const dbKickoff = new Date('2026-10-26T00:20:00.000Z');
  const apiKickoff = new Date('2026-10-25T17:00:00.000Z');
  const scraped = {
    isPreGame: false,
    currentTime: 'Final',
    game: [
      { teamDetails: { _id: kcId, location: 'Kansas City', name: 'Chiefs' } },
      { teamDetails: { _id: seaId, location: 'Seattle', name: 'Seahawks' } },
    ],
    apiKickoff,
  };
  const dbGame = {
    startDateTime: dbKickoff,
    competitors: [
      { _id: kcId, name: 'Kansas City Chiefs' },
      { _id: seaId, name: 'Seattle Seahawks' },
    ],
  };

  const result = reconcileScoreboardGameCounts({
    results: [scraped],
    dbGames: [dbGame],
    events: [{ startDateTime: apiKickoff }],
    resolveScrapedKickoff: () => null,
  });

  assert.equal(result.ok, true);
  assert.equal(result.missingInDb.length, 0);
  assert.equal(result.extraInDb.length, 0);
});

test('filterDbGamesForScoreboardWeek excludes games outside kickoff window even with same competitors', () => {
  const kickoffTimesMs = [new Date('2026-10-25T17:00:00.000Z').getTime()];
  const dbGames = [
    {
      startDateTime: new Date('2026-11-08T18:00:00.000Z'),
      competitors: [{ _id: kcId }, { _id: seaId }],
    },
  ];

  const filtered = filterDbGamesForScoreboardWeek(dbGames, kickoffTimesMs);
  assert.equal(filtered.length, 0);
});

test('filterDbGamesForGameWeek uses GameController begin/end bounds', () => {
  const gameWeek = {
    beginDateTime: new Date('2026-10-21T04:00:00.000Z'),
    endDateTime: new Date('2026-10-27T03:59:00.000Z'),
  };
  const inWeek = { startDateTime: new Date('2026-10-25T20:20:00.000Z') };
  const outWeek = { startDateTime: new Date('2026-10-20T20:20:00.000Z') };
  const hidden = { startDateTime: inWeek.startDateTime, isHidden: true };

  const filtered = filterDbGamesForGameWeek([inWeek, outWeek, hidden], gameWeek);
  assert.equal(filtered.length, 1);
  assert.equal(filtered[0], inWeek);
});

test('reconcileScoreboardGameCounts ignores db games outside official Game_Week range', () => {
  const kickoff = new Date('2026-10-25T20:20:00.000Z');
  const gameWeek = {
    beginDateTime: new Date('2026-10-21T04:00:00.000Z'),
    endDateTime: new Date('2026-10-27T03:59:00.000Z'),
  };
  const scraped = {
    game: [
      { teamDetails: { _id: kcId, location: 'Kansas City', name: 'Chiefs' } },
      { teamDetails: { _id: seaId, location: 'Seattle', name: 'Seahawks' } },
    ],
  };
  const inWeek = {
    startDateTime: kickoff,
    competitors: [
      { _id: kcId, name: 'Kansas City Chiefs' },
      { _id: seaId, name: 'Seattle Seahawks' },
    ],
  };
  const strayDuplicate = {
    startDateTime: new Date('2026-11-08T18:00:00.000Z'),
    competitors: [
      { _id: kcId, name: 'Kansas City Chiefs' },
      { _id: seaId, name: 'Seattle Seahawks' },
    ],
  };

  const result = reconcileScoreboardGameCounts({
    results: [scraped],
    dbGames: [inWeek, strayDuplicate],
    events: [{ startDateTime: kickoff }],
    gameWeek,
    resolveScrapedKickoff: () => kickoff,
  });

  assert.equal(result.ok, true);
  assert.equal(result.dbCount, 1);
});

test('reconcileScoreboardGameCounts fails when counts differ', () => {
  const kickoff = new Date('2026-10-26T00:20:00.000Z');
  const scraped = {
    game: [
      { teamDetails: { _id: kcId, location: 'Kansas City', name: 'Chiefs' } },
      { teamDetails: { _id: seaId, location: 'Seattle', name: 'Seahawks' } },
    ],
  };

  const result = reconcileScoreboardGameCounts({
    results: [scraped],
    dbGames: [],
    events: [{ startDateTime: kickoff }],
    resolveScrapedKickoff: () => kickoff,
  });

  assert.equal(result.ok, false);
  assert.equal(result.countsMatch, false);
  assert.equal(result.scrapedCount, 1);
  assert.equal(result.dbCount, 0);
  assert.equal(result.missingInDb.length, 1);
});
