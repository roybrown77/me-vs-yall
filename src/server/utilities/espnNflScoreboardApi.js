const buildEspnNflScoreboardApiUrl = ({ year, seasonType, weekNumber }) => {
  const params = new URLSearchParams({
    seasontype: String(seasonType),
    week: String(weekNumber),
    year: String(year),
  });
  return `https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard?${params.toString()}`;
};

const parseEspnScoreboardEvents = (payload = {}) =>
  (payload.events || []).map((event) => ({
    espnGameId: event.id ? String(event.id) : null,
    startDateTime: event.date ? new Date(event.date) : null,
    shortName: event.shortName || null,
  }));

const fetchEspnNflScoreboardEvents = async ({ year, seasonType, weekNumber }) => {
  const url = buildEspnNflScoreboardApiUrl({ year, seasonType, weekNumber });
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`ESPN scoreboard API ${response.status} for ${url}`);
  }

  const payload = await response.json();
  return parseEspnScoreboardEvents(payload);
};

const buildEspnKickoffByGameId = (events = []) => {
  const kickoffByGameId = {};

  events.forEach((event) => {
    if (!event?.espnGameId || !event?.startDateTime) {
      return;
    }

    kickoffByGameId[event.espnGameId] = event.startDateTime;
  });

  return kickoffByGameId;
};

const enrichScrapedResultsWithEspnKickoffs = (results = [], kickoffByGameId = {}) =>
  results.map((result) => {
    const espnGameId = result?.espnGameId ? String(result.espnGameId) : null;
    const apiKickoff = espnGameId ? kickoffByGameId[espnGameId] : null;

    if (!apiKickoff) {
      return result;
    }

    return {
      ...result,
      apiKickoff,
    };
  });

module.exports = {
  buildEspnKickoffByGameId,
  buildEspnNflScoreboardApiUrl,
  enrichScrapedResultsWithEspnKickoffs,
  fetchEspnNflScoreboardEvents,
  parseEspnScoreboardEvents,
};
