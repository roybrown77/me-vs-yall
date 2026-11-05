const { ObjectId } = require("mongodb");

/** NFL league id in Mongo (ObjectId string). */
const NFL_LEAGUE_ID = "59723313734d1d6202a85f10";

const nflLeagueObjectId = () => new ObjectId(NFL_LEAGUE_ID);

const buildNflIncrementalQueries = (sinceDate) => {
  const leagueId = nflLeagueObjectId();
  const since = new Date(sinceDate);

  const games = {
    leagueId,
    $or: [{ startDateTime: { $gte: since } }, { endDateTime: { $gte: since } }],
  };

  const gameweeks = {
    leagueId,
    $or: [{ beginDateTime: { $gte: since } }, { endDateTime: { $gte: since } }],
  };

  const picks = {
    leagueId,
    $or: [
      { createDateTime: { $gte: since } },
      { gameDateTime: { $gte: since } },
    ],
  };

  return { leagueId, since, games, gameweeks, picks };
};

module.exports = {
  NFL_LEAGUE_ID,
  nflLeagueObjectId,
  buildNflIncrementalQueries,
};
