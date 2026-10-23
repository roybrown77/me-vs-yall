const test = require('node:test');
const assert = require('node:assert/strict');

const {
  buildEspnKickoffByGameId,
  enrichScrapedResultsWithEspnKickoffs,
  parseEspnScoreboardEvents,
} = require('../espnNflScoreboardApi');

test('parseEspnScoreboardEvents maps event id and kickoff', () => {
  const events = parseEspnScoreboardEvents({
    events: [
      {
        id: '401873022',
        shortName: 'KC @ SEA',
        date: '2026-10-26T00:20:00.000Z',
      },
    ],
  });

  assert.equal(events.length, 1);
  assert.equal(events[0].espnGameId, '401873022');
  assert.equal(events[0].startDateTime.toISOString(), '2026-10-26T00:20:00.000Z');
});

test('enrichScrapedResultsWithEspnKickoffs attaches apiKickoff by espn game id', () => {
  const kickoffByGameId = buildEspnKickoffByGameId([
    {
      espnGameId: '401873022',
      startDateTime: new Date('2026-10-26T00:20:00.000Z'),
    },
  ]);

  const [enriched] = enrichScrapedResultsWithEspnKickoffs(
    [{ espnGameId: '401873022', kickoffTime: '' }],
    kickoffByGameId
  );

  assert.equal(enriched.apiKickoff.toISOString(), '2026-10-26T00:20:00.000Z');
});
