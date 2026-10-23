import { useState } from 'react';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';

import {
  buildOverUnderHistoryRows,
  buildSpreadHistoryRows,
  formatOverUnderLabel,
  formatSpreadFavoriteLabel,
  overUnderLineHasMovement,
  spreadLineHasMovement,
} from '../gameLines';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 'min(92vw, 360px)',
  maxHeight: '70vh',
  overflow: 'auto',
  bgcolor: '#fff',
  borderRadius: '12px',
  boxShadow: 24,
  p: 2,
  fontFamily: 'monospace',
};

const LineHistoryModal = ({ open, title, rows, onClose }) => (
  <Modal open={open} onClose={onClose} aria-labelledby="game-line-history-title">
    <Box sx={modalStyle}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <h3 id="game-line-history-title" style={{ margin: 0, fontSize: '16px' }}>
          {title}
        </h3>
        <IconButton aria-label="Close line history" onClick={onClose} size="small">
          <Close />
        </IconButton>
      </div>
      {rows.length === 0 ? (
        <p style={{ margin: 0, color: '#666' }}>No line history yet.</p>
      ) : (
        <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
          {rows.map((row) => (
            <li
              key={`${row.date}-${row.valueLabel}`}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                padding: '8px 0',
                borderBottom: '1px solid #eee',
                fontSize: '13px',
              }}
            >
              <span style={{ color: '#555' }}>{row.dateLabel}</span>
              <span style={{ fontWeight: 700, textAlign: 'right' }}>{row.valueLabel}</span>
            </li>
          ))}
        </ul>
      )}
    </Box>
  </Modal>
);

LineHistoryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  rows: PropTypes.array.isRequired,
  onClose: PropTypes.func.isRequired,
};

const lineButtonStyle = (hasMovement, slimMode) => ({
  flex: 1,
  minWidth: 0,
  border: 'none',
  borderRadius: slimMode ? '6px' : '8px',
  padding: slimMode ? '6px 8px' : '8px 10px',
  fontFamily: 'monospace',
  fontSize: slimMode ? '10px' : '12px',
  fontWeight: 700,
  cursor: 'pointer',
  textAlign: 'center',
  backgroundColor: hasMovement ? '#FCE385' : '#f0f0f0',
  color: '#000',
});

const GameLinesBar = ({ game, slimMode = false }) => {
  const [spreadOpen, setSpreadOpen] = useState(false);
  const [overUnderOpen, setOverUnderOpen] = useState(false);

  const spreadRows = buildSpreadHistoryRows(game);
  const overUnderRows = buildOverUnderHistoryRows(game);
  const showSpread = spreadRows.length > 0 || getSpreadAvailable(game);
  const showOverUnder = overUnderRows.length > 0 || hasOverUnder(game);

  if (!showSpread && !showOverUnder) {
    return null;
  }

  const spreadMoved = spreadLineHasMovement(game);
  const ouMoved = overUnderLineHasMovement(game);

  return (
    <div
      className="game-lines-bar"
      style={{
        width: '100%',
        display: 'flex',
        marginTop: slimMode ? '6px' : '10px',
        marginBottom: slimMode ? '2px' : '4px',
        padding: slimMode ? '0 2px' : '0 4px',
        gap: slimMode ? '6px' : '8px',
        boxSizing: 'border-box',
      }}
    >
      {showSpread && (
        <button
          type="button"
          style={lineButtonStyle(spreadMoved, slimMode)}
          onClick={() => setSpreadOpen(true)}
          aria-label="View spread line history"
        >
          {formatSpreadFavoriteLabel(game)}
        </button>
      )}
      {showOverUnder && (
        <button
          type="button"
          style={lineButtonStyle(ouMoved, slimMode)}
          onClick={() => setOverUnderOpen(true)}
          aria-label="View over under line history"
        >
          {formatOverUnderLabel(game)}
        </button>
      )}
      <LineHistoryModal
        open={spreadOpen}
        title="Spread by day"
        rows={spreadRows}
        onClose={() => setSpreadOpen(false)}
      />
      <LineHistoryModal
        open={overUnderOpen}
        title="Over / under by day"
        rows={overUnderRows}
        onClose={() => setOverUnderOpen(false)}
      />
    </div>
  );
};

function getSpreadAvailable(game) {
  return Boolean(game?.spread?.teamId);
}

function hasOverUnder(game) {
  const ou = game?.overUnder;
  return ou !== undefined && ou !== null && ou !== '';
}

GameLinesBar.propTypes = {
  game: PropTypes.object.isRequired,
  slimMode: PropTypes.bool,
};

export default GameLinesBar;
