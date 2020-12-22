import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {createBrowserHistory} from 'history';
import ReactGA from 'react-ga';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import mvy from '../../styles/images/mvy-balls-cut.png';
import rocket from '../../styles/images/rocket.png';

import baseball from '../../styles/images/baseball.png';
import football from '../../styles/images/football.png';
import soccer from '../../styles/images/soccer.png';
import basketball from '../../styles/images/basketball.png';
import boxing from '../../styles/images/boxing.png';
import mma from '../../styles/images/mma.png';

import Countdown from '../../components/Countdown';
import Popover from '../../components/Popover';
import { loadGamesInProgress } from '../../actions';
import { googleLogin } from '../../middleware/authenticationClient';
import { getAreAnyGamesInProgress, getLeagueStartDateTime, images, getRandomIntInclusive } from '../../utilities';
import {displayHomePageImages} from '../../config';
import hoodiesBw from '../../styles/images/mvy-hoodie-white-bw.jpg';
import shirts from '../../styles/images/mvy-tee-white-romey.jpg';
import shirtGray from '../../styles/images/mvy-tee-gray.jpg';

const history = createBrowserHistory({forceRefresh: true});

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
  buttonContainer: {
    margin: '0 0 32px 0'
  },
  buttonLeagueContainer: {
    maxWidth: '320px',
    fontSize: '24px',
    margin: '30px auto',
    fontWeight: 'bold'
  },
  buttonBorder: {
    maxWidth: '155px',
    margin: '10px auto',
    backgroundColor: "#fff",
    border: "1px solid lightgray"
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: 'none',
    padding: '10px'
  },
  inProgress: {
    width:'12px', 
    height: '100%', 
    position: 'absolute',
    right: '4px',
    bottom: '4px'
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
    fontSize: '14px',
    color: 'black',
    marginTop: '4px'
  },
  footerLinks: {
    paddingBottom:'20px',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  },
  loginButton: {
    fontSize: '1rem',
    fontWeight: "700",
    width: '95%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    maxWidth: '325px',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  },
  subTitle: {
    fontSize: '24px',
    margin: '16px auto',
    padding: '0 32px'
  },
  ball: {
    width: '70px'
  }
};

const instructions = [
  '1. Tap league below.',
  '2. Tap "Press To Play" to sign in.',
  '3. Tap teams you think will win this week.',
  '4. View Leaders to see if you won.',
  "5. No purchase necessary.  It's free yall."
];

class Home extends Component {
    componentDidMount() {
      ReactGA.ga('send', 'pageview', '/');
      window.scrollTo(0, 0);
      this.props.loadGamesInProgress();
    }

    gram = () => {
      window.location = "https://www.instagram.com/_mevsyall";
    };

    tube = () => {
      window.location = "https://www.youtube.com/channel/UC3BFY6ohNlayFkPVnlPKqww";
    };

    navigateTo = (route) => {
      history.push(route);
    };

