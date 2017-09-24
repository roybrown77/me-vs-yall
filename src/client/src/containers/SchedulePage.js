import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

import get from 'lodash/get';
import moment from 'moment';
import Immutable from 'immutable';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';
import GameSearchBar from '../components/GameSearchBar';
import Games from '../components/Games';
import Game from '../components/Game';

import { loadGames, loadPicks, addPick, updatePick } from '../actions';

const leagues = [ {id: '59723313734d1d6202a85f10', name: 'NFL'} ];

const weeks = [
                    {
                        weekNo: 1,
                        weekNumberDisplay: '',
                        namePrefix: 'Hall of Fame Game',
                        beginDateTime: '2017-08-03T05:00:00+00:00',
                        endDateTime: '2017-08-04T02:00:00+00:00'
                    },
                    {
                        weekNo: 2,
                        weekNumberDisplay: 1,
                        namePrefix: 'Pre Week',
                        beginDateTime: '2017-08-09T05:00:00+00:00',
                        endDateTime: '2017-08-14T02:00:00+00:00'
                    },
                    {
                        weekNo: 3,
                        weekNumberDisplay: 2,
                        namePrefix: 'Pre Week',
                        beginDateTime: '2017-08-17T05:00:00+00:00',
                        endDateTime: '2017-08-22T02:00:00+00:00'
                    },
                    {
                        weekNo: 4,
                        weekNumberDisplay: 3,
                        namePrefix: 'Pre Week',
                        beginDateTime: '2017-08-24T05:00:00+00:00',
                        endDateTime: '2017-08-28T02:00:00+00:00'
                    },
                    {
                        weekNo: 5,
                        weekNumberDisplay: 4,
                        namePrefix: 'Pre Week',
                        beginDateTime: '2017-08-31T05:00:00+04:00',
                        endDateTime: '2017-09-01T02:00:00+04:00'
                    },
                    {
                        weekNo: 6,
                        weekNumberDisplay: 1,
                        namePrefix: 'Week',
                        beginDateTime: '2017-09-07T05:00:00+00:00',
                        endDateTime: '2017-09-12T02:00:00+00:00'
                    },
                    {
                        weekNo: 7,
                        weekNumberDisplay: 2,
                        namePrefix: 'Week',
                        beginDateTime: '2017-09-14T05:00:00+00:00',
                        endDateTime: '2017-09-19T02:00:00+00:00'
                    },
                    {
                        weekNo: 8,
                        weekNumberDisplay: 3,
                        namePrefix: 'Week',
                        beginDateTime: '2017-09-21T05:00:00+00:00',
                        endDateTime: '2017-09-26T02:00:00+00:00'
                    },
                    // {
                    //     weekNo: 9,
                    //     weekNumberDisplay: 4,
                    //     namePrefix: 'Week',
                    //     beginDateTime: '2017-09-28T05:00:00+00:00',
                    //     endDateTime: '2017-10-03T02:00:00+00:00'
                    // }
                  ];

class SchedulePage extends Component {
    constructor(props) {
        super(props);

        const formattedWeeks = weeks.map((week)=>{
            const startDateTime = moment.utc(week.beginDateTime).format('ddd M/D');
            const endDateTime = moment.utc(week.endDateTime).format('ddd M/D');

            if (startDateTime !== endDateTime) {
                week.displayName = week.namePrefix + ' ' + week.weekNumberDisplay + ' ' + moment.utc(week.beginDateTime).format('ddd M/D') + ' - ' + moment.utc(week.endDateTime).format('ddd M/D');
            } else {
                week.displayName = week.namePrefix + ' ' + week.weekNumberDisplay + ' ' + moment.utc(week.beginDateTime).format('ddd M/D');
            }

            return week;
        });

        this.state = {
            currentWeek: weeks[weeks.length-1].weekNo-1,
            weeks: formattedWeeks
        };

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentWillMount() {
        const query = {
            leagueId: '59723313734d1d6202a85f10',
            weekNo: 8
        };
        this.props.loadGames(query);
        this.props.loadPicks(query);
    } 

    componentWillReceiveProps(nextProps) {
    }

    handleFilterLeague(filterLeague) {
    }

    handleFilterYear(filterYear) {
    } 
  
    handleFilterWeek(filterWeek) {
    }

    handleMakePick(pick) {
        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (pickFound) {
            this.props.updatePick(pickFound._id, pick);
        } else {
            this.props.addPick(pick);
        }
    }

    render() {
        return (
            <div>
                <Header></Header>
                <div className='page-container'>
                    <GameSearchBar 
                        league={leagues.find(x=>x.id === this.props.leagueId).name}
                        year={this.props.year}
                        currentWeek={this.state.currentWeek}
                        weeks={this.state.weeks}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}>
                    </GameSearchBar>
                    <Games handleMakePick={this.handleMakePick} games={this.props.games ? this.props.games : []} picks={this.props.picks ? this.props.picks : []}> 
                    </Games>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  const entities = state.get('entities').toJS();
  const games = entities.games;
  const picks = entities.picks;
  const leagueId = '59723313734d1d6202a85f10'; //state.getIn(['games', 'leagueId']).toJS();
  const weekNo = 8; //state.getIn(['games', 'weekNo']).toJS();
  const year = 2017;

  return {
    games,
    picks,
    leagueId
  }
};

SchedulePage.propTypes = {
        games: PropTypes.array,
        picks: PropTypes.array,
        leagueId: PropTypes.string,
        loadGames: PropTypes.func.isRequired,
        loadPicks: PropTypes.func.isRequired,
        addPick: PropTypes.func.isRequired,
        updatePick: PropTypes.func.isRequired
    };

export default connect(mapStateToProps, {
  loadGames,
  loadPicks,
  addPick,
  updatePick
})(SchedulePage);