import { useEffect } from 'react';
import { useRegisterSW } from 'virtual:pwa-register/react';

const useSyncServiceWorker = (period = 60 * 60 * 1000) => {
  const {
    needRefresh,
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(swUrl, r) {
      if (period <= 0 || !r) return;

      const checkForUpdates = async () => {
        if ('onLine' in navigator && !navigator.onLine) return;

        const resp = await fetch(swUrl, {
          cache: 'no-store',
          headers: {
            cache: 'no-store',
            'cache-control': 'no-cache',
          },
        });

        if (resp?.status === 200) await r.update();
        scheduleUpdate();
      };

      const scheduleUpdate = () => {
        setTimeout(checkForUpdates, period);
      };

      const registerPeriodicSync = () => {
        if (r?.active?.state === 'activated') {
          scheduleUpdate();
        } else if (r?.installing) {
          r.installing.addEventListener('statechange', (e) => {
            const sw = e.target;
            if (sw.state === 'activated') scheduleUpdate();
          });
        }
      };

      registerPeriodicSync();
    },
  });

  useEffect(() => {
    const [shouldRefresh] = needRefresh;
    if (!shouldRefresh) return;

    // Apply the update immediately (sends SKIP_WAITING) and reload.
    updateServiceWorker(true);
  }, [needRefresh, updateServiceWorker]);

  return { updateServiceWorker };
};

export default useSyncServiceWorker;
