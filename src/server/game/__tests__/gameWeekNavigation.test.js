const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildLeaderboardPath,
  buildWeekQueryMetaMap,
  findGameWeekForEspnWeek,
  findNavigableWeekForGame,
  isWednesdayInTimezone,
  resolveLeaderboardNotificationWeek,
} = require('../gameWeekNavigation');

const entireSeasonWeek = {
  _id: 'entire',
  description: 'Entire Season Mon Sep 1',
  beginDateTime: new Date('2025-09-01T00:00:00.000Z'),
  endDateTime: new Date('2026-02-15T00:00:00.000Z'),
};

const week3 = {
  _id: 'week-3',
  description: 'Week 3 Thu Sep 18',
  beginDateTime: new Date('2025-09-16T00:00:00.000Z'),
  endDateTime: new Date('2025-09-23T00:00:00.000Z'),
};

const referenceGame = {
  startDateTime: new Date('2025-09-21T17:00:00.000Z'),
};

test('findGameWeekForEspnWeek resolves navigable week by ESPN seasonType and week number', () => {
  const week7 = {
    _id: 'week-7',
    description: 'Week 7 Thu Oct 23',
    beginDateTime: new Date('2026-10-21T04:00:00.000Z'),
    endDateTime: new Date('2026-10-27T03:59:00.000Z'),
  };

  const found = findGameWeekForEspnWeek([entireSeasonWeek, week7], {
    seasonType: 2,
    weekNumber: 1,
  });

  assert.equal(String(found._id), 'week-7');
});

test('findNavigableWeekForGame ignores entire-season week overlap', () => {
  const week = findNavigableWeekForGame(referenceGame, [entireSeasonWeek, week3]);
  assert.equal(String(week._id), 'week-3');
});

test('resolveLeaderboardNotificationWeek uses current week except on Wednesday', () => {
  const gameWeeks = [entireSeasonWeek, week3];
  const tuesday = new Date('2025-09-23T15:00:00.000Z'); // Tue 11am ET

  const weekday = resolveLeaderboardNotificationWeek({
    referenceGame,
    gameWeeks,
    timezone: 'America/New_York',
    dateValue: tuesday,
  });

  assert.equal(weekday.useEntireSeason, false);
  assert.equal(String(weekday.week._id), 'week-3');

  const wednesday = new Date('2025-09-24T15:00:00.000Z'); // Wed 11am ET
  const midweek = resolveLeaderboardNotificationWeek({
    referenceGame,
    gameWeeks,
    timezone: 'America/New_York',
    dateValue: wednesday,
  });

  assert.equal(midweek.useEntireSeason, true);
  assert.equal(String(midweek.week._id), 'entire');
});

test('buildLeaderboardPath includes week segment for navigable weeks', () => {
  const meta = buildWeekQueryMetaMap([entireSeasonWeek, week3]);
  const path = buildLeaderboardPath({
    leagueName: 'nfl',
    year: 2025,
    week: week3,
    weekQueryMetaById: meta,
  });

  assert.match(path, /^\/leaders\/nfl\/2025\/regular\/week-/);
});

test('isWednesdayInTimezone respects subscriber timezone', () => {
  const utcWednesdayMorning = new Date('2025-09-24T06:00:00.000Z'); // Wed UTC, Tue evening PT

  assert.equal(
    isWednesdayInTimezone({
      timezone: 'America/Los_Angeles',
      dateValue: utcWednesdayMorning,
    }),
    false
  );

  assert.equal(
    isWednesdayInTimezone({
      timezone: 'America/New_York',
      dateValue: utcWednesdayMorning,
    }),
    true
  );
});
