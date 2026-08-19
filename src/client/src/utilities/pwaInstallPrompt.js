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

export const subscribePwaInstall = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getPwaInstallSnapshot = () => cachedSnapshot;

export const getPwaInstallServerSnapshot = () => SERVER_SNAPSHOT;

export const promptPwaInstall = async () => {
  if (!deferredPrompt) {
    return { outcome: 'unavailable' };
  }

  await deferredPrompt.prompt();
  const choiceResult = await deferredPrompt.userChoice;
  deferredPrompt = null;
  emitChange();

  return choiceResult;
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
}
