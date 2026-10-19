const test = require('node:test');
const assert = require('node:assert/strict');

const { hasGameStarted, isValid } = require('../PickDomain');

const kickoff = new Date('2026-09-20T17:00:00.000Z');

const baseGame = {
  _id: 'game-1',
  startDateTime: kickoff,
  isGameOver: false,
};

const basePick = {
  gameId: 'game-1',
  pickId: 'team-a',
  userId: 'user-1',
};

test('hasGameStarted is false before kickoff', () => {
  const pickTime = new Date('2026-09-20T16:00:00.000Z');
  assert.equal(hasGameStarted(kickoff, pickTime), false);
});

test('hasGameStarted is false at kickoff (server uses strict before start)', () => {
  assert.equal(hasGameStarted(kickoff, kickoff), false);
});

test('hasGameStarted is true after kickoff', () => {
  const pickTime = new Date('2026-09-20T17:00:01.000Z');
  assert.equal(hasGameStarted(kickoff, pickTime), true);
});

test('isValid allows picks before kickoff', () => {
  assert.equal(
    isValid(baseGame, {
      ...basePick,
      createDateTime: new Date('2026-09-20T16:30:00.000Z'),
    }),
    true
  );
});

test('isValid rejects picks after kickoff', () => {
  assert.equal(
    isValid(baseGame, {
      ...basePick,
      createDateTime: new Date('2026-09-20T17:30:00.000Z'),
    }),
    false
  );
});

test('isValid rejects picks when game is over', () => {
  assert.equal(
    isValid(
      { ...baseGame, isGameOver: true },
      { ...basePick, createDateTime: new Date('2026-09-20T16:30:00.000Z') }
    ),
    false
  );
});

test('isValid requires gameId and pickId', () => {
  assert.equal(
    isValid(baseGame, {
      pickId: 'team-a',
      createDateTime: new Date('2026-09-20T16:30:00.000Z'),
    }),
    false
  );

  assert.equal(
    isValid(baseGame, {
      gameId: 'game-1',
      createDateTime: new Date('2026-09-20T16:30:00.000Z'),
    }),
    false
  );
});
