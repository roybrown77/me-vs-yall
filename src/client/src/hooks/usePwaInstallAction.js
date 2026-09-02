import { useCallback, useMemo, useState } from 'react';

import usePwaInstallPrompt from './usePwaInstallPrompt';
import {
  getInstallMessage,
  isAndroid,
  isIos,
  isMobileDevice,
} from '../utilities/pwaInstall';

const usePwaInstallAction = () => {
  const { canInstall, promptInstall } = usePwaInstallPrompt();
  const [installFeedback, setInstallFeedback] = useState(null);
  const onIos = useMemo(() => isIos(), []);
  const onAndroid = useMemo(() => isAndroid(), []);
  const isMobile = useMemo(() => isMobileDevice(), []);
  const installMessage = useMemo(
    () => getInstallMessage({ canInstall, isIos: onIos, isAndroid: onAndroid, isMobile }),
    [canInstall, onAndroid, onIos, isMobile]
  );

  const handleInstall = useCallback(() => {
    if (canInstall) {
      promptInstall().then((result) => {
        if (result?.outcome === 'accepted') {
          setInstallFeedback({
            tone: 'success',
            message: 'App installed! Open Me vs Yall from your home screen.',
          });
          return;
        }

        if (result?.outcome === 'dismissed') {
          setInstallFeedback({
            tone: 'info',
            message: 'Install canceled. Try again whenever you are ready.',
          });
          return;
        }

        if (installMessage) {
          setInstallFeedback({
            tone: 'info',
            message: installMessage,
          });
        }
      });
      return;
    }

    if (installMessage) {
      setInstallFeedback({
        tone: 'info',
        message: installMessage,
      });
    }
  }, [canInstall, installMessage, promptInstall]);

  return {
    canInstall,
    handleInstall,
    installFeedback,
    installMessage,
    setInstallFeedback,
  };
};

export default usePwaInstallAction;
