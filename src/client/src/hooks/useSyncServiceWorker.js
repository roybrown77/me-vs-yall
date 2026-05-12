import { useRegisterSW } from 'virtual:pwa-register/react';

/**
 * Periodically updating the service worker keeps the app secure and fresh.
 *
 * @param {number} period - Interval in ms for checking updates. Default: 1 hour.
 * @returns {{ updateServiceWorker: (reloadPage?: boolean) => Promise<void> }}
 */
const useSyncServiceWorker = (period = 60 * 60 * 1000) => {
  const { updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      if (period <= 0 || !registration) return;

      const checkForUpdates = async () => {
        if ('onLine' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await registration.update();
        scheduleUpdate();
      };

      const scheduleUpdate = () => {
        setTimeout(checkForUpdates, period);
      };

      const registerPeriodicSync = () => {
        if (registration?.active?.state === 'activated') {
          scheduleUpdate();
        } else if (registration?.installing) {
          registration.installing.addEventListener('statechange', (e) => {
            const sw = e.target;
            if (sw.state === 'activated') scheduleUpdate();
          });
        }
      };

      registerPeriodicSync();
    },
  });

  return { updateServiceWorker };
};

export default useSyncServiceWorker;