    render() {
      const {isAuthenticated, games} = this.props;

      const nflGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f10');
      const ncaafGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f15');
      const premierGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f17');
      const nbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f19');
      const wnbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f37');
      const nba2kGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f35');
      const mlbGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f21');
      const xGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f23');
      const boxingMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f25');
      const mmaMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f27');
      const mlsGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f29');
      const womensCollegeBasketballGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f31');
      const mensCollegeBasketballGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f33');

      const areAnyNflGamesInProgress = getAreAnyGamesInProgress(nflGames);
      const areAnyNCAAFGamesInProgress = getAreAnyGamesInProgress(ncaafGames);
      const areAnyPremierGamesInProgress = getAreAnyGamesInProgress(premierGames);
      const areAnyNbaGamesInProgress = getAreAnyGamesInProgress(nbaGames);
      const areAnyWnbaGamesInProgress = getAreAnyGamesInProgress(wnbaGames);
      const areAnyNba2kGamesInProgress = getAreAnyGamesInProgress(nba2kGames);
      const areAnyMlbGamesInProgress = getAreAnyGamesInProgress(mlbGames);
      const areAnyXGamesInProgress = getAreAnyGamesInProgress(xGames);
      const areAnyBoxingMatchesInProgress = getAreAnyGamesInProgress(boxingMatches);
      const areAnyMMAMatchesInProgress = getAreAnyGamesInProgress(mmaMatches);
      const areAnyMlsGamesInProgress = getAreAnyGamesInProgress(mlsGames);
      const areAnyWomensCollegeBasketballGamesInProgress = getAreAnyGamesInProgress(womensCollegeBasketballGames);
      const areAnyMensCollegeBasketballGamesInProgress = getAreAnyGamesInProgress(mensCollegeBasketballGames);

      const nflStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f10', nflGames);
      const ncaafStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f15', ncaafGames);
      const premierStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f17', premierGames);
      const nbaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f19', nbaGames);
      const wnbaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f37', wnbaGames);
      const nba2kStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f35', nba2kGames);
      const mlbStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f21', mlbGames);
      const xStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f23', xGames);
      const boxingStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f25', boxingMatches);
      const mmaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f27', mmaMatches);
      const mlsStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f29', mlsGames);
      const womensCollegeBasketballStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f31', womensCollegeBasketballGames);
      const mensCollegeBasketballStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f33', mensCollegeBasketballGames);
      const image = images['59723313734d1d6202a85f15'][getRandomIntInclusive(2,3)];
      const videoUrl = `https://www.youtube.com/embed/k2KTcFctHyU?autoplay=1`

      return (
        <div style={{backgroundColor: 'rgb(255, 255, 255)', paddingBottom: '10px', fontFamily: 'monospace'}} className="fade-in">
          <img style={{width:'100%'}} src={hoodiesBw} alt=""/>
          <div style={styles.subTitle}>
            Feel the thrill of betting without risking a thing. {"🤩"}
          </div>
          <div>
            <Popover 
              borderStyle={{margin: '8px auto', maxWidth: '100px', padding: '16px', backgroundColor: '#000', color: '#fff', cursor: 'pointer', borderRadius: '10px'}}
              title={'How To Play'}>
              <div style={{padding:'16px'}}>
                {
                  instructions.map((instruction,instructionIndex)=>{
                    return (
                        <div key={instructionIndex}>{instruction}</div>
                    );
                  })
                }
              </div>
            </Popover>
          </div>
          <div style={styles.buttonLeagueContainer}>
            <div style={{display:'flex'}}>
              <div>
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '3rem', color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba') }}>
                      <div>
                        <div>
                          NBA
                          {
                            areAnyNbaGamesInProgress &&
                            <img style={styles.ball} src={basketball} alt=""/>
                          }
                        </div>
                        <div>
                          {nbaStartDateTime && <Countdown styles={{...styles.countdown}} date={nbaStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '1.75rem', color: '#3B7A57'}} onClick={() => { history.push('/scoreboards/boxing') }}>
                      <div>
                        <div>
                        BOXING
                        {
                          areAnyBoxingMatchesInProgress &&
                          <img style={styles.ball} src={boxing} alt=""/>
                        }
                        </div>
                        <div>
                          {boxingStartDateTime && <Countdown styles={{...styles.countdown}} date={boxingStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '3rem', color: '#FF7E00'}} onClick={() => { history.push('/scoreboards/mma') }}>
                      <div>
                        <div>
                        MMA
                        {
                          areAnyMMAMatchesInProgress &&
                          <img style={styles.ball} src={mma} alt=""/>
                        }
                        </div>
                        <div>
                          {mmaStartDateTime && <Countdown styles={{...styles.countdown}} date={mmaStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '1.5em', color: '#c83f49'}} onClick={() => { history.push('/scoreboards/wnba') }}>
                      <div>
                        <div>
                          WNBA
                          {
                            areAnyWnbaGamesInProgress &&
                            <img style={styles.ball} src={basketball} alt=""/>
                          }
                        </div>
                        <div>
                          {wnbaStartDateTime && <Countdown styles={{...styles.countdown}} date={wnbaStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                false &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '2rem', color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba2k') }}>
                      <div>
                        <div>
                        NBA 2K
                        {
                          areAnyNba2kGamesInProgress &&
                          <img style={styles.ball} src={basketball} alt=""/>
                        }
                        </div>
                        <div>
                          {nba2kStartDateTime && <Countdown styles={{...styles.countdown}} date={nba2kStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              </div>
              <div style={{marginLeft: '10px'}}>
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '3rem', color: '#D50A0A'}} onClick={() => { history.push('/scoreboards/nfl') }}>
                      <div>
                        <div>
                        NFL
                        {
                          areAnyNflGamesInProgress &&
                          <img style={{...styles.ball, width: '57px'}} src={football} alt=""/>
                        }
                        </div>
                        <div>
                          {nflStartDateTime && <Countdown styles={{...styles.countdown}} date={nflStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '1.25rem', color: 'dodgerblue'}} onClick={() => { history.push('/scoreboards/ncaaf') }}>
                      <div>
                        <div>
                        COLLEGE FOOTBALL
                        {
                          areAnyNCAAFGamesInProgress &&
                          <img style={{...styles.ball, width: '57px'}} src={football} alt=""/>
                        }
                        </div>
                        <div>
                          {ncaafStartDateTime && <Countdown styles={{...styles.countdown}} date={ncaafStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '1.5rem', color: '#3D195B'}} onClick={() => { history.push('/scoreboards/premier') }}>
                      <div>
                        <div>
                        PREMIER LEAGUE
                        {
                          areAnyPremierGamesInProgress &&
                          <img style={{...styles.ball, width: '65px'}} src={soccer} alt=""/>
                        }
                        </div>
                        <div>
                          {premierStartDateTime && <Countdown styles={{...styles.countdown}} date={premierStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '3rem', color: '#D50032'}} onClick={() => { history.push('/scoreboards/mlb') }}>
                      <div>
                        <div>
                        MLB
                        {
                          areAnyMlbGamesInProgress &&
                          <img style={{...styles.ball, width: '40px'}} src={baseball} alt=""/>
                        }
                        </div>
                        <div>
                          {mlbStartDateTime && <Countdown styles={{...styles.countdown}} date={mlbStartDateTime}/>}
                        </div>
                      </div>
                  </Button>
                </Grid>
              }
              </div>
            </div>
          </div>
          {false && <div>
            <img style={{width:'100%'}} src={shirtGray} alt=""/>
          </div>}
          {false && <div style={styles.subTitle}>
            Interested in following along?  Subscribe below for updates.
          </div>}
          <div>
            <img style={{width:'100%'}} src={shirts} alt=""/>
          </div>
          <div style={styles.subTitle}>
            About Us
          </div>
          <div style={styles.subTitle}>
            {"We built this web app to avoid keeping track of our weekly NFL picks in messages, spreadsheets or paper.  It grew into something fun we can play with other sports fanatics worldwide.  Enjoy!  :D"}
          </div>
          <div style={{backgroundColor: '#000', color: '#fff', padding: '16px', fontSize: '14px', position: 'relative', bottom: '-10px'}}>
            <div style={styles.footerLinks}>
              <div>
                <div><Link style={styles.link} to={'/tips'}>Tips</Link></div>
                <div><Link style={styles.link} to={'/shop'}>Shop</Link></div>
                <div><Link style={styles.link} to={'/play'}>Play</Link></div>
                {true && <div><Link style={styles.link} to={''} onClick={()=>this.tube()}>Tube</Link></div>}
              </div>
              <div style={{paddingLeft:'50px'}}>
                <div><Link style={styles.link} to={'/about'}>About</Link></div>
                <div><Link style={styles.link} to={'/contact'}>Contact</Link></div>
                <div><Link style={styles.link} to={'/oftheweek'}>#$%@ of the Week</Link></div>
                <div><Link style={styles.link} to={''} onClick={()=>this.gram()}>Gram</Link></div>
              </div>
            </div>
            <div>© 2020 Me vs Yall</div>
          </div>
        </div>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
    const homePageDomain = state.get('homePageDomain').toJS();
    const games = get(homePageDomain, 'games', []);
    const authenticationDomain = state.get('authenticationDomain').toJS();
    const isAuthenticated = get(authenticationDomain, 'isAuthenticated');

    return {
      isAuthenticated,
      games
    }
};

Home.propTypes = {
    classes: PropTypes.object.isRequired,
    games: PropTypes.array,
    loadGamesInProgress: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, {
  loadGamesInProgress
})(withStyles(styles, { withTheme: true })(Home));
