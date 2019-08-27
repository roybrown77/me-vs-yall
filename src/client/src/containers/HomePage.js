import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import confetti from '../styles/images/confetti.png';
import football from '../styles/images/football.png';
import soccer from '../styles/images/soccer2.png';
import tennis from '../styles/images/tennis.png';
import basketball from '../styles/images/basketball3.png';
import baseball from '../styles/images/baseball1.png';
import mvy from '../styles/images/mvy.png'

import Countdown from '../components/Countdown';

import { loadGamesInProgress } from '../actions';

import { 
    getAreAnyGamesInProgress,
    getLeagueStartDateTime
} from '../selectors';

const styles = {
  plainTitle: {
    color: '#f4f7f6', 
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
    fontSize: '1rem', 
    fontWeight: '500',
    margin: '8px 8px'
  },
  buttonContainer: {
    padding: '0 8px',
    margin: '16px 0'
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: '5px solid black',
    borderRadius: '8px'
  },
  ballsContainer: {
    position:'relative', 
    height: '24px'
  },
  emojiContainer: {
    height: '70px',
    position:'relative',
    margin: '24px 0'
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

class HomePage extends Component {
    componentDidMount() {
        this.props.loadGamesInProgress();
    }

    render() {
      const { 
            games
        } = this.props;

      const nflGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f10');
      const premierGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f17');
      const nbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f19');
      const mlbGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f21');

      const areAnyNflGamesInProgress = getAreAnyGamesInProgress(nflGames);
      const areAnyPremierGamesInProgress = getAreAnyGamesInProgress(premierGames);
      const areAnyNbaGamesInProgress = getAreAnyGamesInProgress(nbaGames);
      const areAnyMlbGamesInProgress = getAreAnyGamesInProgress(mlbGames);

      const nflStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f10', nflGames);
      const premierStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f17', premierGames);
      const nbaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f19', nbaGames);
      const mlbStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f21', mlbGames);

      return (
        <div className="fade-in home-page-container">
          {
              true &&
              <div style={{marginTop: '16px'}}>
                <img src={mvy} alt=""/>
              </div>
          }
          {
              true &&
              <div style={styles.subTitle}>
                sports.  fun.  facts.  prizes.
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
          <Grid container item xs={12} justify="center">
            <Grid item xs={2}>
              <img src={football} alt=""/>
            </Grid>
            <Grid item xs={2}>
              <img src={soccer} alt=""/>
            </Grid>
            <Grid item xs={2}>
              <img src={basketball} alt=""/>
            </Grid>
            <Grid item xs={2}>
              <img src={baseball} alt=""/>
            </Grid>
            <Grid item xs={2}>
              <img src={tennis} alt=""/>
            </Grid>
          </Grid>
          {
            false &&
            <div style={styles.subTitle}>
              <div style={styles.subTitle}>
                pick sports winners.
              </div>
              <div style={styles.subTitle}>
                every week.
              </div>
              <div style={styles.subTitle}>
                against others around the world.
              </div>
            </div>
          }
          {
            false &&
            <div style={styles.subTitle}>
              <div style={styles.subTitle}>
                promoting healthy betting habits via free play.
              </div>
            </div>
          }
          {
            true &&
            <div style={styles.emojiContainer}>
              <div style={{left: '77%', position: 'absolute'}}>
                <img src={confetti} alt=""/>
              </div>
            </div>
          }
          <div style={styles.subTitle}>
            <a style={{color:'#FF1493'}} href='https://www.instagram.com/mevsyallgames'>gram</a>
          </div>

          <div style={styles.subTitle}>
            <Link style={{color:'#1E90FF'}} to='/tips'>tips</Link>
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

HomePage.propTypes = {
    classes: PropTypes.object.isRequired,
    games: PropTypes.array,
    loadGamesInProgress: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {
  loadGamesInProgress
})(withStyles(styles, { withTheme: true })(HomePage));
