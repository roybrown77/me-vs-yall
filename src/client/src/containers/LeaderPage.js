import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

import get from 'lodash/get';
import moment from 'moment';

import Header from '../components/Header';
import Footer from '../components/Footer';
import GameSearchBar from '../components/GameSearchBar';

import { loadLeaders, selectWeek } from '../actions';

import { rawWeeks, leagues } from '../selectors/data';

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
    }

    componentWillMount() {
        const leagueName = leagues.find(x=>x.id === this.props.leagueId).name.toLowerCase();
        history.push('/leaders/' + leagueName);

        const weekToSearch = this.props.weekNo;

        const query = {
            leagueId: this.props.leagueId,
            weekNo: weekToSearch
        };

        this.props.loadLeaders(query);
    }

    handleFilterLeague(filterLeague) {
    }

    handleFilterYear(filterYear) {
    }
  
    handleFilterWeek(event, index) {
        const weekToSearch = this.props.weeks[index].weekNo;

        const query = {
            leagueId: this.props.leagueId,
            weekNo: weekToSearch
        };

        this.props.selectWeek(weekToSearch);
    }

    render() {
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
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
  const entities = state.get('entities').toJS();
  const ui = !!state.get('ui') ? state.get('ui').toJS() : undefined;

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
    weeks,
    leagueId,
    weekNo,
    year
  }
};

LeaderPage.propTypes = {
    dataLoading: PropTypes.bool,
    leagueId: PropTypes.string,
    weekNo: PropTypes.number,
    loadLeaders: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  selectWeek,
  loadLeaders
})(LeaderPage);