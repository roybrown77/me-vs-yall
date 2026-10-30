export const SIGN_IN_TROPHY_SCENE_ID = 'trophy';
export const SIGN_IN_TROPHY_CAPTION = 'Trophy case is waiting on you.';

export const SIGN_IN_CONSTELLATION_SCENE_ID = 'constellation';
export const SIGN_IN_CONSTELLATION_CAPTION = 'Look up — MVY is written in the stars.';

export const getSignInPlayfulSceneMeta = (sceneId = SIGN_IN_TROPHY_SCENE_ID) => {
  if (sceneId === SIGN_IN_CONSTELLATION_SCENE_ID) {
    return {
      id: SIGN_IN_CONSTELLATION_SCENE_ID,
      caption: SIGN_IN_CONSTELLATION_CAPTION,
    };
  }
  return {
    id: SIGN_IN_TROPHY_SCENE_ID,
    caption: SIGN_IN_TROPHY_CAPTION,
  };
};
