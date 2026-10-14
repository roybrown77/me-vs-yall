import { hasGameStarted } from "../../utilities";
import { inferSeasonType } from "./rankings";

const DIVISIONS = ["East", "North", "South", "West"];

const scoreOf = (competitor) => {
  const value = Number.parseInt(competitor?.score, 10);
  return Number.isFinite(value) ? value : 0;
};

const resultFor = (teamScore, opponentScore) => {
  if (teamScore > opponentScore) return "W";
  if (teamScore < opponentScore) return "L";
  return "T";
};

const isRollupWeek = (week = {}) => {
  if (week.isRollup) return true;

  return [week.displayName, week.description, week.name].some((value) => {
    const label = String(value || "").trim().toLowerCase();
    if (!label) return false;
    return label.startsWith("entire") || /^week\s+\d+\s*-\s*\d+\b/i.test(label);
  });
};

const regularSeasonWeeks = (weeks = []) =>
  weeks.filter(
    (week) => !isRollupWeek(week) && inferSeasonType(week) === 2
  );

const gameFallsInWeek = (game, week) => {
  const start = new Date(game.startDateTime).getTime();
  const begin = new Date(week.beginDateTime).getTime();
  const end = new Date(week.endDateTime).getTime();
  return start >= begin && start <= end;
};

const isRegularSeasonGame = (game, weeks) =>
  regularSeasonWeeks(weeks).some((week) => gameFallsInWeek(game, week));

const liveScoreIsDecided = (game) => {
  const competitors = game?.competitors || [];
  if (competitors.length < 2) return false;
  return scoreOf(competitors[0]) !== scoreOf(competitors[1]);
};

export const gameCountsTowardPlayoffSeed = (game) => {
  if (!game || game.isHidden) return false;
  if (!hasGameStarted(game.startDateTime)) return false;
  if (game.isGameOver) return true;
  return liveScoreIsDecided(game);
};

const winPct = (wins, losses, ties) => {
  const played = wins + losses + ties;
  if (!played) return 0;
  return (wins + ties * 0.5) / played;
};

const formatRecord = (team) =>
  team.ties > 0
    ? `${team.wins}-${team.losses}-${team.ties}`
    : `${team.wins}-${team.losses}`;

const emptyRecord = (team) => ({
  teamId: String(team._id),
  shortLocation: team.shortLocation || team.name || "Team",
  name: team.name || team.location || "Team",
  color: team.color || "#64748b",
  conference: team.conference,
  division: team.division,
  wins: 0,
  losses: 0,
  ties: 0,
  pointsFor: 0,
  pointsAgainst: 0,
  divisionWins: 0,
  divisionLosses: 0,
  divisionTies: 0,
  conferenceWins: 0,
  conferenceLosses: 0,
  conferenceTies: 0,
  against: new Map(),
  live: false,
});

const applyResult = (record, opponentId, result, pointsFor, pointsAgainst, flags) => {
  if (result === "W") record.wins += 1;
  else if (result === "L") record.losses += 1;
  else record.ties += 1;

  record.pointsFor += pointsFor;
  record.pointsAgainst += pointsAgainst;

  if (flags.division) {
    if (result === "W") record.divisionWins += 1;
    else if (result === "L") record.divisionLosses += 1;
    else record.divisionTies += 1;
  }

  if (flags.conference) {
    if (result === "W") record.conferenceWins += 1;
    else if (result === "L") record.conferenceLosses += 1;
    else record.conferenceTies += 1;
  }

  const results = record.against.get(opponentId) || [];
  results.push(result);
  record.against.set(opponentId, results);
};

const headToHeadKeys = (group) => {
  if (group.length < 2) return null;

  const stats = group.map((team) => {
    let wins = 0;
    let losses = 0;
    let ties = 0;
    let opponentsPlayed = 0;

    group.forEach((other) => {
      if (other.teamId === team.teamId) return;
      const results = team.against.get(other.teamId) || [];
      if (!results.length) return;
      opponentsPlayed += 1;
      results.forEach((result) => {
        if (result === "W") wins += 1;
        else if (result === "L") losses += 1;
        else ties += 1;
      });
    });

    const played = wins + losses + ties;
    return {
      teamId: team.teamId,
      wins,
      losses,
      ties,
      opponentsPlayed,
      pct: played ? winPct(wins, losses, ties) : null,
    };
  });

  const playedEveryone = stats.every(
    (entry) => entry.opponentsPlayed === group.length - 1
  );
  if (playedEveryone) {
    return stats.map((entry) => entry.pct ?? 0);
  }

  const beatTheGroup = (entry) =>
    entry.opponentsPlayed === group.length - 1 &&
    entry.wins > 0 &&
    entry.losses === 0 &&
    entry.ties === 0;
  const lostToTheGroup = (entry) =>
    entry.opponentsPlayed === group.length - 1 &&
    entry.losses > 0 &&
    entry.wins === 0 &&
    entry.ties === 0;

  if (!stats.some(beatTheGroup) && !stats.some(lostToTheGroup)) {
    return null;
  }

  return stats.map((entry) => {
    if (beatTheGroup(entry)) return 2;
    if (lostToTheGroup(entry)) return 0;
    return 1;
  });
};

const numericKey = (team, read) => {
  const value = read(team);
  return Number.isFinite(value) ? value : 0;
};

