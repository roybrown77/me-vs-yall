import { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';

import InstallMobile from '@mui/icons-material/InstallMobile';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

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

const feedbackStyles = {
  success: {
    backgroundColor: '#B3E6CA',
    color: '#000000',
  },
  info: {
    backgroundColor: '#FFE8A3',
    color: '#000000',
  },
};

const PwaInstallCard = ({
  className = '',
  onClose,
  showClose = false,
}) => {
  const { canInstall, promptInstall } = usePwaInstallPrompt();
  const [installFeedback, setInstallFeedback] = useState(null);
  const onIos = useMemo(() => isIos(), []);
  const onAndroid = useMemo(() => isAndroid(), []);
  const isMobile = useMemo(() => isMobileDevice(), []);
  const installMessage = useMemo(
    () => getInstallMessage({ canInstall, isIos: onIos, isAndroid: onAndroid, isMobile }),
    [canInstall, onAndroid, onIos, isMobile]
  );
  const siteLabel = useMemo(() => getSiteLabel(), []);

  const handleInstall = useCallback(async () => {
    if (canInstall) {
      const result = await promptInstall();

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
    }

    if (installMessage) {
      setInstallFeedback({
        tone: 'info',
        message: installMessage,
      });
    }
  }, [canInstall, installMessage, promptInstall]);

  const feedbackStyle =
    feedbackStyles[installFeedback?.tone] || feedbackStyles.info;

  return (
    <>
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
          >
            <InstallMobile fontSize="small" aria-hidden="true" />
            <span>Add to Home Screen</span>
          </button>
        </div>

        <div className="pwa-install-banner__emojis" aria-hidden="true">
          {INSTALL_APP_EMOJIS}
        </div>
      </div>

      <Snackbar
        open={Boolean(installFeedback)}
        onClose={() => setInstallFeedback(null)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          severity="none"
          onClose={() => setInstallFeedback(null)}
          style={{
            textAlign: 'center',
            font: 'bold 14px monospace',
            maxWidth: 'min(420px, calc(100vw - 32px))',
            ...feedbackStyle,
          }}
        >
          {installFeedback?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

PwaInstallCard.propTypes = {
  className: PropTypes.string,
  onClose: PropTypes.func,
  showClose: PropTypes.bool,
};

export default PwaInstallCard;
