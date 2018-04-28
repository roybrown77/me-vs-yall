import React, { Component } from 'react';
import { connect } from 'react-redux';
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
import { leagues, getWeeks } from '../selectors/data';

class ScoreboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentWillMount() {
        this.props.loadScoreboard();
    }

    handleFilterLeague(filterLeague) {
    }

    handleFilterYear(filterYear) {
    }
  
    handleFilterWeek(event, index) {
        if (this.props.weeks.length === 0) {
            return;
        }

        const week = this.props.weeks[index];
        
        const query = {
            leagueId: this.props.leagueId,
            year: week.year,
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
                    {!this.props.dataLoading && <GameSearchBar 
                        league={leagues.find(x=>x.id === this.props.leagueId).name}
                        year={this.props.year}
                        weekNo={this.props.weekNo}
                        seasonType={this.props.seasonType}
                        weeks={this.props.weeks}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}/>
                    }
                    {this.props.dataLoading && <Spinner/>}
                    {
                        !this.props.dataLoading && !this.props.isAuthenticated && 
                        <RaisedButton
                          label="Press Start to Play!"
                          labelPosition="before"
                          primary={true}
                          style={{
                            width: '100%',
                            backgroundColor: 'green',
                            margin:'10px 0'
                          }}
                        />
                    }
                    {!this.props.dataLoading && this.props.isAuthenticated && areAnyGamesOver && <PickResult games={this.props.games} picks={this.props.picks}/>}
                    {!areAnyGamesOver && <div style={{height:'12px'}}/>}
                    {!this.props.dataLoading && 
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
    const scoreboardDomain = state.get('scoreboardDomain').toJS();
    const dataLoading = get(scoreboardDomain, 'dataLoading');
    const games = get(scoreboardDomain, 'games', []);
    const picks = get(scoreboardDomain, 'picks', []);

    const weeksDomain = state.get('weeksDomain').toJS();
    const rawWeeks = get(weeksDomain,'gameWeeks', []);
    const weeks = getWeeks(rawWeeks);
    const mostRecentWeek = last(rawWeeks);
    const ui = state.get('ui').toJS();
    const request = get(ui,'request');
    const currentWeek = request || mostRecentWeek;
    const leagueId = get(currentWeek, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const year = get(currentWeek, 'year');
    const seasonType = get(currentWeek, 'seasonType');
    const weekNo = get(currentWeek, 'weekNo');

    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    return {
        dataLoading,
        games,
        picks,
        weeks,
        leagueId,
        year,
        seasonType,
        weekNo,
        isAuthenticated
    }
};

ScoreboardPage.propTypes = {
    dataLoading: PropTypes.bool,
    games: PropTypes.array,
    picks: PropTypes.array,
    weeks: PropTypes.array,
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