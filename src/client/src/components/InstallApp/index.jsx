import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';

import InstallMobile from '@mui/icons-material/InstallMobile';
import IconButton from '@mui/material/IconButton';

import PwaInstallCard from '../PwaInstallCard';
import usePwaInstallPrompt from '../../hooks/usePwaInstallPrompt';

const InstallApp = ({ marginLeft = '0' }) => {
  const { installed } = usePwaInstallPrompt();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!isOpen || typeof document === 'undefined') return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (installed) return null;

  const modal =
    isOpen && typeof document !== 'undefined'
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
              aria-label="Install app"
              onClick={(event) => event.stopPropagation()}
            >
              <PwaInstallCard
                className="pwa-install-banner--modal"
                onClose={() => setIsOpen(false)}
                showClose
                showEmojis
              />
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        onClick={() => setIsOpen((current) => !current)}
        style={{
          marginTop: '25px',
          marginLeft,
          padding: '10px',
          backgroundColor: '#fff',
          cursor: 'pointer',
        }}
      >
        <div style={{ fontSize: '9px', fontWeight: 700 }}>Install App</div>
        <div
          style={{
            background: '#FFE8A3',
            margin: '5px',
            borderRadius: '8px',
          }}
        >
          <IconButton style={{ color: '#000' }} aria-label="Install app">
            <InstallMobile className="install-app-icon-wiggle" />
          </IconButton>
        </div>
      </div>

      {modal}
    </>
  );
};

InstallApp.propTypes = {
  marginLeft: PropTypes.string,
};

export default InstallApp;
