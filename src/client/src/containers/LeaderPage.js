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
import Slide from '@material-ui/core/Slide';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';

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

const listStyles = {
  root: {
    marginTop: '12px',
    width: '100%',
    backgroundColor: '#fff'
  },
};

const cardStyles = {
  card: {
    display: 'flex',
    marginBottom: '12px',
    height: '100px'
  },
  details: {
    width: '33%',
    display: 'flex',
    flexDirection: 'column',
  },
  content: {
    flex: '1 0 auto',
  },
  cover: {
    width: 151,
    height: 151,
  },
  controls: {
    display: 'flex',
    alignItems: 'center'
  },
  playIcon: {
    height: 38,
    width: 38,
  },
};

class LeaderPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            open: false,
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

    handleClickOpen = (leader) => {
        console.log(JSON.stringify(leader));
        this.setState({ open: true });
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
                        <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={250}>
                            <div style={listStyles.root}>
                                <List>
                                {
                                    this.props.leaders.map((leader, index) => (
                                    <div>
                                        <ListItem key={leader.id} onClick={() => this.handleClickOpen(leader)} button>
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
                                        {this.props.leaders.length-1 !== index && 
                                        <Divider />}
                                    </div>
                                ))}
                                </List>
                            </div>
                        </Slide>
                    }
                    {
                        false && 
                        this.props.leaders.length > 0 && 
                        (!(this.props.weeksDataLoading || this.props.dataLoading)) &&
                        <Grow in={true} timeout={500}>
                            <div style={{marginTop: '12px'}}>
                                {
                                    this.props.leaders.map((leader, index) => (
                                    <Card 
                                    key={leader.id} 
                                    style={cardStyles.card}
                                    onClick={() => this.handleClickOpen(leader)}
                                    >
                                      <div style={cardStyles.details}>
                                        <CardContent style={cardStyles.content}>
                                          <Typography variant="headline">{leader.userName}</Typography>
                                        </CardContent>
                                      </div>
                                      <div style={cardStyles.details}>
                                        <CardContent style={cardStyles.content}>
                                            <Typography variant="headline">{leader.wins} - {leader.losses} - {leader.ties}</Typography>
                                        </CardContent>
                                      </div>
                                      <div style={cardStyles.details}>
                                        <CardContent style={cardStyles.content}>
                                            <Typography variant="headline">{((getWinnings(leader) || 0) < 0 ? '-' : '') + formatMoney(getWinnings(leader))}</Typography>
                                        </CardContent>
                                      </div>
                                    </Card>
                                ))}
                            </div>
                        </Grow>
                    }
                    {
                        false && 
                        this.props.leaders.length > 0 && 
                        (!(this.props.weeksDataLoading || this.props.dataLoading)) &&
                        <Grow in={true} timeout={500}>
                            <div style={{marginTop: '12px'}}>
                                <table style={{width:"100%", backgroundColor: '#fff', padding: '12px'}}>
                                    <tbody>
                                        {
                                            this.props.leaders.map((leader, index) => (
                                            <tr key={leader.id} 
                                            style={{paddingBottom:"16px"}}
                                            onClick={() => this.handleClickOpen(leader)}>
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

    const weekNo = get(request, 'date') ? undefined : get(request, 'weekNo') ? get(request, 'weekNo') : get(currentWeek,'weekNo');
    
    const seasonType = get(request, 'date') ? undefined : get(request, 'seasonType') ? get(request, 'seasonType') : get(currentWeek, 'seasonType');
    
    const date = get(request, 'date') ? get(request, 'date') : get(currentWeek, 'date');
    
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