import { useCallback, useSyncExternalStore } from 'react';

import {
  getPwaInstallServerSnapshot,
  getPwaInstallSnapshot,
  promptPwaInstall,
  subscribePwaInstall,
} from '../utilities/pwaInstallPrompt';

const usePwaInstallPrompt = () => {
  const { canInstall, installed } = useSyncExternalStore(
    subscribePwaInstall,
    getPwaInstallSnapshot,
    getPwaInstallServerSnapshot
  );

  const promptInstall = useCallback(async () => promptPwaInstall(), []);

  return { canInstall, promptInstall, installed };
};

export default usePwaInstallPrompt;
