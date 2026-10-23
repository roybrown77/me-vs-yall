const test = require('node:test');
const assert = require('node:assert/strict');

const {
  getDbGameMatchKey,
  getScrapedGameMatchKey,
  hasSameGameMatch,
} = require('../espnGameMatch');

const kcId = '19823783734d1d04a1b39001';
const seaId = '19823783734d1d04a1b3901f';

test('getScrapedGameMatchKey distinguishes preseason and regular-season rematches', () => {
  const scraped = {
    game: [{ teamDetails: { _id: kcId } }, { teamDetails: { _id: seaId } }],
  };

  const preseasonKey = getScrapedGameMatchKey(scraped, new Date('2026-08-28T20:00:00.000Z'));
  const regularKey = getScrapedGameMatchKey(scraped, new Date('2026-10-25T20:20:00.000Z'));

  assert.notEqual(preseasonKey, regularKey);
  assert.match(regularKey, /2026-10-25$/);
});

test('hasSameGameMatch matches only the same kickoff day', () => {
  const dbPreseason = {
    startDateTime: new Date('2026-08-29T00:00:00.000Z'),
    competitors: [{ _id: seaId }, { _id: kcId }],
  };

  const dbRegular = {
    startDateTime: new Date('2026-10-26T00:20:00.000Z'),
    competitors: [{ _id: kcId }, { _id: seaId }],
  };

  const scraped = {
    game: [{ teamDetails: { _id: kcId } }, { teamDetails: { _id: seaId } }],
  };

  const regularKickoff = new Date('2026-10-26T00:20:00.000Z');

  assert.equal(
    hasSameGameMatch({ dbGame: dbPreseason, scrapedGame: scraped, scrapedKickoff: regularKickoff }),
    false
  );
  assert.equal(
    hasSameGameMatch({ dbGame: dbRegular, scrapedGame: scraped, scrapedKickoff: regularKickoff }),
    true
  );
});

test('getDbGameMatchKey uses Eastern kickoff date', () => {
  const key = getDbGameMatchKey({
    startDateTime: new Date('2026-10-26T00:20:00.000Z'),
    competitors: [{ _id: kcId }, { _id: seaId }],
  });

  assert.match(key, /2026-10-25$/);
});
