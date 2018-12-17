import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';
import last from 'lodash/last';

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

import { 
    formatWeeks, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getTimeUntilNextGamesLoad,
    getIsCurrentWeek,
    getGroupedGames,
    getAreAnyGamesInProgress } from '../selectors';

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
    color: '#F7F8E0',
    borderColor: '#FFC107',
    '&:hover': {
      backgroundColor: '#FFC107',
      color: '#F7F8E0',
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
  }
});

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
            year: this.props.year,
            seasonType: this.props.seasonType,
            weekNo: this.props.weekNo,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime
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
            endDateTime: this.props.endDateTime
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

        const weekFound = this.props.weeks[parseInt(week.key)];

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: weekFound.seasonType,
            weekNo: weekFound.weekNo,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime
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
        const { classes, games, picks, teams, isCurrentWeek, isAuthenticated, dataLoading, weeksDataLoading } = this.props;
        const areAnyGamesOver = games.some(x=>x.isGameOver);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const timeUntilNextGamesLoad = getTimeUntilNextGamesLoad(games);
        const groupedGames = getGroupedGames(games, picks, teams);
        const gamesNotStarted = games.filter(x=>!hasGameStarted(x.startDateTime));

        return (
            <div>
                <PageContainer>
                    {
                        <GameSearchBar 
                            league={this.props.leagueId}
                            leagues={this.props.leagues}
                            year={this.props.year}
                            years={this.props.years}
                            weekNo={this.props.weekNo}
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
                                dataLoading || weeksDataLoading &&
                                <LinearProgress />
                            }
                        </div>
                    }
                    {
                        !isAuthenticated && 
                        <Button 
                            variant="contained" 
                            className={classes.button} onClick={() => googleLogin()}>
                            Log in to Play!
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
                            <div style={{color: 'darkorange', fontSize: '17px'}}>live play starts in</div>
                            <Countdown date={get(games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).find(x=>x.isGameOver !== true),'startDateTime')}/>
                        </div>
                    }
                    {
                        areAllGamesOver &&
                        isCurrentWeek &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div style={{color: 'darkorange', fontSize: '17px'}}>next games load in</div>
                            <Countdown date={timeUntilNextGamesLoad}/>
                        </div>
                    }
                    <div style={{margin: '4px 14%', padding: '4px', border: '4px solid lightgreen', borderRadius: '8px'}}>
                        <div style={{color: 'darkgreen', fontSize: '17px'}}>player with the most wins without tying and gets 2 folks to join wins <b>$50</b></div>
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
                            <span className='fast-flash'><b>{gamesNotStarted.length - picks.length}</b> remaining to pick</span>
                        </div>
                    }
                    {
                        <div className={classes.root}>
                            {
                                groupedGames.map(game => (
                                <Game 
                                    game={game} 
                                    pick={picks.find(x=>x.gameId === game._id)} 
                                    key={game._id} 
                                    handleMakePick={this.handleMakePick} 
                                    isAuthenticated={isAuthenticated}
                                />
                            ))}
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
    const isCurrentWeek = getIsCurrentWeek(weeks, beginDateTime, endDateTime, weekNo);

    const teamDomain = state.get('teamDomain').toJS();
    const teams = get(teamDomain, 'teams', []);

    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

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