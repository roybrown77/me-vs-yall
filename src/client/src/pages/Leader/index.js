import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import get from 'lodash/get';
import last from 'lodash/last';
import sample from 'lodash/sample';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import ListItemText from '@material-ui/core/ListItemText';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import LinearProgress from '@material-ui/core/LinearProgress';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';

import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import PageContainer from '../PageContainer';
import GameSearchBar from '../../components/GameSearchBar';
import Countdown from '../../components/Countdown';
import Popover from '../../components/Popover';

import gold from '../../styles/images/gold.png';
import silver from '../../styles/images/silver.png';
import bronze from '../../styles/images/bronze.png';

import {Howl, Howler} from 'howler';
import boastyM4a from './boasty.m4a';
import boastyWebm from './boasty.webm';

import { googleLogin } from '../../middleware/authenticationService';
import { loadLeaders } from '../../actions';
import { 
    formatWeeks, 
    getCurrentWeek, 
    getAreAllGamesOver,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
    getImage
} from '../../utilities';

Howler.volume(1);

const boastySound = new Howl({
  src: [boastyM4a, boastyWebm],
  format: ['m4a', 'webm']
});

const boasty = sample([boastySound, boastySound]);

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
  googleLogin: {
    width: '250px',
    '&:hover': {
      cursor: 'pointer'
    }
  },
  container: {
    backgroundColor: '#ffffff',
    padding: '4px'
  },
  userName: {
    padding: '10px',
    textAlign: 'left'
  },
  expansionSummary: {
    borderBottom: '1px solid rgba(0, 0, 0, 0.12)',
    padding: '0 12px'
  },
  expansionPanelDetails: {
    padding: '8px'
  },
  userPicture: {
    height: '50px',
    width: '50px',
    borderRadius: '8px',
  },
  userDefaultPicture: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: '#3772FA',
    color: '#fff',
    fontSize: '1.5rem'
  },
  button: {
    fontSize: '1rem',
    fontWeight: "700",
    marginBottom: '4px',
    width: '75%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  soundButton: {
    color: '#000'
  }
});                                            

