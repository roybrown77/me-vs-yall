import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import ReactGA from 'react-ga';

import get from 'lodash/get';
import last from 'lodash/last';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Skeleton from '@material-ui/lab/Skeleton';

import VolumeUpOutlinedIcon from '@material-ui/icons/VolumeUpOutlined';
import VolumeOffOutlinedIcon from '@material-ui/icons/VolumeOffOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ToggleOn from '@material-ui/icons/ToggleOn';
import ToggleOff from '@material-ui/icons/ToggleOff';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Box from '@material-ui/core/Box';

import PageContainer from '../PageContainer';
import GameSearchBar from '../../components/GameSearchBar';
import Countdown from '../../components/Countdown';
import Popover from '../../components/Popover';

import gold from '../../styles/images/gold.png';
import silver from '../../styles/images/silver.png';
import bronze from '../../styles/images/bronze.png';

import ice from '../../styles/images/ice.png';
import money from '../../styles/images/smile-sweat.png';

import {Howl, Howler} from 'howler';
import boastyM4a from './boasty.m4a';
import boastyWebm from './boasty.webm';

import { googleLogin } from '../../middleware/authenticationClient';
import { loadLeaders } from '../../actions';
import { 
    formatWeeks, 
    getCurrentWeek, 
    getAreAllGamesOver,
    getAreAnyGamesInProgress,
    getLeagueStartDateTime,
    getImage,
    getLeaders
} from '../../utilities';

import {createBrowserHistory} from 'history';
const history = createBrowserHistory({forceRefresh: false});

Howler.volume(1);

const boasty = new Howl({
  src: [boastyM4a, boastyWebm],
  format: ['m4a', 'webm']
});

