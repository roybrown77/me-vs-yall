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
import Countdown from '../components/Countdown';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Slide from '@material-ui/core/Slide';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import gold from '../styles/images/gold.png';
import silver from '../styles/images/silver.png';
import bronze from '../styles/images/bronze.png';

import { loadLeaders } from '../actions';
import { formatWeeks, formatMoney, getWinnings, getCurrentWeek, hasGameStarted } from '../selectors';

const styles = theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    margin: theme.spacing.unit,
    width: '75%',
    backgroundColor: '#FFC107',
    color: '#F7F8E0',
    borderColor: '#FFC107',
    '&:hover': {
      backgroundColor: '#F7F8E0',
      color: '#FFC107',
      borderColor: '#F7F8E0',
    },
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '8px',
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
  },
  userName: {
    textAlign: 'left'
  },
  expansionSummary: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  }
});

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
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

    handleFilterLeague(event, league) {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const leagueFound = this.props.leagues.find(x=>x.id===league.key);
        const years = get(leagueFound,'years',[]);
        const year = last(years);

        this.props.loadLeaders({
            leagueId: leagueFound.id,
            year
        });
    }

    handleFilterYear(event, year) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const yearFound = this.props.years.find(x=>x===parseInt(year.key));

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: yearFound
        });
    }
  
    handleFilterWeek(event, week) {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const weekFound = this.props.weeks[parseInt(week.key)];

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: weekFound.seasonType,
            weekNo: weekFound.weekNo,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime
        });
    }

    render() {
        const { classes, teams, leaders, games, picks, isAuthenticated, dataLoading, weeksDataLoading } = this.props;
        const areAnyGamesInProgress = games.some(x=>hasGameStarted(x.startDateTime) && !x.isGameOver);

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
                        !isAuthenticated && 
                        <div>
                            <Route render={({ history }) => (
                                <Button 
                                    variant="contained" 
                                    className={classes.button} onClick={() => { history.push('/login') }}>
                                    Press to Play!
                                </Button>
                            )}/>
                        </div>
                    }
                    {
                        isAuthenticated && 
                        <div style={{height:'8px'}}>
                        </div>
                    }
                    {
                        dataLoading && 
                        <LinearProgress/>
                    }
                    {
                        !(weeksDataLoading || dataLoading) && 
                        games.find(x=>x.isGameOver !== true) &&
                        !areAnyGamesInProgress &&
                        <div style={{margin:'8px 0'}}>
                            <div style={{color: 'darkorange', fontSize: '15px'}}>next game starts in</div>
                            <Countdown date={get(games.find(x=>x.isGameOver !== true),'startDateTime')}/>
                        </div>
                    }
                    {
                        !(weeksDataLoading || dataLoading) && 
                        areAnyGamesInProgress &&
                        <div className='fast-flash' style={{color: 'darkorange', marginBottom: '8px', fontSize: '15px'}}>
                            ** games in progress **
                        </div>
                    }
                    {
                        leaders.length > 0 && 
                        (!(weeksDataLoading || dataLoading)) &&
                        <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={250}>
                            <div className={classes.root}>
                                {
                                    leaders.map((leader, index) => (
                                        <div className={classes.container} key={leader.id}>
                                            <ExpansionPanel>
                                                <ExpansionPanelSummary className={classes.expansionSummary} expandIcon={<ExpandMoreIcon />}>
                                                    {
                                                        [1,2,3].includes(index+1) &&
                                                        <div>
                                                            <img src={index+1 === 1 ? gold : index+1 === 2 ? silver : bronze} alt=""/>
                                                        </div>
                                                    }
                                                    {
                                                        ![1,2,3].includes(index+1) &&
                                                        <div style={{
                                                            margin: 'auto 0',
                                                            color: index === 0 ? '#FFC107' : '#000', 
                                                            fontWeight: index === 0 ? '700' : '400'}}>
                                                            {index+1}
                                                        </div>
                                                    }
                                                    <ListItemText style={{margin:'auto 0'}}><div className={classes.userName}>{leader.userName}</div></ListItemText>
                                                    <div style={{textAlign:'right'}}>
                                                        <div>{leader.wins} - {leader.losses} - {leader.ties}</div>
                                                        <div style={{color:'#009933', fontWeight: '700'}}>
                                                            {((getWinnings(leader) || 0) < 0 ? '-' : '') + formatMoney(getWinnings(leader))}
                                                        </div>
                                                    </div>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                    <div style={{margin: '12px auto'}}>
                                                        {
                                                            <table style={{width:"100%", backgroundColor: '#fff'}}>
                                                                <tbody>
                                                                    {games.map((game)=>(
                                                                        <tr key={leader.id + '-' + game._id}>
                                                                            <td align="center">
                                                                                <div style={{
                                                                                width:'24px', 
                                                                                height: '24px', 
                                                                                backgroundColor: game.isGameOver && 
                                                                                picks.find(pick=>pick.pickId === game.competitors[0]._id && pick.userId === leader.id && game.competitors[0].score > game.competitors[1].score) ? '#009933' : 
                                                                                game.isGameOver && 
                                                                                picks.find(pick=>pick.pickId === game.competitors[0]._id && pick.userId === leader.id && game.competitors[0].score <= game.competitors[1].score) ? 'red' : 
                                                                                moment() > moment(game.startDateTime) && 
                                                                                picks.find(pick=>pick.pickId === game.competitors[0]._id && pick.userId === leader.id) ? 'lightblue' : ''}}/>
                                                                            </td>
                                                                            <td align="center">                                                                           
                                                                                <span>
                                                                                    {   
                                                                                        get(teams.find(team=>team._id === game.competitors[0]._id), 'name')
                                                                                    }
                                                                                </span>
                                                                                <span> vs </span>
                                                                                <span>
                                                                                    {   
                                                                                        get(teams.find(team=>team._id === game.competitors[1]._id), 'name')
                                                                                    } 
                                                                                </span>                                                    
                                                                            </td>
                                                                            <td align="center">
                                                                                <div style={{
                                                                                width:'24px', 
                                                                                height: '24px', 
                                                                                backgroundColor: game.isGameOver && 
                                                                                picks.find(pick=>pick.pickId === game.competitors[1]._id && pick.userId === leader.id && game.competitors[1].score > game.competitors[0].score) ? '#009933' : 
                                                                                game.isGameOver && 
                                                                                picks.find(pick=>pick.pickId === game.competitors[1]._id && pick.userId === leader.id && game.competitors[1].score <= game.competitors[0].score) ? 'red' : 
                                                                                moment() > moment(game.startDateTime) && 
                                                                                picks.find(pick=>pick.pickId === game.competitors[1]._id && pick.userId === leader.id) ? 'lightblue' : ''}}/>
                                                                            </td>
                                                                        </tr>
                                                                    ))}
                                                                </tbody>
                                                            </table>
                                                        }
                                                    </div>
                                                </ExpansionPanelDetails>
                                            </ExpansionPanel>
                                        </div>
                                    ))
                                }
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
    loadLeaders: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  loadLeaders
})(withStyles(styles, { withTheme: true })(LeaderPage));