import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import Header from '../components/Header';
import Footer from '../components/Footer';
import GameSearchBar from '../components/GameSearchBar';
import Spinner from '../components/Spinner';

import { loadLeaders } from '../actions';
import { isLoggedIn } from '../middleware/authenticationService';
import { getWinnings, formatMoney, leagues, getWeeks } from '../selectors/data';

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
    }

    componentWillMount() {
        if (!isLoggedIn()) {
            this.props.history.push('/login');
            return;
        }

        this.props.loadLeaders();
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

        this.props.loadLeaders(query);
    }

    render() {
        const leaders = this.props.leaders;
        return (
            <div>
                <Header/>
                <div className='page-container'>
                    <GameSearchBar 
                        league={leagues.find(x=>x.id === this.props.leagueId).name}
                        year={this.props.year}
                        seasonType={this.props.seasonType}
                        weekNo={this.props.weekNo}
                        weeks={this.props.weeks}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}/>
                    {this.props.dataLoading && <Spinner/>}
                    {!this.props.dataLoading && 
                        <div>
                            <div style={{height:'12px'}}/>
                            <table style={{width:"100%", backgroundColor: '#fff', padding: '12px'}}>
                                <tbody>
                                    {leaders.map((leader, index) => (
                                        <tr key={leader.id}
                                            style={{paddingBottom:"16px"}}>
                                            <td>
                                                <div className="leader-item" style={{color: index === 0 ? '#FFC107' : '#000'}}>
                                                    {index+1}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {leader.userName}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {leader.wins}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {leader.losses}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {leader.ties}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {formatMoney(getWinnings(leader))}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>}
                </div>
                <Footer/>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const leaderDomain = state.get('leaderDomain').toJS();
    const dataLoading = get(leaderDomain, 'dataLoading');
    const leaders = get(leaderDomain, 'games', []);

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
        leaders,
        dataLoading,
        weeks,
        leagueId,
        year,
        seasonType,
        weekNo,
        isAuthenticated
    }
};

LeaderPage.propTypes = {
    leaders: PropTypes.array,
    dataLoading: PropTypes.bool,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    weekNo: PropTypes.number,
    seasonType: PropTypes.number,
    isAuthenticated: PropTypes.bool.isRequired,
    loadLeaders: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  loadLeaders
})(LeaderPage);