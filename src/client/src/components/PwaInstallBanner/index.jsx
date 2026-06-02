import { useCallback, useMemo, useState } from 'react';

import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';

const dismissKey = 'pwaInstallBannerDismissed';
const dismissForDays = 30;

const getCookie = (name) => {
  if (typeof document === 'undefined') return null;

  const encodedName = encodeURIComponent(name);
  const cookie = document.cookie
    .split('; ')
    .find((row) => row.startsWith(`${encodedName}=`));

  if (!cookie) return null;

  return decodeURIComponent(cookie.split('=').slice(1).join('='));
};

const setCookie = (name, value, days) => {
  if (typeof document === 'undefined') return;

  const expires = new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax`;
};

const isIosSafari = () => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent;
  const isIosDevice = /iPad|iPhone|iPod/.test(ua);
  const isTouchMac =
    window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;
  const isIos = isIosDevice || isTouchMac;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);

  return isIos && isSafari;
};

const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent;
  return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

const PwaInstallBanner = () => {
  const { canInstall, promptInstall, installed } = usePwaInstallPrompt();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return getCookie(dismissKey) === '1';
    } catch {
      return false;
    }
  });

  const showIosInstructions = useMemo(() => {
    return !canInstall && isIosSafari();
  }, [canInstall]);

  const isMobile = useMemo(() => isMobileDevice(), []);

  const installMessage = useMemo(() => {
    if (canInstall) {
      return 'Install MvY for quicker picks, cleaner stats, and a true app experience.';
    }

    if (showIosInstructions) {
      return 'Tap Share, then Add to Home Screen to install MvY on iPhone.';
    }

    if (isMobile) {
      return 'Open your browser menu and tap Add to Home Screen to install MvY.';
    }

    return 'Use your browser menu to install, pin, or create a MvY shortcut.';
  }, [canInstall, showIosInstructions, isMobile]);

  const shouldShow = useMemo(() => {
    return !dismissed && !installed;
  }, [dismissed, installed]);

  const dismiss = useCallback(() => {
    try {
      setCookie(dismissKey, '1', dismissForDays);
    } catch {
      // ignore storage issues
    }
    setDismissed(true);
  }, []);

  const handleInstall = useCallback(async () => {
    await promptInstall();
  }, [promptInstall]);

  if (!shouldShow) return null;

  return (
    <div className="pwa-install-banner" role="region" aria-label="Install app banner">
      <button
        type="button"
        className="pwa-install-banner__close"
        onClick={dismiss}
        aria-label="Close install banner"
      >
        ×
      </button>
      <div className="pwa-install-banner__content">
        <div className="pwa-install-banner__kicker">GAMEDAY ACCESS</div>
        <div className="pwa-install-banner__title">LOCK IN Me vs Yall ON YOUR HOME SCREEN</div>
        <div className="pwa-install-banner__subtitle">{installMessage}</div>
        <div className="pwa-install-banner__voice">
          "The season is won in the margins. Keep MvY one tap away."
        </div>
      </div>
      {canInstall ? (
        <button type="button" className="pwa-install-banner__action" onClick={handleInstall}>
          Install App
        </button>
      ) : null}
    </div>
  );
};

export default PwaInstallBanner;
