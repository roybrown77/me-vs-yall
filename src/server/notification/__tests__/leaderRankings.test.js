const test = require('node:test');
const assert = require('node:assert/strict');

const { rankLeaders, formatTopLeadersBody, formatLeaderDisplayName } = require('../leaderRankings');

test('rankLeaders orders users by wins', () => {
  const games = [
    {
      _id: 'game-1',
      isGameOver: true,
      startDateTime: new Date('2026-08-21T00:00:00.000Z'),
      competitors: [
        { _id: 'team-a', score: 24 },
        { _id: 'team-b', score: 17 },
      ],
    },
    {
      _id: 'game-2',
      isGameOver: true,
      startDateTime: new Date('2026-08-22T00:00:00.000Z'),
      competitors: [
        { _id: 'team-c', score: 10 },
        { _id: 'team-d', score: 13 },
      ],
    },
  ];

  const picks = [
    { userId: 'user-1', gameId: 'game-1', pickId: 'team-a' },
    { userId: 'user-1', gameId: 'game-2', pickId: 'team-d' },
    { userId: 'user-2', gameId: 'game-1', pickId: 'team-b' },
    { userId: 'user-2', gameId: 'game-2', pickId: 'team-c' },
  ];

  const users = [
    { authServiceId: 'user-1', firstName: 'Alex', lastName: 'Leader' },
    { authServiceId: 'user-2', firstName: 'Blake', lastName: 'Second' },
  ];

  const leaders = rankLeaders({ games, picks, users });

  assert.equal(leaders[0].name, 'Alex L.');
  assert.equal(leaders[0].wins, 2);
  assert.equal(leaders[0].losses, 0);
  assert.equal(leaders[1].name, 'Blake S.');
  assert.equal(leaders[1].wins, 0);
  assert.equal(leaders[1].losses, 2);
});

test('formatTopLeadersBody lists top three leaders', () => {
  const body = formatTopLeadersBody([
    { name: 'Alex L.', wins: 8, losses: 2 },
    { name: 'Blake S.', wins: 7, losses: 3 },
    { name: 'Casey T.', wins: 7, losses: 4 },
  ]);

  assert.equal(
    body,
    'Top 3: 1. Alex L. (8-2), 2. Blake S. (7-3), 3. Casey T. (7-4)'
  );
});

test('formatLeaderDisplayName keeps Vegas, kings, and queens unabbreviated', () => {
  assert.equal(
    formatLeaderDisplayName({ authServiceId: '1', firstName: 'Vegas', lastName: 'SuperBook' }),
    'Vegas'
  );
  assert.equal(
    formatLeaderDisplayName({ authServiceId: '2', firstName: 'King Homer' }),
    'King Homer'
  );
  assert.equal(
    formatLeaderDisplayName({ authServiceId: '18', firstName: 'Queen Rogue' }),
    'Queen Rogue'
  );
  assert.equal(
    formatLeaderDisplayName({ authServiceId: 'user-3', firstName: 'Pat', lastName: 'Smith' }),
    'Pat S.'
  );
});
