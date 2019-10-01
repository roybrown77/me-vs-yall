import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import mvy from '../../styles/images/mvy.png';

import Countdown from '../../components/Countdown';

import { loadGamesInProgress } from '../../actions';

import { 
    getAreAnyGamesInProgress,
    getLeagueStartDateTime
} from '../../utilities';

const styles = {
  plainTitle: {
    color: 'transparent', 
    backgroundColor: '#000000',
    fontSize: '2rem', 
    fontStyle: 'italic',
    fontWeight: '700',
    margin: '16px auto',
    padding: '8px',
    width: '50%'
  },
  subTitle: {
    color: '#000000',
    margin: '8px 8px',
    fontFamily: 'Poppins, sans serif',
    fontSize: '2rem',
    fontWeight: 'bold !important',
    letterSpacing: '-1px',
    lineHeight: '1.1'
  },
  buttonContainer: {
    padding: '0 8px',
    margin: '40px 0 16px 0'
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: '5px solid black'
  },
  ballsContainer: {
    position:'relative', 
    height: '24px'
  },
  inProgress: {
    width:'12px', 
    height: '12px', 
    position: 'absolute',
    right: '8px',
    bottom: '8px'
  },
  footer: {
    fontWeight: '500',
    width: '100%',
    marginTop: '7em',
    fontSize: '11px'
  },
  spacer: {
    margin: '0 7px',
    border: '2px solid black'
  },
  countdown: {
    fontSize: '11px',
    color: 'black',
    marginTop: '4px'
  }
};

class Home extends Component {
    componentWillMount() {
        window.scrollTo(0, 0);
    }

    componentDidMount() {
        this.props.loadGamesInProgress();
    }

    gram = () => {
      window.location = "https://www.instagram.com/_mevsyall";
    };

