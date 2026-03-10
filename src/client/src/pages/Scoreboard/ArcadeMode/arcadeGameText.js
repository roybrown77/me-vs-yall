const getTeamLabel = (competitor = {}) => {
  return (
    competitor.shortLocation ||
    competitor.abbreviation ||
    competitor.location ||
    competitor.name ||
    "Team"
  );
};

const getTeamTinyLabel = (competitor = {}) => {
  const label =
    competitor.abbreviation ||
    competitor.shortLocation ||
    competitor.shortName ||
    competitor.location ||
    competitor.name ||
    "Team";
  const text = String(label || "Team");
  if (text.length <= 12) return text;
  return `${text.slice(0, 12)}…`;
};

const getScoreText = (game) => {
  const awayScore = game?.competitors?.[0]?.score;
  const homeScore = game?.competitors?.[1]?.score;
  const a = typeof awayScore === "number" ? awayScore : 0;
  const h = typeof homeScore === "number" ? homeScore : 0;
  return `${a}-${h}`;
};

const getGameLabelWithScore = (game, away, home) => {
  const awayLabel = getTeamLabel(away);
  const homeLabel = getTeamLabel(home);
  const scoreText = getScoreText(game);
  const suffix = game?.isGameOver ? " • Final" : "";
  return `${awayLabel} ${scoreText} ${homeLabel}${suffix}`;
};

export { getGameLabelWithScore, getScoreText, getTeamLabel, getTeamTinyLabel };
