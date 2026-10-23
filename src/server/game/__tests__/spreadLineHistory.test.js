const { test } = require('node:test');
const assert = require('node:assert/strict');

const {
  upsertSpreadHistory,
  upsertOverUnderHistory,
  spreadHistoryHasMovement,
  overUnderHistoryHasMovement,
  spreadSnapshotKey,
} = require('../spreadLineHistory');

test('upsertSpreadHistory replaces same-day entry and keeps prior days', () => {
  const spreadA = { teamId: 'abc', amount: -3 };
  const spreadB = { teamId: 'abc', amount: -3.5 };
  const first = upsertSpreadHistory([], spreadA);
  assert.equal(first.length, 1);
  assert.equal(first[0].amount, -3);

  const second = upsertSpreadHistory(
    [{ date: '2026-10-20', teamId: 'abc', amount: -2.5 }],
    spreadA,
  );
  assert.equal(second.length, 2);
  assert.deepEqual(second[1], { date: first[0].date, teamId: 'abc', amount: -3 });

  const sameDayUpdate = upsertSpreadHistory(second, spreadB);
  assert.equal(sameDayUpdate.length, 2);
  assert.equal(sameDayUpdate[1].amount, -3.5);
});

test('spreadHistoryHasMovement detects favorite or line changes', () => {
  assert.equal(spreadHistoryHasMovement([]), false);
  assert.equal(
    spreadHistoryHasMovement([
      { date: '2026-10-20', teamId: 'a', amount: -3 },
      { date: '2026-10-21', teamId: 'a', amount: -3 },
    ]),
    false,
  );
  assert.equal(
    spreadHistoryHasMovement([
      { date: '2026-10-20', teamId: 'a', amount: -3 },
      { date: '2026-10-21', teamId: 'b', amount: 3 },
    ]),
    true,
  );
  assert.notEqual(
    spreadSnapshotKey({ teamId: 'a', amount: -3 }),
    spreadSnapshotKey({ teamId: 'a', amount: -3.5 }),
  );
});

test('upsertOverUnderHistory and movement detection', () => {
  const one = upsertOverUnderHistory([], 44);
  assert.equal(one[0].value, 44);
  const two = upsertOverUnderHistory(
    [{ date: '2026-10-19', value: 42 }],
    44,
  );
  assert.equal(two.length, 2);
  assert.equal(overUnderHistoryHasMovement(two), true);
  assert.equal(
    overUnderHistoryHasMovement([
      { date: '2026-10-19', value: 44 },
      { date: '2026-10-20', value: 44 },
    ]),
    false,
  );
});
