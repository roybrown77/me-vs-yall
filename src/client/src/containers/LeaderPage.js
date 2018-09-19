import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import PageContainer from './PageContainer';
import GameSearchBar from '../components/GameSearchBar';
import LinearProgress from '../components/LinearProgress';

import RaisedButton from 'material-ui/RaisedButton';
import Grow from '@material-ui/core/Grow';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

import { loadLeaders } from '../actions';
import { formatWeeks, formatMoney, getWinnings, getCurrentWeek } from '../selectors';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

const styles = {
  root: {
    width: '100%',
    marginTop: '12px',
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
};

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
        if (this.props.weeksDataLoading || this.props.dataLoading) return;

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        this.props.loadLeaders({
            leagueId: urlLeagueId,
            year: this.props.year,
            seasonType: this.props.seasonType,
            weekNo: this.props.weekNo,
            date: this.props.date
        });
    }

    handleFilterLeague(event, index) {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const league = this.props.leagues[index];
        const years = get(league,'years',[]);
        const year = last(years);

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        if (urlLeagueId !== this.props.leagueId) {
            //history.push('/leaders/' + league.name);
        }
        
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
            weekNo: week.weekNo,
            date: week.date
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
                <PageContainer>
                    {
                        <GameSearchBar 
                            league={this.props.leagueId}
                            leagues={this.props.leagues}
                            year={this.props.year}
                            years={this.props.years}
                            weekNo={this.props.weekNo}
                            weeks={this.props.weeks}
                            seasonType={this.props.seasonType}
                            date={this.props.date}
                            onFilterLeague={this.handleFilterLeague}
                            onFilterYear={this.handleFilterYear}
                            onFilterWeek={this.handleFilterWeek}
                            onFilterDate={this.handleFilterDate}
                        />
                    }
                    {
                        !this.props.isAuthenticated && 
                        <div style={{margin:'0 12px'}}>
                            <Route render={({ history }) => (
                            <RaisedButton
                              label="Press Start to Play!"
                              labelPosition="before"
                              primary={true}
                              onClick={() => { history.push('/login') }}
                              style={{
                                width: '100%',
                                marginTop:'12px'
                              }}/>
                              )}/>
                        </div>
                    }
                    {
                        (this.props.dataLoading) && 
                        <LinearProgress/>
                    }
                    {
                        this.props.leaders.length > 0 && 
                        (!(this.props.weeksDataLoading || this.props.dataLoading)) &&
                        <Grow in={true} timeout={500}>
                            <div>
                                <table style={{width:"100%", backgroundColor: '#f4f7f6', padding: '12px'}}>
                                    <tbody>
                                        {
                                            this.props.leaders.map((leader, index) => (
                                            <tr key={leader.id} 
                                            style={{
                                                paddingBottom:"16px", 
                                                backgroundColor: '#fff',
                                                boxShadow: '0 0 2px rgba(0,0,0,0.12), 0 2px 2px rgba(0,0,0,0.24)'}}>
                                                <td>
                                                    <div className="leader-item" 
                                                    style={{color: index === 0 ? '#FFC107' : '#000'}}>
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
                                                        {((getWinnings(leader) || 0) < 0 ? '-' : '') + formatMoney(getWinnings(leader))}
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </Grow>
                    }
                    {
                        false &&
                        this.props.leaders.length > 0 && 
                        (!(this.props.weeksDataLoading || this.props.dataLoading)) &&
                        <Grow in={true} timeout={500}>
                            <div style={{marginTop: '12px'}}>
                                <Paper style={styles.root}>
                                  <Table style={styles.table}>
                                    <TableHead>
                                      <TableRow>
                                        <TableCell numeric>Rank</TableCell>
                                        <TableCell>Name</TableCell>
                                        <TableCell numeric>Wins</TableCell>
                                        <TableCell numeric>Losses</TableCell>
                                        <TableCell numeric>Ties</TableCell>
                                        <TableCell>$</TableCell>
                                      </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {this.props.leaders.map((leader, index) => (
                                            <TableRow key={leader.id}>
                                                <TableCell numeric>{index+1}</TableCell>
                                                <TableCell component="th" scope="row">
                                                  {leader.userName}
                                                </TableCell>
                                                <TableCell numeric>{leader.wins}</TableCell>
                                                <TableCell numeric>{leader.losses}</TableCell>
                                                <TableCell numeric>{leader.ties}</TableCell>
                                                <TableCell numeric>
                                                    {((getWinnings(leader) || 0) < 0 ? '-' : '') + formatMoney(getWinnings(leader))}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                  </Table>
                                </Paper>
                            </div>
                        </Grow>
                    }
                </PageContainer>
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
    const currentWeek = getCurrentWeek(weeks);
    const weekNo = get(request, 'date') ? undefined : get(request, 'weekNo') || get(currentWeek,'weekNo');
    const seasonType = get(request, 'date') ? undefined : get(request, 'seasonType') || get(currentWeek, 'seasonType');
    const date = get(request, 'date') || get(currentWeek, 'date');
    
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    return {
        dataLoading,
        weeksDataLoading,
        leaders,
        weeks,
        leagues,
        years,
        leagueId,
        year,
        seasonType,
        weekNo,
        date,
        isAuthenticated
    }
};

LeaderPage.propTypes = {
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    leaders: PropTypes.array,
    weeks: PropTypes.array,
    leagues: PropTypes.array,
    years: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    seasonType: PropTypes.number,
    weekNo: PropTypes.number,
    date: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    loadLeaders: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadLeaders
})(LeaderPage);