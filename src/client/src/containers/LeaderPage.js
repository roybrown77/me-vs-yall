import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();

import get from 'lodash/get';
import groupBy from 'lodash/groupBy';
import transform from 'lodash/transform';
import orderBy from 'lodash/orderBy';

import Header from '../components/Header';
import Footer from '../components/Footer';
import GameSearchBar from '../components/GameSearchBar';
import Spinner from '../components/Spinner';

import { loadGames, loadPicks, selectWeek, loadGameWeeks } from '../actions';
import { isLoggedIn } from '../middleware/authenticationService';

import { leagues, getResults, getWeeks } from '../selectors/data';

const users = [
    {
        id: 'google-oauth2|114172296334563495985',
        name: 'Roy B.'
    },
    {
        id: 'google-oauth2|114007081690870704922',
        name: 'Scott T.'
    },
    {
        id: 'google-oauth2|110505723196499693171',
        name: 'Keith H.'
    }
];

// <div style={{fontSize: '40px', color: '#FFC107'}}>
                            //     <span>W</span>
                            // </div>

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

        const weekToSearch = this.props.weekNo;

        const query = {
            leagueId: this.props.leagueId,
            weekNo: weekToSearch
        };

        this.props.loadGames(query);
        this.props.loadPicks(query);
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

        const weekToSearch = this.props.weeks[index].weekNo;

        const query = {
            leagueId: this.props.leagueId,
            weekNo: weekToSearch
        };

        this.props.selectWeek(weekToSearch);
        this.props.loadGames(query);
        this.props.loadPicks(query);
        this.props.loadGameWeeks(query);
    }

    render() {
        const {picks, games} = this.props;

        const picksByUser = transform(groupBy(picks, x=>x.userId), (result, value, key)=>{
            result.push({
                userId: key,
                picks: value
            });
        }, []);

        const pickResults = picksByUser.filter((item) => {
            return !!users.find(x=>x.id === item.userId)
        }).map(item =>{
            const pickResult = getResults(games,item.picks);
            const user = users.find(x=>x.id === item.userId);

            return {
                id: item.userId,
                userName: get(user,'name','unknown'),
                wins: pickResult.wins,
                losses: pickResult.losses,
                ties: pickResult.ties
            };
        });

        const pickResultsOrdered = orderBy(pickResults, ['wins', 'userName'], ['desc', 'asc']);

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
                    {!this.props.dataLoading && 
                        <div>
                            <div style={{height:'12px'}}/>
                            <table style={{width:"100%", backgroundColor: '#fff', padding: '12px'}}>
                                <tbody>
                                    {pickResultsOrdered.map((pickResult, index) => (
                                        <tr key={pickResult.id}
                                            style={{paddingBottom:"16px"}}>
                                            <td>
                                                <div className="leader-item" style={{color: index === 0 ? '#FFC107' : '#000'}}>
                                                    {index+1}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {pickResult.userName}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {pickResult.wins}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {pickResult.losses}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="leader-item">
                                                    {pickResult.ties}
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
    const weekNo = get(ui,'weekNo') || get(weeks, '[' + weekIndex + '].weekNo');
    
    const year = 2017;
    const picks = entities.picks;
    const games = entities.games;
    const pickResults = [];

    return {
        picks,
        games,
        pickResults,
        dataLoading,
        weeks,
        leagueId,
        weekNo,
        year
    }
};

LeaderPage.propTypes = {
    picks: PropTypes.array,
    games: PropTypes.array,
    pickResults: PropTypes.array,
    dataLoading: PropTypes.bool,
    leagueId: PropTypes.string,
    weekNo: PropTypes.number,
    loadGames: PropTypes.func.isRequired,
    loadPicks: PropTypes.func.isRequired,
    loadGameWeeks: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  selectWeek,
  loadGames,
  loadPicks,
  loadGameWeeks
})(LeaderPage);