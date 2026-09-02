export const isStandalonePwa = () => {
  if (typeof window === 'undefined') return false;

  const displayModeStandalone =
    window.matchMedia && window.matchMedia('(display-mode: standalone)').matches;

  const iOSStandalone = window.navigator?.standalone === true;

  return Boolean(displayModeStandalone || iOSStandalone);
};

export const isIos = () => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent;
  const isIosDevice = /iPad|iPhone|iPod/.test(ua);
  const isTouchMac =
    window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1;

  return isIosDevice || isTouchMac;
};

export const isIosSafari = () => {
  if (typeof window === 'undefined') return false;

  const ua = window.navigator.userAgent;
  const isSafari = /Safari/.test(ua) && !/CriOS|FxiOS|EdgiOS/.test(ua);

  return isIos() && isSafari;
};

export const isAndroid = () => {
  if (typeof window === 'undefined') return false;

  return /Android/i.test(window.navigator.userAgent);
};

export const isMobileDevice = () => {
  if (typeof window === 'undefined') return false;

  if (isIos() || isAndroid()) return true;

  const ua = window.navigator.userAgent;
  return /webOS|BlackBerry|IEMobile|Opera Mini/i.test(ua);
};

export const getInstallMessage = ({ canInstall, isIos: onIos, isAndroid: onAndroid, isMobile }) => {
  if (canInstall) return null;

  if (onIos) {
    return 'Tap the Share button, then choose Add to Home Screen';
  }

  if (onAndroid) {
    return canInstall
      ? null
      : 'If no install prompt appears, open the browser menu (⋮) and choose Install app or Add to Home Screen';
  }

  if (isMobile) {
    return 'Open your browser menu, then Add to Home Screen';
  }

  return 'Use the install icon in your browser address bar';
};

export const getSiteLabel = () => {
  if (typeof window === 'undefined') return 'mevsyall.com';

  return window.location.host || 'mevsyall.com';
};

export const INSTALL_APP_EMOJIS = '😎🏈⚽️🏀🥇🏆👑✌🏿';
