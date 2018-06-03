import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PickResult from '../components/PickResult';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';
import Spinner from '../components/Spinner';

import { loadScoreboard, addPick, updatePick } from '../actions';
import { formatWeeks, getYears } from '../selectors/data';
import history from '../middleware/history';

class ScoreboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentDidMount() {
        const query = {
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: this.props.seasonType,
            weekNo: this.props.weekNo
        }

        this.props.loadScoreboard(query);
    }

    handleFilterLeague(event, index) {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const league = this.props.leagues[index];
        const years = getYears(league.id);
        const year = last(years);
        
        const query = {
            leagueId: league.id,
            year
        };

        this.props.loadScoreboard(query);
    }

    handleFilterYear(event, index) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const year = this.props.years[index];
        
        const query = {
            leagueId: this.props.leagueId,
            year: year
        };

        this.props.loadScoreboard(query);
    }
  
    handleFilterWeek(event, index) {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const week = this.props.weeks[index];
        
        const query = {
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: week.seasonType,
            weekNo: week.weekNo
        };

        this.props.loadScoreboard(query);
    }

    handleMakePick(pick) {
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
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}/>
                    }
                    {(this.props.weeksDataLoading || this.props.dataLoading) && <Spinner/>}
                    {
                        !this.props.dataLoading && !this.props.isAuthenticated && 
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
    const { leagueName } = ownProps.match.params;
    const urlLeague = leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
    const urlLeagueId = get(urlLeague,'id')
    const leagueId = (get(request, 'leagueId') || urlLeagueId) || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    if (!urlLeague) {
        history.replace('/scoreboards/nfl');
    }
    
    const years = getYears(leagueId);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []);
    const weeks = formatWeeks(rawWeeks);
    const weekNo = get(request, 'weekNo') || get(last(rawWeeks), 'weekNo');

    const seasonType = get(request, 'seasonType') || get(last(rawWeeks), 'seasonType');
    
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
    leagueId: PropTypes.string,
    year: PropTypes.number,
    seasonType: PropTypes.number,
    weekNo: PropTypes.number,
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