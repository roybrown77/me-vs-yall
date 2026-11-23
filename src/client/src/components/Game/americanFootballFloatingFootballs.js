export { computeHeartTapBurst as computePlayToggleTapBurst } from "./americanFootballFloatingHearts.js";

/** Burst anchor (px); rendered per play-toggle slot with `position: absolute` + jitter. */
export const PLAY_MODE_BURST_ORIGIN = { x: 0, y: 0 };

/**
 * Generates floating football particle descriptors (same motion model as hearts).
 *
 * @param {{
 *   playMode: 'pass' | 'run' | 'kick',
 *   burstCount: number,
 *   rapidLevel?: number,
 *   nowMs?: number,
 *   idPrefix?: string,
 *   rng?: () => number,
 * }} input
 */
export const createFloatingFootballBurst = ({
  playMode,
  burstCount,
  rapidLevel = 0,
  nowMs = Date.now(),
  idPrefix = "football",
  rng = Math.random,
}) => {
  const origin = PLAY_MODE_BURST_ORIGIN;
  const spreadFactor = 1 + Math.min(rapidLevel, 6) * 0.18;
  const heightBoost = Math.min(rapidLevel, 6) * 7;

  const particles = [];
  for (let i = 0; i < burstCount; i += 1) {
    const jitterX = (rng() - 0.5) * 16 * spreadFactor;
    const jitterY = -(3 + rng() * 8);
    const direction = rng() < 0.5 ? -1 : 1;
    const swayMagnitude = (6 + rng() * 14) * spreadFactor;
    const sway1 = Math.round(direction * swayMagnitude * 10) / 10;
    const sway2 = Math.round(-direction * (swayMagnitude * (0.75 + rng() * 0.5)) * 10) / 10;
    const sway3 = Math.round(direction * (swayMagnitude * (0.5 + rng() * 0.5)) * 10) / 10;
    const riseY = -Math.round(72 + rng() * 40 + heightBoost);
    const scale = Math.round((0.94 + rng() * 0.1 + Math.min(rapidLevel, 5) * 0.015) * 100) / 100;
    const rot1 = Math.round(direction * (10 + rng() * 22));
    const rot2 = Math.round(-direction * (10 + rng() * 22));
    const durationMs = Math.round(950 + rng() * 520);
    const delayMs = Math.round(i * (18 + rng() * 22));

    particles.push({
      id: `${idPrefix}-${playMode}-${nowMs}-${i}-${Math.floor(rng() * 100000)}`,
      playMode,
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