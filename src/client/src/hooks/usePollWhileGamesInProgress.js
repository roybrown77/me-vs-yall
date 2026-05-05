import { useEffect, useRef } from "react";

import { getAreAnyGamesInProgress } from "../utilities";

const usePollWhileGamesInProgress = ({
  games = [],
  onPoll,
  intervalMs = 15000,
  enabled = true,
}) => {
  const onPollRef = useRef(onPoll);

  useEffect(() => {
    onPollRef.current = onPoll;
  }, [onPoll]);

  useEffect(() => {
    if (!enabled) return;

    const id = setInterval(() => {
      if (!getAreAnyGamesInProgress(games)) return;
      onPollRef.current?.();
    }, intervalMs);

    return () => clearInterval(id);
  }, [enabled, games, intervalMs]);
};

export default usePollWhileGamesInProgress;
