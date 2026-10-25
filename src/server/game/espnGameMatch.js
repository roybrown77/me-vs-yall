const moment = require('moment-timezone');

const NFL_TIMEZONE = 'America/New_York';

const getGameKeyFromIds = (ids = []) =>
  ids
    .map((id) => id.toString().toLowerCase())
    .sort()
    .join('|');

const getKickoffDateKey = (dateValue) => {
  if (!dateValue) {
    return '';
  }

  const parsed = moment(dateValue).tz(NFL_TIMEZONE);
  return parsed.isValid() ? parsed.format('YYYY-MM-DD') : '';
};

const buildGameMatchKey = (competitorIds = [], kickoffDateKey = '') => {
  const competitorKey = getGameKeyFromIds(competitorIds);
  if (!competitorKey) {
    return '';
  }

  return kickoffDateKey ? `${competitorKey}@${kickoffDateKey}` : competitorKey;
};

const getDbGameMatchKey = (dbGame = {}) =>
  buildGameMatchKey(
    (dbGame.competitors || []).map((competitor) => competitor?._id).filter(Boolean),
    getKickoffDateKey(dbGame.startDateTime)
  );

const getScrapedGameMatchKey = (scrapedGame = {}, kickoff = null) => {
  const kickoffDateKey =
    getKickoffDateKey(kickoff) ||
    getKickoffDateKey(scrapedGame.apiKickoff) ||
    '';

  return buildGameMatchKey(
    (scrapedGame.game || []).map((team) => team?.teamDetails?._id).filter(Boolean),
    kickoffDateKey
  );
};

const hasSameCompetitors = ({ dbGame, scrapedGame }) => {
  const dbCompetitorIds = (dbGame.competitors || [])
    .map((competitor) => competitor?._id?.toString().toLowerCase())
    .filter(Boolean);

  const scrapedCompetitorIds = (scrapedGame.game || [])
    .map((team) => team?.teamDetails?._id?.toString().toLowerCase())
    .filter(Boolean);

  if (dbCompetitorIds.length !== 2 || scrapedCompetitorIds.length !== 2) {
    return false;
  }

  return dbCompetitorIds.every((id) => scrapedCompetitorIds.includes(id));
};

const hasSameGameMatch = ({ dbGame, scrapedGame, scrapedKickoff = null }) => {
  if (!hasSameCompetitors({ dbGame, scrapedGame })) {
    return false;
  }

  const dbMatchKey = getDbGameMatchKey(dbGame);
  const scrapedMatchKey = getScrapedGameMatchKey(scrapedGame, scrapedKickoff);

  if (!dbMatchKey.includes('@') || !scrapedMatchKey.includes('@')) {
    return false;
  }

  return dbMatchKey === scrapedMatchKey;
};

// Weekly scoreboard reconcile: same two teams on this week's board (kickoff keys can diverge for live/final).
const hasScoreboardWeekGameMatch = ({ dbGame, scrapedGame }) =>
  hasSameCompetitors({ dbGame, scrapedGame });

module.exports = {
  NFL_TIMEZONE,
  buildGameMatchKey,
  getDbGameMatchKey,
  getGameKeyFromIds,
  getKickoffDateKey,
  getScrapedGameMatchKey,
  hasSameCompetitors,
  hasSameGameMatch,
  hasScoreboardWeekGameMatch,
};
