import Skeleton from '@mui/material/Skeleton';
import moment from 'moment-timezone';
import get from 'lodash/get';

import { 
    hasGameStarted
} from '../../utilities';

const formatQuarter = (quarter) => {
    if (!quarter) return '';
    return quarter === 1 ? `${quarter}st` : quarter === 2 ? `${quarter}nd` : quarter === 3 ? `${quarter}rd` : `${quarter}th`;
};

const formatPlayClock = (time) => {
    const value = Number(time);
    if (!Number.isFinite(value) || value < 0) {
        return '';
    }

    if (value > 59) {
        return (value / 100).toFixed(2).toString().replace('.', ':');
    }

    return `${value}:00`;
};

const formatKickoffTime = (startDateTime) => moment(startDateTime).format('h:mm A');

const getLiveClockDisplay = (game) => {
    if (game.isGameOver || !hasGameStarted(game.startDateTime)) {
        return '';
    }

    const currentTime = String(game.currentTime || '').trim();
    if (/^halftime/i.test(currentTime)) {
        return 'HT';
    }

    const clockMatch = currentTime.match(/^(\d{1,2}:\d{2})/);
    if (clockMatch) {
        return clockMatch[1];
    }

    const playClock = formatPlayClock(get(game, 'playHistory[0].time'));
    if (!playClock || playClock === '0:00') {
        return '';
    }

    return playClock;
};

const getLiveQuarterDisplay = (game) => {
    if (game.isGameOver || !hasGameStarted(game.startDateTime)) {
        return '';
    }

    const currentTime = String(game.currentTime || '').trim();
    if (/^halftime/i.test(currentTime)) {
        return '';
    }

    const quarterMatch = currentTime.match(/\b(1st|2nd|3rd|4th|OT\d*)\b/i);
    if (quarterMatch) {
        return quarterMatch[1].toUpperCase() === 'OT' || /^OT/i.test(quarterMatch[1])
            ? quarterMatch[1].toUpperCase()
            : quarterMatch[1];
    }

    return formatQuarter(get(game, 'playHistory[0].quarter'));
};

const TinyScoreboard = ({loading, title, games}) => {
    const styles = {
        header: {
            flex: '0 0 auto',
            minWidth: '35px',
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px 8px',
            textAlign: 'left',
            lineHeight: '20px',
            fontWeight: 'bold',
            fontSize: '14px',
            'WebkitBoxShadow': '0px 8px 0px 0px dodgerblue',
            'MozBoxShadow': '0px 8px 0px 0px dodgerblue',
            boxShadow: '0px 8px 0px 0px dodgerblue'
        },
        gameContainer: {
            display: 'flex',
            fontSize: '12px',
            padding: '5px 0 15px 4px',
            fontWeight: 'bold',
            backgroundColor: '#fff',
            overflowX: 'auto',
            flex: '1 1 auto',
            minWidth: 0,
        },
        gameCard: {
            marginRight: '8px',
            paddingRight: '8px',
            flex: '0 0 auto',
        },
        gameRow: {
            display: 'flex',
            whiteSpace: 'nowrap',
            alignItems: 'flex-start',
        },
        metaColumn: {
            marginRight: '4px',
            textAlign: 'left',
        },
        timeColumn: {
            marginRight: '4px',
            textAlign: 'left',
            minWidth: '34px',
        },
        scoreColumn: {
            textAlign: 'left',
            minWidth: '58px',
        },
        rowLine: {
            height: '14px',
            lineHeight: '14px',
            whiteSpace: 'nowrap',
        },
        kickoffTime: {
            height: '14px',
            lineHeight: '14px',
            minWidth: '58px',
            whiteSpace: 'nowrap',
        },
        linkToGame: {
            color: '#000',
            margin: '4px 8px 0 0',
            border: '4px solid #000',
            borderRadius: '8px'
        }
    };

    if (games?.length === 0 && !loading) return null;

    return (
        <div style={{margin: '15px 0'}}>
            <div style={{display: 'flex'}}>
                <div style={styles.header}>
                    {title}
                </div>
                {
                    loading && 
                    <div style={{...styles.gameContainer, padding: '10px', height: '70px', width: '100%' }}>
                        <Skeleton animation="pulse" height='100%' width='100%' variant="rect"/>
                    </div>
                }
                { 
                    !loading && 
                    <div style={styles.gameContainer}>
                        {
                            games?.map((game, index) => {
                                const isLive = hasGameStarted(game.startDateTime) && !game.isGameOver;
                                const leaderStyle = (competitorIndex) => (
                                    game.competitors[competitorIndex].score >= game.competitors[1 - competitorIndex].score && isLive
                                        ? { borderRight: '8px solid #FCE385', paddingRight: '4px' }
                                        : {}
                                );

                                return (
                                    <div
                                        key={index}
                                        style={{
                                            ...styles.gameCard,
                                            borderRight: index + 1 === games.length ? '' : '1px dashed gray',
                                        }}
                                    >
                                        <div style={styles.gameRow}>
                                            <div style={styles.metaColumn}>
                                                <div style={{...styles.rowLine, color: game.isGameOver ? '' : isLive ? 'red' : ''}}>
                                                    {game.isGameOver ? 'Final' : isLive ? 'Live' : ''}
                                                </div>
                                                <div style={styles.rowLine}>{game.competitors[0].shortLocation}</div>
                                                <div style={styles.rowLine}>{game.competitors[1].shortLocation}</div>
                                                <div style={styles.rowLine}>
                                                    {Intl.DateTimeFormat(navigator.language, { weekday: 'short' }).format(new Date(game.startDateTime))}
                                                </div>
                                            </div>
                                            <div style={styles.timeColumn}>
                                                <div style={styles.rowLine}>{getLiveClockDisplay(game)}</div>
                                                <div style={styles.rowLine}>{get(game, 'spread.teamId') === game.competitors[0]._id ? get(game, 'spread.amount') : ''}</div>
                                                <div style={styles.rowLine}>{get(game, 'spread.teamId') === game.competitors[1]._id ? get(game, 'spread.amount') : ''}</div>
                                                <div style={styles.rowLine}>
                                                    {Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'numeric' }).format(new Date(game.startDateTime))}
                                                </div>
                                            </div>
                                            <div style={styles.scoreColumn}>
                                                <div style={styles.rowLine}>{getLiveQuarterDisplay(game)}</div>
                                                <div style={{...styles.rowLine, ...leaderStyle(0)}}>
                                                    {isLive || game.isGameOver ? game.competitors[0].score || 0 : null}
                                                </div>
                                                <div style={{...styles.rowLine, ...leaderStyle(1)}}>
                                                    {isLive || game.isGameOver ? game.competitors[1].score || 0 : null}
                                                </div>
                                                <div style={styles.kickoffTime}>{formatKickoffTime(game.startDateTime)}</div>
                                            </div>
                                        </div>
                                        <a href={"#game-" + game._id} style={{textDecoration: 'none'}}>
                                            <div style={styles.linkToGame}>{game.isGameOver ? 'Recap' : isLive ? 'Plays' : 'Preview'}</div>
                                        </a>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </div>
        </div>
    );
};

export default TinyScoreboard;