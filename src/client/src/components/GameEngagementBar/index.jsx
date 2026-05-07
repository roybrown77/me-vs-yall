import { useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Send from '@mui/icons-material/Send';
import ToggleOn from '@mui/icons-material/ToggleOn';
import ToggleOff from '@mui/icons-material/ToggleOff';

import CalendarReminder from '../CalendarReminder';
import styles from "../../pages/Scoreboard/styles";

import {
    getCopiedGamesToShare,
  } from "../../utilities";

const GameEngagementBar = ({
    handleSpreadToggleOn,
    handleSpreadToggleOff,
    games,
    picks,
    teams,
    isAuthenticated,
    userId,
    spreadMode,
    arcadeMode,
    onArcadeModeChange,
}) => {
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [isSpreadModeAlertOpen, setIsSpreadModeAlertOpen] = useState(false);

    const handleShareGames = () => {
        const gamesToShare = getCopiedGamesToShare(games, picks, teams, isAuthenticated, userId);

        // Create a temporary text area element
        const textArea = document.createElement('textarea');
        textArea.value = gamesToShare;

        // Append the text area to the document
        document.body.appendChild(textArea);

        // Select the text in the text area
        textArea.select();
        textArea.setSelectionRange(0, textArea.value.length);

        // Copy the selected text to the clipboard
        document.execCommand('copy');

        // Remove the temporary text area
        document.body.removeChild(textArea);

        setIsShareClicked(true);
    };

    const handleGamesCopiedAlertClose = () => {
        setIsShareClicked(false);
    };

    const handleSpreadModeAlertClose = () => {
        setIsSpreadModeAlertOpen(false);
    };

    const isArcadeModeEnabled = typeof arcadeMode === "boolean" ? arcadeMode : false;
    const surfaceBackgroundColor = isArcadeModeEnabled ? '#EFFBF8' : '#fff';

    const enableSpreadMode = () => {
        setIsSpreadModeAlertOpen(true);
        handleSpreadToggleOn?.();
    };

    const disableSpreadMode = () => {
        setIsSpreadModeAlertOpen(false);
        handleSpreadToggleOff?.();
    };

    const toggleArcadeMode = () => {
        onArcadeModeChange?.(!isArcadeModeEnabled);
    };

    return (
        <div
            style={{
                display: 'flex',
                width: '100%',
                color: '#000',
                flexWrap: 'wrap',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                boxSizing: 'border-box',
            }}
        >
            <div style={{ display: 'flex' }}>
                <div
                    onClick={toggleArcadeMode}
                    style={{
                        marginTop: "25px",
                        padding: "10px",
                        backgroundColor: surfaceBackgroundColor,
                        cursor: "pointer",
                    }}
                >
                    <div style={{ fontSize: "9px", fontWeight: 700 }}>Arcade Mode</div>
                    <div style={{ background: 'dodgerblue', margin: '5px', borderRadius: '8px' }}>
                        <IconButton
                            style={isArcadeModeEnabled ? styles.toggleButtonOn : styles.toggleButtonOff}
                            aria-label="Toggle Arcade Mode"
                        >
                            {isArcadeModeEnabled ? <ToggleOn /> : <ToggleOff />}
                        </IconButton>
                    </div>
                </div>
                <CalendarReminder containerStyle={{ marginLeft: 0 }} />
            </div>
            {document.queryCommandSupported('copy') && (
                <div
                    style={{
                        marginTop: '25px',
                        padding: '10px',
                        backgroundColor: surfaceBackgroundColor,
                    }}
                >
                    <div style={{ fontSize: '9px', fontWeight: 700 }}>
                        Share {isAuthenticated ? 'Picks' : 'Games'}
                    </div>
                    <div
                        style={{
                            background: '#B3E6CA',
                            margin: '5px',
                            borderRadius: '8px',
                        }}
                    >
                        <IconButton
                            className={isShareClicked ? 'fly-plane' : ''}
                            style={{ color: 'black' }}
                            aria-label={isAuthenticated ? 'share picks' : 'share games'}
                        >
                            <Send
                                onClick={handleShareGames}
                                style={{
                                    WebkitTransform: 'rotate(-45deg)',
                                    transform: 'rotate(-45deg)',
                                }}
                            />
                        </IconButton>
                        <Snackbar
                            open={isShareClicked}
                            onClose={handleGamesCopiedAlertClose}
                            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                        >
                            <Alert
                                severity="none"
                                onClose={handleGamesCopiedAlertClose}
                                style={{
                                    textAlign: 'center',
                                    backgroundColor: '#B3E6CA',
                                    color: '#000000',
                                    font: 'bold 14px monospace',
                                }}
                            >
                                {isAuthenticated
                                    ? 'Picks are copied and ready to share with your friends around the world! 🌎🌍🌏🌞'
                                    : 'Games are copied and ready to share with your friends around the world! 🌎🌍🌏🌞'}
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            )}
            <div
                style={{
                    marginTop: '25px',
                    padding: '10px',
                    backgroundColor: surfaceBackgroundColor,
                }}
            >
                <div style={{ fontSize: '9px', fontWeight: 700 }}>vs Spread</div>
                <div
                    style={{
                        background: '#FCE385',
                        margin: '5px',
                        borderRadius: '8px',
                    }}
                >
                    <IconButton
                        style={spreadMode ? styles.toggleButtonOn : styles.toggleButtonOff}
                        aria-label="toggle spread mode"
                    >
                        {spreadMode ? (
                            <ToggleOn onClick={disableSpreadMode} />
                        ) : (
                            <ToggleOff onClick={enableSpreadMode} />
                        )}
                    </IconButton>
                    <Snackbar
                        open={isSpreadModeAlertOpen}
                        onClose={handleSpreadModeAlertClose}
                        anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
                    >
                        <Alert
                            severity="none"
                            onClose={handleSpreadModeAlertClose}
                            style={{
                                textAlign: 'center',
                                backgroundColor: '#FCE385',
                                color: '#000000',
                                font: 'bold 14px monospace',
                            }}
                        >
                            {'Spread mode activated!'}
                            <span style={{ marginLeft: '4px', fontSize: '2rem' }}>🐣</span>
                        </Alert>
                    </Snackbar>
                </div>
            </div>
        </div>
    );
};

GameEngagementBar.propTypes = {
    handleSpreadToggleOn: PropTypes.func.isRequired,
    handleSpreadToggleOff: PropTypes.func.isRequired,
    games: PropTypes.array.isRequired,
    picks: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    spreadMode: PropTypes.bool,
    arcadeMode: PropTypes.bool,
    onArcadeModeChange: PropTypes.func,
};

export default GameEngagementBar;
