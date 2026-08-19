import { registerSW } from 'virtual:pwa-register';

const updatePeriodMs = 60 * 60 * 1000;

export const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!import.meta.env.PROD || updatePeriodMs <= 0 || !registration) return;

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
      setTimeout(checkForUpdates, updatePeriodMs);
    };

    const registerPeriodicSync = () => {
      if (registration?.active?.state === 'activated') {
        scheduleUpdate();
      } else if (registration?.installing) {
        registration.installing.addEventListener('statechange', (event) => {
          if (event.target.state === 'activated') scheduleUpdate();
        });
      }
    };

    registerPeriodicSync();
  },
});