    render() {
      const { 
            games
        } = this.props;

      const nflGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f10');
      const ncaafGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f15');
      const premierGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f17');
      const mlsGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f29');
      const nbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f19');
      const mlbGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f21');
      const xGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f23');
      const boxingMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f25');
      const mmaMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f27');

      const areAnyNflGamesInProgress = getAreAnyGamesInProgress(nflGames);
      const areAnyNCAAFGamesInProgress = getAreAnyGamesInProgress(ncaafGames);
      const areAnyPremierGamesInProgress = getAreAnyGamesInProgress(premierGames);
      const areAnyMlsGamesInProgress = getAreAnyGamesInProgress(mlsGames);
      const areAnyNbaGamesInProgress = getAreAnyGamesInProgress(nbaGames);
      const areAnyMlbGamesInProgress = getAreAnyGamesInProgress(mlbGames);
      const areAnyXGamesInProgress = getAreAnyGamesInProgress(xGames);
      const areAnyBoxingMatchesInProgress = getAreAnyGamesInProgress(boxingMatches);
      const areAnyMMAMatchesInProgress = getAreAnyGamesInProgress(mmaMatches);

      const nflStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f10', nflGames);
      const ncaafStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f15', ncaafGames);
      const premierStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f17', premierGames);
      const mlsStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f29', mlsGames);
      const nbaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f19', nbaGames);
      const mlbStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f21', mlbGames);
      const xStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f23', xGames);
      const boxingStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f25', boxingMatches);
      const mmaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f27', mmaMatches);

      return (
        <div className="fade-in home-page-container">
          {
              true &&
                <div style={{marginTop: '16px'}}>
                  <img style={{width:'275px'}} src={mvy} alt=""/>
                </div>
          }
          {
              true &&
                <div style={styles.subTitle}>
                  sports.  picks.  fun.  facts.  prizes.  free.
                </div>
          }
            <div style={styles.buttonContainer}>
              <Grid>
                <Grid item xs={8} style={{margin:'16px auto'}}>
                  <Route render={({ history }) => (
                      <Button 
                          variant="outlined" 
                          style={{...styles.button, color: '#D50A0A'}} onClick={() => { history.push('/scoreboards/nfl') }}>
                          <div>NFL</div>
                          {
                            areAnyNflGamesInProgress &&
                            <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#D50A0A'}}></div>
                          }
                      </Button>
                  )}/>
                  {nflStartDateTime && <Countdown styles={styles.countdown} date={nflStartDateTime}/>}
                </Grid>
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#EC8800'}} onClick={() => { history.push('/scoreboards/ncaaf') }}>
                            NCAAF
                            {
                              areAnyNCAAFGamesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#EC8800'}}></div>
                            }
                        </Button>
                    )}/>
                    {ncaafStartDateTime && <Countdown styles={styles.countdown} date={ncaafStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#3D195B'}} onClick={() => { history.push('/scoreboards/premier') }}>
                            PREMIER
                            {
                              areAnyPremierGamesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#3D195B'}}></div>
                            }
                        </Button>
                    )}/>
                    {premierStartDateTime && <Countdown styles={styles.countdown} date={premierStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#17408B'}} onClick={() => { history.push('/scoreboards/mls') }}>
                            MLS
                            {
                              areAnyMlsGamesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#17408B'}}></div>
                            }
                        </Button>
                    )}/>
                    {mlsStartDateTime && <Countdown styles={styles.countdown} date={mlsStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'BLACK'}} onClick={() => { history.push('/scoreboards/boxing') }}>
                            BOXING
                            {
                              areAnyBoxingMatchesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: 'BLACK'}}></div>
                            }
                        </Button>
                    )}/>
                    {boxingStartDateTime && <Countdown styles={styles.countdown} date={boxingStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'BLACK'}} onClick={() => { history.push('/scoreboards/mma') }}>
                            MMA
                            {
                              areAnyMMAMatchesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: 'BLACK'}}></div>
                            }
                        </Button>
                    )}/>
                    {mmaStartDateTime && <Countdown styles={styles.countdown} date={mmaStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba') }}>
                            NBA
                            {
                              areAnyNbaGamesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#17408B'}}></div>
                            }
                        </Button>
                    )}/>
                    {nbaStartDateTime && <Countdown styles={styles.countdown} date={nbaStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#E52A34'}} onClick={() => {}}>
                            X GAMES
                            {
                              areAnyXGamesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#E52A34'}}></div>
                            }
                        </Button>
                    )}/>
                    {xStartDateTime && <Countdown styles={styles.countdown} date={xStartDateTime}/>}
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'PURPLE'}} onClick={() => { history.push('/statoftheweek') }}>
                            STAT OF THE WEEK
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#1E90FF'}} onClick={() => { history.push('/tips') }}>
                            TIPS
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'coral'}} onClick={() => { history.push('/shop') }}>
                            SHOP
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  false &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'GREEN'}} onClick={() => { history.push('/news') }}>
                            NEWS
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  false &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'GRAY'}} onClick={() => { history.push('/random') }}>
                            RANDOM
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'LIGHTPURPLE'}} onClick={() => { history.push('/mailinglist') }}>
                            MAILING LIST
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'GREEN'}} onClick={() => { history.push('/contact') }}>
                            CONTACT
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#FF1493'}} onClick={() => this.gram()}>
                            GRAM
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  true &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                    <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: 'DARKBLUE'}} onClick={() => { history.push('/about') }}>
                            ABOUT
                        </Button>
                    )}/>
                  </Grid>
                }
                {
                  false &&
                  <Grid item xs={8} style={{margin:'16px auto'}}>
                      <Route render={({ history }) => (
                        <Button 
                            variant="outlined" 
                            style={{...styles.button, color: '#D50032'}} onClick={() => { history.push('/scoreboards/mlb') }}>
                            MLB
                            {
                              areAnyMlbGamesInProgress &&
                              <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#D50032'}}></div>
                            }
                        </Button>
                      )}/>
                    {!areAnyMlbGamesInProgress && <Countdown styles={styles.countdown} date={mlbStartDateTime}/>}
                  </Grid>
                }
              </Grid>
            </div>
        </div>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
    const homePageDomain = state.get('homePageDomain').toJS();
    const games = get(homePageDomain, 'games', []);

    return {
        games
    }
};

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    games: PropTypes.array,
    loadGamesInProgress: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadGamesInProgress
})(withStyles(styles, { withTheme: true })(Home));