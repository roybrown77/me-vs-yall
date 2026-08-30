const FIGHT_LEAGUE_IDS = ["59723313734d1d6202a85f25", "59723313734d1d6202a85f27"];

const isFightLeague = (leagueId) => FIGHT_LEAGUE_IDS.includes(String(leagueId));

export const getSharedCompetitorTextSizes = (competitors = [], { slimMode = false } = {}) => {
  const maxLocationLen = Math.max(...competitors.map((c) => (c.shortLocation || "").length), 0);
  const maxNameLen = Math.max(...competitors.map((c) => (c.name || "").length), 0);

  let locationFontSize = slimMode ? "1.85em" : "2.5em";
  if (maxLocationLen > 11) {
    locationFontSize = slimMode ? "1.05em" : "1.2em";
  } else if (maxLocationLen > 9) {
    locationFontSize = slimMode ? "1.15em" : "1.45em";
  } else if (maxLocationLen > 7) {
    locationFontSize = slimMode ? "1.3em" : "1.65em";
  } else if (maxLocationLen > 5) {
    locationFontSize = slimMode ? "1.55em" : "1.9em";
  } else if (maxLocationLen > 3) {
    locationFontSize = slimMode ? "1.7em" : "1.75em";
  }

  let nameFontSize = slimMode ? "1.05em" : "20px";
  if (maxNameLen > 22) {
    nameFontSize = slimMode ? "0.85em" : "13px";
  } else if (maxNameLen > 18) {
    nameFontSize = slimMode ? "0.95em" : "15px";
  } else if (maxNameLen > 14) {
    nameFontSize = slimMode ? "1em" : "17px";
  }

  return { locationFontSize, nameFontSize };
};

/** @deprecated Use getSharedCompetitorTextSizes */
export const getFightCompetitorTextSizes = getSharedCompetitorTextSizes;

export { isFightLeague };

export const getLeagueGameNoun = ({ leagueId, plural = false }) => {
  const base = isFightLeague(leagueId) ? "fight" : "game";
  return plural ? `${base}s` : base;
};
