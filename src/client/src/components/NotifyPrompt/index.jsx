import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import NotificationsOff from '@mui/icons-material/NotificationsOff';

import NotifyPromptCard from '../NotifyPromptCard';
import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';

import '../PwaInstall/pwa-install.css';

const notifyFeedbackStyles = {
  success: {
    backgroundColor: '#B3E6CA',
    color: '#000000',
  },
  info: {
    backgroundColor: '#FFE8A3',
    color: '#000000',
  },
};

const NotifyPrompt = ({
  notificationsEnabled,
  notificationsSupported,
  notifyDisabledReason,
  isEnablingNotifications,
  onEnable,
  onDisable,
}) => {
  const { installed } = usePwaInstallPrompt();
  const [isOpen, setIsOpen] = useState(false);
  const [notifyFeedback, setNotifyFeedback] = useState(null);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  const handleClick = async () => {
    if (isEnablingNotifications) return;

    if (notificationsEnabled) {
      const result = await onDisable();
      if (result?.message) {
        setNotifyFeedback(result);
      }
      return;
    }

    if (notificationsSupported || installed) {
      const result = await onEnable();
      if (result?.message) {
        setNotifyFeedback(result);
      }
      return;
    }

    if (!installed) {
      setIsOpen(true);
    }
  };

  const modal =
    isOpen && !installed && typeof document !== 'undefined'
      ? createPortal(
          <div
            className="pwa-install-overlay"
            role="presentation"
            onClick={() => setIsOpen(false)}
          >
            <div
              className="pwa-install-overlay__panel"
              role="dialog"
              aria-modal="true"
              aria-label="Notification options"
              onClick={(event) => event.stopPropagation()}
            >
              <NotifyPromptCard
                disabledReason={notifyDisabledReason}
                onClose={() => setIsOpen(false)}
              />
            </div>
          </div>,
          document.body
        )
      : null;

  const feedbackStyle =
    notifyFeedbackStyles[notifyFeedback?.tone] || notifyFeedbackStyles.info;

  return (
    <>
      <div
        onClick={handleClick}
        style={{
          marginTop: '25px',
          padding: '10px',
          backgroundColor: '#fff',
          cursor: isEnablingNotifications ? 'wait' : 'pointer',
        }}
      >
        <div style={{ fontSize: '9px', fontWeight: 700 }}>Notify</div>
        <div
          style={{
            background: notificationsEnabled ? '#B3E6CA' : '#E4E4E4',
            margin: '5px',
            borderRadius: '8px',
          }}
        >
          <IconButton
            style={{ color: '#000', pointerEvents: 'none' }}
            aria-label={
              notificationsEnabled ? 'disable notifications' : 'notification options'
            }
            disabled={isEnablingNotifications}
          >
            {notificationsEnabled ? (
              <NotificationsActive className="notify-icon-wiggle" />
            ) : (
              <NotificationsOff className="notify-icon-wiggle" />
            )}
          </IconButton>
        </div>
      </div>

      <Snackbar
        open={Boolean(notifyFeedback)}
        onClose={() => setNotifyFeedback(null)}
        autoHideDuration={6000}
        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
      >
        <Alert
          severity="none"
          onClose={() => setNotifyFeedback(null)}
          style={{
            textAlign: 'center',
            font: 'bold 14px monospace',
            maxWidth: 'min(420px, calc(100vw - 32px))',
            ...feedbackStyle,
          }}
        >
          {notifyFeedback?.message}
        </Alert>
      </Snackbar>

      {modal}
    </>
  );
};

NotifyPrompt.propTypes = {
  notificationsEnabled: PropTypes.bool.isRequired,
  notificationsSupported: PropTypes.bool.isRequired,
  notifyDisabledReason: PropTypes.string,
  isEnablingNotifications: PropTypes.bool.isRequired,
  onEnable: PropTypes.func.isRequired,
  onDisable: PropTypes.func.isRequired,
};

export default NotifyPrompt;
