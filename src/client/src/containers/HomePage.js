import React, { Component } from 'react';
import { Route } from 'react-router-dom';
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

import Countdown from '../components/Countdown';

import { loadGamesInProgress } from '../actions';

import { 
    formatWeeks, 
    getCurrentWeek, 
    hasGameStarted,
    getAreAllGamesOver,
    getTimeUntilNextGamesLoad,
    getGroupedGames,
    getAreAnyGamesInProgress,
    getStartDateTime
} from '../selectors';

const styles = {
  title: {
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
    padding: '8px',
    fontWeight: '500',
    margin: '16px 0'
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
    borderRadius: '8px',
    height: '100px'
  },
  ballsContainer: {
    position:'relative', 
    height: '24px'
  },
  emojiContainer: {
    height: '70px',
    position:'relative',
    margin: '40px 0'
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

      const areAnyNflGamesInProgress = getAreAnyGamesInProgress(nflGames);
      const areAnyPremierGamesInProgress = getAreAnyGamesInProgress(premierGames);
      const areAnyNbaGamesInProgress = getAreAnyGamesInProgress(nbaGames);

      const nflStartDateTime = getStartDateTime(nflGames);
      const premierStartDateTime = getStartDateTime(premierGames);
      const nbaStartDateTime = getStartDateTime(nbaGames);

      return (
        <div className="fade-in home-page-container">
          <div style={styles.title}>
            Me vs Yall
          </div>
          <div style={styles.subTitle}>
            pick winners every week against others around the world.
          </div>
          <div style={styles.buttonContainer}>
            <Grid container spacing={8}>
              <Grid item xs={6}>
                <Route render={({ history }) => (
                    <Button 
                        variant="outlined" 
                        style={{...styles.button, color: '#D50A0A'}} onClick={() => { history.push('/scoreboards/nfl') }}>
                        <div>National Football League</div>
                        {
                          areAnyNflGamesInProgress &&
                          <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#D50A0A'}}></div>
                        }
                    </Button>
                )}/>
                {nflStartDateTime && <Countdown styles={styles.countdown} date={nflStartDateTime}/>}
              </Grid>
              <Grid item xs={6}>
                <Route render={({ history }) => (
                    <Button 
                        variant="outlined" 
                        style={{...styles.button, color: '#3D195B'}} onClick={() => { history.push('/scoreboards/premier') }}>
                        Premier League Football
                        {
                          areAnyPremierGamesInProgress &&
                          <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#3D195B'}}></div>
                        }
                    </Button>
                )}/>
                {premierStartDateTime && <Countdown styles={styles.countdown} date={premierStartDateTime}/>}
              </Grid>
              <Grid item xs={6} style={{margin:'auto'}}>
                <Route render={({ history }) => (
                    <Button 
                        variant="outlined" 
                        style={{...styles.button, color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba') }}>
                        National Basketball Association
                        {
                          areAnyNbaGamesInProgress &&
                          <div className='fast-flash' style={{...styles.inProgress, backgroundColor: '#17408B'}}></div>
                        }
                    </Button>
                )}/>
                {nbaStartDateTime && <Countdown styles={styles.countdown} date={nbaStartDateTime}/>}
              </Grid>
            </Grid>
          </div>
          <Grid container spacing={4} item xs={12} justify="center">
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
          <div style={styles.emojiContainer}>
            <div style={{left: '77%', position: 'absolute'}}>
              <img src={confetti} alt=""/>
            </div>
          </div>
          {
            false &&
            <div style={styles.footer}>
              Houston<span style={styles.spacer}/>Boston<span style={styles.spacer}/>Atlanta<span style={styles.spacer}/>Earth<span style={styles.spacer}/>Milky Way
            </div>
          }
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