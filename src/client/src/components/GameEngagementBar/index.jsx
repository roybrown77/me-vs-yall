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

const GameEngagementBar = ({ handleSpreadToggleOn, handleSpreadToggleOff, games, picks, teams, isAuthenticated, userId }) => {
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

    const spreadToggleOn = () => {
        localStorage.setItem("spreadModeToggle", "1");
        setIsSpreadModeAlertOpen(false);
        handleSpreadToggleOff();
    };

    const spreadToggleOff = () => {
        localStorage.setItem("spreadModeToggle", "0");
        setIsSpreadModeAlertOpen(true);
        handleSpreadToggleOn();
    };

    const spreadMode = localStorage.getItem("spreadModeToggle") === "1";

    return (
        <div style={{ display: 'flex', color: '#000' }}>
            <CalendarReminder />
            {document.queryCommandSupported('copy') && (
                <div
                    style={{
                        marginTop: '25px',
                        padding: '10px',
                        backgroundColor: '#fff',
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
                                severity="success"
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
                    backgroundColor: '#fff',
                    marginLeft: !document.queryCommandSupported('copy') ? 'auto' : undefined,
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
                            <ToggleOn onClick={spreadToggleOn} />
                        ) : (
                            <ToggleOff onClick={spreadToggleOff} />
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
                            {'Spread mode activated! 🐣'}
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
};

export default GameEngagementBar;
