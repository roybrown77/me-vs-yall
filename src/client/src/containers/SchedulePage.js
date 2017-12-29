import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

import get from 'lodash/get';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PickResult from '../components/PickResult';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';
import Spinner from '../components/Spinner';

import { loadGames, loadPicks, loadGameWeeks, addPick, updatePick, selectWeek } from '../actions';
import { isLoggedIn, getUserProfile } from '../middleware/authenticationService';

import { leagues, getWeeks } from '../selectors/data';

class SchedulePage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentWillMount() {
        if (!isLoggedIn()) {
            window.location.href = '/login';
            return;
        }

        this.props.loadGameWeeks({leagueId: this.props.leagueId}).then(()=>{
            const leagueName = leagues.find(x=>x.id === this.props.leagueId).name.toLowerCase();
            history.push('/leagues/' + leagueName);

            const weekToSearch = this.props.weekNo;

            getUserProfile((err, profile) => {
                const query = {
                    userId: profile.sub,
                    leagueId: this.props.leagueId,
                    weekNo: weekToSearch
                };

                this.props.selectWeek(weekToSearch);
                this.props.loadGames(query);
                this.props.loadPicks(query);
            });
        });
    }

    handleFilterLeague(filterLeague) {
    }

    handleFilterYear(filterYear) {
    }
  
    handleFilterWeek(event, index) {
        if (this.props.weeks.length === 0) {
            return;
        }

        const weekToSearch = this.props.weeks[index].weekNo;

        this.props.selectWeek(weekToSearch);

        getUserProfile((err, profile) => {
            const query = {
                userId: profile.sub,
                leagueId: this.props.leagueId,
                weekNo: weekToSearch
            };

            this.props.selectWeek(weekToSearch);
            this.props.loadGames(query);
            this.props.loadPicks(query);
            this.props.loadGameWeeks(query);
        });
    }

    handleMakePick(pick) {
        pick.leagueId = this.props.leagueId;
        pick.weekNo = this.props.weekNo;

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
                    <GameSearchBar 
                        league={leagues.find(x=>x.id === this.props.leagueId).name}
                        year={this.props.year}
                        weekNo={this.props.weekNo}
                        weeks={this.props.weeks}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}/>
                    {this.props.dataLoading && <Spinner/>}
                    {!this.props.dataLoading && areAnyGamesOver && <PickResult games={this.props.games} picks={this.props.picks}/>}
                    {!areAnyGamesOver && <div style={{height:'12px'}}/>}
                    {!this.props.dataLoading && 
                        <Games
                            handleMakePick={this.handleMakePick} 
                            games={this.props.games ? this.props.games : []} 
                            picks={this.props.picks ? this.props.picks : []}/>
                    }
                </div>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  const entities = state.get('entities').toJS();
  const ui = !!state.get('ui') ? state.get('ui').toJS() : undefined;

  const games = entities.games;
  const picks = entities.picks;
  const weeks = getWeeks(entities);

  const defaultLeague = 'nfl';
  const leagueName = get(ownProps, 'match.params.name');
  const league = leagueName ? leagues.find(x=>x.name.toLowerCase() === leagueName.toLowerCase()) : defaultLeague;
  const leagueId = league ? league.id : leagues.find(x=>x.name.toLowerCase() === defaultLeague).id;
  
  const weekIndex = weeks.length-1;
  const weekNo = get(ui,'weekNo') || get(weeks, '[' + weekIndex + '].weekNo');
  
  const year = 2017;
  const dataLoading = entities.dataLoading;
  const isAuthenticated = entities.authentication.isAuthenticated;

  return {
    dataLoading,
    games,
    picks,
    weeks,
    leagueId,
    weekNo,
    year,
    isAuthenticated
  }
};

SchedulePage.propTypes = {
    dataLoading: PropTypes.bool,
    games: PropTypes.array,
    picks: PropTypes.array,
    leagueId: PropTypes.string,
    weekNo: PropTypes.number,
    loadGames: PropTypes.func.isRequired,
    loadPicks: PropTypes.func.isRequired,
    loadGameWeeks: PropTypes.func.isRequired,
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
};

export default connect(mapStateToProps, {
  loadGames,
  loadPicks,
  loadGameWeeks,
  addPick,
  updatePick,
  selectWeek
})(SchedulePage);