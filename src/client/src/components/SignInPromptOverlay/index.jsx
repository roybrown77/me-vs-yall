import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import {
  getSignInPromptPhase,
  isInGuestPromptCooldown,
  readSignInPromptGuestDismissedAt,
  shouldShowSignInPrompt,
  writeSignInPromptGuestDismissedAt,
} from '../../utilities/signInPromptPolicy';
import { googleLogin, isConfirmedAuthentication } from '../../utilities/authenticationClient';
import './sign-in-prompt-overlay.css';

const SignInPromptOverlay = () => {
  const location = useLocation();
  const sessionStartedAtRef = useRef(Date.now());
  const shouldShowPromptRef = useRef(shouldShowSignInPrompt());
  const wasInCooldownRef = useRef(
    isInGuestPromptCooldown({
      guestDismissedAtIso: readSignInPromptGuestDismissedAt(),
    }),
  );
  const playfulSceneRef = useRef(undefined);
  const [phase, setPhase] = useState('hidden');
  const [fadeIn, setFadeIn] = useState(false);
  const [playfulBundle, setPlayfulBundle] = useState(null);

  const onAuthCallback = location.pathname.startsWith('/authenticationCallback');

  useEffect(() => {
    if (onAuthCallback) {
      setPhase('hidden');
      setFadeIn(false);
      return undefined;
    }

    const tick = () => {
      const isAuthenticated = isConfirmedAuthentication();
      const guestDismissedAtIso = readSignInPromptGuestDismissedAt();
      const inCooldown = isInGuestPromptCooldown({ guestDismissedAtIso });

      if (wasInCooldownRef.current && !inCooldown) {
        sessionStartedAtRef.current = Date.now();
        shouldShowPromptRef.current = shouldShowSignInPrompt();
      }
      wasInCooldownRef.current = inCooldown;

      const nextPhase = getSignInPromptPhase({
        isAuthenticated,
        sessionStartedAtMs: sessionStartedAtRef.current,
        guestDismissedAtIso,
        shouldShowPrompt: shouldShowPromptRef.current,
      });

      setPhase(nextPhase);
    };

    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [location.pathname, onAuthCallback]);

  useEffect(() => {
    if (phase !== 'visible') {
      setFadeIn(false);
      setPlayfulBundle(null);
      playfulSceneRef.current = undefined;
      return undefined;
    }

    let cancelled = false;

    Promise.all([
      import('../../utilities/signInPlayfulScenes.js'),
      import('./SignInPlayfulMoment.jsx'),
    ])
      .then(([{ pickSignInPlayfulScene }, momentModule]) => {
        if (cancelled) {
          return;
        }
        const scene = pickSignInPlayfulScene();
        playfulSceneRef.current = scene;
        if (scene) {
          setPlayfulBundle({ scene, Moment: momentModule.default });
        }
      })
      .catch(() => {
        playfulSceneRef.current = null;
      });

    const raf = window.requestAnimationFrame(() => setFadeIn(true));
    return () => {
      cancelled = true;
      window.cancelAnimationFrame(raf);
    };
  }, [phase]);

  const continueAsGuest = () => {
    writeSignInPromptGuestDismissedAt(new Date().toISOString());
    wasInCooldownRef.current = true;
    setFadeIn(false);
    setPhase('hidden');
  };

  if (phase === 'hidden' || phase === 'waiting' || onAuthCallback) {
    return null;
  }

  const theatrical = Boolean(playfulBundle?.scene);
  const PlayfulMoment = playfulBundle?.Moment;

  return (
    <div
      className={`sign-in-prompt-overlay${fadeIn ? ' is-visible' : ''}${theatrical ? ' sign-in-prompt-overlay--theatrical' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="sign-in-prompt-title"
      aria-hidden={!fadeIn}
    >
      <div className="sign-in-prompt-overlay__dialog">
        {PlayfulMoment && playfulBundle?.scene ? (
          <PlayfulMoment scene={playfulBundle.scene} />
        ) : null}
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
          <button
            type="button"
            className="sign-in-prompt-overlay__guest-btn"
            onClick={continueAsGuest}
          >
            Continue as our beloved guest
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignInPromptOverlay;
