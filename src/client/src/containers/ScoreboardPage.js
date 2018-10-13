import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Route }from 'react-router-dom';
import PropTypes from 'prop-types';

import get from 'lodash/get';
import last from 'lodash/last';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import PageContainer from './PageContainer';
import GameSearchBar from '../components/GameSearchBar';
import PickResult from '../components/PickResult';
import LinearProgress from '../components/LinearProgress';
import Games from '../components/Games';

import { loadScoreboard, addPick, updatePick } from '../actions';
import { formatWeeks, getCurrentWeek } from '../selectors';
import createHistory from 'history/createBrowserHistory';
const history = createHistory();

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    width: '75%',
    color: '#FFC107',
    borderColor: '#FFC107',
    '&:hover': {
      backgroundColor: '#F7F8E0',
      borderColor: '#FFC107',
    },
  },
  input: {
    display: 'none',
  },
});

class ScoreboardPage extends Component {
    constructor(props) {
        super(props);

        this.handleFilterLeague = this.handleFilterLeague.bind(this);
        this.handleFilterYear = this.handleFilterYear.bind(this);
        this.handleFilterWeek = this.handleFilterWeek.bind(this);
        this.handleMakePick = this.handleMakePick.bind(this);
    }

    componentDidMount() {
        if (this.props.weeksDataLoading || this.props.dataLoading) return;

        const { leagueName } = this.props.match.params;

        const urlLeague = this.props.leagues.find(x=>get(x,'name','').toLowerCase() === (leagueName || '').toLowerCase());
        const urlLeagueId = get(urlLeague,'id',this.props.leagueId);

        this.props.loadScoreboard({
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

        this.props.loadScoreboard({
            leagueId: leagueFound.id,
            year
        });
    }

    handleFilterYear(event, year) {
        if (get(this.props, 'years', []).length === 0) {
            return;
        }

        const yearFound = this.props.years.find(x=>x===parseInt(year.key));

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: yearFound
        });
    }
  
    handleFilterWeek(event, week) {
        if (get(this.props, 'weeks', []).length === 0) {
            return;
        }

        const weekFound = this.props.weeks[parseInt(week.key)];

        this.props.loadScoreboard({
            leagueId: this.props.leagueId,
            year: this.props.year,
            seasonType: weekFound.seasonType,
            weekNo: weekFound.weekNo,
            beginDateTime: weekFound.beginDateTime,
            endDateTime: weekFound.endDateTime
        });
    }

    handleMakePick(pick) {
        if (!this.props.isAuthenticated) return;

        const pickFound = this.props.picks.find(x=>x.gameId === pick.gameId);
        if (!!pickFound) {
            this.props.updatePick(get(pickFound,'_id'), pick);
        } else {
            this.props.addPick(pick);
        }
    }

    render() {
        const { classes } = this.props;
        const areAnyGamesOver = this.props.games.some(x=>!!x.isGameOver);

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
                        <div>
                            <Route render={({ history }) => (
                                <Button 
                                    variant="outlined" 
                                    color="secondary" 
                                    className={classes.button} onClick={() => { history.push('/login') }}>
                                    Press to Play!
                                </Button>
                            )}/>
                        </div>
                    }
                    {
                        this.props.isAuthenticated && this.props.dataLoading && 
                        <div style={{height:'8px'}}>
                        </div>
                    }
                    {
                        this.props.dataLoading && 
                        <LinearProgress/>
                    }
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && this.props.isAuthenticated && areAnyGamesOver && 
                        <div style={{margin:'8px 0'}}>
                            <PickResult games={this.props.games} picks={this.props.picks}/>
                        </div>
                    }
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && this.props.isAuthenticated && !areAnyGamesOver && 
                        <div style={{height:'8px'}}>
                        </div>
                    }
                    {
                        !(this.props.weeksDataLoading || this.props.dataLoading) && 
                        <div>
                            <Games
                                handleMakePick={this.handleMakePick} 
                                games={this.props.games} 
                                picks={this.props.picks}
                                teams={this.props.teams}
                                />
                        </div>
                    }
                </PageContainer>
            </div>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    const lookup = state.get('lookup').toJS();

    const scoreboardDomain = state.get('scoreboardDomain').toJS();
    const dataLoading = get(scoreboardDomain, 'dataLoading');
    const games = get(scoreboardDomain, 'games', []);
    const picks = get(scoreboardDomain, 'picks', []);

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
    const rawWeeks = get(weeksDomain,'gameWeeks', []).filter(x=>x.year===year);;
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
        dataLoading,
        weeksDataLoading,
        games,
        picks,
        weeks,
        leagues,
        years,
        leagueId,
        year,
        seasonType,
        weekNo,
        beginDateTime,
        endDateTime,
        teams,
        isAuthenticated
    }
};

ScoreboardPage.propTypes = {
    dataLoading: PropTypes.bool,
    weeksDataLoading: PropTypes.bool,
    games: PropTypes.array,
    picks: PropTypes.array,
    weeks: PropTypes.array,
    leagues: PropTypes.array,
    years: PropTypes.array,
    teams: PropTypes.array,
    leagueId: PropTypes.string,
    year: PropTypes.number,
    seasonType: PropTypes.number,
    weekNo: PropTypes.number,
    beginDateTime: PropTypes.string,
    endDateTime: PropTypes.string,
    isAuthenticated: PropTypes.bool.isRequired,
    loadScoreboard: PropTypes.func.isRequired,
    addPick: PropTypes.func.isRequired,
    updatePick: PropTypes.func.isRequired,
    classes: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, {
  loadScoreboard,
  addPick,
  updatePick
})(withStyles(styles, { withTheme: true })(ScoreboardPage));