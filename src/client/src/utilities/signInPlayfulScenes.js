/**
 * Playful moments shown on the sign-in prompt overlay.
 * Trophy Lottie asset from LottieFiles (community); see https://lottiefiles.com/page/license
 */
import trophyAnimation from '../lottie/sign-in/lf20_touohxv0.json';
import constellationAnimation from '../lottie/sign-in/night-city-constellation.json';
import {
  SIGN_IN_TROPHY_CAPTION,
  SIGN_IN_TROPHY_SCENE_ID,
  SIGN_IN_CONSTELLATION_CAPTION,
  SIGN_IN_CONSTELLATION_SCENE_ID,
  getSignInPlayfulSceneMeta,
} from './signInPlayfulSceneMeta.js';

export {
  SIGN_IN_TROPHY_CAPTION,
  SIGN_IN_TROPHY_SCENE_ID,
  SIGN_IN_CONSTELLATION_CAPTION,
  SIGN_IN_CONSTELLATION_SCENE_ID,
} from './signInPlayfulSceneMeta.js';

export const SIGN_IN_PLAYFUL_TROPHY_SCENE = {
  ...getSignInPlayfulSceneMeta(SIGN_IN_TROPHY_SCENE_ID),
  kind: 'lottie',
  animationData: trophyAnimation,
};

export const SIGN_IN_PLAYFUL_CONSTELLATION_SCENE = {
  ...getSignInPlayfulSceneMeta(SIGN_IN_CONSTELLATION_SCENE_ID),
  kind: 'lottie',
  animationData: constellationAnimation,
};

export const SIGN_IN_PLAYFUL_SCENES = [
  SIGN_IN_PLAYFUL_TROPHY_SCENE,
  SIGN_IN_PLAYFUL_CONSTELLATION_SCENE,
];

/** Randomly picks between the available playful scenes on sign-in. */
export const pickSignInPlayfulScene = (rng = Math.random) => {
  const index = Math.floor(rng() * SIGN_IN_PLAYFUL_SCENES.length);
  return SIGN_IN_PLAYFUL_SCENES[index] || SIGN_IN_PLAYFUL_TROPHY_SCENE;
};
