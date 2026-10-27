import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SIGN_IN_TROPHY_CAPTION,
  SIGN_IN_TROPHY_SCENE_ID,
  getSignInPlayfulSceneMeta,
} from '../signInPlayfulSceneMeta.js';

test('sign-in playful moment is always the trophy scene', () => {
  const meta = getSignInPlayfulSceneMeta();
  assert.equal(meta.id, SIGN_IN_TROPHY_SCENE_ID);
  assert.equal(meta.caption, SIGN_IN_TROPHY_CAPTION);
  assert.equal(meta.caption, 'Trophy case is waiting on you.');
});
