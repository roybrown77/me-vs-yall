export const ROAD_SCALES = [1, 2, 3];

export const ROAD_SCALE_LABELS = {
  1: "Standard",
  2: "Double",
  3: "Triple",
};

export const DEFAULT_ROAD_SCALE = 2;

export const COURSE_PROFILES = ["standard", "turns", "hills", "mixed"];

export const COURSE_PROFILE_LABELS = {
  standard: "Standard",
  turns: "Turns",
  hills: "Hills",
  mixed: "All",
};

export const DEFAULT_COURSE_PROFILE = "hills";

export const normalizeRoadScale = (scale) => {
  const rounded = Math.round(Number(scale));
  return ROAD_SCALES.includes(rounded) ? rounded : DEFAULT_ROAD_SCALE;
};

export const isCourseProfile = (id) => COURSE_PROFILES.includes(id);

export const normalizeCourseProfile = (id) =>
  (isCourseProfile(id) ? id : DEFAULT_COURSE_PROFILE);

export const stepRoadScale = (scale, delta) => {
  const index = ROAD_SCALES.indexOf(normalizeRoadScale(scale));
  const next = ROAD_SCALES[(index + delta + ROAD_SCALES.length) % ROAD_SCALES.length];
  return next;
};

export const stepCourseProfile = (profile, delta) => {
  const index = COURSE_PROFILES.indexOf(normalizeCourseProfile(profile));
  const next = COURSE_PROFILES[(index + delta + COURSE_PROFILES.length) % COURSE_PROFILES.length];
  return next;
};
