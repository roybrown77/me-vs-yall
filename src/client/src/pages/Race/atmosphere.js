import * as THREE from "three";

/** Cold icy sky — also used for FogExp2 and renderer clear. */
export const RACE_SKY_COLOR = 0x6eb4ea;

/** Tuned with {@link RACE_CAMERA_FAR} so distant terrain fades before the far plane. */
export const RACE_FOG_DENSITY = 0.00228;

// Computes fog horizon distance for a given density and obscured fraction.
export const fogHorizonDistance = (
  density = RACE_FOG_DENSITY,
  obscured = 0.965,
) => {
  const t = -Math.log(Math.max(1 - obscured, 1e-4));
  return Math.sqrt(t) / density;
};

export const RACE_CAMERA_FAR = Math.ceil(fogHorizonDistance(RACE_FOG_DENSITY, 0.96) * 1.06);

// Applies sky color and exponential fog to the Three.js scene.
export const applyRaceAtmosphere = (scene) => {
  const color = new THREE.Color(RACE_SKY_COLOR);
  scene.background = color;
  scene.fog = new THREE.FogExp2(RACE_SKY_COLOR, RACE_FOG_DENSITY);
  return color;
};
