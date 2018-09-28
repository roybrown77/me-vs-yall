import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import RaisedButton from 'material-ui/RaisedButton';

import PageContainer from './PageContainer';
import PickResult from '../components/PickResult';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';
import LinearProgress from '../components/LinearProgress';

import { loadScoreboard, addPick, updatePick } from '../actions';
import { formatWeeks, getCurrentWeek } from '../selectors';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class ScoreboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentDidMount() {
        if (this.props.weeksDataLoading || this.props.dataLoading) return;

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        this.props.loadScoreboard({
            leagueId: urlLeagueId,
            year: this.props.year,
            seasonType: this.props.seasonType,
            weekNo: this.props.weekNo,
            date: this.props.date
        });
    }

    handleFilterLeague(event, index) {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const league = this.props.leagues[index];
        const years = get(league,'years',[]);
        const year = last(years);

        this.props.loadScoreboard({
            leagueId: league.id,
            year
        });
    }

    handleFilterYear(event, index) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const year = this.props.years[index];

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: year
        });
    }
  
    handleFilterWeek(event, index) {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const week = this.props.weeks[index];

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: week.seasonType,
            weekNo: week.weekNo,
            date: week.date
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
        const areAnyGamesOver = this.props.games.some(x=>!!x.isGameOver);

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
                            date={this.props.date}
                            onFilterLeague={this.handleFilterLeague}
                            onFilterYear={this.handleFilterYear}
                            onFilterWeek={this.handleFilterWeek}
                            onFilterDate={this.handleFilterDate}
                        />
                    }
                    {
                        !this.props.isAuthenticated && 
                        <div style={{margin:'0 12px'}}>
                            <Route render={({ history }) => (
                            <RaisedButton
                              label="Press Start to Play!"
                              labelPosition="before"
                              primary={true}
                              onClick={() => { history.push('/login') }}
                              style={{
                                width: '100%',
                                marginTop:'12px'
                              }}/>
                              )}/>
                        </div>
                    }
                    {
                        (this.props.dataLoading) && 
                        <LinearProgress/>
                    }
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && this.props.isAuthenticated && areAnyGamesOver && 
                        <div style={{marginTop:'5px'}}>
                            <PickResult games={this.props.games} picks={this.props.picks}/>
                        </div>
                    }
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && 
                        <div style={{marginTop: '12px'}}>
                            <Games
                                handleMakePick={this.handleMakePick} 
                                games={this.props.games} 
                                picks={this.props.picks}
                                teams={this.props.teams}
                                />
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
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);;
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const weekNo = get(request, 'date') ? undefined : get(request, 'weekNo') || get(currentWeek,'weekNo');
    const seasonType = get(request, 'date') ? undefined : get(request, 'seasonType') || get(currentWeek, 'seasonType');
    const date = get(request, 'date') || get(currentWeek, 'date');
    
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
        leagues,
        years,
        leagueId,
        year,
        seasonType,
        weekNo,
        date,
        teams,
        isAuthenticated
    }
};

ScoreboardPage.propTypes = {
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
    seasonType: PropTypes.number,
    weekNo: PropTypes.number,
    date: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    loadScoreboard: PropTypes.func.isRequired,
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadScoreboard,
  addPick,
  updatePick
})(ScoreboardPage);