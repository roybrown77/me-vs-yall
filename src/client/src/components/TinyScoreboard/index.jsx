import Skeleton from '@mui/material/Skeleton';
import get from 'lodash/get';

import { 
    hasGameStarted
} from '../../utilities';

const formatQuarter = (quarter) => {
    if (!quarter) return;
    return quarter === 1 ? `${quarter}st` : quarter === 2 ? `${quarter}nd` : quarter === 3 ? `${quarter}rd` : `${quarter}th`;
};

const formatTime = (time) => {
    const value = (time || 0);
    return value > 59 ? (value/100).toFixed(2).toString().replace('.',':') : ':' + value;
};

const TinyScoreboard = ({loading, title, games, pastel = false}) => {
    const styles = {
        header: {
            maxWidth: '35px',
            backgroundColor: '#000',
            color: '#fff',
            padding: '10px',
            textAlign: 'right',
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
            padding: '5px 0 15px 10px',
            fontWeight: 'bold',
            backgroundColor: pastel ? '#EFFBF8' : '#fff',
            overflowX: 'scroll'
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
        <div style={{margin: '0 0 15px 0'}}>
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
                                return (
                                    <div key={index} style={{marginRight: '10px', borderRight: index+1 === games.length ? '' : '1px dashed gray'}}>
                                        <div style={{display:'flex'}}>
                                            <div style={{marginRight:'5px', textAlign: 'left'}}>
                                                <div style={{height:'14px', color: game.isGameOver ? '' : hasGameStarted(game.startDateTime) ? 'red' : ''}}>
                                                    {game.isGameOver ? 'Final' : hasGameStarted(game.startDateTime) ? 'Live' : ''}
                                                </div>
                                                <div style={{height:'14px'}}>{game.competitors[0].shortLocation}</div>
                                                <div style={{height:'14px'}}>{game.competitors[1].shortLocation}</div>
                                                <div style={{height:'14px'}}>
                                                    {Intl.DateTimeFormat(navigator.language, { weekday: 'short' }).format(new Date(game.startDateTime))}
                                                </div>
                                            </div>
                                            <div style={{marginRight:'5px', textAlign: 'left'}}>
                                                <div style={{height:'14px'}}>
                                                    {game.isGameOver ? '' : hasGameStarted(game.startDateTime) ? (game.currentTime?.toLowerCase() === 'halftime' ? 'HT' : formatTime(get(game,'playHistory[0].time')) === ':0' ? '' : formatTime(get(game,'playHistory[0].time'))) : ''}
                                                </div>
                                                <div style={{height:'14px'}}>{get(game, 'spread.teamId') === game.competitors[0]._id ? get(game, 'spread.amount') : ''}</div>
                                                <div style={{height:'14px'}}>{get(game, 'spread.teamId') === game.competitors[1]._id ? get(game, 'spread.amount') : ''}</div>
                                                <div style={{height:'14px'}}>
                                                    {Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'numeric' }).format(new Date(game.startDateTime))}
                                                </div>
                                            </div>
                                            <div style={{marginRight:'10px', textAlign: 'right'}}>
                                                <div style={{height:'14px'}}>
                                                    {game.isGameOver ? '' : hasGameStarted(game.startDateTime) ? formatQuarter(get(game,'playHistory[0].quarter')) : ''}
                                                </div>
                                                <div style={{height:'14px', ...(game.competitors[0].score >= game.competitors[1].score && hasGameStarted(game.startDateTime) ? {borderRight: "8px solid #FCE385", paddingRight: "4px"} : {}) }}>
                                                    {hasGameStarted(game.startDateTime) ? game.competitors[0].score || 0 : null}
                                                </div>
                                                <div style={{height:'14px', ...(game.competitors[1].score >= game.competitors[0].score && hasGameStarted(game.startDateTime) ? {borderRight: "8px solid #FCE385", paddingRight: "4px"} : {}) }}>
                                                    {hasGameStarted(game.startDateTime) ? game.competitors[1].score || 0 : null}
                                                </div>
                                                <div style={{height:'14px', width:'35px'}}>
                                                    {Intl.DateTimeFormat(navigator.language, { hour: 'numeric', hour12: true }).format(new Date(game.startDateTime))}
                                                </div>
                                            </div>
                                        </div>
                                        <a href={"#game-" + game._id} style={{textDecoration: 'none'}}>
                                            <div style={styles.linkToGame}>{hasGameStarted(game.startDateTime) ? game.isGameOver ? 'Recap' : 'Plays' : 'Preview'}</div>
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