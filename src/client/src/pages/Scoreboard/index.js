import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactGA from 'react-ga';

import get from 'lodash/get';
import last from 'lodash/last';

import moment from 'moment-timezone';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined';
import ToggleOn from '@material-ui/icons/ToggleOn';
import ToggleOff from '@material-ui/icons/ToggleOff';
import Share from '@material-ui/icons/BackupOutlined';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import PageContainer from '../PageContainer';
import GameSearchBar from '../../components/GameSearchBar';
import PickResult from '../../components/PickResult';
import Game from '../../components/Game';
import Countdown from '../../components/Countdown';
import Popover from '../../components/Popover';

import {Howl, Howler} from 'howler';
import maddenM4a from './madden-touchdown.m4a';
import maddenWebm from './madden-touchdown.webm';

import tecmoM4a from './tecmo-touchdown.m4a';
import tecmoWebm from './tecmo-touchdown.webm';

import nbaJamsM4a from './nba-jams-boom-shakalaka.m4a';
import nbaJamsWebm from './nba-jams-boom-shakalaka.webm';

import { loadScoreboard, addPick, updatePick, updateGame, showGameDetailsToggle } from '../../actions';
import { googleLogin } from '../../middleware/authenticationClient';

import { 
    formatWeeks, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getGroupedGames,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
    getImage
} from '../../utilities';

import { 
    getPicksNotSelected,
    copy
} from './utilities';

import {createBrowserHistory} from 'history';
const history = createBrowserHistory({forceRefresh: false});

Howler.volume(1);

const madden = new Howl({
  src: [maddenM4a, maddenWebm],
  format: ['m4a', 'webm']
});

const tecmo = new Howl({
  src: [tecmoM4a, tecmoWebm],
  format: ['m4a', 'webm']
});

const nbaJams = new Howl({
  src: [nbaJamsM4a, nbaJamsWebm],
  format: ['m4a', 'webm']
});

const styles = theme => ({
  googleLogin: {
    width: '250px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  input: {
    display: 'none',
  },
  pickResultContainer: {
    margin: '0 15% 6px 15%',
    backgroundColor: 'white'
  },
  banner: {
    marginBottom: '10px'
  },
  bannerImage: {
    borderRadius: '8px'
  },
  button: {
    backgroundColor: '#3772FA',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    },
    borderRadius: 0,
    color: '#FFFFFF',
    fontSize: '1.5rem',
    fontWeight: "700",
    lineHeight: '2.75',
    marginBottom: '10px',
    padding: '0',
    width: '75%',
    '-webkit-box-shadow': '-8px 8px 0px 0px black',
    '-moz-box-shadow': '-8px 8px 0px 0px black',
    boxShadow: '-8px 8px 0px 0px black'
  },
  soundButton: {
    color: '#000'
  },
  toggleButtonOn: {
    color: 'blue'
  },
  toggleButtonOff: {
    color: 'gray'
  }
});

let gameDate;

const TabPanel = (props) => {
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
};

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

const a11yProps = (index) => {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
};

const Alert = (props) => {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
};

const Loader = ({dataLoading, weeksDataLoading}) => {
    return (
        <div style={{height: '8px'}}>
            {
                (dataLoading || weeksDataLoading) &&
                <LinearProgress />
            }
        </div>
    );
};

const ScoreboardOptions = ({classes, spreadMode, copyData, openCopyAlert, isAuthenticated}) => {
    return (
        <div style={{
            justifyContent: 'center',
            display:'flex', 
            fontSize: '17px', 
            paddingBottom: '20px',
            fontFamily: 'monospace'}}>
            <div style={{marginRight: '40px'}} onClick={()=>{}}>
                <div>
                    <IconButton className={spreadMode ? classes.toggleButtonOn : classes.toggleButtonOff} aria-label="spreadModeToggle">
                        {spreadMode ? <ToggleOn/> : <ToggleOff/>}
                    </IconButton>
                </div>
                <div style={{marginTop: '-3px'}}>
                    beat vegas
                </div>
            </div>
            {
                document.queryCommandSupported('copy') &&
                <div style={{marginRight: '40px'}}>
                    <div>
                        <IconButton className={classes.toggleButtonOn} aria-label="share picks" onClick={this.handleSharePicks}>
                            <Share/>
                        </IconButton>
                    </div>
                    <div style={{marginTop: '-3px'}}>
                        share
                    </div>
                    <textarea style={{position:'fixed',bottom:'-10em'}} type="text" onChange={()=>{}} value={copyData} id="copyInput" readOnly />
                    <Snackbar open={openCopyAlert} autoHideDuration={10000} onClose={this.handleCopyAlertClose}>
                        <Alert onClose={this.handleCopyAlertClose} severity="success">
                        {isAuthenticated ? 'Picks copied!' : 'Games copied!'}
                        </Alert>
                    </Snackbar>
                </div>
            }
        </div>
    );
};

