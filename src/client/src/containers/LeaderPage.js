import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import moment from 'moment-timezone';

import PageContainer from './PageContainer';
import GameSearchBar from '../components/GameSearchBar';
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

import { googleLogin } from '../middleware/authenticationService';
import { loadLeaders } from '../actions';
import { 
    formatWeeks, 
    formatMoney, 
    getWinnings, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getTimeUntilNextGamesLoad,
    getLeaders,
    getIsCurrentWeek,
    getVegasPicks,
    getVegasUser,
    getAreAnyGamesInProgress } from '../selectors';

const styles = theme => ({
  root: {
    width: '100%',
    paddingTop: '4px',
    paddingBottom: '12px'
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
  button: {
    fontSize: '1rem',
    fontWeight: "700",
    marginBottom: '4px',
    width: '75%',
    backgroundColor: '#FFC107',
    color: '#F7F8E0',
    borderColor: '#FFC107',
    '&:hover': {
      backgroundColor: '#FFC107',
      color: '#F7F8E0',
      borderColor: '#FFC107',
    },
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '4px'
  },
  userName: {
    textAlign: 'left'
  },
  expansionSummary: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)'
  }
});

const getIndicator = (game,picks,leader,index1,index2) => {
    return game.isGameOver && ((game.competitors[index1].score === game.competitors[index2].score && 
            picks.find(pick=>pick.pickId === '000000000000000000000000' && pick.userId === leader.id && pick.gameId === game._id)) || 
            (game.competitors[index1].score > game.competitors[index2].score && 
            picks.find(pick=>(pick.pickId === game.competitors[index1]._id || pick.pickId === '000000000000000000000000') 
                && pick.userId === leader.id && pick.gameId === game._id))) ? '#009933' : 

            game.isGameOver && ((game.competitors[index1].score === game.competitors[index2].score && 
            picks.find(pick=>pick.pickId === game.competitors[index1]._id && pick.userId === leader.id && pick.gameId === game._id)) || 
            (game.isGameOver && game.competitors[index1].score < game.competitors[index2].score && 
            picks.find(pick=>(pick.pickId === game.competitors[index1]._id || pick.pickId === '000000000000000000000000') 
                && pick.userId === leader.id && pick.gameId === game._id))) ? 'red' : 

            moment() > moment(game.startDateTime) && 
            picks.find(pick=>((pick.pickId === game.competitors[index1]._id) || pick.pickId === '000000000000000000000000') && 
                pick.userId === leader.id && pick.gameId === game._id) ? 'lightblue' : '';
}

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
    }

    componentDidMount() {
        this.startPolling();

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

    componentWillUnmount() {
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }
    }

    startPolling() {
        let self = this;
        setTimeout(function() {
            self._timer = setInterval(self.poll.bind(self), 15000);
        }, 1000);
    }

    poll() {
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        if (!areAnyGamesInProgress) return;

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
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
        const { 
            classes, 
            teams, 
            leaders, 
            games, 
            picks, 
            isAuthenticated,
            isCurrentWeek 
        } = this.props;

        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const timeUntilNextGamesLoad = getTimeUntilNextGamesLoad(games);

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
                        <Button 
                            variant="contained" 
                            className={classes.button} onClick={() => googleLogin()}>
                            Log in to Play!
                        </Button>
                    }
                    {
                        games.find(x=>x.isGameOver !== true) &&
                        !areAnyGamesInProgress &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div style={{color: 'darkorange', fontSize: '17px'}}>live play starts in</div>
                            <Countdown date={get(games.sort((a, b) => new Date(a.startDateTime) - new Date(b.startDateTime)).find(x=>x.isGameOver !== true),'startDateTime')}/>
                        </div>
                    }
                    {
                        areAllGamesOver &&
                        isCurrentWeek &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div style={{color: 'darkorange', fontSize: '17px'}}>next games load in</div>
                            <Countdown date={timeUntilNextGamesLoad}/>
                        </div>
                    }
                    <div style={{margin: '4px 14%', padding: '4px', border: '4px solid lightgreen', borderRadius: '8px'}}>
                        <div style={{color: 'darkgreen', fontSize: '17px'}}>player with the most wins without tying and gets 2 folks to join wins <b>$50</b></div>
                    </div>
                    {
                        areAnyGamesInProgress &&
                        <div style={{color: 'darkorange', fontSize: '17px', margin:'4px 20%', padding: '4px', border: '4px solid darkorange', borderRadius: '8px'}}>
                            <div className='fast-flash'>** games in progress **</div>
                            <div>auto update: on</div>
                        </div>
                    }
                    {
                        leaders.length > 0 && 
                        <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={250}>
                            <div className={classes.root}>
                                <div style={{backgroundColor:'white',padding:'4px'}}>
                                {
                                    leaders.map((leader, index) => (
                                        <div className={classes.container} key={leader.id}>
                                            <ExpansionPanel style={{borderRadius:'8px'}}>
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
                                                    <ListItemText style={{width: '50%', margin:'auto 0'}}><div className={classes.userName}>{leader.userName}</div></ListItemText>
                                                    <div style={{textAlign:'right', margin: 'auto', width: '25%'}}>
                                                        <div>{leader.wins + leader.losses > 0 ? parseInt((leader.wins/(leader.wins + leader.losses)) * 100) + '%' : ''}</div>
                                                        <div>{leader.wins} - {leader.losses}</div>
                                                    </div>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails>
                                                    <div style={{margin: '12px auto'}}>
                                                        <div style={{marginBottom: '12px', color: (getWinnings(leader) || 0) < 0 ? 'red' : '#009933', fontWeight: '700'}}>
                                                            Vegas possible winnings: {((getWinnings(leader) || 0) < 0 ? '-' : '') + formatMoney(getWinnings(leader))}
                                                        </div>
                                                        {
                                                            <table style={{width:"100%", backgroundColor: '#fff'}}>
                                                                <tbody>
                                                                    {games.map((game)=>(
                                                                        <tr key={leader.id + '-' + game._id}>
                                                                            <td align="center">
                                                                                <div style={{
                                                                                width:'24px', 
                                                                                height: '24px', 
                                                                                backgroundColor: getIndicator(game,picks,leader,0,1)}}/>
                                                                            </td>
                                                                            {
                                                                                <td align="center">
                                                                                    <span>{hasGameStarted(game.startDateTime) ? get(game,'competitors.0.score',0) : undefined}</span>
                                                                                </td>
                                                                            }
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
                                                                            {
                                                                                <td align="center">
                                                                                    <span>{hasGameStarted(game.startDateTime) ? get(game,'competitors.1.score',0) : undefined}</span>
                                                                                </td>
                                                                            }
                                                                            <td align="center">
                                                                                <div style={{
                                                                                width:'24px', 
                                                                                height: '24px', 
                                                                                backgroundColor: getIndicator(game,picks,leader,1,0)}}/>
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
    const games = get(leaderDomain, 'gameList', []);
    const pickList = get(leaderDomain, 'pickList', []);
    const userList = get(leaderDomain, 'userList', []);

    const picks = [...pickList, ...getVegasPicks(games)];
    const users = [...userList, getVegasUser()];

    const leaders = getLeaders(games, picks, users);

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
    const isCurrentWeek = getIsCurrentWeek(weeks, beginDateTime, endDateTime, weekNo);

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
        picks,
        isCurrentWeek
    }
};

LeaderPage.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    leaders: PropTypes.array,
    weeks: PropTypes.array,
    isCurrentWeek: PropTypes.bool,
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