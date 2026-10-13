import get from "lodash/get";
import last from "lodash/last";
import moment from "moment-timezone";

import { leagues } from "../../utilities";

const RANKINGS_LOCK_TZ = "America/New_York";

export const inferSeasonType = (week = {}) => {
  const description = String(week.description || "").toLowerCase();

  if (
    description.includes("preseason") ||
    description.includes("hall of fame") ||
    /pre\s*season/.test(description)
  ) {
    return 1;
  }

  if (
    description.includes("playoff") ||
    description.includes("wild card") ||
    description.includes("divisional") ||
    description.includes("conference") ||
    description.includes("super bowl") ||
    description.includes("final")
  ) {
    return 3;
  }

  return 2;
};

const shouldSkipWeekSegment = (selectedWeek = {}) => {
  const labelCandidates = [
    selectedWeek.displayName,
    selectedWeek.description,
    selectedWeek.name,
  ]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return labelCandidates.some((label) => {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.startsWith("entire")) {
      return true;
    }

    return /^week\s+\d+\s*-\s*\d+\b/i.test(label);
  });
};

const sortWeeksChronologically = (weeks = []) =>
  [...weeks].sort(
    (a, b) =>
      new Date(a.beginDateTime || 0).getTime() -
      new Date(b.beginDateTime || 0).getTime()
  );

const getNavigableWeeks = (weeks = []) =>
  sortWeeksChronologically(weeks).filter(
    (week) => !week?.isRollup && !shouldSkipWeekSegment(week)
  );

export const isFirstRegularSeasonWeek = (week, weeks = []) => {
  if (!week) return false;

  const regularWeeks = getNavigableWeeks(weeks).filter(
    (entry) => inferSeasonType(entry) === 2
  );

  return regularWeeks.length > 0 && regularWeeks[0]._id === week._id;
};

export const areRankingsAvailableForWeek = (week, weeks = []) => {
  if (!week) {
    return false;
  }

  const seasonType = inferSeasonType(week);

  if (seasonType === 1) {
    return false;
  }

  if (seasonType === 3) {
    return true;
  }

  const regularWeeks = getNavigableWeeks(weeks).filter(
    (entry) => inferSeasonType(entry) === 2
  );
  const regularSeasonWeekIndex = regularWeeks.findIndex(
    (entry) => entry._id === week._id
  );

  return regularSeasonWeekIndex >= 1;
};

export const isLatestLeagueYear = (leagueId, year) => {
  const league = leagues.find(
    (entry) => String(entry.id) === String(leagueId)
  );
  const latestYear = last(league?.years);

  if (latestYear == null || year == null) {
    return false;
  }

  return Number(year) === Number(latestYear);
};

export const areRankingsAvailableForSelection = ({
  week,
  weeks = [],
  leagueId,
  year,
}) =>
  areRankingsAvailableForWeek(week, weeks) &&
  isLatestLeagueYear(leagueId, year);

export const getPreviousRankingWeek = (currentWeek, weeks = []) => {
  if (!currentWeek) return null;

  const navigableWeeks = getNavigableWeeks(weeks);
  const currentIndex = navigableWeeks.findIndex(
    (week) => week._id === currentWeek._id
  );

  if (currentIndex <= 0) {
    return null;
  }

  for (let index = currentIndex - 1; index >= 0; index -= 1) {
    const seasonType = inferSeasonType(navigableWeeks[index]);
    if (seasonType === 2 || seasonType === 3) {
      return navigableWeeks[index];
    }
  }

  return null;
};

const gameStartTime = (game) => new Date(game.startDateTime).getTime();

const gameFallsInWeek = (game, week) => {
  const start = gameStartTime(game);
  const begin = new Date(week.beginDateTime).getTime();
  const end = new Date(week.endDateTime).getTime();
  return start >= begin && start <= end;
};

export const filterGamesInSeasonTypes = (games = [], weeks = [], seasonTypes = []) => {
  const allowedWeeks = getNavigableWeeks(weeks).filter((week) =>
    seasonTypes.includes(inferSeasonType(week))
  );

  if (allowedWeeks.length === 0) {
    return [];
  }

  return games.filter(
    (game) =>
      game.isGameOver &&
      allowedWeeks.some((week) => gameFallsInWeek(game, week))
  );
};

export const filterPlayoffGames = (games = [], weeks = []) =>
  filterGamesInSeasonTypes(games, weeks, [3]);

const getPlayoffWeeks = (weeks = []) =>
  getNavigableWeeks(weeks).filter((week) => inferSeasonType(week) === 3);

const getWeekBeginDateTime = (week) =>
  week?.displayBeginDateTime || week?.beginDateTime || null;

export const getRankingsSeasonBeginDateTime = (weeks = []) => {
  const regularWeeks = getNavigableWeeks(weeks).filter(
    (week) => inferSeasonType(week) === 2
  );

  return getWeekBeginDateTime(regularWeeks[0]);
};

