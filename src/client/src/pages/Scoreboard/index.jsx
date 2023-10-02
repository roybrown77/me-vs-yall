import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactGA from 'react-ga';

import get from 'lodash/get';
import last from 'lodash/last';

import moment from 'moment-timezone';

import {createBrowserHistory} from 'history';

import Skeleton from '@material-ui/lab/Skeleton';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import ToggleOn from '@material-ui/icons/ToggleOn';
import ToggleOff from '@material-ui/icons/ToggleOff';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import RemainingGamesNotifier from './RemainingGamesNotifier';

import PageContainer from '../../components/PageContainer';
import GameSearchBar from '../../components/GameSearchBar';
import PickResult from '../../components/PickResult';
import Game from '../../components/Game';
import Countdown from '../../components/Countdown';
import Popover from '../../components/Popover';
import TinyScoreboard from '../../components/TinyScoreboard';

import { loadScoreboard, addPick, updatePick, updateGame, showGameDetailsToggle } from '../../actions';

import { 
    googleLogin, 
    isConfirmedAuthentication,
    getUser 
} from '../../middleware/authenticationClient';

import { 
    formatWeeks, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getGroupedGames,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
} from '../../utilities';

import { getPicksNotSelected } from './utilities';

import a11yProps from "../../utilities/a11yProps";

import styles from './styles';

const history = createBrowserHistory({forceRefresh: false});

