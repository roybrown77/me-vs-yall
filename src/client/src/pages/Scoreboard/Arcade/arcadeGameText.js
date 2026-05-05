export const collapseGameName = (name) => {
  if (typeof name !== "string") return name;
  const trimmed = name.trim();
  if (!trimmed) return trimmed;

  if (trimmed.length <= 3) return trimmed;

  const words = trimmed.split(/\s+/).filter(Boolean);
  const maxWords = 3;
  const collapsed = words.slice(0, maxWords).join(" ");
  return words.length > maxWords ? `${collapsed}…` : collapsed;
};

export const getGameTitle = (game) => {
  const away = game?.competitors?.[0]?.name;
  const home = game?.competitors?.[1]?.name;
  if (game?.gameName) return collapseGameName(game.gameName);
  if (away && home) return `${away} vs ${home}`;
  return "Game";
};

export const getGameSubtitle = (game) => {
  const away = game?.competitors?.[0];
  const home = game?.competitors?.[1];
  const awayScore = typeof away?.score === "number" ? away.score : "-";
  const homeScore = typeof home?.score === "number" ? home.score : "-";
  const time = game?.isGameOver ? "FINAL" : (game?.currentTime || game?.gameTime);
  const date = game?.startDateTimeDisplay;
  const scoreLine = away?.name && home?.name
    ? `${away.name} ${awayScore} - ${homeScore} ${home.name}`
    : `${awayScore} - ${homeScore}`;

  return [time, date, scoreLine].filter(Boolean).join(" • ");
};