class Leader extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.startPolling = this.startPolling.bind(this);
        this.handleToggleSound = this.handleToggleSound.bind(this);

        this.state = {
            soundOn: false
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        this.startPolling();

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        this.props.loadLeaders({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            isRollup: urlLeagueId !== this.props.leagueId ? undefined : this.props.isRollup
        });
    }

    componentWillUnmount() {
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }
    }

    componentDidUpdate(prevProps) {
      if (this.props.leagueId !== prevProps.leagueId || 
        this.props.year !== prevProps.year || 
        this.props.weekId !== prevProps.weekId) {
        this.resetPoll();
      }
    }

    startPolling() {
        let self = this;
        self._timer = setInterval(self.poll.bind(self), 15000);
    }

    resetPoll() {
        let self = this;
        
        if (this._timer) {
          clearInterval(this._timer);
          this._timer = null;
        }

        self._timer = setInterval(self.poll.bind(self), 15000);
    }

    poll() {
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        if (!areAnyGamesInProgress) return;

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime,
            weekId: this.props.weekId,
            isRollup: this.props.isRollup
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

        const weekFound = this.props.weeks[week.key];

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime,
            weekId: weekFound._id,
            isRollup: weekFound.isRollup
        });
    }

    handleToggleSound() {
        if (!this.state.soundOn) { boasty.play(); } else { boasty.stop(); };

        this.setState((state) => ({
            soundOn: !state.soundOn
        }));
    }

    render() {
        const { 
            classes, 
            leaders, 
            games, 
            isAuthenticated,
            dataLoading,
            weeksDataLoading,
            weeks = [],
            weekId,
            leagueId
        } = this.props;

        const {soundOn} = this.state;

        const currentWeek = weeks.find(x=>x._id === weekId);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
        const image = getImage('leaders',leagueId);

        return (
            <div>
                <PageContainer>
                    {
                        <GameSearchBar 
                            leagueId={leagueId}
                            leagues={this.props.leagues}
                            year={this.props.year}
                            years={this.props.years}
                            weekId={this.props.weekId}
                            weeks={this.props.weeks}
                            beginDateTime={this.props.beginDateTime}
                            endDateTime={this.props.endDateTime}
                            onFilterLeague={this.handleFilterLeague}
                            onFilterYear={this.handleFilterYear}
                            onFilterWeek={this.handleFilterWeek}
                            onFilterDate={this.handleFilterDate}
                        />
                    }
                    {
                        <div style={{height: '8px'}}>
                            {
                                (dataLoading || weeksDataLoading) &&
                                <LinearProgress />
                            }
                        </div>
                    }
                    {
                        !isAuthenticated && 
                        <Button
                            variant="contained" 
                            className={classNames(classes.button)}
                            disabled={dataLoading || weeksDataLoading} 
                            onClick={() => googleLogin()}>
                          Press to Play
                        </Button>
                    }
                    {
                        !areAllGamesOver &&
                        !areAnyGamesInProgress &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid deeppink'}}>
                            <div style={{color: 'deeppink', fontSize: '17px'}}>next {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fight' : 'game'} starts in</div>
                            <Countdown date={timeUntilNextGameStarts}/>
                        </div>
                    }
                    {
                        areAllGamesOver &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid deeppink'}}>
                            <div style={{color: 'deeppink', fontSize: '17px'}}>new {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fights' : 'games'} load in</div>
                            <Countdown date={timeUntilNextGameStarts}/>
                        </div>
                    }
                    {
                        areAnyGamesInProgress &&
                        <div style={{color: 'deeppink', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid deeppink', borderRadius: '8px'}}>
                            <div className='fast-flash'>** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fights' : 'games'} in progress **</div>
                        </div>
                    }
                    {
                        !get(currentWeek,'prize') &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid lightgreen', borderRadius: '8px', cursor: 'pointer'}}>
                            <div style={{color: 'darkgreen', fontSize: '17px'}}>player with the most correct wins bragging rights!</div>
                        </div>
                    }
                    {
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid blue', borderRadius: '8px', cursor: 'pointer'}}>
                            <div style={{color: 'blue', fontSize: '17px'}}>watch your name rise and fall as scores change.  builds drama. :D</div>
                        </div>
                    }
                    {
                        get(currentWeek,'prize') &&
                        <Popover 
                            borderStyle={{margin: '4px 14%', border: '4px solid lightgreen', borderRadius: '8px', cursor: 'pointer'}}
                            titleStyle={{color: 'darkgreen', fontSize: '17px', borderBottom:'3px solid lightgreen', padding: '4px'}}
                            subTitleStyle={{color: 'darkgreen', fontSize: '17px', borderTop:'3px solid lightgreen', padding: '4px'}}
                            title={'player with the most correct wins!'}
                            subTitle={'tap to view rules.'}
                            segments={get(currentWeek,'prizes')}
                        >
                            {
                                <div style={{padding:'16px'}}>
                                    <div style={{paddingBottom: '12px'}}>{get(currentWeek,'prize.message')}</div>
                                    {get(currentWeek,'prize.rules',[]).map((rule,ruleIndex)=>{
                                        return (
                                            <div key={ruleIndex}>{rule}</div>
                                        );
                                    })}
                                </div>
                            }
                        </Popover>
                    }
                    {
                        !isAuthenticated &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** sign in then tap {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fighter' : 'team'} **
                        </div>
                    }
                    {
                        isAuthenticated &&
                        areAllGamesOver &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 10%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'tap fighter before match starts' : 'tap team before game starts'} **
                        </div>
                    }
                    <div style={{
                            justifyContent: 'center',
                            display:'flex', 
                            fontSize: '17px', 
                            fontFamily: 'monospace', 
                            fontWeight: 'bold'}}>
                        <div style={{margin:'auto 0'}}>boasty when u win</div>
                        <IconButton className={classes.soundButton} aria-label="sound" onClick={this.handleToggleSound}>
                            {soundOn ? <VolumeUpOutlinedIcon/> : <VolumeOffOutlinedIcon/>}
                        </IconButton>
                    </div>
                    {
                        leaders.length > 0 && 
                        <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={250}>
                            <div className={classes.root}>
                                <div style={{backgroundColor:'white',padding:'4px'}}>
                                {
                                    leaders.map((leader, index) => (
                                        <div className={classes.container} key={leader.id}>
                                            <ExpansionPanel style={{borderRadius:'8px', boxShadow:'none'}}>
                                                <ExpansionPanelSummary className={classes.expansionSummary} expandIcon={<ExpandMoreIcon />}>
                                                    {
                                                        [1,2,3].includes(index+1) &&
                                                        <div style={{margin: 'auto 10px auto 0'}}>
                                                            <img style={{width:'40px'}}src={index+1 === 1 ? gold : index+1 === 2 ? silver : bronze} alt=""/>
                                                        </div>
                                                    }
                                                    {
                                                        ![1,2,3].includes(index+1) &&
                                                        <div style={{
                                                            margin: 'auto 10px auto 0',
                                                            color: index === 0 ? '#FFC107' : '#000', 
                                                            fontWeight: index === 0 ? '700' : '400'}}>
                                                            {index+1}
                                                        </div>
                                                    }
                                                    <ListItemText style={{width: '100%', margin:'auto 0'}}>
                                                        <div style={{display: 'flex'}}>
                                                            {
                                                                leader.picture &&
                                                                <img className={classes.userPicture} src={leader.picture} alt=""/>
                                                            }
                                                            {
                                                                !leader.picture &&
                                                                <div className={classes.userDefaultPicture}>
                                                                    <div style={{margin: '7px 0'}}>{leader.userName[0]}</div>
                                                                </div>
                                                            }
                                                            <div className={classes.userName}>{leader.userName}</div>
                                                        </div>
                                                    </ListItemText>
                                                    <div style={{textAlign:'right', margin: 'auto', width: '35%'}}>
                                                        {
                                                            areAnyGamesInProgress &&
                                                            <div style={{color:'gray'}}>{leader.winsBeforeGameOver} - {leader.lossesBeforeGameOver}</div>
                                                        }
                                                        <div>{leader.percentage}</div>
                                                        <div>{leader.wins} - {leader.losses}</div>
                                                    </div>
                                                </ExpansionPanelSummary>
                                                <ExpansionPanelDetails className={classes.expansionPanelDetails}>
                                                    <div style={{margin: '12px auto'}}>
                                                        <div style={{
                                                            fontWeight: '700',
                                                            color: leader.color}}>
                                                            in Vegas you would have won: {leader.vegasWinnings}
                                                        </div>
                                                        {
                                                            <table style={{
                                                                width:"100%", 
                                                                backgroundColor: '#fff'}}>
                                                            {
                                                                get(leader,'games',[]).map((game,gameIndex)=>{
                                                                    

                                                                    return (<tbody key={leader.id + '-' + game._id}>
                                                                        {
                                                                            game.isNewDate &&
                                                                            <tr>
                                                                                <td align="center">
                                                                                </td>
                                                                                <td align="center">
                                                                                </td>
                                                                                <td align="center">                                                                      
                                                                                    <div style={{margin:'12px 0',fontWeight:'600',color:'rgba(0, 0, 0, 0.87)'}}>{game.date}</div>                                                
                                                                                </td>
                                                                                <td align="center">
                                                                                </td>
                                                                                <td align="center">
                                                                                </td>
                                                                            </tr>
                                                                        }
                                                                        <tr>
                                                                            <td align="center">
                                                                                <div style={{
                                                                                width:'24px', 
                                                                                height: '24px', 
                                                                                backgroundColor: game.awayIndicator}}/>
                                                                            </td>
                                                                            {
                                                                                <td align="center">
                                                                                    <span>{game.awayScore}</span>
                                                                                </td>
                                                                            }
                                                                            <td align="center">                                                                      
                                                                                <span>
                                                                                    {game.awayTeam}
                                                                                </span>
                                                                                <span> vs </span>
                                                                                <span>
                                                                                    {game.homeTeam} 
                                                                                </span>                                                
                                                                            </td>
                                                                            {
                                                                                <td align="center">
                                                                                    <span>{game.homeScore}</span>
                                                                                </td>
                                                                            }
                                                                            <td align="center">
                                                                                <div style={{
                                                                                width:'24px', 
                                                                                height: '24px', 
                                                                                backgroundColor: game.homeIndicator}}/>
                                                                            </td>
                                                                        </tr>
                                                                    </tbody>)
                                                                })}
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
                    {
                        image &&
                        !(dataLoading || weeksDataLoading) &&
                        <div>
                            <img style={{width:'90%'}} src={image.picture} alt=""/>
                            <div style={{
                                color: 'gray',
                                fontSize: '10px'
                            }}>Image via {image.source}</div>
                        </div>
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
    const leaders = get(leaderDomain, 'leaderList', []);
    const leagueId = get(leaderDomain, 'leagueId');

    const ui = state.get('ui').toJS();
    const request = get(ui,'request');

    const leagues = get(lookup, 'leagues', []);
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const weeksDomain = state.get('weeksDomain').toJS();
    const weeksDataLoading = get(weeksDomain, 'dataLoading');
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const beginDateTime = get(request, 'beginDateTime') || get(currentWeek, 'beginDateTime');
    const endDateTime = get(request, 'endDateTime') || get(currentWeek, 'endDateTime');
    
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    const weekId = get(request,'weekId') || get(currentWeek,'_id');
    const isRollup = get(request,'isRollup') || get(currentWeek,'isRollup');
    
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
        weekId,
        beginDateTime,
        endDateTime,
        games,
        isRollup
    }
};

Leader.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    leaders: PropTypes.array,
    weeks: PropTypes.array,
    leagues: PropTypes.array,
    years: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    weekId: PropTypes.string,
    beginDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    games: PropTypes.array,
    picks: PropTypes.array,
    teams: PropTypes.array,
    loadLeaders: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
    isRollup: PropTypes.bool,
};

export default connect(mapStateToProps, {
  loadLeaders
})(withStyles(styles, { withTheme: true })(Leader));