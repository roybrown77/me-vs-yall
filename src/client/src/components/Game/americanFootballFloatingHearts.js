export const HEART_SVG_PATH =
  "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z";

export const RAPID_TAP_WINDOW_MS = 900;
export const BASE_HEARTS_PER_TAP = 4;
export const BONUS_HEARTS_PER_RAPID_TAP = 2;
export const MAX_HEARTS_PER_TAP = 16;

export const LEFT_HEART_ORIGIN = { x: 17.5, y: 78 };
export const RIGHT_HEART_ORIGIN = { x: 352.5, y: 78 };

/**
 * Computes how many recent taps fall within the rapid-tap window and how many
 * floating hearts to spawn for the current tap.
 *
 * @param {{ recentTapTimesMs?: number[], nowMs?: number }} input
 * @returns {{ updatedTapTimesMs: number[], burstCount: number, rapidLevel: number }}
 */
export const computeHeartTapBurst = ({
  recentTapTimesMs = [],
  nowMs = Date.now(),
} = {}) => {
  const cutoff = nowMs - RAPID_TAP_WINDOW_MS;
  const activeTaps = recentTapTimesMs.filter((t) => nowMs - t <= RAPID_TAP_WINDOW_MS && t >= cutoff);
  const updatedTapTimesMs = [...activeTaps, nowMs];
  const rapidLevel = Math.max(0, updatedTapTimesMs.length - 1);
  const burstCount = Math.min(
    MAX_HEARTS_PER_TAP,
    BASE_HEARTS_PER_TAP + rapidLevel * BONUS_HEARTS_PER_RAPID_TAP,
  );

  return {
    updatedTapTimesMs,
    burstCount,
    rapidLevel,
  };
};

/**
 * Generates a burst of Instagram-style floating heart particle descriptors.
 *
 * @param {{
 *   side: 'left' | 'right',
 *   burstCount: number,
 *   rapidLevel?: number,
 *   nowMs?: number,
 *   idPrefix?: string,
 *   rng?: () => number,
 * }} input
 */
export const createFloatingHeartBurst = ({
  side,
  burstCount,
  rapidLevel = 0,
  nowMs = Date.now(),
  idPrefix = "heart",
  rng = Math.random,
}) => {
  const origin = side === "right" ? RIGHT_HEART_ORIGIN : LEFT_HEART_ORIGIN;
  const spreadFactor = 1 + Math.min(rapidLevel, 6) * 0.18;
  const heightBoost = Math.min(rapidLevel, 6) * 7;

  const particles = [];
  for (let i = 0; i < burstCount; i += 1) {
    const jitterX = (rng() - 0.5) * 14 * spreadFactor;
    const jitterY = (rng() - 0.5) * 6;
    const direction = rng() < 0.5 ? -1 : 1;
    const swayMagnitude = (6 + rng() * 14) * spreadFactor;
    const sway1 = Math.round(direction * swayMagnitude * 10) / 10;
    const sway2 = Math.round(-direction * (swayMagnitude * (0.75 + rng() * 0.5)) * 10) / 10;
    const sway3 = Math.round(direction * (swayMagnitude * (0.5 + rng() * 0.5)) * 10) / 10;
    const riseY = -Math.round(78 + rng() * 44 + heightBoost);
    const scale = Math.round((0.55 + rng() * 0.55 + Math.min(rapidLevel, 5) * 0.04) * 100) / 100;
    const rot1 = Math.round(direction * (6 + rng() * 14));
    const rot2 = Math.round(-direction * (6 + rng() * 14));
    const durationMs = Math.round(950 + rng() * 520);
    const delayMs = Math.round(i * (18 + rng() * 22));

    particles.push({
      id: `${idPrefix}-${side}-${nowMs}-${i}-${Math.floor(rng() * 100000)}`,
      side,
      x: Math.round((origin.x + jitterX) * 10) / 10,
      y: Math.round((origin.y + jitterY) * 10) / 10,
      sway1,
      sway2,
      sway3,
      riseY,
      scale,
      rot1,
      rot2,
      durationMs,
      delayMs,
      expiresAtMs: nowMs + durationMs + delayMs + 80,
    });
  }

  return particles;
};
