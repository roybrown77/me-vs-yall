import moment from 'moment-timezone';

export const SIGN_IN_PROMPT_DELAY_MS = 7000;
export const SIGN_IN_PROMPT_COOLDOWN_HOURS = 24;
export const SIGN_IN_PROMPT_SHOW_PROBABILITY = 0.5;
export const SIGN_IN_PROMPT_GUEST_DISMISSED_KEY = 'signInPromptGuestDismissedAt';
export const SIGN_IN_PROMPT_LAST_SHOWN_KEY = 'signInPromptLastShownAt';

/** @returns {string | null} ISO timestamp */
export const readSignInPromptGuestDismissedAt = () => {
  try {
    const value = localStorage.getItem(SIGN_IN_PROMPT_GUEST_DISMISSED_KEY);
    return value && moment(value).isValid() ? value : null;
  } catch {
    return null;
  }
};

export const writeSignInPromptGuestDismissedAt = (iso) => {
  try {
    localStorage.setItem(SIGN_IN_PROMPT_GUEST_DISMISSED_KEY, iso);
    localStorage.removeItem(SIGN_IN_PROMPT_LAST_SHOWN_KEY);
  } catch {
    /* private mode */
  }
};

/**
 * Randomly decides whether a signed-out session should display the sign-in overlay.
 *
 * @param {() => number} [rng=Math.random]
 * @returns {boolean}
 */
export const shouldShowSignInPrompt = (rng = Math.random) =>
  rng() < SIGN_IN_PROMPT_SHOW_PROBABILITY;

/**
 * @param {{ nowMs?: number, guestDismissedAtIso?: string | null }} input
 * @returns {boolean}
 */
export const isInGuestPromptCooldown = ({
  nowMs = Date.now(),
  guestDismissedAtIso = null,
} = {}) => {
  const dismissedMs = guestDismissedAtIso ? moment(guestDismissedAtIso).valueOf() : null;
  const cooldownMs = SIGN_IN_PROMPT_COOLDOWN_HOURS * 60 * 60 * 1000;
  return dismissedMs != null && nowMs - dismissedMs < cooldownMs;
};

/**
 * @typedef {'hidden' | 'waiting' | 'visible'} SignInPromptPhase
 */

/**
 * Unsigned users randomly get the sign-in prompt after 7s of browsing.
 * Selecting "Continue as our beloved guest" suppresses the prompt for 24 hours.
 *
 * @param {{
 *   isAuthenticated: boolean,
 *   sessionStartedAtMs: number,
 *   nowMs?: number,
 *   guestDismissedAtIso?: string | null,
 *   shouldShowPrompt?: boolean,
 * }} input
 * @returns {SignInPromptPhase}
 */
export const getSignInPromptPhase = ({
  isAuthenticated,
  sessionStartedAtMs,
  nowMs = Date.now(),
  guestDismissedAtIso = null,
  shouldShowPrompt = true,
}) => {
  if (isAuthenticated) {
    return 'hidden';
  }

  if (isInGuestPromptCooldown({ nowMs, guestDismissedAtIso })) {
    return 'hidden';
  }

  if (!shouldShowPrompt) {
    return 'hidden';
  }

  if (nowMs - sessionStartedAtMs < SIGN_IN_PROMPT_DELAY_MS) {
    return 'waiting';
  }

  return 'visible';
};