const TinyScoreboard = ({title, games}) => {
    const styles = {
        header: {
            backgroundColor: 'black',
            color: 'white',
            width: '80px',
            padding: '10px',
            textAlign: 'right',
            lineHeight: '20px',
            fontWeight: 'bold',
            fontSize: '14px',
            '-webkit-box-shadow': '0px 8px 0px 0px dodgerblue',
            '-moz-box-shadow': '0px 8px 0px 0px dodgerblue',
            boxShadow: '0px 8px 0px 0px dodgerblue'
        },
        gameContainer: {
            display: 'flex',
            fontSize: '12px',
            padding: '5px 0 15px 10px',
            fontWeight: 'bold',
            backgroundColor: 'white',
            overflowX: 'scroll'
        }
    };

    if (games.length === 0) return null;

    return (
        <div style={{margin: '10px 0 20px 0'}}>
            <div style={{display: 'flex'}}>
                <div style={styles.header}>
                    {title}
                </div>
                <div style={styles.gameContainer}>
                {
                    games.map((game, index) => {
                        return (
                            <div style={{marginRight: '10px', borderRight: index+1 === games.length ? '' : '1px dashed gray'}}>
                                <div style={{display:'flex'}}>
                                    <div style={{marginRight:'5px', textAlign: 'left'}}>
                                        {
                                            (game.isGameOver || hasGameStarted(game.startDateTime)) && 
                                            <div style={{color: game.isGameOver ? '' : hasGameStarted(game.startDateTime) ? 'red' : ''}}>
                                                {game.isGameOver ? 'Final' : hasGameStarted(game.startDateTime) ? 'Live' : ''}
                                            </div>
                                        }
                                        <div>{game.competitors[0].shortLocation}</div>
                                        <div>{game.competitors[1].shortLocation}</div>
                                        <div style={{width:'35px'}}>
                                            {Intl.DateTimeFormat(navigator.language, { weekday: 'short' }).format(new Date(game.startDateTime))}
                                        </div>
                                    </div>
                                    <div style={{marginRight:'5px', textAlign: 'left'}}>
                                        {
                                            (game.isGameOver || hasGameStarted(game.startDateTime)) && 
                                            <div style={{height:'14px'}}>
                                                {game.isGameOver ? '' : hasGameStarted(game.startDateTime) ? get(game,'playHistory[0].time') : ''}
                                            </div>
                                        }
                                        <div style={{height:'14px'}}>{get(game, 'spread.teamId') === game.competitors[0]._id ? get(game, 'spread.amount') : ''}</div>
                                        <div style={{height:'14px'}}>{get(game, 'spread.teamId') === game.competitors[1]._id ? get(game, 'spread.amount') : ''}</div>
                                        <div style={{width:'35px'}}>
                                            {Intl.DateTimeFormat(navigator.language, { day: 'numeric', month: 'numeric' }).format(new Date(game.startDateTime))}
                                        </div>
                                    </div>
                                    <div style={{marginRight:'10px', textAlign: 'right'}}>
                                        {
                                            (game.isGameOver || hasGameStarted(game.startDateTime)) && 
                                            <div style={{height:'14px'}}>
                                                {game.isGameOver ? '' : hasGameStarted(game.startDateTime) ? get(game,'playHistory[0].quarter') : ''}
                                            </div>
                                        }
                                        <div style={{height:'14px', color: game.competitors[0].score >= game.competitors[1].score ? 'darkgoldenrod' : ''}}>{
                                            game.competitors[0].score}
                                        </div>
                                        <div style={{height:'14px', color: game.competitors[1].score >= game.competitors[0].score ? 'darkgoldenrod' : ''}}>{
                                            game.competitors[1].score}
                                        </div>
                                        <div style={{width:'35px'}}>
                                            {Intl.DateTimeFormat(navigator.language, { hour: 'numeric', hour12: true }).format(new Date(game.startDateTime))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
                </div>
            </div>
        </div>
    );
};

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soundOn: false,
            openCopyAlert: false,
            gamePlayTabValue: 0,
            tabValue: localStorage.getItem('tabValue') === '1' ? 1 : 0
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        ReactGA.ga('send', 'pageview', '/scoreboards/' + urlLeague.name);
        
        this.props.loadScoreboard({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            gameType: this.state.tabValue
        });

        this.startPolling(this.state.tabValue);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        console.log('stop timerID: ' + this.timerID);
    }

    handleTabChange = (event, newValue) => {
        clearInterval(this.timerID);
        console.log('stop timerID: ' + this.timerID);

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);
        
        this.props.loadScoreboard({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            gameType: newValue
        });

        localStorage.setItem('tabValue', newValue);
        this.setState({tabValue: newValue});
        this.startPolling(newValue);
    };

    startPolling = (tabValue) => {
        this.timerID = setInterval(
            () => this.poll(tabValue),
            2000
        );
        console.log('start timerID: ' + this.timerID);
    }

    poll = (tabValue) => {
        console.log('running timerID: ' + this.timerID + ' ' + (new Date()).toLocaleTimeString());

        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        const minutes = parseInt(moment().format('mm'));
        const minuteInterval = (minutes > 15 ? 15 - (minutes % 15) : minutes);
        console.log('minuteInterval: ' + minuteInterval);
        
        if (!areAnyGamesInProgress && minuteInterval !== 10) return;

        if (this.props.weeks.findIndex(x=>x._id === this.props.weekId)+1 < this.props.weeks.length) return;

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime,
            weekId: this.props.weekId,
            gameType: tabValue
        });
    }

    handleFilterLeague = (event, league) => {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const leagueFound = this.props.leagues.find(x=>x.id===league.props.value);
        const years = get(leagueFound,'years',[]);
        const year = last(years);

        ReactGA.ga('send', 'pageview', '/scoreboards/' + leagueFound.name);

        history.push('/scoreboards/' + leagueFound.name);

        this.props.loadScoreboard({
            leagueId: leagueFound.id,
            year
        });
    }

    handleFilterYear = (event, year) => {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const yearFound = this.props.years.find(x=>x===parseInt(year.props.value));

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: yearFound
        });
    }
  
    handleFilterWeek = (event, week) => {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const weekFound = this.props.weeks[week.props.value];

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime,
            weekId: weekFound._id
        });
    }

    handleMakePick = (pick) => {
        const gameFound = this.props.games.find(x=>x._id === pick.gameId);

        if (!this.props.isAuthenticated || gameFound.isGameOver) return;

        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (!!pickFound) {
            this.props.updatePick(get(pickFound,'_id'), {...pick, gameType: this.state.tabValue});
        } else {
            this.props.addPick({...pick, gameType: this.state.tabValue});
        }
    }

    handleUpdateGame = (game) => {
        if (!this.props.isAuthenticated) return;

        this.props.updateGame(game);
    }

    handleToggleSound = () => {
        if (['59723313734d1d6202a85f10'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { tecmo.play(); } else { tecmo.stop(); };
        }

        if (['59723313734d1d6202a85f15'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { madden.play(); } else { madden.stop(); };
        }

        if (['59723313734d1d6202a85f19', '59723313734d1d6202a85f31', '59723313734d1d6202a85f33', '59723313734d1d6202a85f35', '59723313734d1d6202a85f37'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { nbaJams.play(); } else { nbaJams.stop(); };
        }

        this.setState((state) => ({
            soundOn: !state.soundOn
        }));
    }

    handleSharePicks = () => {
        const copyText = document.getElementById("copyInput");

        copyText.select();
        
        /* for mobile devices */
        copyText.setSelectionRange(0, 99999);

        document.execCommand("copy");
        
        this.setState((state) => ({
            openCopyAlert: true
        }));
    }

    handleCopyAlertClose = (event, reason) => {
        if (reason === 'clickaway') {
          return;
        }

        this.setState((state) => ({
            openCopyAlert: false
        }));
    };

    handleUpdateGamePlayTab = (gamePlayTabValue) => {
        if (gamePlayTabValue === 2) {
            clearInterval(this.timerID);
            console.log('stop timerID: ' + this.timerID);
        } else {
            this.startPolling(this.state.tabValue);
        }
    };

    render() {
        const { 
            classes, 
            games, 
            picks, 
            teams,
            leagues,
            years,
            weeks = [],
            isAuthenticated, 
            dataLoading, 
            weeksDataLoading,
            spreadMode,
            userId,
            weekId,
            leagueId,
            year,
            beginDateTime,
            endDateTime
        } = this.props;

        const {soundOn, openCopyAlert} = this.state;

        const currentWeek = weeks.find(x=>x._id === weekId);
        const areAnyGamesOver = games.some(x=>x.isGameOver);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const groupedGames = getGroupedGames(games, picks, teams, spreadMode);
        const gamesNotStarted = games.filter(x=>!hasGameStarted(x.startDateTime));
        const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
        const picksNotSelected = getPicksNotSelected(gamesNotStarted, picks);

        gameDate = null;

        const image = getImage(leagueId);

        const copyData = copy(games,picks,teams);

        const disableTie = get(currentWeek,'disableTie') || false;

        return (
            <div>
                <PageContainer>
                    <TinyScoreboard {...{
                            title: `Get Ready`,
                            games: groupedGames.notCompleted
                        }
                    }/>
                    <TinyScoreboard {...{
                            title: `Party Done`,
                            games: groupedGames.completed
                        }
                    }/>
                    {
                        <GameSearchBar 
                            leagueId={leagueId}
                            leagues={leagues}
                            year={year}
                            years={years}
                            weekId={weekId}
                            weeks={weeks}
                            beginDateTime={beginDateTime}
                            endDateTime={endDateTime}
                            onFilterLeague={this.handleFilterLeague}
                            onFilterYear={this.handleFilterYear}
                            onFilterWeek={this.handleFilterWeek}
                            onFilterDate={this.handleFilterDate}
                        />
                    }
                    {
                        <Loader {...{dataLoading, weeksDataLoading}} />
                    }
                    {
                        !isAuthenticated && 
                        <Button
                            variant="contained" 
                            className={classNames(classes.button)}
                            onClick={() => googleLogin()}>
                          Play For Free
                        </Button>
                    }
                    {
                        isAuthenticated && 
                        picks.length > 0 &&
                        areAnyGamesOver && 
                        <div className={classNames(classes.pickResultContainer)}>
                            <PickResult spreadMode={spreadMode} games={games} picks={picks}/>
                        </div>
                    }
                    {
                        !areAllGamesOver &&
                        !areAnyGamesInProgress &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid deeppink'}}>
                            <div style={{color: 'deeppink', fontSize: '17px'}}>next {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fight' : 'game'} starts in</div>
                            <Countdown date={timeUntilNextGameStarts}/>
                        </div>
                    }
                    {
                        areAnyGamesInProgress &&
                        <div style={{color: 'deeppink', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid deeppink'}}>
                            <div className='fast-flash'>** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fights' : 'games'} in progress **</div>
                        </div>
                    }
                    {
                        false &&
                        !get(currentWeek,'prize') &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid lightgreen', borderRadius: '8px', cursor: 'pointer'}}>
                            <div style={{color: 'darkgreen', fontSize: '17px'}}>player with the most correct wins bragging rights!</div>
                        </div>
                    }
                    {
                        get(currentWeek,'prize') &&
                        <Popover 
                            borderStyle={{margin: '4px 14%', border: '4px solid lightgreen', borderRadius: '8px', cursor: 'pointer'}}
                            titleStyle={{color: 'darkgreen', fontSize: '17px', borderBottom:'3px solid lightgreen', padding: '4px'}}
                            subTitleStyle={{color: 'darkgreen', fontSize: '17px', borderTop:'3px solid lightgreen', padding: '4px'}}
                            title={'player with the most correct wins!'}
                            subTitle={'tap to view rules.'}
                            segments={get(currentWeek,'prizes')}
                        >
                            {
                                <div style={{padding:'16px'}}>
                                    <div style={{paddingBottom: '12px'}}>{get(currentWeek,'prize.message')}</div>
                                    {get(currentWeek,'prize.rules',[]).map((rule,ruleIndex)=>{
                                        return (
                                            <div key={ruleIndex}>{rule}</div>
                                        );
                                    })}
                                </div>
                            }
                        </Popover>
                    }
                    {
                        !isAuthenticated &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** sign in then tap {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fighter' : 'team'} **
                        </div>
                    }
                    {
                        isAuthenticated && 
                        picksNotSelected > 0 &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 20%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            <div>tap {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fighter' : 'team'} below</div>
                            <div className='fast-flash'><b>{picksNotSelected}</b> remaining</div>
                        </div>
                    }
                    {
                        false &&
                        isAuthenticated &&
                        areAllGamesOver &&
                        !(dataLoading || weeksDataLoading) &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 10%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'tap fighter before match starts' : 'tap team before game starts'} **
                        </div>
                    }
                    {
                        false &&
                        <div style={{color: '#1e90ff', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid #1e90ff'}}>
                            ** invite your friends.  it's fun beating them.  :D **
                        </div>
                    }
                    {
                        false &&
                        ['59723313734d1d6202a85f10','59723313734d1d6202a85f15','59723313734d1d6202a85f19', '59723313734d1d6202a85f31', '59723313734d1d6202a85f33', '59723313734d1d6202a85f35', '59723313734d1d6202a85f37'].includes(leagueId) &&
                        <div style={{
                                justifyContent: 'center',
                                display:'flex', 
                                fontSize: '17px', 
                                fontFamily: 'monospace', 
                                fontWeight: 'bold'}}>
                            <div style={{margin:'auto 0'}}>retro arcade sound</div>
                            <IconButton className={classes.soundButton} aria-label="sound" onClick={this.handleToggleSound}>
                                {soundOn ? <VolumeUpOutlinedIcon/> : <VolumeOffOutlinedIcon/>}
                            </IconButton>
                        </div>
                    }
                    {
                        false &&
                        <ScoreboardOptions {...{classes, spreadMode, copyData, openCopyAlert, isAuthenticated}} />
                    }
                    {
                        <Box sx={{
                            marginTop: '30px',
                            position: "relative",
                            zIndex: "2",
                            backgroundColor: "white"
                            }}>
                            <Box sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider', 
                                position: "relative",
                                zIndex: "3",
                                backgroundColor: "white"
                            }}>
                                <Tabs value={this.state.tabValue} onChange={this.handleTabChange}  aria-label="game types" style={{
                                    paddingBottom: "20px",
                                    width: 'fit-content', 
                                    margin: 'auto',
                                }}>
                                    <Tab label="Straight Up" {...a11yProps(0)} />
                                    <Tab label="Beat Vegas Mode" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <div className={classes.root}>
                                {
                                    groupedGames.notCompleted.map(game => {
                                        let newGameDate = moment(get(game,'startDateTime')).format('dddd MMM D YYYY');
                                        let newDate = (gameDate !== newGameDate);
                                        if (newDate) gameDate = newGameDate;

                                        return (
                                            <div key={game._id}>
                                                {
                                                    newDate &&
                                                    <div style={{
                                                        position: 'relative', 
                                                        zIndex: 3, 
                                                        fontFamily:'monospace', 
                                                        backgroundColor:'rgba(0,0,0,0.87)', 
                                                        color: '#ffffff', width: '100%', 
                                                        padding: '2px 0', 
                                                        marginBottom:'8px'
                                                    }}>
                                                        <div style={{margin:'16px 0',fontSize:'14px',fontWeight:'600'}}>{gameDate}</div>
                                                    </div>
                                                }
                                                <Game 
                                                    game={game} 
                                                    pick={picks.find(x=>x.gameId === game._id)}
                                                    handleMakePick={this.handleMakePick} 
                                                    handleUpdateGame={this.handleUpdateGame} 
                                                    handleUpdateGamePlayTab={this.handleUpdateGamePlayTab}
                                                    isAuthenticated={isAuthenticated}
                                                    userId={userId}
                                                    spreadMode={spreadMode}
                                                    disableTie={disableTie}
                                                />
                                            </div>
                                        );
                                    })
                                }
                                <div>
                                    {
                                        groupedGames.completed.length > 0 &&
                                        <div style={{position: 'relative', zIndex: 10, fontFamily:'monospace', backgroundColor:'rgba(0,0,0,0.87)', color: '#ffffff', width: '100%', padding: '2px 0', marginBottom:'8px'}}>
                                            <div style={{margin:'16px 0',fontSize:'14px', fontWeight:'600'}}>*** Completed Matches ***</div>
                                        </div>
                                    }
                                    {
                                        groupedGames.completed.map(game => {
                                            let newGameDate = moment(get(game,'startDateTime')).format('dddd MMM D YYYY');
                                            let newDate = (gameDate !== newGameDate);
                                            if (newDate) gameDate = newGameDate;

                                            return (
                                                <div key={game._id}>
                                                    {
                                                        newDate &&
                                                        <div style={{position: 'relative', zIndex: 10, fontFamily:'monospace', backgroundColor:'rgba(0,0,0,0.87)', color: '#ffffff', width: '100%', padding: '2px 0', marginBottom:'8px'}}>
                                                            <div style={{margin:'16px 0',fontSize:'14px',fontWeight:'600'}}>{gameDate}</div>
                                                        </div>
                                                    }
                                                    <Game 
                                                        game={game} 
                                                        pick={picks.find(x=>x.gameId === game._id)}
                                                        handleMakePick={this.handleMakePick} 
                                                        handleUpdateGame={this.handleUpdateGame} 
                                                        handleUpdateGamePlayTab={this.handleUpdateGamePlayTab}
                                                        isAuthenticated={isAuthenticated}
                                                        userId={userId}
                                                        disableTie={disableTie}
                                                    />
                                                </div>
                                            );
                                        })
                                    }
                                </div>
                            </div>
                        </Box>
                    }
                    {
                        false &&
                        image &&
                        !(dataLoading || weeksDataLoading) &&
                        <div>
                            <img style={{width:'90%'}} src={image.picture} alt=""/>
                            <div style={{
                                color: 'gray',
                                fontSize: '10px'
                            }}>Image via {image.source}</div>
                        </div>
                    }
                </PageContainer>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const lookup = state.get('lookup').toJS();

    const scoreboardDomain = state.get('scoreboardDomain').toJS();
    const dataLoading = get(scoreboardDomain, 'dataLoading');
    const games = get(scoreboardDomain, 'games', []);
    const picks = get(scoreboardDomain, 'picks', []);
    const leagueId = get(scoreboardDomain, 'leagueId');

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');
    const spreadMode = localStorage.getItem('tabValue') === '1';

    const leagues = get(lookup, 'leagues', []);
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const beginDateTime = get(request, 'beginDateTime') || get(currentWeek, 'beginDateTime');
    const endDateTime = get(request, 'endDateTime') || get(currentWeek, 'endDateTime');
    
    const teamDomain = state.get('teamDomain').toJS();
    const teams = get(teamDomain, 'teams', []);

    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    const weekId = get(request,'weekId') || get(currentWeek,'_id');

    const userJson = localStorage.getItem('user');
    const user = JSON.parse(userJson);
    const userId = get(user, 'sub');
    
    return {
        dataLoading,
        weeksDataLoading,
        games,
        picks,
        weeks,
        leagues,
        years,
        leagueId,
        year,
        weekId,
        beginDateTime,
        endDateTime,
        teams,
        userId,
        isAuthenticated,
        spreadMode
    }
};

Scoreboard.propTypes = {
    classes: PropTypes.object.isRequired,
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    games: PropTypes.array,
    picks: PropTypes.array,
    weeks: PropTypes.array,
    leagues: PropTypes.array,
    years: PropTypes.array,
    teams: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    week: PropTypes.number,
    weekId: PropTypes.string,
    beginDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    userId: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    loadScoreboard: PropTypes.func.isRequired,
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired,
    updateGame: PropTypes.func.isRequired,
    showGameDetailsToggle: PropTypes.func.isRequired,
    spreadMode: PropTypes.bool
};

export default connect(mapStateToProps, {
  loadScoreboard,
  addPick,
  updatePick,
  updateGame,
  showGameDetailsToggle,
})(withStyles(styles, { withTheme: true })(Scoreboard));
