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
import { getWinnings, formatMoney, leagues, getWeeks, years } from '../selectors/data';

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
    }

    componentWillMount() {
        this.props.loadLeaders();
    }

    handleFilterLeague(event, index) {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const league = this.props.leagues[index];
        
        const query = {
            league: league
        };

        this.props.loadLeaders(query);
    }

    handleFilterYear(event, index) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const year = this.props.years[index];
        
        const query = {
            year: year
        };

        this.props.loadLeaders(query);
    }
  
    handleFilterWeek(event, index) {
        if (get(this.props, 'weeks', []).length === 0) {
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
                        league={leagues.find(x=>x.id === this.props.leagueId).id}
                        leagues={leagues}
                        year={this.props.year}
                        years={years}
                        seasonType={this.props.seasonType}
                        weekNo={this.props.weekNo}
                        weeks={this.props.weeks}
                        onFilterLeague={this.handleFilterLeague}
                        onFilterYear={this.handleFilterYear}
                        onFilterWeek={this.handleFilterWeek}/>
                    {this.props.dataLoading && <Spinner/>}
                    {!this.props.dataLoading && 
                        <div>
                            <div style={{height:'20px'}}/>
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
    const leaders = get(leaderDomain, 'leaders', []);

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

    return {
        leaders,
        dataLoading,
        weeks,
        leagueId,
        year,
        seasonType,
        weekNo
    }
};

LeaderPage.propTypes = {
    leaders: PropTypes.array,
    dataLoading: PropTypes.bool,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    weekNo: PropTypes.number,
    weeks: PropTypes.array,
    years: PropTypes.array,
    leagues: PropTypes.array,
    seasonType: PropTypes.number,
    loadLeaders: PropTypes.func.isRequired,
};

export default connect(mapStateToProps, {
  loadLeaders
})(LeaderPage);