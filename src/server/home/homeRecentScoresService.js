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

const {
  buildWeekQueryMetaMap,
  findCurrentWeek,
  findPriorWeek,
} = require('../game/gameWeekNavigation');

const trimOrEmpty = (value) => String(value ?? '').trim();

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

const fetchRecentStartedGamesForWeek = async ({
  leagueId,
  year,
  week,
  teamsById,
}) => {
  if (!week?.beginDateTime || !week?.endDateTime) {
    return [];
  }

  const games = await gameRepository
    .find(
      {
        leagueId: new mongoose.Types.ObjectId(leagueId),
        year,
        isHidden: { $ne: true },
        startDateTime: {
          $gt: new Date(moment(week.beginDateTime)),
          $lt: new Date(moment(week.endDateTime)),
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

  return (games || [])
    .filter((game) => hasGameStarted(game.startDateTime))
    .sort((a, b) => new Date(b.startDateTime) - new Date(a.startDateTime))
    .slice(0, RECENT_GAME_LIMIT)
    .map((game) => enrichCompetitors(game, teamsById));
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

  const weekQueryMetaById = buildWeekQueryMetaMap(gameWeeks || []);
  const currentWeek = findCurrentWeek(gameWeeks || []);
  const priorWeek = findPriorWeek(gameWeeks || []);

  let selectedWeek = currentWeek;
  let recentGames = [];

  if (currentWeek) {
    recentGames = await fetchRecentStartedGamesForWeek({
      leagueId,
      year,
      week: currentWeek,
      teamsById,
    });
  }

  if (
    !recentGames.length &&
    priorWeek &&
    String(priorWeek._id) !== String(currentWeek?._id)
  ) {
    selectedWeek = priorWeek;
    recentGames = await fetchRecentStartedGamesForWeek({
      leagueId,
      year,
      week: priorWeek,
      teamsById,
    });
  }

  if (!selectedWeek) {
    return {
      navigation: { leagueName, year: Number(year), seasonType: null, weekSegment: null },
      games: [],
    };
  }

  const weekMeta = weekQueryMetaById[String(selectedWeek._id)] || {};
  const weekSegment = weekMeta.weekSegment ?? null;

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
