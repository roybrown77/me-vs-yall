import { isStandalonePwa } from './pwaInstall';

const isStandalone = () => isStandalonePwa();

let deferredPrompt = null;
let installed = isStandalone();
const listeners = new Set();

const syncSnapshot = () => {
  const canInstall = Boolean(deferredPrompt) && !installed;

  if (
    cachedSnapshot.canInstall !== canInstall ||
    cachedSnapshot.installed !== installed
  ) {
    cachedSnapshot = { canInstall, installed };
  }
};

let cachedSnapshot = {
  canInstall: false,
  installed,
};

syncSnapshot();

const SERVER_SNAPSHOT = Object.freeze({
  canInstall: false,
  installed: false,
});

const emitChange = () => {
  syncSnapshot();
  listeners.forEach((listener) => listener());
};

const refreshInstalled = () => {
  const nextInstalled = isStandalone();
  if (nextInstalled === installed) return;

  installed = nextInstalled;
  if (installed) {
    deferredPrompt = null;
  }
  emitChange();
};

export const subscribePwaInstall = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getPwaInstallSnapshot = () => cachedSnapshot;

export const getPwaInstallServerSnapshot = () => SERVER_SNAPSHOT;

export const promptPwaInstall = () => {
  if (!deferredPrompt) {
    return Promise.resolve({ outcome: 'unavailable' });
  }

  const promptEvent = deferredPrompt;
  deferredPrompt = null;

  // prompt() must run synchronously in the click handler's call stack.
  return promptEvent
    .prompt()
    .then(() => promptEvent.userChoice)
    .then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        installed = true;
      }
      emitChange();
      return choiceResult;
    })
    .catch(() => {
      emitChange();
      return { outcome: 'unavailable' };
    });
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    emitChange();
  });

  window.addEventListener('appinstalled', () => {
    installed = true;
    deferredPrompt = null;
    emitChange();
  });

  window.addEventListener('pageshow', refreshInstalled);
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      refreshInstalled();
    }
  });

  if (window.matchMedia) {
    window.matchMedia('(display-mode: standalone)').addEventListener('change', refreshInstalled);
  }
}
