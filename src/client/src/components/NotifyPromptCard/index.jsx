import PropTypes from 'prop-types';

import InstallMobile from '@mui/icons-material/InstallMobile';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

import usePwaInstallAction from '../../hooks/usePwaInstallAction';
import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';
import mvyIcon from '../../styles/images/mvy-balls-cut.png';
import { INSTALL_APP_EMOJIS } from '../../utilities/pwaInstall';

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

const NotifyPromptCard = ({ disabledReason, onClose }) => {
  const { installed } = usePwaInstallPrompt();
  const {
    handleInstall,
    installFeedback,
    installMessage,
    setInstallFeedback,
  } = usePwaInstallAction();

  const feedbackStyle =
    feedbackStyles[installFeedback?.tone] || feedbackStyles.info;

  return (
    <>
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
            ) : installMessage ? (
              <div className="pwa-install-banner__hint">{installMessage}</div>
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

NotifyPromptCard.propTypes = {
  disabledReason: PropTypes.string,
  onClose: PropTypes.func.isRequired,
};

export default NotifyPromptCard;
