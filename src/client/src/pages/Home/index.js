import React, { Component } from 'react';
import { Route, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import mvy from '../../styles/images/mvy.png';
import fattMatt from '../../styles/images/fatt-matt.jpg';
import hudsonGrille from '../../styles/images/hudson-grille.jpg';
import lsu from '../../styles/images/lsu.jpg';

import Countdown from '../../components/Countdown';
import Popover from '../../components/Popover';
import { loadGamesInProgress } from '../../actions';
import { googleLogin } from '../../middleware/authenticationService';
import { getAreAnyGamesInProgress, getLeagueStartDateTime} from '../../utilities';

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
    margin: '40px 0'
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
    marginBottom: '8px',
    width: '100%',
    backgroundColor: '#3772FA',
    color: '#FFFFFF',
    maxWidth: '325px',
    borderColor: '#3772FA',
    '&:hover': {
      backgroundColor: '#3772FA',
      color: '#FFFFFF',
      borderColor: '#3772FA',
    }
  }
};

const instructions = [
  '1. Tap "Press To Play".',
  '2. Tap teams you think will win this week.',
  '3. View Leaders to see if you won.',
  '4. Enjoy your favorite meal and dance, dance, dance. :D'
];

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
      const {isAuthenticated, games} = this.props;

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
        <div className="fade-in">
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
             <Popover 
                borderStyle={{margin: '8px auto', maxWidth: '100px', padding: '16px', backgroundColor: '#fff', cursor: 'pointer'}}
                titleStyle={{fontWeight: 'bold'}}
                title={'How To Play'}>
                {
                    <div style={{padding:'16px'}}>
                      {
                        instructions.map((instruction,instructionIndex)=>{
                          return (
                              <div key={instructionIndex}>{instruction}</div>
                          );
                        })
                      }
                    </div>
                }
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
            {
               false &&
               <Grid item xs={8} style={styles.buttonBorder}>
                <Route render={({ history }) => (
                    <Button 
                        variant="outlined" 
                        style={{...styles.button}} onClick={() => { history.push('/play') }}>
                        PLAY
                    </Button>
                )}/>
              </Grid>
            }
            <Grid>
              <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                <Grid item xs={8} style={styles.buttonBorder}>
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
                false &&
                <Grid item xs={8} style={styles.buttonBorder}>
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
          <div style={{backgroundColor: 'lightgray', padding: '20px', fontFamily: 'Poppins, sans serif'}}>
            <img style={{width:'90%'}} src={lsu} alt=""/>
            <div style={{fontSize: '10px'}}>Image via LSU Sports Information</div>
            <div><svg width="62" height="43" xmlns="http://www.w3.org/2000/svg"><path d="M5.266 38.877c1.452.833 2.918.32 4.32.057 3.251-.615 6.476-1.387 9.728-1.987 1.096-.202 2.252-.155 3.367-.08.612.04 1.158.465 1.187 1.158.036.836-.586 1.398-1.296 1.371-5.507-.205-10.51 2.352-15.828 3.104-3.789.535-5.922-1.198-5.838-4.952.128-5.752 2.184-11.108 4.47-16.369.324-.743.922-1.304 1.878-.977 1.07.366 1.137 1.213.858 2.1-.754 2.389-1.6 4.752-2.35 7.143-.408 1.3-.841 2.617-.706 4.01.861.305 1.095-.384 1.43-.82 5.204-6.806 10.957-13.122 17.665-18.508C33.95 6.26 44.6.39 57.591.488c.606.006 1.228-.073 1.816.027 1.083.184 2.082.601 1.887 1.95-.19 1.322-1.2 1.623-2.346 1.467-13.31-1.817-24 3.952-33.929 12.042-7.941 6.47-14.268 14.264-19.753 22.903" fill="#EF1F6B" fillRule="evenodd"></path></svg></div>
            <div>let's go!</div>
          </div>
          <div style={{backgroundColor: '#EFFD57', padding: '20px', fontFamily: 'Poppins, sans serif'}}>
            <img style={{width:'90%'}} src={fattMatt} alt=""/>
            <div><svg width="140" height="66" xmlns="http://www.w3.org/2000/svg"><path d="M10.692 47.094c3.37.344 6.433-.973 9.608-1.25 1.078-.095 2.146-.284 3.223-.377 1.191-.103 1.843.552 2.072 1.66.258 1.244-.51 2.07-1.53 2.113-5.775.24-11.136 2.5-16.777 3.302-2.94.419-3.684-.71-3.997-3.596-.499-4.593-1.358-9.145-2.067-13.715-.091-.584-.177-1.17-.29-1.75-.285-1.443-.37-3.06 1.36-3.382 1.826-.338 2.112 1.28 2.332 2.72.477 3.115 1.004 6.223 1.52 9.332.126.762.01 1.748.851 2.076.907.353 1.376-.547 1.898-1.106 7.39-7.923 15.274-15.341 23.214-22.702 7.77-7.2 16.175-13.48 25.872-17.914 7.638-3.493 13.675-1.117 16.949 6.7 2.094 4.995 2.338 10.347 3.15 15.59 1.323 8.558 1.889 17.267 5.096 25.445.467 1.191 1 2.358 1.534 3.521 3.65 7.959 7.393 9.738 16.007 7.533 5.842-1.496 10.797-4.764 15.65-8.147 5.823-4.06 11.487-8.323 15.536-14.334 1.165-1.73 2.191-3.495 2.796-5.508.368-1.224.808-2.487 2.305-2.815.765-.167 1.383.123 1.74.803.735 1.402.254 2.683-.498 3.901-3.01 4.872-6.267 9.557-10.84 13.123-7.532 5.878-15.065 11.767-24.077 15.324-3.663 1.446-7.506 1.594-11.356 1.41-4.647-.221-7.422-2.842-9.248-7.048-4.26-9.809-5.878-20.186-7.173-30.67-.591-4.787-.992-9.625-2.557-14.235C70.21 4.89 65.773 2.861 57.732 6.074c-7.512 3.002-13.979 7.679-20.018 12.922-9.073 7.876-17.6 16.324-25.42 25.458-.597.698-1.481 1.324-1.602 2.64" fill="#EF1F6B" fillRule="evenodd"></path></svg></div>
            <div>1811 Piedmont Ave NE, Atlanta, GA</div>
            <div>Best bbq & live blues in town! Pic taken at 9 am before the line wraps around the block. :D</div>
            <div>Spot the sticker?</div>
          </div>
          <div style={{backgroundColor: '#fff', padding: '20px', fontFamily: 'Poppins, sans serif'}}>
            <img style={{width:'90%'}} src={hudsonGrille} alt=""/>
            <div><svg width="78" height="129" xmlns="http://www.w3.org/2000/svg"><path d="M19.413 8.217c1.886 2.814 2.161 6.136 3.406 9.07.423.996.757 2.028 1.18 3.023.469 1.1 1.354 1.368 2.439 1.05 1.22-.357 1.587-1.423 1.147-2.343-2.498-5.212-3.02-11.007-4.96-16.363C21.614-.14 20.268-.266 17.573.812c-4.289 1.716-8.712 3.095-13.08 4.615-.558.193-1.116.393-1.682.565C1.404 6.417-.064 7.102.465 8.78c.558 1.77 2.122 1.263 3.496.782 2.974-1.042 5.965-2.036 8.953-3.04.732-.246 1.549-.812 2.232-.223.738.636.164 1.472-.085 2.195C11.535 18.74 8.686 29.183 5.915 39.65c-2.71 10.242-4.309 20.611-3.67 31.255.5 8.384 5.432 12.598 13.871 11.82 5.394-.497 10.234-2.794 15.244-4.539 8.178-2.849 16.133-6.438 24.86-7.446 1.27-.147 2.551-.223 3.829-.298 8.741-.513 12.068 1.956 14.166 10.597 1.421 5.86.862 11.769.153 17.643-.85 7.047-1.956 14.05-5.362 20.447-.981 1.84-2.058 3.575-3.55 5.054-.909.9-1.816 1.881-1.404 3.357.212.753.758 1.163 1.526 1.16 1.583-.01 2.488-1.036 3.21-2.273 2.89-4.944 5.497-10.019 6.499-15.731 1.653-9.41 3.316-18.826 2.226-28.453-.442-3.914-2.116-7.376-4.086-10.689-2.377-3.999-5.993-5.219-10.565-4.857-10.66.844-20.583 4.288-30.448 8.066-4.503 1.725-8.963 3.643-13.768 4.425-8.555 1.394-12.43-1.57-13.367-10.179-.877-8.042.216-15.947 2.01-23.742 2.695-11.708 6.15-23.203 10.545-34.395.336-.855.473-1.93 1.579-2.654" fill="#EF1F6B" fillRule="evenodd"></path></svg></div>
            <div>4046 Peachtree Rd NE, Atlanta, GA</div>
            <div>Great place for wings, football, mma and boxing!</div>
            <div>Spot the sticker?</div>
          </div>
          <div style={{backgroundColor: '#3772FA', color: '#fff', padding: '16px', fontSize: '14px', fontfontFamily: 'Poppins, sans serif'}}>
            <div style={styles.footerLinks}>
              <div>
                <div><Link style={styles.link} to={'/about'}>About</Link></div>
                <div><Link style={styles.link} to={'/shop'}>Shop</Link></div>
              </div>
              <div style={{paddingLeft:'50px'}}>
                <div><Link style={styles.link} to={'/tips'}>Tips</Link></div>
                <div><Link style={styles.link} to={'/statoftheweek'}>Stat of the Week</Link></div>
              </div>
            </div>
            <div>© 2019 Me vs Yall. All rights reserved.</div>
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
