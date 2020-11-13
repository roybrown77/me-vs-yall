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
    fontFamily: 'monospace',
    margin: '30px auto',
    fontWeight: 'bold'
  },
  buttonBorder: {
    maxWidth: '155px',
    margin: '10px auto',
    backgroundColor: "#fff"
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
    fontFamily: 'monospace',
    margin: '16px auto',
    padding: '0 32px'
  },
  ball: {
    width: '70px'
  }
};

const instructions = [
  '1. Tap "Press To Play" to sign in.',
  '2. Tap league below.',
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
        <div className="fade-in">
          {false && <div style={{width:'100%', height: '50px', backgroundColor: 'dodgerblue'}}>
          </div>}
          {
            true &&
            <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
              <div style={{marginTop: '32px'}}>
                <img style={{width:'70%'}} src={mvy} alt=""/>
              </div>
            </Slide>
          }
          <div>
          <div style={styles.subTitle}>
            compete worldwide for rep
          </div>
          <div style={styles.subTitle}>
            streaming live game plays  <span><img style={{width:'20px'}} src={rocket} alt=""/></span>
          </div>
          <div style={{...styles.subTitle, margin: '30px auto', fontWeight:'bold'}}>
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
          {displayHomePageImages && <div>
            <img style={{width:'100%',maxWidth:'500px',marginTop:'30px'}} src={mma} alt=""/>
          </div>}
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
                      style={{...styles.button, fontSize: '2rem', color: '#3B7A57'}} onClick={() => { history.push('/scoreboards/boxing') }}>
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
                      style={{...styles.button, fontSize: '1.75em', color: '#c83f49'}} onClick={() => { history.push('/scoreboards/wnba') }}>
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
                      style={{...styles.button, fontSize: '1.5rem', color: 'dodgerblue'}} onClick={() => { history.push('/scoreboards/ncaaf') }}>
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
            {
              false &&
              <Grid item xs={8} style={styles.buttonBorder}>
                <Button 
                    variant="outlined" 
                    style={{...styles.button, fontSize: '1.75rem', color: '#5D8AA8'}} onClick={() => { history.push('/scoreboards/ncaaw') }}>
                    WOMENS COLLEGE BASKETBALL
                    {
                      areAnyWomensCollegeBasketballGamesInProgress &&
                      <img style={styles.ball} src={basketball} alt=""/>
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
                      <img style={styles.ball} src={basketball} alt=""/>
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
                      <img style={styles.ball} src={soccer} alt=""/>
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
                      <img style={styles.ball} src={basketball} alt=""/>
                    }
                </Button>
                {xStartDateTime && <Countdown styles={styles.countdown} date={xStartDateTime}/>}
              </Grid>
            }
          </div>
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
          {false && <div style={{marginTop:'40px'}}>
            <iframe style={{borderStyle:'none'}} width="320" height="215" title="Los D Baya" src={videoUrl}>
            </iframe>
          </div>}
          <div style={{backgroundColor: '#3772FA', color: '#fff', padding: '16px', fontSize: '14px', fontfontFamily: 'Poppins, sans serif', marginTop: '40px'}}>
            <div style={styles.footerLinks}>
              <div>
                <div><Link style={styles.link} to={'/tips'}>Tips</Link></div>
                <div><Link style={styles.link} to={'/shop'}>Shop</Link></div>
                <div><Link style={styles.link} to={'/play'}>Play</Link></div>
                {false && <div><Link style={styles.link} to={''} onClick={()=>this.tube()}>Tube</Link></div>}
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
