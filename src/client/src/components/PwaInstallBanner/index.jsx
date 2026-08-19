import { useCallback, useMemo, useState } from 'react';

import PwaInstallCard from '../PwaInstallCard';
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

const PwaInstallBanner = () => {
  const { installed } = usePwaInstallPrompt();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return getCookie(dismissKey) === '1';
    } catch {
      return false;
    }
  });

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

  if (!shouldShow) return null;

  return (
    <PwaInstallCard
      className="pwa-install-banner--docked"
      onClose={dismiss}
      showClose
    />
  );
};

export default PwaInstallBanner;
