import { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';

import InstallMobile from '@mui/icons-material/InstallMobile';

import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';
import mvyIcon from '../../styles/images/mvy-balls-cut.png';
import {
  getInstallMessage,
  getSiteLabel,
  INSTALL_APP_EMOJIS,
  isAndroid,
  isIos,
  isMobileDevice,
} from '../../utilities/pwaInstall';

const PwaInstallCard = ({
  className = '',
  onClose,
  showClose = false,
  showEmojis = false,
}) => {
  const { canInstall, promptInstall } = usePwaInstallPrompt();
  const onIos = useMemo(() => isIos(), []);
  const onAndroid = useMemo(() => isAndroid(), []);
  const isMobile = useMemo(() => isMobileDevice(), []);
  const installMessage = useMemo(
    () => getInstallMessage({ canInstall, isIos: onIos, isAndroid: onAndroid, isMobile }),
    [canInstall, onAndroid, onIos, isMobile]
  );
  const siteLabel = useMemo(() => getSiteLabel(), []);

  const handleInstall = useCallback(async () => {
    if (!canInstall) return;

    await promptInstall();
  }, [canInstall, promptInstall]);

  return (
    <div
      className={`pwa-install-banner ${className}`.trim()}
      role="region"
      aria-label="Install app"
    >
      {showClose ? (
        <button
          type="button"
          className="pwa-install-banner__close"
          onClick={onClose}
          aria-label="Close install app"
        >
          ×
        </button>
      ) : null}

      <div className="pwa-install-banner__header">
        <img className="pwa-install-banner__icon" src={mvyIcon} alt="" />
        <div className="pwa-install-banner__info">
          <div className="pwa-install-banner__title">Me vs Yall</div>
          <div className="pwa-install-banner__subtitle">{siteLabel}</div>
          {installMessage ? (
            <div className="pwa-install-banner__hint">{installMessage}</div>
          ) : null}
        </div>
      </div>

      <div className="pwa-install-banner__footer">
        <button
          type="button"
          className="pwa-install-banner__action"
          onClick={handleInstall}
          title={installMessage || undefined}
        >
          <InstallMobile fontSize="small" aria-hidden="true" />
          <span>Add to Home Screen</span>
        </button>
      </div>

      {showEmojis ? (
        <div className="pwa-install-banner__emojis" aria-hidden="true">
          {INSTALL_APP_EMOJIS}
        </div>
      ) : null}
    </div>
  );
};

PwaInstallCard.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  showClose: PropTypes.bool,
  showEmojis: PropTypes.bool,
};

export default PwaInstallCard;