const styles = theme => ({
  root: {
    width: '100%',
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
    backgroundColor: '#ffffff'
  },
  userName: {
    padding: '10px',
    textAlign: 'left',
    wordBreak: 'break-all',
    width: '100%'
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
    objectFit: 'cover'
  },
  userDefaultPictureContainer: {
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    backgroundColor: '#3772FA',
    color: '#fff',
    fontSize: '1.5rem',
    objectFit: 'cover',
    margin: 'auto'
  },
  button: {
    backgroundColor: '#3772FA',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    },
    borderRadius: 0,
    color: '#FFFFFF',
    fontSize: '1.5rem',
    fontWeight: "700",
    lineHeight: '2.75',
    marginBottom: '10px',
    padding: '0',
    width: '75%',
    '-webkit-box-shadow': '-8px 8px 0px 0px black',
    '-moz-box-shadow': '-8px 8px 0px 0px blackk',
    boxShadow: '-8px 8px 0px 0px black'
  },
  soundButton: {
    color: '#000'
  },
  toggleButtonOn: {
    color: 'black'
  },
  toggleButtonOff: {
    color: 'gray'
  }
});

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
        >
        {value === index && (
            <Box sx={{ p: 3, padding: 0 }}>
            {children}
            </Box>
        )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const VegasWinCalculation = (props) => {
    const { leader, title='', showInfo=false } = props;

    if (!showInfo) {
        return (
            <div style={{color: leader.positiveWinnings ? '#009933' : 'red', textDecoration:'underline', fontWeight: '700'}}>
                {`${title}${leader.vegasWinnings}`}
            </div>
        );
    }

    return (
        <Popover 
            title={`${title}${leader.vegasWinnings}`}
            titleStyle={{color: leader.positiveWinnings ? '#009933' : 'red', textDecoration:'underline', fontWeight: '700'}}
        >
            <div style={{padding:'16px'}}>
                <div>${(leader.wins + leader.losses) * 110} initial bets = {leader.wins + leader.losses} bets x $110</div>
                <div style={{paddingTop:'16px'}}>{leader.positiveWinnings ? '$' : '-$'}{Math.abs(leader.wins * 100 - leader.losses * 110)} profit = {leader.wins} wins x $100 - {leader.losses} losses x $110</div>
                <div style={{paddingTop:'16px'}}>${leader.wins * 100 + leader.wins * 110} payout = initial bets + profit</div>
                <div style={{paddingTop:'16px', fontStyle: 'italic'}}>Wins are determined against the spread</div>
            </div>
        </Popover>
    );
};

class Leader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            soundOn: false,
            tabValue: localStorage.getItem('tabValue') === '1' ? 1 : 0,
            spreadModeToggle: localStorage.getItem('spreadModeToggle', '0') === '1' ? '1' : '0'
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        ReactGA.ga('send', 'pageview', '/leaders/' + urlLeague.name);

        this.props.loadLeaders({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            gameType: this.state.tabValue,
            loading: true
        });

        this.startPolling(this.state.tabValue);
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
        // console.log('stop timerID: ' + this.timerID);
    }

    startPolling = (tabValue) => {
        this.timerID = setInterval(
            () => this.poll(tabValue),
            15000
        );
        // console.log('start timerID: ' + this.timerID);
    }

    poll = (tabValue) => {
        // console.log('running timerID: ' + this.timerID + ' ' + (new Date()).toLocaleTimeString());

        const leagueName = window.location.pathname.split('/')[2];
        const leagueFound = this.props.leagues.find(x=>x.name === leagueName);

        if (!leagueFound) {
            this.resetPoll();
            return;
        }
        
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);

        if (!areAnyGamesInProgress) return;

        if (this.props.weeks.findIndex(x=>x._id === this.props.weekId)+1 < this.props.weeks.length) return;

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: this.props.beginDateTime,
            endDateTime: this.props.endDateTime,
            weekId: this.props.weekId,
            gameType: tabValue,
            loading: false
        });
    }

    handleFilterLeague = (event, league) => {
        if (get(this.props, 'leagues', []).length === 0) {
            return;
        }

        const leagueFound = this.props.leagues.find(x=>x.id===league.props.value);
        const years = get(leagueFound,'years',[]);
        const year = last(years);

        ReactGA.ga('send', 'pageview', '/leaders/' + leagueFound.name);

        history.push('/leaders/' + leagueFound.name);

        this.props.loadLeaders({
            leagueId: leagueFound.id,
            year,
            gameType: this.state.tabValue,
            loading: true
        });
    }

    handleFilterYear = (event, year) => {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const yearFound = this.props.years.find(x=>x===parseInt(year.props.value));

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: yearFound,
            gameType: this.state.tabValue,
            loading: true
        });
    }
  
    handleFilterWeek = (event, week) => {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const weekFound = this.props.weeks[week.props.value];

        this.props.loadLeaders({
            leagueId: this.props.leagueId,
            year: this.props.year,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime,
            weekId: weekFound._id,
            gameType: this.state.tabValue,
            loading: true
        });
    }

    handleToggleSound = () => {
        if (!this.state.soundOn) { boasty.play(); } else { boasty.stop(); };

        this.setState((state) => ({
            soundOn: !state.soundOn
        }));
    }

    handleTabChange = (event, newValue) => {
        clearInterval(this.timerID);
        // console.log('stop timerID: ' + this.timerID);

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);
        
        this.props.loadLeaders({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            gameType: newValue,
            loading: true
        });

        localStorage.setItem('tabValue', newValue);
        this.setState({tabValue: newValue});
        this.startPolling(newValue);
    };

    handleSpreadToggle = () => {
        clearInterval(this.timerID);
        
        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);
        
        this.props.loadLeaders({
            leagueId: urlLeagueId,
            year: urlLeagueId !== this.props.leagueId ? undefined : this.props.year,
            beginDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.beginDateTime,
            endDateTime: urlLeagueId !== this.props.leagueId ? undefined : this.props.endDateTime,
            weekId: urlLeagueId !== this.props.leagueId ? undefined : this.props.weekId,
            gameType: "0",
            loading: true
        });

        localStorage.setItem('spreadModeToggle', this.state.spreadModeToggle === '0' ? '1' : '0');
        this.setState((state) => ({
            spreadModeToggle: state.spreadModeToggle === '0' ? '1' : '0'
        }));
        this.startPolling(this.state.spreadModeToggle === '0' ? '1' : '0');
    }

    render() {
        const { 
            classes, 
            leaders, 
            games, 
            isAuthenticated,
            dataLoading,
            weeks = [],
            weekId,
            leagueId,
            isRollup,
            spreadMode
        } = this.props;

        const {soundOn} = this.state;

        const currentWeek = weeks.find(x=>x._id === weekId);
        const areAnyGamesInProgress = getAreAnyGamesInProgress(this.props.games);
        const areAllGamesOver = getAreAllGamesOver(games);
        const timeUntilNextGameStarts = getLeagueStartDateTime(leagueId, games);
        const image = getImage(leagueId);

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
                        !isAuthenticated && 
                        <Button
                            variant="contained" 
                            className={classNames(classes.button)}
                            onClick={() => googleLogin()}>
                          Play For Free
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
                        areAnyGamesInProgress &&
                        <div style={{color: 'deeppink', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid deeppink'}}>
                            <div className='fast-flash'>** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'fights' : 'games'} in progress **</div>
                        </div>
                    }
                    {
                        false &&
                        !get(currentWeek,'prize') &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid lightgreen', borderRadius: '8px', cursor: 'pointer'}}>
                            <div style={{color: 'darkgreen', fontSize: '17px'}}>player with the most correct wins bragging rights!</div>
                        </div>
                    }
                    {
                        false &&
                        <div style={{margin: '4px 14%', padding: '4px', border: '4px solid blue', cursor: 'pointer'}}>
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
                        false &&
                        isAuthenticated &&
                        areAllGamesOver &&
                        <div style={{color: 'darkviolet', fontSize: '17px', margin:'4px 10%', padding: '4px', border: '4px solid darkviolet', borderRadius: '8px'}}>
                            ** {['59723313734d1d6202a85f25','59723313734d1d6202a85f27'].includes(leagueId) ? 'tap fighter before match starts' : 'tap team before game starts'} **
                        </div>
                    }
                    {
                        false &&
                        <div style={{color: '#1e90ff', fontSize: '17px', margin:'4px 17%', padding: '4px', border: '4px solid #1e90ff'}}>
                            ** invite your friends.  it's fun beating them.  :D **
                        </div>
                    }
                    {
                        false &&
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
                    }
                    <div onClick={this.handleSpreadToggle} style={{marginTop:'25px', padding: '10px', marginLeft: 'auto', textAlign:'right',backgroundColor:'#fff', width: '40px'}}>
                        <div style={{fontSize:'9px'}}>
                            vs Spread
                        </div>
                        <div><IconButton className={this.state.spreadModeToggle === '1' ? classes.toggleButtonOn : classes.toggleButtonOff} aria-label="spreadModeToggle">
                            {this.state.spreadModeToggle === '1' ? <ToggleOn/> : <ToggleOff/>}
                        </IconButton></div>
                    </div>
                    {
                        <Box sx={{
                            position: "relative",
                            zIndex: "2",
                            backgroundColor: "white"
                            }}>
                            <Box sx={{ 
                                borderBottom: 1, 
                                borderColor: 'divider', 
                                position: "relative",
                                zIndex: "3",
                                backgroundColor: "white"
                            }}>
                                <Tabs value={this.state.tabValue} onChange={this.handleTabChange}  aria-label="game types" style={{
                                    paddingBottom: "20px",
                                    width: 'fit-content', 
                                    margin: 'auto',
                                }}>
                                <Tab label="Straight Up" {...a11yProps(0)} />
                                <Tab label="Spread Mode $" {...a11yProps(1)} />
                                </Tabs>
                            </Box>
                            <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={250}>
                                <div className={classes.root}>
                                    {
                                        !areAnyGamesInProgress &&
                                        dataLoading &&
                                        <div style={{margin: '10px 0'}}>
                                            <Skeleton style={{margin: '10px 0 0 0'}} animation="pulse" height='5em' variant="rectangular"/>
                                            <Skeleton style={{margin: '10px 0 0 0'}} animation="pulse" height='5em' variant="rectangular"/>
                                            <Skeleton style={{margin: '10px 0 0 0'}} animation="pulse" height='5em' variant="rectangular"/>
                                        </div>
                                    }
                                    {
                                        !(!areAnyGamesInProgress &&
                                        dataLoading) &&
                                        leaders.map((leader, index) => (
                                            <div className={classes.container} key={leader.id}>
                                                <Accordion style={{borderRadius:'8px', boxShadow:'none'}}>
                                                    <AccordionSummary className={classes.expansionSummary} expandIcon={<ExpandMoreIcon />}>
                                                        <div style={{display: 'flex', width: '75%'}}>
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
                                                            {
                                                                leader.picture &&
                                                                <div style={{margin:'auto'}}>
                                                                    <img className={classes.userPicture} src={leader.picture} alt=""/>
                                                                </div>
                                                            }
                                                            {
                                                                !leader.picture &&
                                                                <div className={classes.userDefaultPictureContainer}>
                                                                    <div style={{margin: '7px 0'}}>{leader.userName[0]}</div>
                                                                </div>
                                                            }
                                                            <div className={classes.userName}>{leader.userName}</div>
                                                            {
                                                                true &&
                                                                <div style={{display:'flex', margin: 'auto'}}>
                                                                    <div><img style={{width:'30px'}} src={leader.winsInARow > leader.lossesInARow ? money : ice} alt=""/></div>
                                                                    <div style={{fontWeight: '700'}}><span style={{margin: '3px 0'}}>x</span><span>{leader.winsInARow || leader.lossesInARow}</span></div>
                                                                </div>
                                                            }
                                                        </div>
                                                        <div style={{textAlign:'right', margin: 'auto 0 auto auto', width: '25%'}}>
                                                            {
                                                                areAnyGamesInProgress &&
                                                                <div style={{color:'gray'}}>{leader.winsBeforeGameOver} - {leader.lossesBeforeGameOver}</div>
                                                            }
                                                            {spreadMode && <VegasWinCalculation {...{leader}} />}
                                                            <div>{leader.percentage}</div>
                                                            <div>{leader.wins} - {leader.losses}</div>
                                                        </div>
                                                    </AccordionSummary>
                                                    <AccordionDetails className={classes.expansionPanelDetails}>
                                                        <div style={{margin: '12px auto'}}>
                                                            {
                                                                spreadMode &&
                                                                <VegasWinCalculation {...{title: 'in Vegas you would have won: ', leader, showInfo: true}} />
                                                            }
                                                            {
                                                                <table style={{
                                                                    width:"100%", 
                                                                    backgroundColor: '#fff'}}>
                                                                {
                                                                    !isRollup &&
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
                                                    </AccordionDetails>
                                                </Accordion>
                                            </div>
                                        ))
                                    }
                                </div>
                            </Slide>
                        </Box>
                    }
                    {
                        false &&
                        image &&
                        !(dataLoading) &&
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
    const ui = state.get('ui').toJS();
    const weeksDomain = state.get('weeksDomain').toJS();
    const authenticationDomain = state.get('authenticationDomain').toJS();

    const dataLoading = get(leaderDomain, 'dataLoading', true);
    const games = get(leaderDomain, 'gameList', []);
    const pickList = get(leaderDomain, 'pickList', []);
    const userList = get(leaderDomain, 'userList', []);
    const teamList = get(leaderDomain, 'teamList', []);
    const isRollup = get(leaderDomain, 'isRollup', false);
    const leagueId = get(leaderDomain, 'leagueId');

    const spreadMode = localStorage.getItem('tabValue') === '1' || localStorage.getItem('spreadModeToggle') === '1';
    
    const leaders = getLeaders(games, pickList, userList, teamList, isRollup, spreadMode);
    
    const request = get(ui,'request');

    const leagues = get(lookup, 'leagues', []);
    const league = leagues.find(x=>x.id === leagueId);

    const years = get(league, 'years',[]);
    const year = get(request, 'year') || last(years);

    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);
    const weeks = formatWeeks(rawWeeks);
    const currentWeek = getCurrentWeek(weeks);
    const beginDateTime = get(request, 'beginDateTime') || get(currentWeek, 'beginDateTime');
    const endDateTime = get(request, 'endDateTime') || get(currentWeek, 'endDateTime');
    
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    const weekId = get(request,'weekId') || get(currentWeek,'_id');
    
    return {
        isAuthenticated,
        dataLoading,
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
        isRollup,
        spreadMode
    }
};

Leader.propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    dataLoading: PropTypes.bool,
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
    spreadMode: PropTypes.bool
};

export default connect(mapStateToProps, {
  loadLeaders,
})(withStyles(styles, { withTheme: true })(Leader));
