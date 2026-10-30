import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SIGN_IN_TROPHY_CAPTION,
  SIGN_IN_TROPHY_SCENE_ID,
  SIGN_IN_CONSTELLATION_CAPTION,
  SIGN_IN_CONSTELLATION_SCENE_ID,
  getSignInPlayfulSceneMeta,
} from '../signInPlayfulSceneMeta.js';

test('sign-in playful scene meta exposes trophy and constellation scenes', () => {
  const trophy = getSignInPlayfulSceneMeta();
  assert.equal(trophy.id, SIGN_IN_TROPHY_SCENE_ID);
  assert.equal(trophy.caption, SIGN_IN_TROPHY_CAPTION);
  assert.equal(trophy.caption, 'Trophy case is waiting on you.');

  const constellation = getSignInPlayfulSceneMeta(SIGN_IN_CONSTELLATION_SCENE_ID);
  assert.equal(constellation.id, SIGN_IN_CONSTELLATION_SCENE_ID);
  assert.equal(constellation.caption, SIGN_IN_CONSTELLATION_CAPTION);
  assert.equal(constellation.caption, 'Look up — MVY is written in the stars.');
});