export const getEarliestPlayoffWeekBegin = (weeks = []) => {
  const playoffWeeks = getPlayoffWeeks(weeks);
  return getWeekBeginDateTime(playoffWeeks[0]);
};

export const getLatestPlayoffWeekEnd = (weeks = []) => {
  const playoffWeeks = getPlayoffWeeks(weeks);

  let latestWeek = null;
  let latestTime = null;

  playoffWeeks.forEach((week) => {
    const endTime = new Date(week.endDateTime).getTime();
    if (!Number.isFinite(endTime)) {
      return;
    }

    if (latestTime === null || endTime > latestTime) {
      latestTime = endTime;
      latestWeek = week;
    }
  });

  return latestWeek?.endDateTime || null;
};

export const getRankingsLockMomentAfter = (dateTime) => {
  const anchor = moment(dateTime).tz(RANKINGS_LOCK_TZ);
  let lock = anchor.clone().day(2).hour(3).minute(0).second(0).millisecond(0);

  if (!lock.isAfter(anchor)) {
    lock = lock.add(1, "week");
  }

  return lock;
};

const getGamesScheduledInWeek = (games = [], week) => {
  if (!week) {
    return [];
  }

  return games.filter((game) => gameFallsInWeek(game, week));
};

export const isWeekRankingLocked = ({
  week,
  seasonGames = [],
  now = new Date(),
} = {}) => {
  if (!week?.endDateTime) {
    return false;
  }

  const weekGames = getGamesScheduledInWeek(seasonGames, week);
  if (weekGames.length > 0 && !weekGames.every((game) => game.isGameOver)) {
    return false;
  }

  const lockMoment = getRankingsLockMomentAfter(week.endDateTime);
  return moment(now).tz(RANKINGS_LOCK_TZ).isSameOrAfter(lockMoment);
};

export const getRankingStatsCutoffEndDateTime = ({
  week,
  weeks = [],
  seasonGames = [],
  endDateTime,
  now = new Date(),
}) => {
  if (!week || !endDateTime) {
    return endDateTime;
  }

  if (isWeekRankingLocked({ week, seasonGames, now })) {
    return endDateTime;
  }

  const previousRankingWeek = getPreviousRankingWeek(week, weeks);
  return previousRankingWeek?.endDateTime ?? null;
};

