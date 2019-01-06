import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';
import last from 'lodash/last';

import moment from 'moment-timezone';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

import PageContainer from './PageContainer';
import GameSearchBar from '../components/GameSearchBar';
import PickResult from '../components/PickResult';
import Game from '../components/Game';
import Countdown from '../components/Countdown';

import { googleLogin } from '../middleware/authenticationService';
import { loadScoreboard, addPick, updatePick } from '../actions';

import obs from '../styles/images/original-barber-shop-3.jpeg';

import { 
    formatWeeks, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getTimeUntilNextGamesLoad,
    getGroupedGames,
    getAreAnyGamesInProgress,
    getStartDateTime
} from '../selectors';

const styles = theme => ({
  root: {
    paddingTop: '4px'
  },
  button: {
    fontSize: '1rem',
    fontWeight: "700",
    marginBottom: '4px',
    width: '75%',
    backgroundColor: '#FFC107',
    color: '#FFFFFF',
    borderColor: '#FFC107',
    '&:hover': {
      backgroundColor: '#FFC107',
      color: '#FFFFFF',
      borderColor: '#FFC107',
    },
  },
  input: {
    display: 'none',
  },
  pickResultContainer: {
    border: '4px solid rgb(255, 193, 7)',
    margin: '4px 25%',
    borderRadius: '8px',
    padding: '4px'
  },
  banner: {
    marginBottom: '10px'
  },
  bannerImage: {
    borderRadius: '8px'
  }
});

let gameDate;

class ScoreboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
        this.startPolling = this.startPolling.bind(this);
    }

    componentDidMount() {
        this.startPolling();

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);
        
        this.props.loadScoreboard({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            seasonType: urlLeagueId !== this.props.leagueId ? undefined : this.props.seasonType,
            weekNo: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekNo,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId
        });
    }

    componentWillUnmount() {
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }
    }

    startPolling() {
        let self = this;
        setTimeout(function() {
            self._timer = setInterval(self.poll.bind(self), 15000);
        }, 1000);
    }

    poll() {
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        if (!areAnyGamesInProgress) return;

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: this.props.seasonType,
            weekNo: this.props.weekNo,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime,
            weekId: this.props.weekId
        });
    }

    handleFilterLeague(event, league) {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const leagueFound = this.props.leagues.find(x=>x.id===league.key);
        const years = get(leagueFound,'years',[]);
        const year = last(years);

        this.props.loadScoreboard({
            leagueId: leagueFound.id,
            year
        });
    }

    handleFilterYear(event, year) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const yearFound = this.props.years.find(x=>x===parseInt(year.key));

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: yearFound
        });
    }
  
    handleFilterWeek(event, week) {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const weekFound = this.props.weeks[week.key];

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: weekFound.seasonType,
            weekNo: weekFound.weekNo,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime,
            weekId: weekFound._id
        });
    }

    handleMakePick(pick) {
        if (!this.props.isAuthenticated) return;

        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (!!pickFound) {
            this.props.updatePick(get(pickFound,'_id'), pick);
        } else {
            this.props.addPick(pick);
        }
    }

    render() {
        const { 
            classes, 
            games, 
            picks, 
            teams, 
            isCurrentWeek, 
            isAuthenticated, 
            dataLoading, 
            weeksDataLoading, 
            weekId,
            weeks
        } = this.props;

        const week = weeks.find(x=>x._id === weekId);
        const areAnyGamesOver = games.some(x=>x.isGameOver);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const timeUntilNextGamesLoad = getTimeUntilNextGamesLoad(games);
        const groupedGames = getGroupedGames(games, picks, teams);
        const gamesNotStarted = games.filter(x=>!hasGameStarted(x.startDateTime));
        const timeUntilNextGameStarts = getStartDateTime(games);

        return (
            <div>
                <PageContainer>
                    {
                        <GameSearchBar 
                            leagueId={this.props.leagueId}
                            leagues={this.props.leagues}
                            year={this.props.year}
                            years={this.props.years}
                            weekId={this.props.weekId}
                            weeks={this.props.weeks}
                            seasonType={this.props.seasonType}
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
                            className={classes.button} onClick={() => googleLogin()}>
                            Log in to Play
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
                        games.find(x=>x.isGameOver !== true) &&
                        !areAnyGamesInProgress &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div style={{color: 'darkorange', fontSize: '17px'}}>next game starts in</div>
                            <Countdown date={timeUntilNextGameStarts}/>
                        </div>
                    }
                    {
                        areAllGamesOver &&
                        isCurrentWeek &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div style={{color: 'darkorange', fontSize: '17px'}}>new games load in</div>
                            <Countdown date={timeUntilNextGamesLoad}/>
                        </div>
                    }
                    <div style={{margin: '4px 14%', padding: '4px', border: '4px solid lightgreen', borderRadius: '8px'}}>
                        <div style={{color: 'darkgreen', fontSize: '17px'}}>player with the most correct wins!</div>
                    </div>
                    {
                        areAnyGamesInProgress &&
                        <div style={{color: 'darkorange', fontSize: '17px', margin:'4px 20%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div className='fast-flash'>** games in progress **</div>
                            <div>auto update: on</div>
                        </div>
                    }
                    {
                        !isAuthenticated &&
                        !areAllGamesOver &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 20%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** log in then tap team **
                        </div>
                    }
                    {
                        isAuthenticated && 
                        ((picks.length === 0 && gamesNotStarted.length > 0) || (picks.length < gamesNotStarted.length)) &&
                        !areAllGamesOver &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 20%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            <div>tap team below</div>
                            <div className='fast-flash'><b>{gamesNotStarted.length - picks.length}</b> remaining</div>
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
                                        <div>
                                            {
                                                newDate &&
                                                <div style={{backgroundColor:'#ffffff', width: '100%', padding: '2px 0', marginBottom:'8px'}}>
                                                    <div style={{margin:'16px 0',fontSize:'14px', fontWeight:'600',color:'darkorange'}}>{gameDate}</div>
                                                </div>
                                            }
                                            <Game 
                                                game={game} 
                                                pick={picks.find(x=>x.gameId === game._id)} 
                                                key={game._id} 
                                                handleMakePick={this.handleMakePick} 
                                                isAuthenticated={isAuthenticated}
                                            />
                                        </div>
                                    );
                            })}
                        </div>
                    }
                    {
                        false &&
                        <div className={classes.banner}>
                            <a href="https://theoriginalbarbershopnpr.com">
                                <img className={classes.bannerImage} src={obs} alt="the original barber shop"/>
                            </a>
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

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');

    const requestStorageJson = localStorage.getItem('request');
    const requestStorage = JSON.parse(requestStorageJson);

    const leagues = get(lookup, 'leagues', []);
    const leagueId = get(request, 'leagueId') ? get(request, 'leagueId') : get(requestStorage, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const weekNo = get(request, 'beginDateTime') ? undefined : get(request, 'weekNo') || get(currentWeek,'weekNo');
    const seasonType = get(request, 'beginDateTime') ? undefined : get(request, 'seasonType') || get(currentWeek, 'seasonType');
    const beginDateTime = get(request, 'beginDateTime') || get(currentWeek, 'beginDateTime');
    const endDateTime = get(request, 'endDateTime') || get(currentWeek, 'endDateTime');
    
    const teamDomain = state.get('teamDomain').toJS();
    const teams = get(teamDomain, 'teams', []);

    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    const weekId = get(request,'weekId') || get(currentWeek,'_id');
    const isCurrentWeek = get(currentWeek,'_id') === get(request,'weekId') || !get(request,'weekId');

    return {
        dataLoading,
        weeksDataLoading,
        games,
        picks,
        weeks,
        isCurrentWeek,
        leagues,
        years,
        leagueId,
        year,
        seasonType,
        weekNo,
        weekId,
        beginDateTime,
        endDateTime,
        teams,
        isAuthenticated
    }
};

ScoreboardPage.propTypes = {
    classes: PropTypes.object.isRequired,
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    games: PropTypes.array,
    picks: PropTypes.array,
    weeks: PropTypes.array,
    isCurrentWeek: PropTypes.bool,
    leagues: PropTypes.array,
    years: PropTypes.array,
    teams: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    seasonType: PropTypes.number,
    week: PropTypes.number,
    weekId: PropTypes.string,
    weekNo: PropTypes.number,
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
})(withStyles(styles, { withTheme: true })(ScoreboardPage));