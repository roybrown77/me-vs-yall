const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  FINAL_STATUS_DELAY_MS,
  resolveFinalStatus,
} = require('../gameFinalStatus');

test('resolveFinalStatus leaves game not over when scrapedIsGameOver is false', () => {
  const result = resolveFinalStatus({
    game: { isGameOver: false },
    scrapedIsGameOver: false,
  });

  assert.deepEqual(result, {
    isGameOver: false,
    playCollectionUntil: null,
    finalStatusDueAt: null,
  });
});

test('resolveFinalStatus marks final immediately and arms collection window when game first finishes', () => {
  const now = 1_700_000_000_000;
  const result = resolveFinalStatus({
    game: { isGameOver: false, playCollectionUntil: null },
    scrapedIsGameOver: true,
    now,
  });

  assert.equal(result.isGameOver, true);
  assert.equal(result.finalStatusDueAt, null);
  assert.equal(result.playCollectionUntil.getTime(), now + FINAL_STATUS_DELAY_MS);
});

test('resolveFinalStatus preserves active play collection deadline while window is open', () => {
  const start = 1_700_000_000_000;
  const deadline = start + FINAL_STATUS_DELAY_MS;
  const midway = start + 20_000;

  const result = resolveFinalStatus({
    game: { isGameOver: true, playCollectionUntil: new Date(deadline) },
    scrapedIsGameOver: true,
    now: midway,
  });

  assert.equal(result.isGameOver, true);
  assert.equal(result.playCollectionUntil.getTime(), deadline);
});

test('resolveFinalStatus clears playCollectionUntil to null once collection window expires', () => {
  const start = 1_700_000_000_000;
  const deadline = start + FINAL_STATUS_DELAY_MS;
  const afterExpiration = deadline + 1_000;

  const result = resolveFinalStatus({
    game: { isGameOver: true, playCollectionUntil: new Date(deadline) },
    scrapedIsGameOver: true,
    now: afterExpiration,
  });

  assert.deepEqual(result, {
    isGameOver: true,
    playCollectionUntil: null,
    finalStatusDueAt: null,
  });
});

test('resolveFinalStatus does not re-arm collection window for already final games', () => {
  const result = resolveFinalStatus({
    game: { isGameOver: true, playCollectionUntil: null, finalStatusDueAt: null },
    scrapedIsGameOver: true,
    now: 1_700_000_000_000,
  });

  assert.deepEqual(result, {
    isGameOver: true,
    playCollectionUntil: null,
    finalStatusDueAt: null,
  });
});
