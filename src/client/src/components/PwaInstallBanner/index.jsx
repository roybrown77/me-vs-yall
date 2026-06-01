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
        x
      </button>
      <div className="pwa-install-banner__spark">⭐</div>
      <div className="pwa-install-banner__content">
        <div className="pwa-install-banner__title">Keep Me vs Yall one tap away</div>
        {canInstall ? (
          <div className="pwa-install-banner__subtitle">
            Save to Home Screen for faster picks and a full app feel.
          </div>
        ) : showIosInstructions ? (
          <div className="pwa-install-banner__subtitle">
            Tap Share, then Add to Home Screen to install Sportspick.
          </div>
        ) : isMobile ? (
          <div className="pwa-install-banner__subtitle">
            Open your browser menu and tap Add to Home Screen.
          </div>
        ) : (
          <div className="pwa-install-banner__subtitle">
            Use your browser menu to install, pin, or create a shortcut.
          </div>
        )}
      </div>
      {canInstall ? (
        <button type="button" className="pwa-install-banner__action" onClick={handleInstall}>
          Save to Home Screen
        </button>
      ) : null}
    </div>
  );
};

export default PwaInstallBanner;
