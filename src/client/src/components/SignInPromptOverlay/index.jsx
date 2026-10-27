import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getSignInPromptPhase,
  readSignInPromptLastShownAt,
  writeSignInPromptLastShownAt,
} from '../../utilities/signInPromptPolicy';
import { googleLogin, isConfirmedAuthentication } from '../../utilities/authenticationClient';

import './sign-in-prompt-overlay.css';

const SignInPromptOverlay = () => {
  const location = useLocation();
  const sessionStartedAtRef = useRef(Date.now());
  const cycleMarkedRef = useRef(false);
  const [phase, setPhase] = useState('hidden');
  const [fadeIn, setFadeIn] = useState(false);

  const onAuthCallback = location.pathname.startsWith('/authenticationCallback');

  useEffect(() => {
    if (onAuthCallback) {
      setPhase('hidden');
      setFadeIn(false);
      return undefined;
    }

    const tick = () => {
      const isAuthenticated = isConfirmedAuthentication();
      const lastShownAtIso = readSignInPromptLastShownAt();
      const nextPhase = getSignInPromptPhase({
        isAuthenticated,
        sessionStartedAtMs: sessionStartedAtRef.current,
        lastShownAtIso,
      });

      const cooldownMs = 24 * 60 * 60 * 1000;
      const inActivePromptPeriod =
        lastShownAtIso
        && Date.now() - Date.parse(lastShownAtIso) < cooldownMs;

      if (nextPhase === 'waiting') {
        cycleMarkedRef.current = false;
      }

      if (nextPhase === 'visible' && !inActivePromptPeriod && !cycleMarkedRef.current) {
        writeSignInPromptLastShownAt(new Date().toISOString());
        cycleMarkedRef.current = true;
      }

      setPhase(nextPhase);
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [location.pathname, onAuthCallback]);

  useEffect(() => {
    if (phase !== 'visible') {
      setFadeIn(false);
      return undefined;
    }
    const raf = window.requestAnimationFrame(() => setFadeIn(true));
    return () => window.cancelAnimationFrame(raf);
  }, [phase]);

  if (phase === 'hidden' || phase === 'waiting' || onAuthCallback) {
    return null;
  }

  return (
    <div
      className={`sign-in-prompt-overlay${fadeIn ? ' is-visible' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-prompt-title"
      aria-hidden={!fadeIn}
    >
      <div className="sign-in-prompt-overlay__panel">
        <div className="sign-in-prompt-overlay__kicker">Continue with Google</div>
        <h2 className="sign-in-prompt-overlay__title" id="sign-in-prompt-title">
          Sign in to keep playing
        </h2>
        <p className="sign-in-prompt-overlay__copy">
          Pick the Google account you want for picks, scores, and leaderboards.
        </p>
        <button
          type="button"
          className="sign-in-prompt-overlay__btn"
          onClick={googleLogin}
        >
          Continue with Google
        </button>
      </div>
    </div>
  );
};

export default SignInPromptOverlay;