const sortByBreakers = (group, breakers) => {
  if (group.length <= 1) return group;

  for (const breaker of breakers) {
    const keys = breaker(group);
    if (!keys || keys.length !== group.length) continue;

    const unique = new Set(keys.map((key) => key.toFixed(6)));
    if (unique.size <= 1) continue;

    const buckets = new Map();
    group.forEach((team, index) => {
      const key = keys[index].toFixed(6);
      const bucket = buckets.get(key) || [];
      bucket.push(team);
      buckets.set(key, bucket);
    });

    return [...buckets.keys()]
      .sort((a, b) => Number(b) - Number(a))
      .flatMap((key) => sortByBreakers(buckets.get(key), breakers));
  }

  return [...group].sort((a, b) =>
    String(a.shortLocation).localeCompare(String(b.shortLocation))
  );
};

const sortTeams = (teams, { useDivisionRecord = false } = {}) => {
  const breakers = [
    (group) =>
      group.map((team) => winPct(team.wins, team.losses, team.ties)),
    (group) => headToHeadKeys(group),
  ];

  if (useDivisionRecord) {
    breakers.push((group) =>
      group.map((team) =>
        numericKey(team, (entry) =>
          winPct(entry.divisionWins, entry.divisionLosses, entry.divisionTies)
        )
      )
    );
  }

  breakers.push(
    (group) =>
      group.map((team) =>
        numericKey(team, (entry) =>
          winPct(
            entry.conferenceWins,
            entry.conferenceLosses,
            entry.conferenceTies
          )
        )
      ),
    (group) =>
      group.map((team) => team.pointsFor - team.pointsAgainst),
    (group) => group.map((team) => team.pointsFor)
  );

  return sortByBreakers(teams, breakers);
};

const toSeed = (team, seed) => ({
  teamId: team.teamId,
  shortLocation: team.shortLocation,
  name: team.name,
  color: team.color,
  conference: team.conference,
  division: team.division,
  wins: team.wins,
  losses: team.losses,
  ties: team.ties,
  live: team.live,
  seed,
  recordLabel: formatRecord(team),
});

const seedConference = (teams, conference) => {
  const winners = DIVISIONS.map((division) => {
    const group = teams.filter((team) => team.division === division);
    return sortTeams(group, { useDivisionRecord: true })[0];
  }).filter(Boolean);

  const seededWinners = sortTeams(winners, { useDivisionRecord: false });
  const winnerIds = new Set(seededWinners.map((team) => team.teamId));
  const wildCards = sortTeams(
    teams.filter((team) => !winnerIds.has(team.teamId)),
    { useDivisionRecord: false }
  ).slice(0, 3);

  const seeds = [...seededWinners, ...wildCards].map((team, index) =>
    toSeed(team, index + 1)
  );
  const bySeed = Object.fromEntries(seeds.map((team) => [team.seed, team]));

  return {
    conference,
    bye: bySeed[1] || null,
    wildCard: [
      { higher: bySeed[2], lower: bySeed[7] },
      { higher: bySeed[3], lower: bySeed[6] },
      { higher: bySeed[4], lower: bySeed[5] },
    ].filter((game) => game.higher && game.lower),
  };
};

const buildRecords = (teams, games) => {
  const records = new Map();

  teams.forEach((team) => {
    if (!team?._id || !team.conference || !team.division) return;
    records.set(String(team._id), emptyRecord(team));
  });

  games.forEach((game) => {
    const competitors = game.competitors || [];
    if (competitors.length < 2) return;

    const home = records.get(String(competitors[1]?._id));
    const away = records.get(String(competitors[0]?._id));
    if (!home || !away) return;

    const awayScore = scoreOf(competitors[0]);
    const homeScore = scoreOf(competitors[1]);
    const awayResult = resultFor(awayScore, homeScore);
    const homeResult = resultFor(homeScore, awayScore);
    const sameDivision =
      home.conference === away.conference && home.division === away.division;
    const sameConference = home.conference === away.conference;
    const live = !game.isGameOver;

    applyResult(away, home.teamId, awayResult, awayScore, homeScore, {
      division: sameDivision,
      conference: sameConference,
    });
    applyResult(home, away.teamId, homeResult, homeScore, awayScore, {
      division: sameDivision,
      conference: sameConference,
    });

    if (live) {
      away.live = true;
      home.live = true;
    }
  });

  return [...records.values()];
};

export const buildPlayoffBracket = ({
  teams = [],
  seasonGames = [],
  liveGames = [],
  weeks = [],
}) => {
  const byId = new Map();

  seasonGames.forEach((game) => {
    if (game?._id && game.isGameOver) {
      byId.set(String(game._id), game);
    }
  });

  liveGames.forEach((game) => {
    if (!game?._id || !hasGameStarted(game.startDateTime)) return;
    byId.set(String(game._id), game);
  });

  const countableGames = [...byId.values()].filter(
    (game) =>
      isRegularSeasonGame(game, weeks) && gameCountsTowardPlayoffSeed(game)
  );

  const records = buildRecords(teams, countableGames);
  const hasResults = records.some(
    (team) => team.wins + team.losses + team.ties > 0
  );

  return {
    hasResults,
    conferences: ["AFC", "NFC"]
      .map((conference) =>
        seedConference(
          records.filter((team) => team.conference === conference),
          conference
        )
      )
      .filter((conference) => conference.bye),
  };
};
