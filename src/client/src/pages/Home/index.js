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
import gram from '../../styles/images/gram.png';
import rocket from '../../styles/images/rocket.png';
import money from '../../styles/images/money.png';

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
  buttonBorder: {
    maxWidth: '325px',
    margin: '10px auto'
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: 'none'
  },
  ballsContainer: {
    position:'relative', 
    height: '24px'
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
    fontFamily: 'monospace',
    margin: '16px auto',
    padding: '0 32px'
  },
  ball: {
    width: '40px',
    marginLeft: '20px'
  }
};

const instructions = [
  '1. Tap "Press To Play".',
  '2. Tap teams you think will win this week.',
  '3. View Leaders to see if you won.',
  "4. No purchase necessary.  It's free yall."
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

    navigateTo = (route) => {
      history.push(route);
    };

    render() {
      const {isAuthenticated, games} = this.props;

      const nflGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f10');
      const ncaafGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f15');
      const premierGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f17');
      const nbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f19');
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
      const nba2kStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f35', nba2kGames);
      const mlbStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f21', mlbGames);
      const xStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f23', xGames);
      const boxingStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f25', boxingMatches);
      const mmaStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f27', mmaMatches);
      const mlsStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f29', mlsGames);
      const womensCollegeBasketballStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f31', womensCollegeBasketballGames);
      const mensCollegeBasketballStartDateTime = getLeagueStartDateTime('59723313734d1d6202a85f33', mensCollegeBasketballGames);
      const image = images['59723313734d1d6202a85f15'][getRandomIntInclusive(2,3)];

      return (
        <div className="fade-in">
          {
            true &&
            <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
              <div style={{marginTop: '32px'}}>
                <img style={{width:'275px'}} src={mvy} alt=""/>
              </div>
            </Slide>
          }
          <div>
          <div style={styles.subTitle}>
            pick your favorite sports teams for prizes  <span><img style={{width:'20px'}} src={money} alt=""/></span>
          </div>
          <div style={styles.subTitle}>
            streaming live game plays <span><img style={{width:'20px'}} src={rocket} alt=""/></span>
          </div>
          <div style={{...styles.subTitle, fontWeight:'bold'}}>
            {"it's free"}
          </div>
          <div style={{marginTop:'32px'}}>
            <Popover 
              borderStyle={{margin: '8px auto', maxWidth: '100px', padding: '16px', backgroundColor: '#fff', cursor: 'pointer'}}
              titleStyle={{fontWeight: 'bold'}}
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
            {
              !isAuthenticated && 
              <Button
                  variant="contained" 
                  style={styles.loginButton}
                  onClick={() => googleLogin()}>
                Press to Play
              </Button>
            }
          </div>
          <div style={styles.buttonContainer}>
            {
               false &&
               <Grid item xs={8} style={styles.buttonBorder}>
                <Button 
                    variant="outlined" 
                    style={{...styles.button}} 
                    onClick={() => {this.navigateTo('/play')}}>
                    PLAY
                </Button>
              </Grid>
            }
            <Grid>
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '4rem', color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba') }}>
                      NBA
                      {
                        areAnyNbaGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={basketball} alt=""/>
                      }
                  </Button>
                  {nbaStartDateTime && <Countdown styles={{...styles.countdown, marginTop: '-1.5rem'}} date={nbaStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '2.5rem', color: '#3B7A57'}} onClick={() => { history.push('/scoreboards/boxing') }}>
                      BOXING
                      {
                        areAnyBoxingMatchesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={boxing} alt=""/>
                      }
                  </Button>
                  {boxingStartDateTime && <Countdown styles={{...styles.countdown, marginTop: '-1rem'}} date={boxingStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '2rem', color: '#FF7E00'}} onClick={() => { history.push('/scoreboards/mma') }}>
                      MMA
                      {
                        areAnyMMAMatchesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={mma} alt=""/>
                      }
                  </Button>
                  {mmaStartDateTime && <Countdown styles={{...styles.countdown, marginTop: '-.5rem'}} date={mmaStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, color: '#17408B'}} onClick={() => { history.push('/scoreboards/nba2k') }}>
                      NBA 2K
                      {
                        areAnyNba2kGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={basketball} alt=""/>
                      }
                  </Button>
                  {nba2kStartDateTime && <Countdown styles={styles.countdown} date={nba2kStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '5rem', color: '#D50A0A'}} onClick={() => { history.push('/scoreboards/nfl') }}>
                      NFL
                      {
                        areAnyNflGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={football} alt=""/>
                      }
                  </Button>
                  {nflStartDateTime && <Countdown styles={{...styles.countdown, marginTop: '-2rem'}} date={nflStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '1.5rem', color: '#D3212D'}} onClick={() => { history.push('/scoreboards/ncaaf') }}>
                      COLLEGE FOOTBALL
                      {
                        areAnyNCAAFGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={football} alt=""/>
                      }
                  </Button>
                  {ncaafStartDateTime && <Countdown styles={styles.countdown} date={ncaafStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '1.25rem', color: '#3D195B'}} onClick={() => { history.push('/scoreboards/premier') }}>
                      PREMIER LEAGUE
                      {
                        areAnyPremierGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={soccer} alt=""/>
                      }
                  </Button>
                  {premierStartDateTime && <Countdown styles={styles.countdown} date={premierStartDateTime}/>}
                </Grid>
              }
              {
                true &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, fontSize: '4rem', color: '#D50032'}} onClick={() => { history.push('/scoreboards/mlb') }}>
                      MLB
                      {
                        areAnyMlbGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={baseball} alt=""/>
                      }
                  </Button>
                  {mlbStartDateTime && <Countdown styles={{...styles.countdown, marginTop: '-1.5rem'}} date={mlbStartDateTime}/>}
                </Grid>
              }
              {
                false &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, color: '#5D8AA8'}} onClick={() => { history.push('/scoreboards/ncaaw') }}>
                      WOMENS COLLEGE BASKETBALL
                      {
                        areAnyWomensCollegeBasketballGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={basketball} alt=""/>
                      }
                  </Button>
                  {womensCollegeBasketballStartDateTime && <Countdown styles={styles.countdown} date={womensCollegeBasketballStartDateTime}/>}
                </Grid>
              }
              {
                false &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, color: '#0048BA'}} onClick={() => { history.push('/scoreboards/ncaam') }}>
                      MENS COLLEGE BASKETBALL
                      {
                        areAnyMensCollegeBasketballGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={basketball} alt=""/>
                      }
                  </Button>
                  {mensCollegeBasketballStartDateTime && <Countdown styles={styles.countdown} date={mensCollegeBasketballStartDateTime}/>}
                </Grid>
              }
              {
                false &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, color: '#17408B'}} onClick={() => { history.push('/scoreboards/mls') }}>
                      MLS
                      {
                        areAnyMlsGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={soccer} alt=""/>
                      }
                  </Button>
                  {mlsStartDateTime && <Countdown styles={styles.countdown} date={mlsStartDateTime}/>}
                </Grid>
              }
              {
                false &&
                <Grid item xs={8} style={styles.buttonBorder}>
                  <Button 
                      variant="outlined" 
                      style={{...styles.button, color: '#E52A34'}} onClick={() => {}}>
                      X GAMES
                      {
                        areAnyXGamesInProgress &&
                        <img className='fast-flash' style={styles.ball} src={basketball} alt=""/>
                      }
                  </Button>
                  {xStartDateTime && <Countdown styles={styles.countdown} date={xStartDateTime}/>}
                </Grid>
              }
            </Grid>
          </div>
          {
            false &&
            <div style={{backgroundColor: 'lightgray', padding: '20px', fontFamily: 'Poppins, sans serif'}}>
              <img style={{width:'90%', maxWidth: '750px'}} src={image.picture} alt=""/>
              <div style={{fontSize: '10px'}}>Image via {image.source}</div>
              <div><svg width="62" height="43" xmlns="http://www.w3.org/2000/svg"><path d="M5.266 38.877c1.452.833 2.918.32 4.32.057 3.251-.615 6.476-1.387 9.728-1.987 1.096-.202 2.252-.155 3.367-.08.612.04 1.158.465 1.187 1.158.036.836-.586 1.398-1.296 1.371-5.507-.205-10.51 2.352-15.828 3.104-3.789.535-5.922-1.198-5.838-4.952.128-5.752 2.184-11.108 4.47-16.369.324-.743.922-1.304 1.878-.977 1.07.366 1.137 1.213.858 2.1-.754 2.389-1.6 4.752-2.35 7.143-.408 1.3-.841 2.617-.706 4.01.861.305 1.095-.384 1.43-.82 5.204-6.806 10.957-13.122 17.665-18.508C33.95 6.26 44.6.39 57.591.488c.606.006 1.228-.073 1.816.027 1.083.184 2.082.601 1.887 1.95-.19 1.322-1.2 1.623-2.346 1.467-13.31-1.817-24 3.952-33.929 12.042-7.941 6.47-14.268 14.264-19.753 22.903" fill="#EF1F6B" fillRule="evenodd"></path></svg></div>
              <div>let's go!</div>
            </div>
          }
          {
            false &&
            <div style={{backgroundColor: 'lightgray', padding: '20px', fontFamily: 'Poppins, sans serif'}}>
              <div>
                {`We rely on new users joining to keep cash prizes available and games free so we appreciate everyone you can invite to play.  The best way we've seen folks sign up is when you show them how since just telling them doesn't always work.  Thanks!`}
              </div>
            </div>
          }
          {
            false &&
            <div style={{backgroundColor: '#fff', padding: '20px', fontFamily: 'Poppins, sans serif'}}>
              <img style={{width:'90%', maxWidth: '750px'}} src={gram} alt=""/>
              <div style={{transform: 'scaleX(-1)'}}><svg width="62" height="43" xmlns="http://www.w3.org/2000/svg"><path d="M5.266 38.877c1.452.833 2.918.32 4.32.057 3.251-.615 6.476-1.387 9.728-1.987 1.096-.202 2.252-.155 3.367-.08.612.04 1.158.465 1.187 1.158.036.836-.586 1.398-1.296 1.371-5.507-.205-10.51 2.352-15.828 3.104-3.789.535-5.922-1.198-5.838-4.952.128-5.752 2.184-11.108 4.47-16.369.324-.743.922-1.304 1.878-.977 1.07.366 1.137 1.213.858 2.1-.754 2.389-1.6 4.752-2.35 7.143-.408 1.3-.841 2.617-.706 4.01.861.305 1.095-.384 1.43-.82 5.204-6.806 10.957-13.122 17.665-18.508C33.95 6.26 44.6.39 57.591.488c.606.006 1.228-.073 1.816.027 1.083.184 2.082.601 1.887 1.95-.19 1.322-1.2 1.623-2.346 1.467-13.31-1.817-24 3.952-33.929 12.042-7.941 6.47-14.268 14.264-19.753 22.903" fill="#EF1F6B" fillRule="evenodd"></path></svg></div> 
              <Grid item xs={8} style={styles.buttonBorder}>
                <Button 
                    variant="outlined" 
                    style={{...styles.button, border: '5px solid black', color: '#FF1493'}} onClick={() => this.gram()}>
                    GRAM
                </Button>
              </Grid>
            </div>
          }
          <div style={{backgroundColor: '#3772FA', color: '#fff', padding: '16px', fontSize: '14px', fontfontFamily: 'Poppins, sans serif'}}>
            <div style={styles.footerLinks}>
              <div>
                <div><Link style={styles.link} to={'/tips'}>Tips</Link></div>
                <div><Link style={styles.link} to={'/shop'}>Shop</Link></div>
                <div><Link style={styles.link} to={'/play'}>Play</Link></div>
              </div>
              <div style={{paddingLeft:'50px'}}>
                <div><Link style={styles.link} to={'/about'}>About</Link></div>
                <div><Link style={styles.link} to={'/oftheweek'}>#$%@ of the Week</Link></div>
                <div><Link style={styles.link} to={''} onClick={()=>this.gram()}>Gram</Link></div>
              </div>
            </div>
            <div>© 2020 Me vs Yall. All rights reserved.</div>
          </div>
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
