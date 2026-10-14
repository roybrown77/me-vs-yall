export const RACE_LENGTH = { min: 5, max: 480, step: 30, fallback: 180 };

// Clamps race duration to allowed sprint (5s) or standard minimum through max seconds.
export const clampRaceLength = (seconds) => {
  const rounded = Math.round(Number(seconds));
  if (!Number.isFinite(rounded)) return RACE_LENGTH.fallback;
  if (rounded === RACE_LENGTH.min) return RACE_LENGTH.min;
  return Math.min(RACE_LENGTH.max, Math.max(RACE_LENGTH.step, rounded));
};

