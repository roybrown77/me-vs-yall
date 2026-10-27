import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SIGN_IN_PROMPT_COOLDOWN_HOURS,
  SIGN_IN_PROMPT_DELAY_MS,
  getSignInPromptPhase,
} from '../signInPromptPolicy.js';

const hourMs = 60 * 60 * 1000;

test('authenticated users never see the sign-in prompt', () => {
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: true,
      sessionStartedAtMs: 0,
      nowMs: SIGN_IN_PROMPT_DELAY_MS + 1000,
    }),
    'hidden',
  );
});

test('first visit waits seven seconds before the prompt', () => {
  const sessionStart = 1000;
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: sessionStart + SIGN_IN_PROMPT_DELAY_MS - 1,
      lastShownAtIso: null,
    }),
    'waiting',
  );
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: sessionStart + SIGN_IN_PROMPT_DELAY_MS,
      lastShownAtIso: null,
    }),
    'visible',
  );
});

test('within twenty-four hours of showing, prompt stays visible on new sessions', () => {
  const lastShown = new Date('2026-10-27T12:00:00.000Z').toISOString();
  const sessionStart = Date.parse('2026-10-27T14:00:00.000Z');
  const nowMs = sessionStart + 500;

  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs,
      lastShownAtIso: lastShown,
    }),
    'visible',
  );
});

test('after twenty-four hours the seven second grace returns', () => {
  const lastShown = new Date('2026-10-26T12:00:00.000Z').toISOString();
  const sessionStart = Date.parse('2026-10-27T13:00:00.000Z');
  const withinGrace = sessionStart + SIGN_IN_PROMPT_DELAY_MS - 1;
  const afterGrace = sessionStart + SIGN_IN_PROMPT_DELAY_MS;

  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: withinGrace,
      lastShownAtIso: lastShown,
    }),
    'waiting',
  );
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: afterGrace,
      lastShownAtIso: lastShown,
    }),
    'visible',
  );
  assert.equal(SIGN_IN_PROMPT_COOLDOWN_HOURS, 24);
});