let gameDate;

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            openCopyAlert: false,
            gamePlayTabValue: 0,
            tabValue: localStorage.getItem('tabValue') === '1' ? 1 : 0,
            spreadModeToggle: localStorage.getItem('spreadModeToggle', '0') === '1' ? '1' : '0',
            isAuthenticated: isConfirmedAuthentication()
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
            gameType: this.state.tabValue,
            loading: true
        });

        this.startPolling(this.state.tabValue);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        // console.log('stop timerID: ' + this.timerID);
    }

    handleTabChange = (event, newValue) => {
        clearInterval(this.timerID);
        // console.log('stop timerID: ' + this.timerID);

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);
        
        if (this.state.isAuthenticated) {
            this.props.loadScoreboard({
                leagueId: urlLeagueId,
                year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
                beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
                endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
                weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
                gameType: newValue,
                loading: true
            });
        }

        localStorage.setItem('tabValue', newValue);
        this.setState({tabValue: newValue});
        this.startPolling(newValue);
    };

    startPolling = (tabValue) => {
        this.timerID = setInterval(
            () => this.poll(tabValue),
            15000
        );
        // console.log('start timerID: ' + this.timerID);
    }

    poll = (tabValue) => {
        // console.log('running timerID: ' + this.timerID + ' ' + (new Date()).toLocaleTimeString());

        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        // why only run every 10 minutes?
        // const minutes = parseInt(moment().format('mm'));
        // const minuteInterval = (minutes > 15 ? 15 - (minutes % 15) : minutes);
        
        if (!areAnyGamesInProgress) return;

        if (this.props.weeks.findIndex(x=>x._id === this.props.weekId)+1 < this.props.weeks.length) return;

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime,
            weekId: this.props.weekId,
            gameType: tabValue,
            loading: false
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
            year,
            loading: true
        });
    }

    handleFilterYear = (event, year) => {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const yearFound = this.props.years.find(x=>x===parseInt(year.props.value));

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: yearFound,
            loading: true
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
            weekId: weekFound._id,
            loading: true
        });
    }

    handleMakePick = (pick) => {
        const gameFound = this.props.games.find(x=>x._id === pick.gameId);

        if (!this.state.isAuthenticated || gameFound.isGameOver) return;

        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (!!pickFound) {
            this.props.updatePick(get(pickFound,'_id'), {...pick, gameType: this.state.tabValue});
        } else {
            this.props.addPick({...pick, gameType: this.state.tabValue});
        }
    }

    handleUpdateGame = (game) => {
        if (!this.state.isAuthenticated) return;

        this.props.updateGame(game);
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
            // console.log('stop timerID: ' + this.timerID);
        }
    };

    handleSpreadToggle = () => {
        clearInterval(this.timerID);
        
        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);
        
        const isSpreadMode = localStorage.getItem('tabValue') === '1';

        this.props.loadScoreboard({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            gameType: isSpreadMode ? "1" : "0",
            loading: true
        });

        localStorage.setItem('spreadModeToggle', this.state.spreadModeToggle === '0' ? '1' : '0');
        this.setState((state) => ({
            spreadModeToggle: state.spreadModeToggle === '0' ? '1' : '0'
        }));
        this.startPolling(this.state.spreadModeToggle === '0' ? '1' : '0');
    }

    render() {
        const { 
            classes, 
            games, 
            picks, 
            teams,
            leagues,
            weeks = [],
            dataLoading,
            spreadMode,
            userId,
            weekId,
            leagueId,
            year,
            beginDateTime,
            endDateTime
        } = this.props;

        const {
            isAuthenticated
        } = this.state;

        const currentWeek = weeks.find(x=>x._id === weekId);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const groupedGames = getGroupedGames(games, picks, teams, spreadMode);
        const gamesNotStarted = games.filter(x=>!hasGameStarted(x.startDateTime));
        const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
        const picksNotSelected = getPicksNotSelected(gamesNotStarted, picks);

        gameDate = null;

        const disableTie = get(currentWeek,'disableTie') || false;

        return (
            <div>
                <PageContainer>
                    <TinyScoreboard {...{
                            title: `Let's Go!!!`,
                            games: groupedGames.notCompleted,
                            loading: dataLoading && !areAnyGamesInProgress
                        }
                    }/>
                    <TinyScoreboard {...{
                            title: `Game Over`,
                            games: groupedGames.completed,
                            loading: dataLoading && !areAnyGamesInProgress
                        }
                    }/>
                    <GameSearchBar
                        leagueId={leagueId}
                        leagues={leagues}
                        yearSelected={year}
                        weekId={weekId}
                        weeks={weeks}
                        beginDateTime={beginDateTime}
                        endDateTime={endDateTime}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}
                        onFilterDate={this.handleFilterDate}
                    />
                    {
                        !isAuthenticated && 
                        <Button
                            variant="contained" 
                            className={classNames(classes.button)}
                            onClick={googleLogin}>
                          Make Your Picks
                        </Button>
                    }
                    {
                        isAuthenticated && 
                        <div className={classNames(classes.pickResultContainer)}>
                            <PickResult loading={dataLoading && !areAnyGamesInProgress} spreadMode={spreadMode} games={groupedGames.completed} picks={picks}/>
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
                    <RemainingGamesNotifier {...{isAuthenticated, picksNotSelected}} />
                    <div onClick={this.handleSpreadToggle} style={{marginTop:'25px', padding: '10px', marginLeft: 'auto', textAlign:'right',backgroundColor:'#fff', width: '40px'}}>
                        <div style={{fontSize:'9px'}}>
                            vs Spread
                        </div>
                        <div><IconButton className={this.state.spreadModeToggle === '1' ? classes.toggleButtonOn : classes.toggleButtonOff} aria-label="spreadModeToggle">
                            {this.state.spreadModeToggle === '1' ? <ToggleOn/> : <ToggleOff/>}
                        </IconButton></div>
                    </div>
                    {
                        <Box sx={{
                            position: "relative",
                            zIndex: "2",
                            backgroundColor: "#EFFBF8"
                            }}>
                            <Box sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider', 
                                position: "relative",
                                zIndex: "3",
                                backgroundColor: "#fff"
                            }}>
                                <Tabs value={this.state.tabValue} onChange={this.handleTabChange}  aria-label="game types" style={{
                                    paddingBottom: "20px",
                                    width: 'fit-content', 
                                    margin: 'auto',
                                }}>
                                    <Tab label="Scores" {...a11yProps(0)} />
                                </Tabs>
                            </Box>
                            <div className={classes.root}>
                                {
                                    !areAnyGamesInProgress &&
                                    dataLoading &&
                                    <div style={{margin: '10px 0'}}>
                                        <Skeleton animation="pulse" height='5em' variant="rect"/>
                                        <div style={{display: 'flex'}}>
                                            <Skeleton style={{margin: '20px'}} animation="pulse" height='10em' width='50%' variant="rect"/>
                                            <Skeleton style={{margin: '20px'}} animation="pulse" height='10em' width='50%' variant="rect"/>
                                        </div>
                                    </div>
                                }
                                {
                                    !(!areAnyGamesInProgress &&
                                    dataLoading) &&
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
                                                    disableTie={disableTie}
                                                />
                                            </div>
                                        );
                                    })
                                }
                                {
                                    !(!areAnyGamesInProgress &&
                                    dataLoading) &&
                                    <div>
                                        {
                                            groupedGames.completed.length > 0 &&
                                            <div style={{position: 'relative', zIndex: 10, fontFamily:'monospace', backgroundColor:'rgba(0,0,0,0.87)', color: '#ffffff', width: '100%', padding: '2px 0', marginBottom:'8px'}}>
                                                <div style={{margin:'16px 0',fontSize:'14px', fontWeight:'600'}}>*** Game Over ***</div>
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
                                }
                            </div>
                        </Box>
                    }
                </PageContainer>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const lookup = state.get('lookup').toJS();

    const scoreboardDomain = state.get('scoreboardDomain').toJS();
    const dataLoading = get(scoreboardDomain, 'dataLoading', true);
    const games = get(scoreboardDomain, 'games', []);
    const picks = get(scoreboardDomain, 'picks', []);
    const leagueId = get(scoreboardDomain, 'leagueId');

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');
    const spreadMode = localStorage.getItem('tabValue') === '1' || localStorage.getItem('spreadModeToggle') === '1';

    const leagues = get(lookup, 'leagues', []);
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const beginDateTime = get(request, 'beginDateTime') || get(currentWeek, 'beginDateTime');
    const endDateTime = get(request, 'endDateTime') || get(currentWeek, 'endDateTime');
    
    const teamDomain = state.get('teamDomain').toJS();
    const teams = get(teamDomain, 'teams', []);

    const weekId = get(request,'weekId') || get(currentWeek,'_id');

    const user =  getUser();
    const userId = get(user, 'sub');
    
    return {
        dataLoading,
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
        spreadMode
    }
};

Scoreboard.propTypes = {
    classes: PropTypes.object.isRequired,
    dataLoading: PropTypes.bool,
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
