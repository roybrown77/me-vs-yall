import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import moment from 'moment-timezone';

import PageContainer from './PageContainer';
import GameSearchBar from '../components/GameSearchBar';
import LinearProgress from '../components/LinearProgress';
import Games from '../components/Games';

import RaisedButton from 'material-ui/RaisedButton';

import Slide from '@material-ui/core/Slide';
import Zoom from '@material-ui/core/Zoom';
import Collapse from '@material-ui/core/Collapse';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import { loadLeaders } from '../actions';
import { formatWeeks, formatMoney, getWinnings, getCurrentWeek } from '../selectors';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

const listStyles = {
  root: {
    marginTop: '12px',
    width: '100%',
    backgroundColor: '#fff'
  },
};

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
            games: [],
            picks: []
        };

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleFilterDate = this.handleFilterDate.bind(this);
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
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime
        });
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

        this.setState({ open: false });
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

        this.setState({ open: false });
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
            beginDateTime: week.beginDateTime,
            endDateTime: week.endDateTime
        });

        this.setState({ open: false });
    }

    handleFilterDate(event) {
        const { value } = event.target;

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            date: value
        });
    }

    handleClickOpen = () => {
        let games = [];
        let picks = [];

        for(let i=0;i<this.props.games.length;i++) {
            if (this.props.games[i].weekNo === this.props.weekNo && 
                this.props.games[i].seasonType === this.props.seasonType) {
                games.push(this.props.games[i]);
            } else {
                if (moment(this.props.games[i].startDateTime) >= moment(this.props.date).startOfDay() &&
                    moment(this.props.games[i].startDateTime) <= moment(this.props.date).endOfDay()) {
                    games.push(this.props.games[i]);
                }
            }
        }

        if (games.length > 0) {
            for(let i=0;i<this.props.picks.length;i++) {
                if (games.find(x=>x._id === this.props.picks[i].gameId)) {
                    picks.push(this.props.picks[i]);
                }
            }
        }

        this.setState({ picks: picks });
        this.setState({ open: !this.state.open });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

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
                            beginDateTime={this.props.beginDateTime}
                            endDateTime={this.props.endDateTime}
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
                              label="Press to Play!"
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
                        <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={250}>
                            <div style={listStyles.root}>
                                <Divider />
                                <List>
                                {
                                    this.props.leaders.map((leader, index) => (
                                    <div key={leader.id}>
                                        <ListItem onClick={() => this.handleClickOpen()} button>
                                            <div style={{
                                                color: index === 0 ? '#FFC107' : '#000', 
                                                fontWeight: index === 0 ? '700' : '400'}}>
                                                {index+1}
                                            </div>
                                            <ListItemText><div>{leader.userName}</div></ListItemText>
                                            <div style={{textAlign:'right'}}>
                                                <div>{leader.wins} - {leader.losses} - {leader.ties}</div>
                                                <div style={{color:'#009933', fontWeight: '700'}}>
                                                    {((getWinnings(leader) || 0) < 0 ? '-' : '') + formatMoney(getWinnings(leader))}
                                                </div>
                                            </div>
                                        </ListItem>
                                        <Divider />
                                        {
                                            <Collapse in={this.state.open}>
                                                <div style={{width: '70%', margin: '12px auto'}}>
                                                    {
                                                        <table style={{width:"100%", backgroundColor: '#fff'}}>
                                                            <tbody>
                                                                {this.props.games.map((game,gameIndex)=>(
                                                                    <tr key={gameIndex}>
                                                                        <td>
                                                                            <div style={{
                                                                            width:'17px', 
                                                                            height: '17px', 
                                                                            backgroundColor: game.isGameOver && 
                                                                            this.state.picks.find(pick=>pick.pickId === game.competitors[0]._id && pick.userId === leader.id && game.competitors[0].score > game.competitors[1].score) ? '#009933' : 
                                                                            game.isGameOver && 
                                                                            this.state.picks.find(pick=>pick.pickId === game.competitors[0]._id && pick.userId === leader.id && game.competitors[0].score <= game.competitors[1].score) ? 'red' : 
                                                                            moment() > moment(game.startDateTime) && 
                                                                            this.state.picks.find(pick=>pick.pickId === game.competitors[0]._id && pick.userId === leader.id) ? 'lightblue' : ''}}/>
                                                                        </td>
                                                                        <td>                                                                           
                                                                            <span>
                                                                                {   
                                                                                    get(this.props.teams.find(team=>team._id === game.competitors[0]._id), 'name')
                                                                                }
                                                                            </span>
                                                                            <span> vs </span>
                                                                            <span>
                                                                                {   
                                                                                    get(this.props.teams.find(team=>team._id === game.competitors[1]._id), 'name')
                                                                                } 
                                                                            </span>                                                    
                                                                        </td>
                                                                        <td>
                                                                            <div style={{
                                                                            width:'17px', 
                                                                            height: '17px', 
                                                                            backgroundColor: game.isGameOver && 
                                                                            this.state.picks.find(pick=>pick.pickId === game.competitors[1]._id && pick.userId === leader.id && game.competitors[1].score > game.competitors[0].score) ? '#009933' : 
                                                                            game.isGameOver && 
                                                                            this.state.picks.find(pick=>pick.pickId === game.competitors[1]._id && pick.userId === leader.id && game.competitors[1].score <= game.competitors[0].score) ? 'red' : 
                                                                            moment() > moment(game.startDateTime) && 
                                                                            this.state.picks.find(pick=>pick.pickId === game.competitors[1]._id && pick.userId === leader.id) ? 'lightblue' : ''}}/>
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    }
                                                </div>
                                            </Collapse>
                                        }
                                    </div>
                                ))}
                                </List>
                                <Divider />
                            </div>
                        </Slide>
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
    const games = get(leaderDomain, 'gameList', []);
    const picks = get(leaderDomain, 'pickList', []);

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');

    const requestStorageJson = localStorage.getItem('request');
    const requestStorage = JSON.parse(requestStorageJson);

    const leagues = get(lookup, 'leagues', []);
    const leagueId = get(request, 'leagueId') ? get(request, 'leagueId') : get(requestStorage, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const weekNo = get(request, 'beginDateTime') ? undefined : get(request, 'weekNo') || get(currentWeek,'weekNo');
    const seasonType = get(request, 'beginDateTime') ? undefined : get(request, 'seasonType') || get(currentWeek, 'seasonType');
    const beginDateTime = get(request, 'beginDateTime') || get(currentWeek, 'beginDateTime');
    const endDateTime = get(request, 'endDateTime') || get(currentWeek, 'endDateTime');
    
    const teamDomain = state.get('teamDomain').toJS();
    const teams = get(teamDomain, 'teams', []);
    
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    return {
        isAuthenticated,
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
        beginDateTime,
        endDateTime,
        games,
        teams,
        picks
    }
};

LeaderPage.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
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
    beginDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    games: PropTypes.array,
    picks: PropTypes.array,
    teams: PropTypes.array,
    loadLeaders: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadLeaders
})(LeaderPage);