import moment from 'moment-timezone';

export const SIGN_IN_PROMPT_DELAY_MS = 7000;
export const SIGN_IN_PROMPT_COOLDOWN_HOURS = 24;
export const SIGN_IN_PROMPT_LAST_SHOWN_KEY = 'signInPromptLastShownAt';

/** @returns {string | null} ISO timestamp */
export const readSignInPromptLastShownAt = () => {
  try {
    const value = localStorage.getItem(SIGN_IN_PROMPT_LAST_SHOWN_KEY);
    return value && moment(value).isValid() ? value : null;
  } catch {
    return null;
  }
};

export const writeSignInPromptLastShownAt = (iso) => {
  try {
    localStorage.setItem(SIGN_IN_PROMPT_LAST_SHOWN_KEY, iso);
  } catch {
    /* private mode */
  }
};

/**
 * @typedef {'hidden' | 'waiting' | 'visible'} SignInPromptPhase
 */

/**
 * Unsigned users get 7s of use, then a blocking prompt. For 24h after first show in a cycle,
 * the prompt stays required on every visit. After 24h the cycle resets (7s grace, then prompt).
 *
 * @param {{ isAuthenticated: boolean, sessionStartedAtMs: number, nowMs?: number, lastShownAtIso?: string | null }} input
 * @returns {SignInPromptPhase}
 */
export const getSignInPromptPhase = ({
  isAuthenticated,
  sessionStartedAtMs,
  nowMs = Date.now(),
  lastShownAtIso = null,
}) => {
  if (isAuthenticated) {
    return 'hidden';
  }

  const lastShownMs = lastShownAtIso ? moment(lastShownAtIso).valueOf() : null;
  const cooldownMs = SIGN_IN_PROMPT_COOLDOWN_HOURS * 60 * 60 * 1000;
  const inActivePromptPeriod =
    lastShownMs != null && nowMs - lastShownMs < cooldownMs;

  if (inActivePromptPeriod) {
    return 'visible';
  }

  if (nowMs - sessionStartedAtMs < SIGN_IN_PROMPT_DELAY_MS) {
    return 'waiting';
  }

  return 'visible';
};
