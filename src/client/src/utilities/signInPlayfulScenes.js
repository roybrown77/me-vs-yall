/**
 * Lottie shown on the sign-in prompt overlay.
 * Asset from LottieFiles (community); see https://lottiefiles.com/page/license
 */
import trophyAnimation from '../lottie/sign-in/lf20_touohxv0.json';
import { getSignInPlayfulSceneMeta } from './signInPlayfulSceneMeta.js';

export { SIGN_IN_TROPHY_CAPTION, SIGN_IN_TROPHY_SCENE_ID } from './signInPlayfulSceneMeta.js';

export const SIGN_IN_PLAYFUL_TROPHY_SCENE = {
  ...getSignInPlayfulSceneMeta(),
  kind: 'lottie',
  animationData: trophyAnimation,
};

/** Always the trophy moment on sign-in (no random skip or alternate scenes). */
export const pickSignInPlayfulScene = () => SIGN_IN_PLAYFUL_TROPHY_SCENE;
