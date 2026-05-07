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

export const getGameTitle = (game, options = {}) => {
  const away = game?.competitors?.[0];
  const home = game?.competitors?.[1];
  const awayLabel = collapseGameName(away?.shortLocation || away?.name);
  const homeLabel = collapseGameName(home?.shortLocation || home?.name);
  const awayScore = typeof away?.score === "number" ? away.score : "-";
  const homeScore = typeof home?.score === "number" ? home.score : "-";

  const isSingleGame = !!options?.isSingleGame;
  const month = game?.startDateTime ? new Date(game.startDateTime).getMonth() : null;
  const useVsEmoji = isSingleGame && (month === 1 || month === 6 || month === 7); // February, July, August
  const separator = useVsEmoji ? "🆚" : "@";

  if (awayLabel && homeLabel) return `${awayScore} ${awayLabel} ${separator} ${homeScore} ${homeLabel}`;
  if (game?.gameName) return collapseGameName(game.gameName);
  return "Game";
};

export const getGameSubtitle = (game) => {
  const away = game?.competitors?.[0];
  const home = game?.competitors?.[1];
  const awayScore = typeof away?.score === "number" ? away.score : "-";
  const homeScore = typeof home?.score === "number" ? home.score : "-";
  const time = game?.isGameOver ? "FINAL" : (game?.currentTime || game?.gameTime);
  const date = game?.startDateTimeDisplay;
  const awayLabel = away?.shortLocation || away?.name;
  const homeLabel = home?.shortLocation || home?.name;

  return [time, date].filter(Boolean).join(" • ");
};
