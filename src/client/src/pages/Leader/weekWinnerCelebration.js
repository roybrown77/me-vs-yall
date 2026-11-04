export const shouldShowWeekWinnerCelebration = ({
  areAllGamesOver,
  games = [],
  isFirstLeader,
}) =>
  Boolean(areAllGamesOver && games.length > 0 && isFirstLeader);
