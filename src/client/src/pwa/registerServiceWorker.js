import { registerSW } from 'virtual:pwa-register';

const updatePeriodMs = 60 * 60 * 1000;

const checkForServiceWorkerUpdate = async (swUrl, registration) => {
  if (!registration || ('onLine' in navigator && !navigator.onLine)) return;

  try {
    const resp = await fetch(swUrl, {
      cache: 'no-store',
      headers: {
        cache: 'no-store',
        'cache-control': 'no-cache',
      },
    });

    if (resp?.status === 200) {
      await registration.update();
    }
  } catch {
    // Ignore transient network errors; next check will retry.
  }
};

let refreshingAfterSwUpdate = false;

if (typeof navigator !== 'undefined' && 'serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (refreshingAfterSwUpdate) return;
    refreshingAfterSwUpdate = true;
    window.location.reload();
  });
}

export const updateServiceWorker = registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (!import.meta.env.PROD || !registration) return;

    const scheduleUpdate = () => {
      if (updatePeriodMs <= 0) return;
      setTimeout(async () => {
        await checkForServiceWorkerUpdate(swUrl, registration);
        scheduleUpdate();
      }, updatePeriodMs);
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

    const checkNow = () => checkForServiceWorkerUpdate(swUrl, registration);
    checkNow();
    window.addEventListener('focus', checkNow);
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        checkNow();
      }
    });
    window.addEventListener('pageshow', (event) => {
      if (event.persisted) {
        checkNow();
      }
    });
  },
});
