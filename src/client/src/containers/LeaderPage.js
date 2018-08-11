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

import { loadLeaders } from '../actions';
import { formatWeeks, formatMoney, getWinnings } from '../selectors';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

class LeaderPage extends Component {
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
            this.props.loadLeaders({
                leagueId: this.props.leagueId,
                date: this.props.date || moment().format('YYYY-MM-DD'),
                year: undefined
            });
        } else {
            this.props.loadLeaders({
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
        
        this.props.loadLeaders({
            leagueId: league.id,
            year
        });
    }

    handleFilterYear(event, index) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const year = this.props.years[index];

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: year
        });
    }
  
    handleFilterWeek(event, index) {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const week = this.props.weeks[index];

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: week.seasonType,
            weekNo: week.weekNo
        });
    }

    handleFilterDate(event) {
        const { value } = event.target;

        this.props.loadLeaders({
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
                    {this.props.dataLoading && <Spinner/>}
                    {!this.props.dataLoading && 
                        <div>
                            <div style={{height:'20px'}}/>
                            <table style={{width:"100%", backgroundColor: '#fff', padding: '12px'}}>
                                <tbody>
                                    {this.props.leaders.map((leader, index) => (
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
    const lookup = state.get('lookup').toJS();

    const leaderDomain = state.get('leaderDomain').toJS();
    const dataLoading = get(leaderDomain, 'dataLoading');
    const leaders = get(leaderDomain, 'leaders', []);

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');

    const leagues = get(lookup, 'leagues', []);
    const leagueId = get(request, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const weekNo = get(request, 'weekNo', get(last(rawWeeks), 'weekNo'));

    const seasonType = get(request, 'seasonType') || get(last(rawWeeks), 'seasonType');

    const isDaily = get(league, 'isDaily', true);
    
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    history.push('/leaders/' + get(league,'name',''));

    return {
        dataLoading,
        weeksDataLoading,
        isDaily,
        leaders,
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

LeaderPage.propTypes = {
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    isDaily: PropTypes.bool,
    leaders: PropTypes.array,
    weeks: PropTypes.array,
    leagues: PropTypes.array,
    years: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    seasonType: PropTypes.number,
    weekNo: PropTypes.number,
    isAuthenticated: PropTypes.bool.isRequired,
    loadLeaders: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadLeaders
})(LeaderPage);