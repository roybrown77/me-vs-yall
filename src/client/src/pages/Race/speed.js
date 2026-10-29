export const RACE_SPEED = { min: 1, max: 4, step: 0.5, fallback: 2 };

// Clamps a pace multiplier to the allowed race speed range.
export const clampRaceSpeed = (multiplier) => {
  const rounded = Math.round(Number(multiplier) * 100) / 100;
  if (!Number.isFinite(rounded)) return RACE_SPEED.fallback;
  return Math.min(RACE_SPEED.max, Math.max(RACE_SPEED.min, rounded));
};

// Formats a multiplier as a percentage label for the UI.
export const formatRaceSpeed = (multiplier) => `${Math.round(multiplier * 100)}%`;
