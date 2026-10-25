import { test } from "node:test";
import assert from "node:assert/strict";

import {
  parseSpotFromDown,
  resolveAmericanFootballLiveBall,
  resolveAmericanFootballMidfieldTeams,
  yardLineToFieldX,
  yardsFromLeftGoalLine,
} from "../americanFootballFieldPosition.js";

const competitors = [
  { shortLocation: "SEA", alternateName: "Seattle", name: "Seattle Seahawks" },
  { shortLocation: "KC", alternateName: "Kansas City", name: "Kansas City Chiefs" },
];

const hasStarted = () => true;

test("parseSpotFromDown reads team yard line and midfield", () => {
  assert.deepEqual(parseSpotFromDown("1st & 10 at KC 25"), {
    midfield: false,
    yardLine: 25,
    teamToken: "KC",
  });
  assert.deepEqual(parseSpotFromDown("2nd & Goal at SEA 1"), {
    midfield: false,
    yardLine: 1,
    teamToken: "SEA",
  });
  assert.deepEqual(parseSpotFromDown("3rd & 3 at 50"), {
    midfield: true,
    yardLine: 50,
    teamToken: null,
  });
});

test("yardsFromLeftGoalLine maps territory to full-field distance", () => {
  const awaySpot = parseSpotFromDown("1st & 10 at SEA 35");
  const homeSpot = parseSpotFromDown("2nd & 7 at KC 40");

  assert.equal(yardsFromLeftGoalLine({ spot: awaySpot, competitors }), 35);
  assert.equal(yardsFromLeftGoalLine({ spot: homeSpot, competitors }), 60);
});

test("resolveAmericanFootballMidfieldTeams shows both teams when live without possession", () => {
  const game = {
    startDateTime: new Date(Date.now() - 60000).toISOString(),
    isGameOver: false,
    possession: null,
    competitors,
  };

  const midfield = resolveAmericanFootballMidfieldTeams({ game, hasGameStarted: hasStarted });
  assert.ok(midfield);
  assert.ok(midfield.away.ballX < midfield.home.ballX);
  assert.equal(midfield.away.teamLabel, "SEA");
  assert.equal(midfield.home.teamLabel, "KC");
});

test("resolveAmericanFootballLiveBall requires start, possession, and spot", () => {
  const game = {
    startDateTime: new Date(Date.now() - 60000).toISOString(),
    isGameOver: false,
    possession: "KC",
    down: "1st & 10 at KC 25",
    competitors,
  };

  const live = resolveAmericanFootballLiveBall({ game, hasGameStarted: hasStarted });
  assert.ok(live);
  assert.equal(live.possessionSide, "home");
  assert.equal(live.yardsFromLeft, 75);
  assert.ok(Math.abs(live.ballX - yardLineToFieldX(75)) < 0.01);

  assert.equal(
    resolveAmericanFootballLiveBall({
      game: { ...game, possession: null },
      hasGameStarted: hasStarted,
    }),
    null,
  );
});
