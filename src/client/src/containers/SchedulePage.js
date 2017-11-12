import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

import get from 'lodash/get';
import moment from 'moment';

import Header from '../components/Header';
import Footer from '../components/Footer';
import PickResult from '../components/PickResult';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';

import { loadGames, loadPicks, addPick, updatePick, selectWeek } from '../actions';
import { isLoggedIn, getUserProfile } from '../middleware/authService';

import { rawWeeks, leagues } from '../selectors/data';

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
        
        const leagueName = leagues.find(x=>x.id === this.props.leagueId).name.toLowerCase();
        history.push('/leagues/' + leagueName);

        const weekToSearch = this.props.weekNo;

        const query = {
            leagueId: this.props.leagueId,
            weekNo: weekToSearch
        };

        getUserProfile((err, profile) => {
            const query = {
                userId: profile.sub,
                leagueId: this.props.leagueId,
                weekNo: weekToSearch
            };

            this.props.loadGames(query);
            this.props.loadPicks(query);
        });
    }

    handleFilterLeague(filterLeague) {
    }

    handleFilterYear(filterYear) {
    }
  
    handleFilterWeek(event, index) {
        const weekToSearch = this.props.weeks[index].weekNo;

        this.props.selectWeek(weekToSearch);

        getUserProfile((err, profile) => {
            const query = {
                userId: profile.sub,
                leagueId: this.props.leagueId,
                weekNo: weekToSearch
            };

            this.props.loadGames(query);
            this.props.loadPicks(query);
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
                        onFilterWeek={this.handleFilterWeek}>
                    </GameSearchBar>
                    {areAnyGamesOver && <PickResult games={this.props.games} picks={this.props.picks}/>}
                    {!areAnyGamesOver && <div style={{height:'12px'}}></div>}
                    <Games dataLoading={this.props.dataLoading}
                    handleMakePick={this.handleMakePick} 
                    games={this.props.games ? this.props.games : []} 
                    picks={this.props.picks ? this.props.picks : []}> 
                    </Games>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  const entities = state.get('entities').toJS();
  const ui = !!state.get('ui') ? state.get('ui').toJS() : undefined;

  const games = entities.games;
  const picks = entities.picks;

  const weeks = rawWeeks.map((week)=>{
            const startDateTime = moment.utc(week.beginDateTime).format('ddd M/D');
            const endDateTime = moment.utc(week.endDateTime).format('ddd M/D');

            if (startDateTime !== endDateTime) {
                week.displayName = week.namePrefix + ' ' + week.weekNumberDisplay + ' ' + moment.utc(week.beginDateTime).format('ddd M/D') + ' - ' + moment.utc(week.endDateTime).format('ddd M/D');
            } else {
                week.displayName = week.namePrefix + ' ' + week.weekNumberDisplay + ' ' + moment.utc(week.beginDateTime).format('ddd M/D');
            }

            return week;
        });

  const defaultLeague = 'nfl';
  const leagueName = get(ownProps, 'match.params.name');
  const league = leagueName ? leagues.find(x=>x.name.toLowerCase() === leagueName.toLowerCase()) : defaultLeague;
  const leagueId = league ? league.id : leagues.find(x=>x.name.toLowerCase() === defaultLeague).id;
  const weekNo = ui.weekNo ? ui.weekNo : weeks[weeks.length-1].weekNo;
  const year = 2017;
  const dataLoading = entities.dataLoading;

  return {
    dataLoading,
    games,
    picks,
    weeks,
    leagueId,
    weekNo,
    year
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
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadGames,
  loadPicks,
  addPick,
  updatePick,
  selectWeek
})(SchedulePage);