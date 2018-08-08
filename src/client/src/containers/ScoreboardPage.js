import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import moment from 'moment-timezone';
import get from 'lodash/get';
import last from 'lodash/last';

import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PickResult from '../components/PickResult';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';
import Spinner from '../components/Spinner';

import { loadScoreboard, loadDailyScoreboard, addPick, updatePick } from '../actions';
import { formatWeeks } from '../selectors';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class ScoreboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleFilterDate = this.handleFilterDate.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentDidMount() {
        const { leagueName } = this.props.match.params;
        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id') || this.props.leagues.find(x=>x.name.toLowerCase() === 'nfl').id;

        if (this.props.isDaily) {
            this.props.loadDailyScoreboard({
                leagueId: this.props.leagueId,
                date: this.props.date || moment().format('YYYY-MM-DD'),
                year: undefined
            });
        } else {
            this.props.loadScoreboard({
                leagueId: urlLeagueId,
                year: this.props.year,
                seasonType: this.props.seasonType,
                weekNo: this.props.weekNo
            });
        }
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
            weekNo: week.weekNo
        });
    }

    handleFilterDate(event) {
        const { value } = event.target;

        this.props.loadDailyScoreboard({
            leagueId: this.props.leagueId,
            date: value
        });
    }

    handleMakePick(pick) {
        if (!this.props.isAuthenticated) return;

        pick.leagueId = this.props.leagueId;
        pick.weekNo = this.props.weekNo;
        pick.year = this.props.year;
        pick.seasonType = this.props.seasonType;

        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (pickFound) {
            this.props.updatePick(pickFound._id, pick);
        } else {
            this.props.addPick(pick);
        }
    }

    render() {
        const areAnyGamesOver = this.props.games.some(x=>!!x.isGameOver);

        return (
            <div>
                <Header/>
                <div className='page-container'>
                    {
                        <GameSearchBar 
                            league={this.props.leagueId}
                            leagues={this.props.leagues}
                            year={this.props.year}
                            years={this.props.years}
                            weekNo={this.props.weekNo}
                            weeks={this.props.weeks}
                            seasonType={this.props.seasonType}
                            isDaily={this.props.isDaily}
                            onFilterLeague={this.handleFilterLeague}
                            onFilterYear={this.handleFilterYear}
                            onFilterWeek={this.handleFilterWeek}
                            onFilterDate={this.handleFilterDate}
                        />
                    }
                    {(this.props.weeksDataLoading || this.props.dataLoading) && <Spinner/>}
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && !this.props.isAuthenticated && 
                        <Route render={({ history }) => (
                        <RaisedButton
                          label="Press Start to Play!"
                          labelPosition="before"
                          primary={true}
                          onClick={() => { history.push('/login') }}
                          style={{
                            width: '100%',
                            margin:'10px 0'
                          }}/>
                          )}/>
                    }
                    {!(this.props.weeksDataLoading || this.props.dataLoading) && this.props.isAuthenticated && areAnyGamesOver && <PickResult games={this.props.games} picks={this.props.picks}/>}
                    {!areAnyGamesOver && <div style={{height:'12px'}}/>}
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && 
                        <Games
                            handleMakePick={this.handleMakePick} 
                            games={this.props.games} 
                            picks={this.props.picks}/>
                    }
                </div>
                <Footer/>
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

    const leagues = get(lookup, 'leagues', []);
    const leagueId = get(request, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []);
    const weeks = formatWeeks(rawWeeks);
    const weekNo = get(request, 'weekNo', get(last(rawWeeks), 'weekNo'));

    const seasonType = get(request, 'seasonType') || get(last(rawWeeks), 'seasonType');

    const isDaily = get(league, 'isDaily', true);
    
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    history.push('/scoreboards/' + get(league,'name',''));

    return {
        dataLoading,
        weeksDataLoading,
        isDaily,
        games,
        picks,
        weeks,
        leagues,
        years,
        leagueId,
        year,
        seasonType,
        weekNo,
        isAuthenticated
    }
};

ScoreboardPage.propTypes = {
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    isDaily: PropTypes.bool,
    games: PropTypes.array,
    picks: PropTypes.array,
    weeks: PropTypes.array,
    leagues: PropTypes.array,
    years: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    seasonType: PropTypes.number,
    weekNo: PropTypes.number,
    isAuthenticated: PropTypes.bool.isRequired,
    loadScoreboard: PropTypes.func.isRequired,
    loadDailyScoreboard: PropTypes.func.isRequired,
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadScoreboard,
  loadDailyScoreboard,
  addPick,
  updatePick
})(ScoreboardPage);