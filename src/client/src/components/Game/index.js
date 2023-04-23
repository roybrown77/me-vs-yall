import React, { Component, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment-timezone';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Grow from '@material-ui/core/Grow';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import green from '@material-ui/core/colors/green';

import CheckCircle from '@material-ui/icons/CheckCircle';
import Cancel from '@material-ui/icons/Cancel';

import { hasGameStarted } from '../../utilities';

import {watchLiveGames} from '../../config';

import { Field } from './Field';

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: 'fit-content'
  },
  game: {
    backgroundColor: '#ffffff',
    padding: '8px',
    marginBottom: '8px'
  },
  paper: {
    borderRadius: '8px',
    boxShadow: 'none'
  },
  control: {
    padding: '32px',
  },
  checkBox: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
  startDateTime: {
    fontSize: '14px',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.87)',
    marginTop: '5px'
  },
  lastPlay: {
    fontSize: '12px',
    fontWeight: 'bold',
    color: 'rgba(0,0,0,.87)'
  },
  tieButton: {
    fontWeight: "700",
    marginTop: '10px',
    width: '25%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  gamePlayMessage: {
    fontWeight: "700",
    marginTop: '10px',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  gameStats: {
    fontWeight: "700",
    marginTop: '10px',
    width: '25%',
    backgroundColor: '#5aa17f',
    color: '#FFFFFF',
    borderColor: '#5aa17f',
    '&:hover': {
      backgroundColor: '#5aa17f',
      color: '#FFFFFF',
      borderColor: '#5aa17f',
    }
  },
  saveButton: {
    fontWeight: "700",
    width: '25%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  competitorHeader: {
    minHeight: '32px'
  }
});

