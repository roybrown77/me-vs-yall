import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactGA from 'react-ga';

import get from 'lodash/get';
import last from 'lodash/last';

import moment from 'moment-timezone';

import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined';

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

import { loadScoreboard, addPick, updatePick } from '../../actions';
import { googleLogin } from '../../middleware/authenticationService';
import { 
    formatWeeks, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getGroupedGames,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
    getImage,
    getPicksNotSelected
} from '../../utilities';

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
  root: {
    paddingTop: '4px'
  },
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
    margin: '0 25% 6px 25%',
    padding: '4px',
    backgroundColor: 'white'
  },
  banner: {
    marginBottom: '10px'
  },
  bannerImage: {
    borderRadius: '8px'
  },
  button: {
    fontSize: '1rem',
    fontWeight: "700",
    marginBottom: '4px',
    width: '75%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  soundButton: {
    color: '#000'
  }
});

let gameDate;

class Scoreboard extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soundOn: false
        };
    }

    componentDidMount() {
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }

        window.scrollTo(0, 0);

        this.startPolling();

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        ReactGA.ga('send', 'pageview', '/scoreboards/' + urlLeague.name);
        
        this.props.loadScoreboard({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId
        });
    }

    componentDidUpdate(prevProps) {
      if (this.props.leagueId !== prevProps.leagueId || 
        this.props.year !== prevProps.year || 
        this.props.weekId !== prevProps.weekId) {
        this.resetPoll();
      }
    }

    startPolling = () => {
        let self = this;
        self._timer = setInterval(self.poll.bind(self), 15000);
    }

    resetPoll() {
        let self = this;
        
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }

        self._timer = setInterval(self.poll.bind(self), 15000);
    }

    poll() {
        const leagueName = window.location.pathname.split('/')[2];
        const leagueFound = this.props.leagues.find(x=>x.name === leagueName);

        if (!leagueFound) {
            this.resetPoll();
            return;
        }

        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        if (!areAnyGamesInProgress) return;

        if (this.props.weeks.findIndex(x=>x._id === this.props.weekId)+1 < this.props.weeks.length) return;

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime,
            weekId: this.props.weekId
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
        if (!this.props.isAuthenticated) return;

        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (!!pickFound) {
            this.props.updatePick(get(pickFound,'_id'), pick);
        } else {
            this.props.addPick(pick);
        }
    }

    handleToggleSound = () => {
        if (['59723313734d1d6202a85f10'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { madden.play(); } else { madden.stop(); };
        }

        if (['59723313734d1d6202a85f15'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { tecmo.play(); } else { tecmo.stop(); };
        }

        if (['59723313734d1d6202a85f19'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { nbaJams.play(); } else { nbaJams.stop(); };
        }

        if (['59723313734d1d6202a85f35'].includes(this.props.leagueId)) {
            if (!this.state.soundOn) { nbaJams.play(); } else { nbaJams.stop(); };
        }

        this.setState((state) => ({
            soundOn: !state.soundOn
        }));
    }

    render() {
        const { 
            classes, 
            games, 
            picks, 
            teams, 
            isAuthenticated, 
            dataLoading, 
            weeksDataLoading,
            weeks = [],
            weekId,
            leagueId
        } = this.props;

        const {soundOn} = this.state;

        const currentWeek = weeks.find(x=>x._id === weekId);
        const areAnyGamesOver = games.some(x=>x.isGameOver);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const groupedGames = getGroupedGames(games, picks, teams);
        const gamesNotStarted = games.filter(x=>!hasGameStarted(x.startDateTime));
        const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
        const picksNotSelected = getPicksNotSelected(gamesNotStarted, picks);

        gameDate = null;

        const image = getImage(leagueId);

        return (
            <div>
                <PageContainer>
                    {
                        <GameSearchBar 
                            leagueId={leagueId}
                            leagues={this.props.leagues}
                            year={this.props.year}
                            years={this.props.years}
                            weekId={this.props.weekId}
                            weeks={this.props.weeks}
                            beginDateTime={this.props.beginDateTime}
                            endDateTime={this.props.endDateTime}
                            onFilterLeague={this.handleFilterLeague}
                            onFilterYear={this.handleFilterYear}
                            onFilterWeek={this.handleFilterWeek}
                            onFilterDate={this.handleFilterDate}
                        />
                    }
                    {
                        <div style={{height: '8px'}}>
                            {
                                (dataLoading || weeksDataLoading) &&
                                <LinearProgress />
                            }
                        </div>
                    }
                    {
                        !isAuthenticated && 
                        <Button
                            variant="contained" 
                            className={classNames(classes.button)}
                            disabled={dataLoading || weeksDataLoading} 
                            onClick={() => googleLogin()}>
                          Press to Play
                        </Button>
                    }
                    {
                        isAuthenticated && 
                        picks.length > 0 &&
                        areAnyGamesOver && 
                        <div className={classNames(classes.pickResultContainer)}>
                            <PickResult games={games} picks={picks}/>
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
                        areAllGamesOver &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid deeppink'}}>
                            <div style={{color: 'deeppink', fontSize: '17px'}}>new {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fights' : 'games'} load in</div>
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
                        isAuthenticated &&
                        areAllGamesOver &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 10%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'tap fighter before match starts' : 'tap team before game starts'} **
                        </div>
                    }
                    {
                        ['59723313734d1d6202a85f10','59723313734d1d6202a85f15','59723313734d1d6202a85f19','59723313734d1d6202a85f35'].includes(leagueId) &&
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
                        <div className={classes.root}>
                            {
                                groupedGames.map(game => {
                                    let newGameDate = moment(get(game,'startDateTime')).format('dddd MMM D YYYY');
                                    let newDate = (gameDate !== newGameDate);
                                    if (newDate) gameDate = newGameDate;

                                    return (
                                        <div key={game._id}>
                                            {
                                                newDate &&
                                                <div style={{fontFamily:'monospace', backgroundColor:'#ffffff', width: '100%', padding: '2px 0', marginBottom:'8px'}}>
                                                    <div style={{margin:'16px 0',fontSize:'14px', fontWeight:'600',color:'deeppink'}}>{gameDate}</div>
                                                </div>
                                            }
                                            <Game 
                                                game={game} 
                                                pick={picks.find(x=>x.gameId === game._id)}
                                                handleMakePick={this.handleMakePick} 
                                                isAuthenticated={isAuthenticated}
                                            />
                                        </div>
                                    );
                            })}
                        </div>
                    }
                    {
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
        isAuthenticated
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
    isAuthenticated: PropTypes.bool.isRequired,
    loadScoreboard: PropTypes.func.isRequired,
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadScoreboard,
  addPick,
  updatePick
})(withStyles(styles, { withTheme: true })(Scoreboard));