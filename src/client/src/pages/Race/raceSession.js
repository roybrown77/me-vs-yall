import { RACE_LENGTH } from "./length.js";
import { RACE_SPEED, clampRaceSpeed } from "./speed.js";
import { isMountainStyle } from "./mountainStyle.js";
import { DEFAULT_CAR_MODEL, normalizeCarModel } from "./carModel.js";
import {
  DEFAULT_COURSE_PROFILE,
  DEFAULT_ROAD_SCALE,
  normalizeCourseProfile,
  normalizeRoadScale,
} from "./courseLayout.js";

export const DEFAULT_RACE_MUSIC_TRACK = "reggae";

const VALID_MUSIC_TRACKS = new Set([
  "off",
  "trap",
  "upbeat",
  "southernTrap",
  "reggae",
  "drizzyDust",
  "eightiesSynth",
]);

const isRaceMusicTrackId = (id) => VALID_MUSIC_TRACKS.has(id);
export const DEFAULT_MOUNTAIN_STYLE = "icy";

const createDefaultSession = () => ({
  lengthSeconds: RACE_LENGTH.fallback,
  speedMultiplier: RACE_SPEED.fallback,
  musicTrackId: DEFAULT_RACE_MUSIC_TRACK,
  mountainStyle: DEFAULT_MOUNTAIN_STYLE,
  carModelId: DEFAULT_CAR_MODEL,
  roadScale: DEFAULT_ROAD_SCALE,
  courseProfile: DEFAULT_COURSE_PROFILE,
});

let session = createDefaultSession();

/** Current race settings for this app session (not persisted to storage). */
export const getRaceSessionSettings = () => ({ ...session });

/** Updates race settings in memory; returns the normalized session snapshot. */
export const setRaceSessionSettings = (partial) => {
  if (partial.speedMultiplier != null) {
    session.speedMultiplier = clampRaceSpeed(partial.speedMultiplier);
  }
  if (partial.musicTrackId != null && isRaceMusicTrackId(partial.musicTrackId)) {
    session.musicTrackId = partial.musicTrackId;
  }
  if (partial.mountainStyle != null) {
    session.mountainStyle = isMountainStyle(partial.mountainStyle)
      ? partial.mountainStyle
      : DEFAULT_MOUNTAIN_STYLE;
  }
  if (partial.carModelId != null) {
    session.carModelId = normalizeCarModel(partial.carModelId);
  }
  if (partial.roadScale != null) {
    session.roadScale = normalizeRoadScale(partial.roadScale);
  }
  if (partial.courseProfile != null) {
    session.courseProfile = normalizeCourseProfile(partial.courseProfile);
  }
  return getRaceSessionSettings();
};

/** Resets session settings to app defaults (tests). */
export const resetRaceSessionSettings = () => {
  session = createDefaultSession();
};
