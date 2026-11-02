import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  SIGN_IN_PROMPT_COOLDOWN_HOURS,
  SIGN_IN_PROMPT_DELAY_MS,
  SIGN_IN_PROMPT_SHOW_PROBABILITY,
  getSignInPromptPhase,
  isInGuestPromptCooldown,
  shouldShowSignInPrompt,
} from '../signInPromptPolicy.js';

test('authenticated users never see the sign-in prompt', () => {
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: true,
      sessionStartedAtMs: 0,
      nowMs: SIGN_IN_PROMPT_DELAY_MS + 1000,
      shouldShowPrompt: true,
    }),
    'hidden',
  );
});

test('shouldShowSignInPrompt rolls against SIGN_IN_PROMPT_SHOW_PROBABILITY', () => {
  assert.equal(SIGN_IN_PROMPT_SHOW_PROBABILITY, 0.5);
  assert.equal(shouldShowSignInPrompt(() => 0.1), true);
  assert.equal(shouldShowSignInPrompt(() => 0.49), true);
  assert.equal(shouldShowSignInPrompt(() => 0.5), false);
  assert.equal(shouldShowSignInPrompt(() => 0.95), false);
});

test('when random roll is false, prompt stays hidden even after seven seconds', () => {
  const sessionStart = 1000;
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: sessionStart + SIGN_IN_PROMPT_DELAY_MS + 5000,
      guestDismissedAtIso: null,
      shouldShowPrompt: false,
    }),
    'hidden',
  );
});

test('when random roll is true, visit waits seven seconds before showing the prompt', () => {
  const sessionStart = 1000;
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: sessionStart + SIGN_IN_PROMPT_DELAY_MS - 1,
      guestDismissedAtIso: null,
      shouldShowPrompt: true,
    }),
    'waiting',
  );
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: sessionStart + SIGN_IN_PROMPT_DELAY_MS,
      guestDismissedAtIso: null,
      shouldShowPrompt: true,
    }),
    'visible',
  );
});

test('within twenty-four hours of selecting "Continue as our beloved guest", prompt stays hidden', () => {
  const guestDismissed = new Date('2026-10-27T12:00:00.000Z').toISOString();
  const sessionStart = Date.parse('2026-10-27T14:00:00.000Z');
  const afterDelay = sessionStart + SIGN_IN_PROMPT_DELAY_MS + 5000;

  assert.equal(
    isInGuestPromptCooldown({
      nowMs: afterDelay,
      guestDismissedAtIso: guestDismissed,
    }),
    true,
  );
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: afterDelay,
      guestDismissedAtIso: guestDismissed,
      shouldShowPrompt: true,
    }),
    'hidden',
  );
});

test('after twenty-four hours from guest dismissal, prompt can show again after seven second grace', () => {
  const guestDismissed = new Date('2026-10-26T12:00:00.000Z').toISOString();
  const sessionStart = Date.parse('2026-10-27T13:00:00.000Z');
  const withinGrace = sessionStart + SIGN_IN_PROMPT_DELAY_MS - 1;
  const afterGrace = sessionStart + SIGN_IN_PROMPT_DELAY_MS;

  assert.equal(
    isInGuestPromptCooldown({
      nowMs: withinGrace,
      guestDismissedAtIso: guestDismissed,
    }),
    false,
  );
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: withinGrace,
      guestDismissedAtIso: guestDismissed,
      shouldShowPrompt: true,
    }),
    'waiting',
  );
  assert.equal(
    getSignInPromptPhase({
      isAuthenticated: false,
      sessionStartedAtMs: sessionStart,
      nowMs: afterGrace,
      guestDismissedAtIso: guestDismissed,
      shouldShowPrompt: true,
    }),
    'visible',
  );
  assert.equal(SIGN_IN_PROMPT_COOLDOWN_HOURS, 24);
});
