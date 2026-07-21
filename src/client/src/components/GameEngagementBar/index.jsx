import { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Send from '@mui/icons-material/Send';
import ToggleOn from '@mui/icons-material/ToggleOn';
import ToggleOff from '@mui/icons-material/ToggleOff';
import NotificationsActive from '@mui/icons-material/NotificationsActive';
import NotificationsOff from '@mui/icons-material/NotificationsOff';

import CalendarReminder from '../CalendarReminder';
import styles from "../../pages/Scoreboard/styles";
import { callApi } from '../../utilities/http';

import {
    getCopiedGamesToShare,
  } from "../../utilities";

const GameEngagementBar = ({ handleSpreadToggleOn, handleSpreadToggleOff, games, picks, teams, isAuthenticated, userId, showSpreadToggle = true }) => {
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [isSpreadModeAlertOpen, setIsSpreadModeAlertOpen] = useState(false);
    const [isEnablingNotifications, setIsEnablingNotifications] = useState(false);
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const notificationsSupported =
      typeof window !== 'undefined' &&
      'Notification' in window &&
      'serviceWorker' in navigator &&
      'PushManager' in window;
    const isNotificationRuntimeReady = import.meta.env.PROD && notificationsSupported;
        const notificationPermission =
            typeof window !== 'undefined' && 'Notification' in window
                ? Notification.permission
                : 'unsupported';

        const notifyDisabledReason = notificationsEnabled
            ? 'Notifications are already enabled on this device.'
            : isEnablingNotifications
                ? 'Notifications are currently being enabled.'
                : !import.meta.env.PROD
                    ? 'Notifications are disabled in development mode. Use preview or production build.'
                    : !window.isSecureContext
                        ? 'Notifications require a secure context (HTTPS or localhost).'
                        : !('Notification' in window)
                            ? 'This browser does not support the Notification API.'
                            : !('serviceWorker' in navigator)
                                ? 'This browser does not support service workers for push.'
                                : !('PushManager' in window)
                                    ? 'This browser does not support PushManager for web push.'
                                    : notificationPermission === 'denied'
                                        ? 'Notifications are blocked in browser/app settings. Allow notifications and try again.'
                                        : '';
        const isNotifyDisabled = !notificationsEnabled && Boolean(notifyDisabledReason);

        const disableNotifications = useCallback(async () => {
            try {
                setIsEnablingNotifications(true);

                if (!('serviceWorker' in navigator)) {
                    setNotificationsEnabled(false);
                    return;
                }

                const registration = await navigator.serviceWorker.ready;
                const existing = await registration.pushManager.getSubscription();

                if (existing) {
                    await callApi({
                        method: 'DELETE',
                        endpoint: '/api/notificationmanagement/subscriptions',
                        body: { endpoint: existing.endpoint },
                    });

                    await existing.unsubscribe();
                }

                setNotificationsEnabled(false);
            } catch (error) {
                console.error(error);
                alert(getEnableErrorMessage(error));
            } finally {
                setIsEnablingNotifications(false);
            }
        }, []);

        const getEnableErrorMessage = (error) => {
            const status = error?.response?.status;
            const dataMessage =
                typeof error?.response?.data === 'string'
                    ? error.response.data
                    : error?.response?.data?.message;

            if (status === 401 || status === 403) {
                return 'Your session is not authorized for notification sync. Please sign in again.';
            }

            if (status === 400 && dataMessage) {
                return `Notification setup failed: ${dataMessage}`;
            }

            if (dataMessage) {
                return `Could not enable notifications: ${dataMessage}`;
            }

            if (error?.message) {
                return `Could not enable notifications: ${error.message}`;
            }

            return 'Could not enable notifications.';
        };

        useEffect(() => {
            const load = async () => {
                if (!isNotificationRuntimeReady) return;

                try {
                    const registration = await navigator.serviceWorker.ready;
                    const existing = await registration.pushManager.getSubscription();
                    if (existing) {
                        setNotificationsEnabled(true);
                        return;
                    }
                } catch {
                    // ignore local subscription check errors
                }

                if (!isAuthenticated) return;

                try {
                    const result = await callApi({
                        method: 'GET',
                        endpoint: '/api/notificationmanagement/subscriptions/me',
                    });
                    setNotificationsEnabled(Boolean(result?.subscribed));
                } catch {
                    // ignore
                }
            };

            load();
        }, [isAuthenticated, isNotificationRuntimeReady]);

        const enableNotifications = useCallback(async () => {
            try {
                setIsEnablingNotifications(true);

                if (!isNotificationRuntimeReady) {
                    alert('Push notifications are not supported in this browser.');
                    return;
                }

                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;

                const { publicKey } = await callApi({
                    method: 'GET',
                    endpoint: '/api/notificationmanagement/vapidPublicKey',
                });

                const urlBase64ToUint8Array = (base64String) => {
                    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
                    const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
                    const rawData = window.atob(base64);
                    const outputArray = new Uint8Array(rawData.length);
                    for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
                    return outputArray;
                };

                const registration = await navigator.serviceWorker.ready;
                const existing = await registration.pushManager.getSubscription();

                const subscription =
                    existing ||
                    (await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(publicKey),
                    }));

                                const payload = {
                                    subscription,
                                    userAgent: navigator.userAgent,
                                    notificationTypes: ['upcoming', 'in_progress', 'all_final'],
                                };

                                if (isAuthenticated) {
                                    try {
                                        await callApi({
                                            method: 'POST',
                                            endpoint: '/api/notificationmanagement/subscriptions/authenticated',
                                            body: payload,
                                        });
                                    } catch (authError) {
                                        const authStatus = authError?.response?.status;
                                        if (authStatus === 401 || authStatus === 403) {
                                            // If session is stale, still register a guest subscription.
                                            await callApi({
                                                method: 'POST',
                                                endpoint: '/api/notificationmanagement/subscriptions',
                                                body: payload,
                                            });
                                        } else {
                                            throw authError;
                                        }
                                    }
                                } else {
                                    await callApi({
                                        method: 'POST',
                                        endpoint: '/api/notificationmanagement/subscriptions',
                                        body: payload,
                                    });
                                }

                setNotificationsEnabled(true);
            } catch (error) {
                console.error(error);
                                alert(getEnableErrorMessage(error));
            } finally {
                setIsEnablingNotifications(false);
            }
        }, [isAuthenticated, isNotificationRuntimeReady]);

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
        <div
            style={{
                display: 'flex',
                color: '#000',
                alignItems: 'flex-start',
                flexWrap: 'nowrap',
                gap: '0',
            }}
        >
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
                            <Send className="share-plane-idle" onClick={handleShareGames} />
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
            {showSpreadToggle && (
                <div
                    style={{
                        marginTop: '25px',
                        padding: '10px',
                        backgroundColor: '#fff',
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
                                {'Spread mode activated!'}
                                <span style={{ marginLeft: '4px', fontSize: '2rem' }}>🐣</span>
                            </Alert>
                        </Snackbar>
                    </div>
                </div>
            )}

            <CalendarReminder marginLeft="0" iconClassName="add-reminder-icon-wiggle" />

            <div
                style={{
                    marginTop: '25px',
                    padding: '10px',
                    backgroundColor: '#fff',
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
                                        <Tooltip
                                                title={
                                                    notificationsEnabled
                                                        ? 'Notifications are enabled. Click to turn them off.'
                                                        : notifyDisabledReason || 'Enable notifications'
                                                }
                                                arrow
                                        >
                        <span>
                            <IconButton
                                style={{ color: '#000' }}
                                                                onClick={
                                                                    isNotifyDisabled
                                                                        ? undefined
                                                                        : notificationsEnabled
                                                                            ? disableNotifications
                                                                            : enableNotifications
                                                                }
                                                                aria-label={notificationsEnabled ? 'disable notifications' : 'enable notifications'}
                                disabled={isNotifyDisabled}
                            >
                                                                {notificationsEnabled ? (
                                                                    <NotificationsActive className="notify-icon-wiggle" />
                                                                ) : (
                                                                    <NotificationsOff className="notify-icon-wiggle" />
                                                                )}
                            </IconButton>
                        </span>
                    </Tooltip>
                </div>
            </div>

        </div>
    );
};

GameEngagementBar.propTypes = {
    handleSpreadToggleOn: PropTypes.func,
    handleSpreadToggleOff: PropTypes.func,
    games: PropTypes.array.isRequired,
    picks: PropTypes.object.isRequired,
    teams: PropTypes.object.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
    userId: PropTypes.string,
    showSpreadToggle: PropTypes.bool,
};

export default GameEngagementBar;
