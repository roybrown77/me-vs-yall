const FIGHT_LEAGUE_IDS = ["59723313734d1d6202a85f25", "59723313734d1d6202a85f27"];

const isFightLeague = (leagueId) => FIGHT_LEAGUE_IDS.includes(leagueId);

export const getLeagueGameNoun = ({ leagueId, plural = false }) => {
  const base = isFightLeague(leagueId) ? "fight" : "game";
  return plural ? `${base}s` : base;
};
