import { test } from "node:test";
import assert from "node:assert/strict";

import {
  SCOREBOARD_VIEW_BRACKET,
  SCOREBOARD_VIEW_RANKINGS,
  buildNavigationPath,
  isLongStandingsScoreboardPath,
  isScoreboardRankingsPath,
  normalizeLegacyScoreboardViewQuery,
  parseNavigationPath,
} from "../navigationPaths.js";

test("parseNavigationPath reads short rankings and playoffs standings URLs", () => {
  assert.deepEqual(parseNavigationPath("/scoreboards/nfl/rankings"), {
    leagueName: "nfl",
    year: null,
    seasonType: null,
    weekSegment: null,
    week: null,
    gameSlug: null,
    scoreboardView: SCOREBOARD_VIEW_RANKINGS,
  });

  assert.deepEqual(parseNavigationPath("/scoreboards/nfl/playoffs"), {
    leagueName: "nfl",
    year: null,
    seasonType: null,
    weekSegment: null,
    week: null,
    gameSlug: null,
    scoreboardView: SCOREBOARD_VIEW_BRACKET,
  });

  assert.equal(
    parseNavigationPath("/scoreboards/nfl/bracket").scoreboardView,
    SCOREBOARD_VIEW_BRACKET
  );
});

test("buildNavigationPath uses short standings URLs without year or week", () => {
  assert.equal(
    buildNavigationPath({
      routeBase: "/scoreboards/",
      leagueName: "nfl",
      scoreboardView: SCOREBOARD_VIEW_RANKINGS,
      year: 2025,
      weekSegment: "week-5",
    }),
    "/scoreboards/nfl/rankings"
  );

  assert.equal(
    buildNavigationPath({
      routeBase: "/scoreboards/",
      leagueName: "nfl",
      scoreboardView: SCOREBOARD_VIEW_BRACKET,
    }),
    "/scoreboards/nfl/playoffs"
  );
});

test("long legacy standings paths are detected for redirect", () => {
  const legacy =
    "/scoreboards/nfl/2025/regular/week-5/rankings";
  assert.equal(
    parseNavigationPath(legacy).scoreboardView,
    SCOREBOARD_VIEW_RANKINGS
  );
  assert.equal(isLongStandingsScoreboardPath(legacy), true);
  assert.equal(isLongStandingsScoreboardPath("/scoreboards/nfl/rankings"), false);
});

test("normalizeLegacyScoreboardViewQuery accepts bracket and playoffs", () => {
  assert.equal(
    normalizeLegacyScoreboardViewQuery("rankings"),
    SCOREBOARD_VIEW_RANKINGS
  );
  assert.equal(normalizeLegacyScoreboardViewQuery("bracket"), SCOREBOARD_VIEW_BRACKET);
  assert.equal(
    normalizeLegacyScoreboardViewQuery("playoffs"),
    SCOREBOARD_VIEW_BRACKET
  );
});

test("isScoreboardRankingsPath matches short rankings URL", () => {
  assert.equal(isScoreboardRankingsPath("/scoreboards/nfl/rankings"), true);
});

test("playoff season week slug playoffs is not the standings tab", () => {
  const scoresPath = "/scoreboards/nfl/2025/playoffs/playoffs";
  const parsed = parseNavigationPath(scoresPath);
  assert.equal(parsed.year, 2025);
  assert.equal(parsed.seasonType, 3);
  assert.equal(parsed.weekSegment, "playoffs");
  assert.equal(parsed.scoreboardView, null);
  assert.equal(isLongStandingsScoreboardPath(scoresPath), false);
});