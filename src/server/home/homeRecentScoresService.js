const mongoose = require('mongoose');
const moment = require('moment-timezone');
const get = require('lodash/get');

const gameRepository = require('../game/databaseRepositories/GameRepository');
const gameWeekRepository = require('../game/databaseRepositories/GameWeekRepository');
const pickRepository = require('../pick/PickRepository');
const userRepository = require('../user/UserRepository');

const {
  nbaTeams,
  premierLeagueTeams,
  ncaaTeams,
  mlbTeams,
  boxingCompetitors,
  ufcCompetitors,
  mlsTeams,
  nba2kCompetitors,
  wnbaTeams,
} = require('../utilities/teams');
const { nflTeams } = require('../utilities/teams/nfl');

const RECENT_GAME_LIMIT = 3;

const leagueIdToName = {
  '59723313734d1d6202a85f10': 'nfl',
  '59723313734d1d6202a85f15': 'cfb',
  '59723313734d1d6202a85f17': 'premier',
  '59723313734d1d6202a85f27': 'mma',
  '59723313734d1d6202a85f25': 'boxing',
  '59723313734d1d6202a85f21': 'mlb',
  '59723313734d1d6202a85f19': 'nba',
  '59723313734d1d6202a85f37': 'wnba',
  '59723313734d1d6202a85f33': 'ncaam',
  '59723313734d1d6202a85f31': 'ncaaw',
  '59723313734d1d6202a85f35': 'nba2k',
};

const teamsByLeagueId = {
  '59723313734d1d6202a85f10': nflTeams,
  '59723313734d1d6202a85f15': ncaaTeams,
  '59723313734d1d6202a85f17': premierLeagueTeams,
  '59723313734d1d6202a85f27': ufcCompetitors,
  '59723313734d1d6202a85f25': boxingCompetitors,
  '59723313734d1d6202a85f21': mlbTeams,
  '59723313734d1d6202a85f19': nbaTeams,
  '59723313734d1d6202a85f37': wnbaTeams,
  '59723313734d1d6202a85f33': ncaaTeams,
  '59723313734d1d6202a85f31': ncaaTeams,
  '59723313734d1d6202a85f35': nba2kCompetitors,
};

const censoredPictureIds = new Set([
  'google-oauth2|105396867324708249567',
  'google-oauth2|116142512598652278859',
]);

const slugify = (value = '') =>
  String(value)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'game';

const PLAYOFF_WEEK_SEGMENT_RULES = [
  { pattern: /super\s*bowl/i, segment: 'super-bowl' },
  { pattern: /conference/i, segment: 'conference-championship' },
  { pattern: /divisional/i, segment: 'divisional-round' },
  { pattern: /wild\s*card/i, segment: 'wild-card' },
  { pattern: /hall\s*of\s*fame/i, segment: 'hall-of-fame' },
];

const trimOrEmpty = (value) => String(value ?? '').trim();