const dedupeGamesById = (games = []) => {
  const seen = new Set();

  return games.filter((game) => {
    const id = String(game._id);
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const CURRENT_RANKING_SEASON_TYPES = [2, 3];

export const resolveRankingSnapshots = ({
  currentYear,
  currentWeek,
  leagueId,
  weeks = [],
  seasonGames = [],
  priorYearGames = [],
  priorYearWeeks = [],
  endDateTime,
}) => {
  if (
    !areRankingsAvailableForWeek(currentWeek, weeks) ||
    !isLatestLeagueYear(leagueId, currentYear)
  ) {
    return {
      current: [],
      previous: [],
      usesPriorPlayoffs: false,
      rankingsAvailable: false,
    };
  }

  const yearNumber = Number(currentYear);
  const gamesThisYear = seasonGames.filter(
    (game) => Number(game.year) === yearNumber
  );

  const rankingStatsCutoffEnd = getRankingStatsCutoffEndDateTime({
    week: currentWeek,
    weeks,
    seasonGames: gamesThisYear,
    endDateTime,
  });

  const rankedSeasonGames = filterGamesInSeasonTypes(
    gamesThisYear,
    weeks,
    CURRENT_RANKING_SEASON_TYPES
  );
  const currentSeasonThroughWeek =
    rankingStatsCutoffEnd == null
      ? []
      : filterGamesThroughDate(rankedSeasonGames, rankingStatsCutoffEnd);

  if (isFirstRegularSeasonWeek(currentWeek, weeks)) {
    const priorPlayoffs = filterPlayoffGames(priorYearGames, priorYearWeeks);

    return {
      current: dedupeGamesById([...priorPlayoffs, ...currentSeasonThroughWeek]),
      previous: priorPlayoffs,
      usesPriorPlayoffs: true,
      rankingsAvailable: true,
    };
  }

  const previousRankingWeek = getPreviousRankingWeek(currentWeek, weeks);
  const previous = previousRankingWeek
    ? filterGamesThroughDate(
        filterGamesInSeasonTypes(
          gamesThisYear,
          weeks,
          CURRENT_RANKING_SEASON_TYPES
        ),
        previousRankingWeek.endDateTime
      )
    : [];

  return {
    current: currentSeasonThroughWeek,
    previous,
    usesPriorPlayoffs: false,
    rankingsAvailable: true,
  };
};

const getTeamIndex = (game, teamId) =>
  game.competitors.findIndex(
    (competitor) => String(competitor._id) === String(teamId)
  );

const isScoringPlay = (lastPlay = "") => {
  const play = String(lastPlay).toLowerCase();
  return (
    play.includes("touchdown") ||
    play.includes("field goal") ||
    play.includes("safety")
  );
};

const isNegativePlay = (lastPlay = "") => {
  const play = String(lastPlay).toLowerCase();
  return play.includes("interception") || play.includes("fumble");
};

const getMomentumFromGames = (teamGames = []) => {
  const recentGames = [...teamGames]
    .filter((game) => game.isGameOver)
    .sort(
      (a, b) =>
        new Date(b.startDateTime).getTime() - new Date(a.startDateTime).getTime()
    )
    .slice(0, 3);

  return recentGames.reduce((total, game) => {
    const plays = game.playHistory || [];
    return (
      total +
      plays.reduce((playTotal, play) => {
        const lastPlay = get(play, "lastPlay", "");
        if (isScoringPlay(lastPlay)) return playTotal + 1;
        if (isNegativePlay(lastPlay)) return playTotal - 0.35;
        return playTotal + 0.15;
      }, 0)
    );
  }, 0);
};

const buildTeamMetrics = (games = [], teamId, teamsById = {}) => {
  const teamGames = games.filter(
    (game) =>
      game.isGameOver &&
      (game.competitors || []).some(
        (competitor) => String(competitor._id) === String(teamId)
      )
  );

  if (teamGames.length === 0) {
    return null;
  }

  let wins = 0;
  let losses = 0;
  let ties = 0;
  let pointsFor = 0;
  let pointsAgainst = 0;

  teamGames.forEach((game) => {
    const teamIndex = getTeamIndex(game, teamId);
    if (teamIndex === -1) return;

    const opponentIndex = teamIndex === 0 ? 1 : 0;
    const teamScore = parseInt(get(game, `competitors.${teamIndex}.score`, 0), 10) || 0;
    const opponentScore =
      parseInt(get(game, `competitors.${opponentIndex}.score`, 0), 10) || 0;

    pointsFor += teamScore;
    pointsAgainst += opponentScore;

    if (teamScore > opponentScore) wins += 1;
    else if (teamScore < opponentScore) losses += 1;
    else ties += 1;
  });

  const gamesPlayed = wins + losses + ties;
  const pointDifferential = pointsFor - pointsAgainst;
  const momentum = getMomentumFromGames(teamGames);

  const powerScore =
    wins * 3 -
    losses * 3 +
    pointDifferential * 0.35 +
    momentum * 1.5 +
    (wins - losses) * 0.5;

  const team = teamsById[String(teamId)] || {};

  return {
    teamId: String(teamId),
    name: team.name || team.location || team.shortLocation || "Team",
    shortLocation: team.shortLocation || team.name || "Team",
    wins,
    losses,
    ties,
    gamesPlayed,
    pointsFor,
    pointsAgainst,
    pointDifferential,
    momentum,
    powerScore,
  };
};

export const buildTeamRankings = ({ games = [], teams = [] }) => {
  const teamsById = teams.reduce((acc, team) => {
    acc[String(team._id)] = team;
    return acc;
  }, {});

  const teamIds = new Set();
  games.forEach((game) => {
    (game.competitors || []).forEach((competitor) => {
      if (competitor?._id) {
        teamIds.add(String(competitor._id));
      }
    });
  });

  const metrics = [...teamIds]
    .map((teamId) => buildTeamMetrics(games, teamId, teamsById))
    .filter(Boolean)
    .sort((a, b) => {
      if (b.powerScore !== a.powerScore) return b.powerScore - a.powerScore;
      if (b.pointDifferential !== a.pointDifferential) {
        return b.pointDifferential - a.pointDifferential;
      }
      return a.name.localeCompare(b.name);
    })
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
    }));

  return metrics;
};

export const attachRankMovement = (currentRankings = [], previousRankings = []) => {
  if (previousRankings.length === 0) {
    return currentRankings.map((entry) => ({
      ...entry,
      movement: "same",
      rankDelta: 0,
    }));
  }

  const previousRankByTeamId = previousRankings.reduce((acc, entry) => {
    acc[entry.teamId] = entry.rank;
    return acc;
  }, {});

  return currentRankings.map((entry) => {
    const previousRank = previousRankByTeamId[entry.teamId];
    if (!previousRank) {
      return { ...entry, movement: "new", rankDelta: null };
    }

    const rankDelta = previousRank - entry.rank;
    if (rankDelta > 0) return { ...entry, movement: "up", rankDelta };
    if (rankDelta < 0) return { ...entry, movement: "down", rankDelta };
    return { ...entry, movement: "same", rankDelta: 0 };
  });
};

export const filterGamesThroughDate = (games = [], endDateTime) => {
  if (!endDateTime) {
    return games.filter((game) => game.isGameOver);
  }

  const cutoff = new Date(endDateTime).getTime();
  return games.filter(
    (game) =>
      game.isGameOver && new Date(game.startDateTime).getTime() <= cutoff
  );
};
