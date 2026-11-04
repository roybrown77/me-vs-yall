/** Boost SFX vs BGM — race-game-sounds.mp4 reads quiet at 1.0 Web Audio gain. */
export const RACE_GAME_SOUNDS_VOLUME_MULTIPLIER = 1.25;

export const scaleRaceGameSoundsGain = (volume) =>
  Math.min(1.25, Math.max(0, Number(volume) * RACE_GAME_SOUNDS_VOLUME_MULTIPLIER));

export const scaleRaceGameSoundsFallbackVolume = (volume) =>
  Math.min(1, Math.max(0, Number(volume) * RACE_GAME_SOUNDS_VOLUME_MULTIPLIER));