const inferSeasonType = (week = {}) => {
  const description = String(week.description || '').toLowerCase();

  if (
    description.includes('preseason') ||
    description.includes('hall of fame') ||
    /pre\s*season/.test(description)
  ) {
    return 1;
  }

  if (
    description.includes('playoff') ||
    description.includes('wild card') ||
    description.includes('divisional') ||
    description.includes('conference') ||
    description.includes('super bowl') ||
    description.includes('final')
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
    .map((value) => String(value || '').trim())
    .filter(Boolean);

  return labelCandidates.some((label) => {
    const normalizedLabel = label.toLowerCase();

    if (normalizedLabel.startsWith('entire')) {
      return true;
    }

    return /^week\s+\d+\s*-\s*\d+\b/i.test(label);
  });
};

const getWeekLabelSources = (week = {}) =>
  [week.description, week.name, week.displayName]
    .map((value) => String(value || '').trim())
    .filter(Boolean);

const buildWeekSegmentFromWeek = (week = {}, { weekNumber } = {}) => {
  const sources = getWeekLabelSources(week);

  for (const source of sources) {
    for (const { pattern, segment } of PLAYOFF_WEEK_SEGMENT_RULES) {
      if (pattern.test(source)) {
        return segment;
      }
    }

    const weekMatch = /week\s+(\d+)/i.exec(source);
    if (weekMatch) {
      return `week-${weekMatch[1]}`;
    }
  }

  const primary = sources[0]?.split(/\s+(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun)\b/i)[0] || '';
  const fallback = slugify(primary);
  if (fallback && fallback !== 'game') {
    return fallback;
  }

  return weekNumber ? `week-${weekNumber}` : 'week';
};

const buildWeekQueryMetaMap = (weeks = []) => {
  const sortedWeeks = [...weeks]
    .sort(
      (a, b) =>
        new Date(a.beginDateTime || 0).getTime() - new Date(b.beginDateTime || 0).getTime()
    )
    .filter((week) => !week?.isRollup && !shouldSkipWeekSegment(week));

  const countersBySeasonType = { 1: 0, 2: 0, 3: 0 };
  const usedSegmentsBySeasonType = { 1: new Set(), 2: new Set(), 3: new Set() };
  const weekMetaById = {};

  sortedWeeks.forEach((week) => {
    const seasonType = inferSeasonType(week);
    countersBySeasonType[seasonType] = (countersBySeasonType[seasonType] || 0) + 1;
    const weekNumber = countersBySeasonType[seasonType];
    let weekSegment = buildWeekSegmentFromWeek(week, { weekNumber });
    const usedSegments = usedSegmentsBySeasonType[seasonType];

    if (usedSegments.has(weekSegment)) {
      let duplicateIndex = 2;
      while (usedSegments.has(`${weekSegment}-${duplicateIndex}`)) {
        duplicateIndex += 1;
      }
      weekSegment = `${weekSegment}-${duplicateIndex}`;
    }

    usedSegments.add(weekSegment);

    weekMetaById[String(week._id)] = {
      seasonType,
      week: weekNumber,
      weekSegment,
    };
  });

  return weekMetaById;
};

const findScoreboardWeek = (weeks = []) => {
  const sorted = [...weeks].sort(
    (a, b) => new Date(a.beginDateTime) - new Date(b.beginDateTime)
  );
  const now = moment().tz('America/New_York');

  const active = sorted.find((week) => {
    if (!week?.beginDateTime || !week?.endDateTime) {
      return false;
    }

    const begin = moment(week.beginDateTime).tz('America/New_York');
    const end = moment(week.endDateTime).tz('America/New_York');
    return now.isSameOrAfter(begin) && now.isSameOrBefore(end);
  });

  if (active) {
    return active;
  }

  const completed = sorted.filter(
    (week) =>
      week?.endDateTime &&
      moment(week.endDateTime).tz('America/New_York').isBefore(now)
  );

  if (completed.length) {
    return completed[completed.length - 1];
  }

  return sorted[0] || null;
};

const hasGameStarted = (startDateTime) => {
  return moment(startDateTime).diff(moment(), 'seconds') < 5;
};

const getPickerLabel = (user) => {
  const first = trimOrEmpty(get(user, 'firstName'));
  const last = trimOrEmpty(get(user, 'lastName'));

  if (first && last) {
    return `${first[0]}${last[0]}`.toUpperCase();
  }

  if (first) {
    return first.slice(0, 2).toUpperCase();
  }

  return '?';
};

const enrichCompetitors = (game, teamsById) => ({
  ...game,
  competitors: (game.competitors || []).map((competitor) => {
    const team = teamsById[String(competitor._id)];

    if (!team) {
      return competitor;
    }

    return {
      ...competitor,
      name: team.name,
      location: team.location,
      shortLocation: team.shortLocation,
      color: team.color || competitor.color,
    };
  }),
});

const buildFieldPickersForGame = (game, picks = [], usersByAuthId = {}) => {
  const awayId = String(game.competitors?.[0]?._id || '');
  const homeId = String(game.competitors?.[1]?._id || '');
  const away = [];
  const home = [];
  const seen = new Set();

  picks
    .filter((pick) => String(pick.gameId) === String(game._id))
    .forEach((pick) => {
      const dedupeKey = `${pick.userId}-${pick.pickId}`;
      if (seen.has(dedupeKey)) {
        return;
      }
      seen.add(dedupeKey);

      const user = usersByAuthId[String(pick.userId)];
      const entry = {
        id: String(pick.userId),
        picture: user?.picture || null,
        label: getPickerLabel(user),
      };

      if (String(pick.pickId) === awayId) {
        away.push(entry);
      } else if (String(pick.pickId) === homeId) {
        home.push(entry);
      }
    });

  return { away, home };
};

const getHomeRecentScores = async ({ leagueId, year }) => {
  const leagueKey = String(leagueId || '').toLowerCase();
  const leagueName = leagueIdToName[leagueKey] || 'nfl';
  const teams = teamsByLeagueId[leagueKey] || [];
  const teamsById = teams.reduce((acc, team) => {
    acc[String(team._id)] = team;
    return acc;
  }, {});

  const gameWeeks = await gameWeekRepository.find({
    leagueId: new mongoose.Types.ObjectId(leagueId),
    year,
  });

  const selectedWeek = findScoreboardWeek(gameWeeks || []);
  if (!selectedWeek) {
    return {
      navigation: { leagueName, year: Number(year), seasonType: null, weekSegment: null },
      games: [],
    };
  }

  const weekQueryMetaById = buildWeekQueryMetaMap(gameWeeks || []);
  const weekMeta = weekQueryMetaById[String(selectedWeek._id)] || {};
  const weekSegment =
    weekMeta.weekSegment && !shouldSkipWeekSegment(selectedWeek)
      ? weekMeta.weekSegment
      : null;

  const games = await gameRepository
    .find(
      {
        leagueId: new mongoose.Types.ObjectId(leagueId),
        year,
        isHidden: { $ne: true },
        startDateTime: {
          $gt: new Date(moment(selectedWeek.beginDateTime)),
          $lt: new Date(moment(selectedWeek.endDateTime)),
        },
      },
      {
        competitors: 1,
        startDateTime: 1,
        leagueId: 1,
        year: 1,
        isGameOver: 1,
      }
    )
    .lean()
    .exec();

  const recentGames = (games || [])
    .filter((game) => hasGameStarted(game.startDateTime))
    .sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime))
    .slice(0, RECENT_GAME_LIMIT)
    .map((game) => enrichCompetitors(game, teamsById));

  if (!recentGames.length) {
    return {
      navigation: {
        leagueName,
        year: Number(year),
        seasonType: weekMeta.seasonType ?? null,
        weekSegment,
      },
      games: [],
    };
  }

  const recentGameIds = recentGames.map((game) => game._id);
  const picks = await pickRepository.find({
    leagueId: new mongoose.Types.ObjectId(leagueId),
    year,
    gameId: { $in: recentGameIds },
    gameType: { $ne: 1 },
  });

  const userIds = [
    ...new Set(
      (picks || [])
        .map((pick) => pick.userId)
        .filter((id) => id && id !== '1')
    ),
  ];

  const users = userIds.length
    ? await userRepository.find({ authServiceId: { $in: userIds } })
    : [];

  const usersByAuthId = (users || []).reduce((acc, user) => {
    const authServiceId = String(user.authServiceId);
    acc[authServiceId] = {
      authServiceId,
      firstName: user.firstName,
      lastName: user.lastName,
      picture: censoredPictureIds.has(authServiceId) ? null : user.picture,
    };
    return acc;
  }, {});

  return {
    navigation: {
      leagueName,
      year: Number(year),
      seasonType: weekMeta.seasonType ?? null,
      weekSegment,
    },
    games: recentGames.map((game) => ({
      ...game,
      fieldPickers: buildFieldPickersForGame(game, picks, usersByAuthId),
    })),
  };
};

module.exports = {
  getHomeRecentScores,
};