const MiniRallyGame = (props) => {
  const [awayScore, setAwayScore] = useState(props.game.competitors[0].score || 0);
  const [homeScore, setHomeScore] = useState(props.game.competitors[1].score || 0);

  useEffect(() => {
    setAwayScore(props.game.competitors[0].score || 0);
    setHomeScore(props.game.competitors[1].score || 0);
  },[props.game.competitors]);

  const awayScoreHandler = () => {
    setAwayScore(awayScore + 7);
  };

  const homeScoreHandler = () => {
    setHomeScore(homeScore + 7);
  };
  
  return (
    <div style={{marginTop: '10px'}}>
      <div style={{display: 'inline-flex', width: '50%', padding: '3px', backgroundColor: '#000', borderRadius: '4px'}}>
        <div style={{
          width: '100%',
          border: '5px dotted yellow',
          margin: '2px',
          display: 'inline-flex',
          padding: '5px'
        }}>
          <div style={{ margin: 'auto', width: '25%'}}>
            <div style={{color: '#fff', marginBottom: '5px'}}>{props.game.competitors[0].shortLocation}</div>
            <div style={{backgroundColor: '#fff',  fontSize: '20px'}}>
              {awayScore}
            </div>
          </div>
          <div style={{ margin: 'auto', width: '25%'}}>
            <div style={{color: '#fff', marginBottom: '5px'}}>{props.game.competitors[1].shortLocation}</div>
            <div style={{backgroundColor: '#fff',  fontSize: '20px'}}>
              {homeScore}
            </div>
          </div>
        </div>
      </div>
      <Field {...{
          leagueId: get(props.game,'leagueId'),
          away: props.game.competitors[0].shortLocation, 
          awayColor: props.game.competitors[0].color, 
          home: props.game.competitors[1].shortLocation, 
          homeColor: props.game.competitors[1].color,
          awayScoreHandler,
          homeScoreHandler
        }
      }/>
      <div>
        <Button size="small" className={props.classes.gamePlayMessage} onClick={() => {}}>
          Tap Team To Play!
        </Button>
      </div>
    </div>
  );
}
const getFlag = (country) => {
  switch (country) {
    case 'USA':
      return "🇺🇸";
    case 'MEXICO':
      return  "🇲🇽";
    case 'BRAZIL':
      return  "🇧🇷";
    case 'ITALY':
      return  "🇲🇽";
    case 'ICELAND':
      return  "🇮🇸";
    case 'SWEDEN':
      return  "🇸🇪";
    case 'RUSSIA':
      return  "🇷🇺";
    case 'PHILLIPINES':
      return  "🇵🇭";
    case 'BULGARIA':
      return  "🇧🇬";
    case 'ENGLAND':
      return  "🇬🇧";
    case 'CROATIA':
      return  "🇭🇷";
    case 'SURINAME':
      return  "🇸🇷";
    case 'NETHERLANDS':
      return  "🇳🇱";
    case 'JAPAN':
      return  "🇯🇵";
    case 'BAHAMAS':
      return  "🇧🇸";
    case 'UKRAINE':
      return  "🇺🇦";
    case 'NIGERIA':
      return  "🇳🇬";
    case 'POLAND':
      return  "🇵🇱";
    case 'DOMINICAN REPUBLIC':
      return  "🇩🇴";
    case 'AUSTRALIA':
      return  "🇦🇺";
    case 'SOUTH KOREA':
      return  "🇰🇷";
    case 'NICARAGUA':
      return  "🇳🇮";
    case 'JAMAICA':
      return "🇯🇲";
    default:
      return "🇺🇸";
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, padding: 0 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

function GamePlayTabs(props) {
  const { game, classes, handleUpdateGamePlayTab, isAuthenticated, userId } = props;

  const [value, setValue] = React.useState(game.isGameOver ? 1 : 0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    handleUpdateGamePlayTab(newValue);
  };

  return (
    <Box sx={{
      position: "relative",
      zIndex: "2",
      backgroundColor: "#fff"
    }}>
      <Box sx={{ 
        borderBottom: 1, 
        borderColor: 'divider', 
        position: "relative",
        zIndex: "3",
        backgroundColor: "#fff"
      }}>
        <Tabs value={value} onChange={handleChange} aria-label="game play tabs" style={{
          paddingBottom: "20px",
          width: 'fit-content', 
          margin: 'auto',
        }}>
          <Tab label="Plays 🕹" {...a11yProps(0)} />
          <Tab label="Highlights 📸" {...a11yProps(1)} />
          <Tab label="Stats 🍿" {...a11yProps(2)} />
          {
            watchLiveGames &&
            (['59723313734d1d6202a85f10',
              '59723313734d1d6202a85f15',
              '59723313734d1d6202a85f19'].includes(get(game,'leagueId')) || 
            (game.liveVideoUrl || game.highlightVideoUrl)) &&
            <Tab label="Watch Live 📺" {...a11yProps(3)} />
          }
          {
            isAuthenticated &&
            userId === 'google-oauth2|114172296334563495985' &&
            <Tab label="Edit" {...a11yProps(3)} />
          }
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
        {
          hasGameStarted(game.startDateTime) &&
          (game.playHistory || []).length > 0 && 
          ['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
          <WorldFootballGamePlayHistory {...props} />
        }
        {
          hasGameStarted(game.startDateTime) &&
          (game.playHistory || []).length > 0 && 
          !['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
          <div className={classes.lastPlay}>
            {
              <GamePlayHistory {...props} />
            }
          </div>
        }
        {
          !hasGameStarted(game.startDateTime) &&
          <div>
            Please wait for game to start to see play history.
          </div>
        }
        {
          hasGameStarted(game.startDateTime) &&
          game.playHistory.length === 0 &&
          <div>
            No play history available.
          </div>
        }
      </TabPanel>
      <TabPanel value={value} index={1}>
        {
          hasGameStarted(game.startDateTime) &&
          (game.highlights || []).length > 0 && 
          !['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
          <div className={classes.lastPlay}>
            {
              hasGameStarted(game.startDateTime) &&
              (game.highlights || []).length > 0 && 
              !['59723313734d1d6202a85f17','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
              <GameHighlights {...props} />
            }
          </div>
        }
        {
          !hasGameStarted(game.startDateTime) &&
          <div>
            Please wait for game to start to see highlights.
          </div>
        }
        {
          hasGameStarted(game.startDateTime) &&
          game.highlights.length === 0 &&
          <div>
            No highlights available.
          </div>
        }
      </TabPanel>
      <TabPanel value={value} index={2}>
        {
          (game.stats || []).length > 0 &&
          <div style={{fontSize: "14px", fontFamily: "monospace"}}>
            <div style={{padding: "10px"}}>
              <div style={{display:'flex'}}>
                <div style={{height: "24px"}}></div>
                <div style={{position: "absolute", right: "100px"}}>
                  {game.stats[0].awayTeam.name}
                </div>
                <div style={{position: "absolute", right: "10px"}}>
                  {game.stats[1].homeTeam.name}
                </div>
              </div>
              {
                (game.stats || []).map((stat,statIndex)=> (
                  <div key={statIndex}>
                    {
                      stat.header &&
                      <div style={{margin: '10px 0'}}>{stat.header}</div>
                    }
                    <div style={{display:'flex'}}>
                      <div>{stat.name}</div>
                      <div style={{position: "absolute", right: "100px"}}>
                        {stat.awayTeam.value}
                      </div>
                      <div style={{position: "absolute", right: "10px"}}>
                        {stat.homeTeam.value}
                      </div>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        }
        {
          (game.stats || []).length === 0 &&
          <div>No stats available.  Please check last season stats by selecting year above.</div>
        }
      </TabPanel>
      {
        watchLiveGames &&
        (['59723313734d1d6202a85f10',
          '59723313734d1d6202a85f15',
          '59723313734d1d6202a85f19'].includes(get(game,'leagueId')) || 
        ((game.liveVideoUrl && game.liveVideoUrl !== "") || (game.highlightVideoUrl && game.highlightVideoUrl !== ""))) &&
        <TabPanel value={value} index={3}>
          {
            hasGameStarted(game.startDateTime) &&
            !game.isGameOver &&
            (['59723313734d1d6202a85f10',
              '59723313734d1d6202a85f15',
              '59723313734d1d6202a85f19'].includes(get(game,'leagueId')) || 
            (game.liveVideoUrl && game.liveVideoUrl !== "")) &&
            get(game,'currentTime','').toLowerCase() !== 'halftime' &&
            <div className="video-stream" style={{
              zIndex: 2, 
              position: 'relative', 
              top: '-250px', 
              marginBottom: '-250px'
            }}>
              <iframe
                sandbox="allow-forms allow-scripts allow-same-origin allow-top-navigation" 
                allowfullscreen
                scrolling="no"
                style={{width:"90%", height: "800px", border: "none"}}
                title="enjoy!" 
                src={(game.liveVideoUrl && game.liveVideoUrl !== "") ? game.liveVideoUrl : game.serverLiveVideoUrl}
              />
            </div>
          }
          {
            game.highlightVideoUrl &&
            game.highlightVideoUrl !== "" &&
            (game.isGameOver || !hasGameStarted(game.startDateTime)) &&
            <div>
              <iframe style={{borderStyle:'none'}} width="90%" height="215" title="highlight" src={game.highlightVideoUrl} />
            </div>
          }
          {
            !hasGameStarted(game.startDateTime) &&
            <div>
              Please wait for game to start to watch live.
            </div>
          }
          {
            hasGameStarted(game.startDateTime) && 
            game.isGameOver &&
            <div>
              Please come back next time before game ends.
            </div>
          }
          {
            hasGameStarted(game.startDateTime) &&
            !game.isGameOver &&
            get(game,'currentTime','').toLowerCase === 'halftime' &&
            <div>
              Please come back after halftime.
            </div>
          }
        </TabPanel>
      }
      {
        isAuthenticated && 
        userId === 'google-oauth2|114172296334563495985' &&
        <TabPanel value={value} index={2}>
          <GameEditor {...props} />
        </TabPanel>
      }
    </Box>
  );
}

const SelectionIndicator = (props) => {
  const { competitor } = props;
  return (
    <div>
      {
        competitor.selected &&
        <svg aria-label="Unlike" className="_8-yf5 " color="#ed4956" fill="#ed4956" height="25" role="img" viewBox="0 0 48 48" width="25"><path d="M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
      }
      {
        !competitor.selected &&
        <svg aria-label="Like" className="_8-yf5 " color="#262626" fill="#262626" height="25" role="img" viewBox="0 0 48 48" width="25"><path d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z"></path></svg>
      }
    </div>
  );
};

const GamePredictionStatusIcon = (props) => {
  const { game, competitor, spreadMode, pick } = props;

  return (
    <div style={{paddingLeft:'2px'}}>
      {
        ((spreadMode && get(game,'isGameOver') && competitor.selected && !competitor.selectedWinner) ||
        (!spreadMode && get(game,'isGameOver') && competitor.selected && ((game.winner !== competitor._id && get(pick,'pickId') === competitor._id) || 
        (game.winner !== '000000000000000000000000' && 
        get(pick,'pickId') === '000000000000000000000000')))) &&
        <Cancel style={{color:'red'}} />
      }
      {
        ((spreadMode && get(game,'isGameOver') && competitor.selected && competitor.selectedWinner) || 
        (!spreadMode && get(game,'isGameOver') && competitor.selected && ((game.winner === competitor._id && get(pick,'pickId') === competitor._id) || 
        (game.winner === '000000000000000000000000' && 
        get(pick,'pickId') === '000000000000000000000000')))) &&
        <CheckCircle style={{color:'green'}} />
      }
    </div>
  );
};

const Competitor = (props) => {
  const { game, spreadMode, pick, competitor } = props;

  return (
    <Grid className="detail-competitor" item xs={12} sm container>
        <Grid item xs>
            <Grid item>
              <div>
                {
                  !['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(get(game,'leagueId')) &&
                  <div style={{fontSize:'25px', color: competitor.color}}>
                    {hasGameStarted(game.startDateTime) || game.isGameOver ? get(competitor,'score') || 0 : undefined}
                  </div>
                }
                {
                  competitor.country &&
                  <div style={{fontSize:'70px'}}>{getFlag(competitor.country)}</div>
                }
                <div style={{fontSize: competitor.country ? '2rem' : '2.5rem', marginTop: competitor.country ? '-10px' : '0', fontWeight: '600', color: competitor.color}}>
                  <span style={{
                    color:'lightgray', 
                    fontSize: '17px', 
                    paddingRight: competitor.rank ? '8px': '0'
                  }}>
                    {competitor.rank}
                  </span>
                  {competitor.shortLocation}
                </div>
                <div style={{paddingBottom: '4px', fontSize: competitor.country ? '15px' : '20px', padding: competitor.record ? '0' : ((get(game,'isGameOver') && get(pick,'pickId')) || (get(game,'spread.amount') && spreadMode)) ? '4px 0' :  '4px 0'}}>
                  {competitor.name}
                </div>
                {
                  competitor.record &&
                  <div style={{fontSize: '16px', color: '#BDBDBD', padding: ((get(game,'isGameOver') && get(pick,'pickId')) || (get(game,'spread.amount') && spreadMode)) ? '4px 0' :  '4px 0'}}>
                    {competitor.record}
                  </div>
                }
                <div style={{display: 'inline-flex', marginTop: '10px'}}>
                  <SelectionIndicator {...props} />
                  {
                    get(game,'isGameOver') && competitor.selected &&
                    <GamePredictionStatusIcon {...props} />
                  }
                </div>
              </div>
            </Grid>
        </Grid>
    </Grid>
  );
};

const WorldFootballGamePlayHistory = (props) => {
  const { classes, game } = props;

  return (
    <div className={"play-history " + classes.lastPlay}>
      {
        (game.playHistory || []).map((play,playIndex)=> (
          <div key={playIndex} style={{margin:'4px 0',display:'flex'}}>
            <div style={{minWidth:'40px',padding:'4px',backgroundColor:play.color,marginRight:'4px',color:'#fff'}}>
              {play.shortLocation}
            </div>
            <div style={{textAlign:'left'}}>
              {play.lastPlay}
            </div>
          </div>
        ))
      }
    </div>
  );
};

const GameFooter = (props) => {
  const { classes, game, isAuthenticated, userId } = props;

  return (
    <div style={{marginTop: "10px"}} className={"game-footer " + classes.startDateTime}>
        {
          game.gameName && 
          <div style={{marginTop: '5px', fontSize: '15px'}}> 
            {game.gameName}
          </div>
        }
        {
          (userId !== 'google-oauth2|114172296334563495985' || !isAuthenticated) &&                   
          <div style={{marginTop: '5px'}}> 
            {game.startDateTimeDisplay}
          </div>
        }
        {
          get(game,'isGameOver') && 
          <div style={{marginTop:'5px'}}>Final</div>
        }
        {
          !get(game,'isGameOver') && 
          hasGameStarted(game.startDateTime) && 
          <div className='fast-flash' style={{color: 'deeppink', marginTop:'5px'}}>
            {game.currentTime || 'in progress'}
          </div>
        }
        {
          hasGameStarted(game.startDateTime) &&
          !get(game,'isGameOver') && 
          <div className={classes.startDateTime}>
            {game.possession} {game.down}
          </div>
        }
    </div>
  );
};

const CompetitorHeader = (props) => {
  const { classes, game, competitor } = props;

  return (
    <Grid item className={classNames(classes.competitorHeader)}>
      <div style={{fontSize: '17px', 
          display: get(game,'spread.teamId') === competitor._id ? 'block' : 'none', 
          textAlign: 'right'}}>
          {get(game,'spread.amount')}
      </div>
    </Grid>
  );
};

const GamePlayHistory = (props) => {
  const [show, setShow] = React.useState(false);
  
  const handleChange = (event) => {
    setShow(!show);
  };

  const { game } = props;
  return (
    <div className="play-history">
      {
        !show &&
        (game.playHistory || []).slice(0,5).map((play,playIndex)=> {
          return (
            <div key={playIndex} style={{margin:'4px 0',display: 'flex', opacity: !show && playIndex === 4 && (game.playHistory || []).length > 5 ? '.1' : '1'}}>
              <div style={{minWidth:'40px',padding:'4px',backgroundColor:'rgb(45, 232, 149)', marginRight:'4px'}}>
                <div>
                  {['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) ? play.quarter : play.quarter === 1 ? '1st' : play.quarter === 2 ? '2nd' : play.quarter === 3 ? '3rd' : play.quarter + 'th'}
                </div>
                {
                  !['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) &&
                  <div>
                    {(play.time/100).toFixed(3).toString().slice(-1) === '0' ? (play.time/100).toFixed(2).toString().replace('.',':') : (play.time/100).toFixed(2).toString().replace('.',':') + '.' + (play.time/100).toFixed(3).toString().slice(-1)}
                  </div>
                }
              </div>
              <div style={{textAlign:'left'}}>
                {play.lastPlay}
              </div>
            </div>
          );
      })} 
      {
        show &&
        (game.playHistory || []).map((play,playIndex)=> {
          return (
            <div key={playIndex} style={{margin:'4px 0', display: 'flex'}}>
              <div style={{minWidth:'40px',padding:'4px',backgroundColor:'rgb(45, 232, 149)', marginRight:'4px'}}>
                <div>
                  {['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) ? play.quarter : play.quarter === 1 ? '1st' : play.quarter === 2 ? '2nd' : play.quarter === 3 ? '3rd' : play.quarter + 'th'}
                </div>
                {
                  !['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) &&
                  <div>
                    {(play.time/100).toFixed(3).toString().slice(-1) === '0' ? (play.time/100).toFixed(2).toString().replace('.',':') : (play.time/100).toFixed(2).toString().replace('.',':') + '.' + (play.time/100).toFixed(3).toString().slice(-1)}
                  </div>
                }
              </div>
              <div style={{textAlign:'left'}}>
                {play.lastPlay}
              </div>
            </div>
          );
        })
      }
      {
        (game.playHistory || []).length > 5 &&
        <div style={{color: 'rgba(0,0,0,0.87)', fontSize: '15px', margin:'4px 17%', 
        padding: '2px', border: '3px solid rgba(0,0,0,0.87)', borderRadius: '8px'}}
          onClick={handleChange}>{show ? "show less -" : "show more +"}
        </div>
      }
    </div>
  );
};

const GameHighlights = (props) => {
  const [show, setShow] = React.useState(false);
  
  const handleChange = (event) => {
    setShow(!show);
  };

  let quarter;

  const { game } = props;
  
  return (
    <div className="game-highlight">
      <div style={{margin:'4px 0',display:'flex'}}>
        <div style={{minWidth:'40px',padding:'4px',backgroundColor:'#1e90ff', color:'#fff', marginRight:'4px'}}>
          MvY Highlights
        </div>
      </div>
      {
        !show &&
        (game.highlights || []).slice(0,5).map((play,playIndex)=> {
          return (
            <div key={playIndex} style={{margin:'4px 0',display: 'flex', opacity: !show && playIndex === 4 && (game.highlights || []).length > 5 ? '.1' : '1'}}>
              <div style={{minWidth:'40px',padding:'4px',backgroundColor:'#1e90ff', color:'#fff', marginRight:'4px'}}>
                <div>
                  {['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) ? play.quarter : play.quarter === 1 ? '1st' : play.quarter === 2 ? '2nd' : play.quarter === 3 ? '3rd' : play.quarter + 'th'}
                </div>
                {
                  !['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) &&
                  <div>
                    {(play.time/100).toFixed(3).toString().slice(-1) === '0' ? (play.time/100).toFixed(2).toString().replace('.',':') : (play.time/100).toFixed(2).toString().replace('.',':') + '.' + (play.time/100).toFixed(3).toString().slice(-1)}
                  </div>
                }
              </div>
              <div style={{textAlign:'left'}}>
                {play.lastPlay}
              </div>
            </div>
          );
        })
      }
      {
        show &&
        (game.highlights || []).map((play,playIndex)=> {
          let newQuarter = play.quarter;
          let isNewQuarter = quarter !== newQuarter;
          if (isNewQuarter) quarter = newQuarter;

          return (
            <div key={playIndex}>
              {
                isNewQuarter &&
                <div style={{display: 'flex', margin: '10px 0'}}>
                  <div style={{borderTop: '1px solid lightgray',width:'50%'}}/>
                  <div style={{fontFamily: 'monospace', position: 'relative', margin: '-7px 10px 0 10px'}}>
                    {['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) ? quarter : 
                    quarter === 1 ? '1st' : 
                    quarter === 2 ? '2nd' : 
                    quarter === 3 ? '3rd' : 
                    quarter + 'th'}
                  </div>
                  <div style={{borderTop: '1px solid lightgray',width:'50%'}}/>
                </div>
              }
              <div style={{margin:'4px 0', display: 'flex'}}>
                <div style={{minWidth:'40px',padding:'4px',backgroundColor:'#1e90ff', color:'#fff', marginRight:'4px'}}>
                  <div>
                    {['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) ? play.quarter : play.quarter === 1 ? '1st' : play.quarter === 2 ? '2nd' : play.quarter === 3 ? '3rd' : play.quarter + 'th'}
                  </div>
                  {
                    !['59723313734d1d6202a85f21'].includes(get(game,'leagueId')) &&
                    <div>
                      {(play.time/100).toFixed(3).toString().slice(-1) === '0' ? (play.time/100).toFixed(2).toString().replace('.',':') : (play.time/100).toFixed(2).toString().replace('.',':') + '.' + (play.time/100).toFixed(3).toString().slice(-1)}
                    </div>
                  }
                </div>
                <div style={{textAlign:'left'}}>
                  {play.lastPlay}
                </div>
              </div>
            </div>
          );
        })
      }
      {
        (game.highlights || []).length > 5 &&
        <div style={{color: 'rgba(0,0,0,0.87)', fontSize: '15px', margin:'4px 17%', 
        padding: '2px', border: '3px solid rgba(0,0,0,0.87)', borderRadius: '8px'}}
          onClick={handleChange}>{show ? "show less -" : "show more +"}
        </div>
      }
    </div>
  );
};

const TieButton = (props) => {
  const { classes, game, handleTie } = props;
  return (
    <div>
      <Button 
          size="small"
          className={classes.tieButton} onClick={() => handleTie(game._id)}>
          {['59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f17'].includes(get(game,'leagueId')) ? 'Draw' : 'Tie'}
      </Button>
    </div>
  );
};

const GameEditor = (props) => {
  const { classes, game, awayScore, homeScore, awayRank, homeRank, awayRecord, homeRecord, awaySpread, 
  homeSpread, gameName, isGameOver, currentTime, gameDate, gameTime, liveVideoUrl, highlightVideoUrl,
  handleInputChange, handleSaveGame, isHidden } = props;

  return (
    <div style={{padding:'16px',textAlign:'left'}}>
      <div>
        <Checkbox
          name="isGameOver"
          color="primary"
          checked={isGameOver}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleInputChange}
        />
        is game over
      </div>
      <div>
        <Checkbox
          name="isHidden"
          color="primary"
          checked={isHidden}
          inputProps={{ 'aria-label': 'secondary checkbox' }}
          onChange={handleInputChange}
        />
        is hidden
      </div>
      <div style={{display: 'flex'}}>
        <div>
          <TextField
            name="awayScore"
            id="outlined-number"
            label={game.competitors[0].shortLocation + " score"}
            type="number"
            defaultValue={awayScore}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{paddingLeft: '16px'}}>
          <TextField
            name="homeScore"
            id="outlined-number"
            label={game.competitors[1].shortLocation + " score"}
            type="number"
            defaultValue={homeScore}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div style={{display: 'flex', marginTop: '16px'}}>
        <div>
          <TextField
            name="awayRank"
            id="outlined-number"
            label={game.competitors[0].shortLocation + " rank"}
            type="number"
            defaultValue={awayRank}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{paddingLeft: '16px'}}>
          <TextField
            name="homeRank"
            id="outlined-number"
            label={game.competitors[1].shortLocation + " rank"}
            type="number"
            defaultValue={homeRank}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div style={{display: 'flex', marginTop: '16px'}}>
        <div>
          <TextField
            name="awayRecord"
            id="outlined-number"
            label={game.competitors[0].shortLocation + " record"}
            type="string"
            defaultValue={awayRecord}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{paddingLeft: '16px'}}>
          <TextField
            name="homeRecord"
            id="outlined-number"
            label={game.competitors[1].shortLocation + " record"}
            type="string"
            defaultValue={homeRecord}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div style={{display: 'flex', marginTop: '16px'}}>
        <div>
          <TextField
            name="awaySpread"
            id="outlined-number"
            label={game.competitors[0].shortLocation + " spread"}
            type="number"
            defaultValue={awaySpread}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{paddingLeft: '16px'}}>
          <TextField
            name="homeSpread"
            id="outlined-number"
            label={game.competitors[1].shortLocation + " spread"}
            type="number"
            defaultValue={homeSpread}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div style={{marginTop: '16px'}}>
        <TextField
          name="currentTime"
          id="outlined-number"
          label="Game Clock"
          defaultValue={currentTime}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
          variant="outlined"
        />
      </div>
      <div style={{display: 'flex', marginTop: '16px'}}>
        <div>
          <TextField
            name="gameDate"
            id="outlined-number"
            label="Game Date"
            type="date"
            defaultValue={gameDate}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
        <div style={{paddingLeft: '16px'}}>
          <TextField
            name="gameTime"
            id="outlined-number"
            label="Game Time"
            type="time"
            defaultValue={gameTime}
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleInputChange}
            variant="outlined"
          />
        </div>
      </div>
      <div style={{marginTop: '16px'}}>
        <TextField
          name="gameName"
          id="outlined-number"
          label="Game Name"
          defaultValue={gameName}
          fullWidth
          multiline={true}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
          variant="outlined"
        />
      </div>
      <div style={{marginTop: '16px'}}>
        <TextField
          name="liveVideoUrl"
          id="outlined-number"
          label="Live Video Url"
          defaultValue={liveVideoUrl}
          fullWidth
          multiline={true}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
          variant="outlined"
        />
      </div>
      <div style={{marginTop: '16px'}}>
        <TextField
          name="highlightVideoUrl"
          id="outlined-number"
          label="Highlight Video Url"
          defaultValue={highlightVideoUrl}
          fullWidth
          multiline={true}
          InputLabelProps={{
            shrink: true,
          }}
          onChange={handleInputChange}
          variant="outlined"
        />
      </div>
      <div style={{marginTop: '10px'}}>
        <Button 
            size="small"
            className={classes.saveButton} onClick={() => handleSaveGame(game._id)}>
            Save
        </Button>
      </div>
    </div>
  );
};

const GameContainer = (props) => {
  const { classes, game, isAuthenticated, disableTie, 
    inProgress, spreadMode, handleMakePick } = props;

  return (
    <div id={"game-" + game._id} key={game._id} className={classes.game}>
        <div style={{zIndex: 3, position: 'relative', backgroundColor: '#fff', paddingBottom: '20px'}}>
          <Grid key={game._id + "-gridlist"} container className={classes.root}>
              {
                game.competitors.map((competitor) => (
                  <Grid
                      key={game._id + "." + competitor._id}
                      item xs={6}
                      onClick={() => handleMakePick(game._id, competitor._id)}
                      className={inProgress ? 'fast-flash' : ''} 
                      style={{
                        border: competitor.selected ? '15px solid #3772FA' : '12px dashed #E7E7E7',
                        padding: '10px',
                        cursor: 'pointer'
                      }}
                  >
                      <Grow in={true} timeout={500}>
                          <Paper className={classNames(classes.paper)}>
                              {
                                spreadMode &&
                                <CompetitorHeader {...{...props, competitor}} />
                              }
                              <Competitor {...{...props, competitor}} />
                          </Paper>
                      </Grow>
                  </Grid>
              ))}                            
          </Grid>
          {
            isAuthenticated &&
            !hasGameStarted(game.startDateTime) &&
            ['59723313734d1d6202a85f10','59723313734d1d6202a85f17','59723313734d1d6202a85f25','59723313734d1d6202a85f27','59723313734d1d6202a85f29'].includes(get(game,'leagueId')) && 
            !spreadMode &&
            !disableTie &&
            <TieButton {...props} />
          }
          <div>
            {
              ['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(get(game,'leagueId')) && 
              <MiniRallyGame {...{game, classes}} />
            }
            {
              !['59723313734d1d6202a85f10','59723313734d1d6202a85f15'].includes(get(game,'leagueId')) && 
              <Field {...{
                  leagueId: get(game,'leagueId'),
                  away: game.competitors[0].shortLocation, 
                  awayColor: game.competitors[0].color, 
                  home: game.competitors[1].shortLocation, 
                  homeColor: game.competitors[1].color,
                  style: {paddingTop: '16px'}
                }
              }/>
            }
          </div>
          <GameFooter {...props} />
        </div>
        <GamePlayTabs {...props} />
    </div>
  );
}

class Game extends Component {
    constructor(props) {
        super(props);
        this.state = {
            awayScore: null,
            homeScore: null,
            awayRank: null,
            homeRank: null,
            awayRecord: null,
            homeRecord: null,
            awaySpread: null,
            homeSpread: null,
            gameName: null,
            isGameOver: null,
            currentTime: null,
            gameTime: null,
            gameDate: null,
            liveVideoUrl: null,
            highlightVideoUrl: null,
            isHidden: null
        };
    }

    handleMakePick = (gameId, pickId) => {
        if (get(this.props,'pick.pickId') === pickId || 
          get(this.props,'pick.inProgress',false) || 
          hasGameStarted(this.props.game.startDateTime)) {
            return;
        }

        const pick = {
            gameId: gameId,
            pickId: pickId
        };

        this.props.handleMakePick(pick);
    }

    handleTie = (gameId) => {
        if (get(this.props,'pick.pickId') === '000000000000000000000000' || 
          get(this.props,'pick.inProgress',false) || 
          hasGameStarted(this.props.game.startDateTime)) {
            return;
        }

        const pick = {
            gameId: gameId,
            pickId: '000000000000000000000000'
        };

        this.props.handleMakePick(pick);
    }

    handleClearInput = () => {
      this.setState({
        awayScore: null,
        homeScore: null,
        awayRank: null,
        homeRank: null,
        awayRecord: null,
        homeRecord: null,
        awaySpread: null,
        homeSpread: null,
        gameName: null,
        isGameOver: null,
        currentTime: null,
        gameTime: null,
        gameDate: null,
        liveVideoUrl: null,
        highlightVideoUrl: null,
        isHidden: null
      });
    }

    handleInputChange = (event) => {
      const target = event.target;
      const value = target.type === 'checkbox' ? target.checked : target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }

    handleSaveGame = (gameId) => {
        if (get(this.props,'userId') !== 'google-oauth2|114172296334563495985') {
            return;
        }

        const {awayScore, homeScore, awayRank, homeRank, awayRecord, homeRecord, awaySpread, isHidden, 
          homeSpread, gameName, isGameOver, currentTime, gameDate, gameTime, liveVideoUrl, highlightVideoUrl} = this.state;

        const gameTimeFormatted = gameTime ? (gameDate || moment().format("YYYY-MM-DD")) + " " + gameTime : null;

        const game = {
            id: gameId,
            awayScore,
            homeScore,
            awayRank,
            homeRank,
            awayRecord,
            homeRecord,
            awaySpread,
            homeSpread,
            gameName,
            isGameOver,
            currentTime,
            gameTime: gameTimeFormatted,
            liveVideoUrl,
            highlightVideoUrl,
            isHidden
        };

        this.props.handleUpdateGame(game);
    }

    handleUpdateGamePlayTab = (newValue) => {
        this.props.handleUpdateGamePlayTab(newValue);
    }

    render() {
        const { classes, game, pick, isAuthenticated, userId, disableTie } = this.props;

        const { awayScore, homeScore, awayRank, homeRank, awayRecord, homeRecord, awaySpread, isHidden, 
          homeSpread, gameName, isGameOver, currentTime, gameDate, gameTime, liveVideoUrl, highlightVideoUrl } = this.state;

        const inProgress = get(pick,'inProgress',false);

        const spreadMode = localStorage.getItem('tabValue') === '1' || localStorage.getItem('spreadModeToggle') === '1';

        const props = { classes, game, pick, isAuthenticated, userId, disableTie,
        awayScore, homeScore, awayRank, homeRank, awayRecord, homeRecord, awaySpread, isHidden, 
        homeSpread, gameName, isGameOver, currentTime, gameDate, gameTime, liveVideoUrl, highlightVideoUrl,
        inProgress, spreadMode, handleMakePick: this.handleMakePick, 
        handleTie: this.handleTie, handleClearInput: this.handleClearInput, 
        handleInputChange: this.handleInputChange, 
        handleSaveGame: this.handleSaveGame, handleUpdateGamePlayTab: this.handleUpdateGamePlayTab };

        return (
          <GameContainer {...props} />
        );
    }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  isAuthenticated: PropTypes.bool.isRequired,
  spreadMode: PropTypes.bool,
  disableTie: PropTypes.bool,
  handleMakePick: PropTypes.func,
  handleUpdateGame: PropTypes.func,
  handleUpdateGamePlayTab: PropTypes.func
};

export default withStyles(styles, { withTheme: true })(Game);
