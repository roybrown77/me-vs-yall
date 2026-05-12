import { useCallback, useEffect, useMemo, useState } from 'react';

const isStandalone = () => {
  if (typeof window === 'undefined') return false;

  // Chrome/Edge
  const displayModeStandalone =
    window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

  // iOS Safari
  const iOSStandalone = window.navigator?.standalone === true;

  return Boolean(displayModeStandalone || iOSStandalone);
};

/**
 * Google-recommended custom install prompt flow.
 * Exposes a stable "Install" action only when Chrome surfaces `beforeinstallprompt`.
 */
const usePwaInstallPrompt = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [installed, setInstalled] = useState(() => isStandalone());

  useEffect(() => {
    const onBeforeInstallPrompt = (e) => {
      // Allows showing our own in-app install UI.
      e.preventDefault();
      setDeferredPrompt(e);
    };

    const onAppInstalled = () => {
      setInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt);
    window.addEventListener('appinstalled', onAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt);
      window.removeEventListener('appinstalled', onAppInstalled);
    };
  }, []);

  const canInstall = useMemo(() => {
    return Boolean(deferredPrompt) && !installed;
  }, [deferredPrompt, installed]);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return { outcome: 'unavailable' };

    deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;

    // Chrome only lets you use it once.
    setDeferredPrompt(null);

    return choiceResult;
  }, [deferredPrompt]);

  return { canInstall, promptInstall, installed };
};

export default usePwaInstallPrompt;
