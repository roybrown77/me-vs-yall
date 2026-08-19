import { useCallback } from 'react';
import PropTypes from 'prop-types';

import InstallMobile from '@mui/icons-material/InstallMobile';

import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';
import mvyIcon from '../../styles/images/mvy-balls-cut.png';
import { INSTALL_APP_EMOJIS } from '../../utilities/pwaInstall';

const NotifyPromptCard = ({ disabledReason, onClose }) => {
  const { canInstall, promptInstall, installed } = usePwaInstallPrompt();

  const handleInstall = useCallback(async () => {
    if (!canInstall) return;

    await promptInstall();
  }, [canInstall, promptInstall]);

  return (
    <div
      className="pwa-install-banner pwa-install-banner--modal"
      role="region"
      aria-label="Notification options"
    >
      <button
        type="button"
        className="pwa-install-banner__close"
        onClick={onClose}
        aria-label="Close notification options"
      >
        ×
      </button>

      <div className="pwa-install-banner__header">
        <img className="pwa-install-banner__icon" src={mvyIcon} alt="" />
        <div className="pwa-install-banner__info">
          <div className="pwa-install-banner__title">Get Notified</div>
          <div className="pwa-install-banner__subtitle">Never miss pick time</div>
          {disabledReason ? (
            <div className="pwa-install-banner__hint">{disabledReason}</div>
          ) : null}
        </div>
      </div>

      <div className="pwa-install-banner__message">
        {installed
          ? 'Push notifications need to be enabled in your installed app settings.'
          : 'Installing the app enables push notifications on your device.'}{' '}
        Otherwise, set a daily 7:00 PM reminder in your calendar.
      </div>

      {!installed ? (
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
      ) : null}

      <div className="pwa-install-banner__emojis" aria-hidden="true">
        {INSTALL_APP_EMOJIS}
      </div>
    </div>
  );
};

NotifyPromptCard.propTypes = {
  disabledReason: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default NotifyPromptCard;
