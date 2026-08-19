import { useCallback, useMemo, useState } from 'react';

import InstallMobile from '@mui/icons-material/InstallMobile';

import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';
import mvyIcon from '../../styles/images/mvy-balls-cut.png';

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
    if (showIosInstructions) {
      return 'Share -> Add to Home Screen';
    }

    if (isMobile) {
      return 'Menu -> Add to Home Screen';
    }

    return 'Menu -> Install app';
  }, [showIosInstructions, isMobile]);

  const siteLabel = useMemo(() => {
    if (typeof window === 'undefined') return 'mevsyall.com';

    return window.location.host || 'mevsyall.com';
  }, []);

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
    if (canInstall) {
      await promptInstall();
      return;
    }
  }, [canInstall, promptInstall]);

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

      <div className="pwa-install-banner__header">
        <img
          className="pwa-install-banner__icon"
          src={mvyIcon}
          alt=""
        />
        <div className="pwa-install-banner__info">
          <div className="pwa-install-banner__title">Me vs Yall</div>
          <div className="pwa-install-banner__subtitle">{siteLabel}</div>
          {!canInstall ? (
            <div className="pwa-install-banner__hint">{installMessage}</div>
          ) : null}
        </div>
      </div>

      <div className="pwa-install-banner__footer">
        <button
          type="button"
          className="pwa-install-banner__action"
          onClick={handleInstall}
          disabled={!canInstall}
          aria-disabled={!canInstall}
          title={!canInstall ? installMessage : undefined}
        >
          <InstallMobile fontSize="small" aria-hidden="true" />
          <span>Add to Home Screen</span>
        </button>
      </div>
    </div>
  );
};

export default PwaInstallBanner;
