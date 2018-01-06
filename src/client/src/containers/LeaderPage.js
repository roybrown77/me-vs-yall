import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

import get from 'lodash/get';

import Header from '../components/Header';
import Footer from '../components/Footer';
import GameSearchBar from '../components/GameSearchBar';
import Spinner from '../components/Spinner';

import { loadLeaders, selectWeek, loadGameWeeks } from '../actions';
import { isLoggedIn } from '../middleware/authenticationService';

import { leagues, getWeeks } from '../selectors/data';

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
    }

    componentWillMount() {
        if (!isLoggedIn()) {
            window.location.href = '/login';
            return;
        }

        const leagueName = leagues.find(x=>x.id === this.props.leagueId).name.toLowerCase();
        history.push('/leaders/' + leagueName);

        const year = this.props.year;
        const seasonType = this.props.seasonType;
        const weekNo = this.props.weekNo;

        const query = {
            leagueId: this.props.leagueId,
            year: year,
            seasonType: seasonType,
            weekNo: weekNo
        };

        this.props.selectWeek(this.props.weeks.find(x=>x.year===year && x.seasonType === seasonType && x.weekNo === weekNo));
        this.props.loadLeaders(query);
        this.props.loadGameWeeks(query);
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

        this.props.selectWeek(week);
        this.props.loadLeaders(query);
        this.props.loadGameWeeks(query);
    }

    render() {
        const {leaders} = this.props;

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
    const entities = state.get('entities').toJS();
    const ui = !!state.get('ui') ? state.get('ui').toJS() : undefined;

    const dataLoading = entities.dataLoading;
    
    const defaultLeague = 'nfl';
    const leagueName = get(ownProps, 'match.params.name');
    const league = leagueName ? leagues.find(x=>x.name.toLowerCase() === leagueName.toLowerCase()) : defaultLeague;
    const leagueId = league ? league.id : leagues.find(x=>x.name.toLowerCase() === defaultLeague).id;
    
    const weeks = [
        ...getWeeks(entities),
        {
            displayName: "All Season",
        }
    ];

    const weekIndex = weeks.length-1;
    const week = get(ui,'week') || get(weeks, '[' + weekIndex + ']');
    const year = week.year || get(weeks, '[' + weekIndex + '].year');
    const seasonType = week.seasonType || get(weeks, '[' + weekIndex + '].seasonType');
    const weekNo = week.weekNo || get(weeks, '[' + weekIndex + '].weekNo');
    
    const leaders = entities.leaders;

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
    seasonType: PropTypes.number,
    loadLeaders: PropTypes.func.isRequired,
    loadGameWeeks: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  selectWeek,
  loadLeaders,
  loadGameWeeks
})(LeaderPage);