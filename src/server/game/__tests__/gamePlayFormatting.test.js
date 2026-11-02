const test = require('node:test');
const assert = require('node:assert/strict');
const router = require('../GameController');

const {
  setAmericanFootballPlays,
  setAmericanFootballDown,
  setBasketballPlays,
  setBaseballPlays,
  normalizeAmericanFootballLiveFields,
} = router._test;

test('setAmericanFootballPlays handles undefined or null playHistory without throwing', () => {
  const gameUndefined = {
    leagueId: '59723313734d1d6202a85f10',
    playHistory: undefined,
  };
  assert.doesNotThrow(() => {
    setAmericanFootballPlays(gameUndefined);
  });

  const gameNull = {
    leagueId: '59723313734d1d6202a85f10',
    playHistory: null,
  };
  assert.doesNotThrow(() => {
    setAmericanFootballPlays(gameNull);
  });

  const gameMissingLeague = {
    playHistory: undefined,
  };
  assert.doesNotThrow(() => {
    setAmericanFootballPlays(gameMissingLeague);
  });
});

test('setAmericanFootballPlays formats punt and touchdown plays', () => {
  const game = {
    leagueId: '59723313734d1d6202a85f10',
    playHistory: [
      { lastPlay: 'Last Play: (10:30) J.Flacco punt for 45 yards' },
      { lastPlay: 'T.Brady pass deep middle for touchdown' },
    ],
  };

  setAmericanFootballPlays(game);
  assert.equal(Array.isArray(game.playHistory), true);
  assert.equal(game.playHistory[0].lastPlay.includes('DEFENSE FORCES PUNT'), true);
  assert.equal(Array.isArray(game.highlights), true);
  assert.equal(game.highlights.length > 0, true);
});

test('setAmericanFootballDown handles undefined or empty playHistory without throwing', () => {
  const gameNoHistory = {
    leagueId: '59723313734d1d6202a85f10',
    playHistory: undefined,
  };
  assert.doesNotThrow(() => {
    setAmericanFootballDown(gameNoHistory);
  });

  const gameEmptyHistory = {
    leagueId: '59723313734d1d6202a85f10',
    playHistory: [],
  };
  assert.doesNotThrow(() => {
    setAmericanFootballDown(gameEmptyHistory);
  });
});

test('setBasketballPlays and setBaseballPlays handle undefined playHistory without throwing', () => {
  const nbaGame = {
    leagueId: '59723313734d1d6202a85f19',
    playHistory: undefined,
  };
  assert.doesNotThrow(() => {
    setBasketballPlays(nbaGame);
  });

  const mlbGame = {
    leagueId: '59723313734d1d6202a85f21',
    playHistory: undefined,
  };
  assert.doesNotThrow(() => {
    setBaseballPlays(mlbGame);
  });
});

test('normalizeAmericanFootballLiveFields handles missing leagueId or non-matching down safely', () => {
  const gameNoLeague = { down: '3rd & 5' };
  assert.doesNotThrow(() => {
    normalizeAmericanFootballLiveFields(gameNoLeague);
  });

  const gameNflNoMatch = {
    leagueId: '59723313734d1d6202a85f10',
    down: 'Final',
    playHistory: undefined,
  };
  assert.doesNotThrow(() => {
    normalizeAmericanFootballLiveFields(gameNflNoMatch);
  });
});
