import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {createBrowserHistory} from 'history';
import ReactGA from 'react-ga';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';

import Popover from '../../components/Popover';
import { getHomePageImage, getAreAnyGamesInProgress } from '../../utilities';

const history = createBrowserHistory({forceRefresh: true});

const styles = {
  inProgress: {
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    position: 'absolute',
    margin: '20px 0 0 10px'
  },
  footerLinks: {
    padding:'20px',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none'
  }
};

const instructions = [
  '1. Tap league.',
  '2. Tap "Press To Play" to sign in.',
  '3. Tap teams you think will win this week.',
  '4. View Leaders to see if you won.',
  "5. No purchase necessary.  It's free yall.  :D"
];

class Home extends Component {
    componentDidMount() {
      ReactGA.ga('send', 'pageview', '/');
      window.scrollTo(0, 0);
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
      const {games} = this.props;

      const year = moment().format('YYYY');

      const nflGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f10');
      const ncaafGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f15');
      const premierGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f17');
      const nbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f19');
      const wnbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f37');
      const mlbGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f21');
      const boxingMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f25');
      const mmaMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f27');

      const areAnyNflGamesInProgress = getAreAnyGamesInProgress(nflGames);
      const areAnyNCAAFGamesInProgress = getAreAnyGamesInProgress(ncaafGames);
      const areAnyPremierGamesInProgress = getAreAnyGamesInProgress(premierGames);
      const areAnyNbaGamesInProgress = getAreAnyGamesInProgress(nbaGames);
      const areAnyWnbaGamesInProgress = getAreAnyGamesInProgress(wnbaGames);
      const areAnyMlbGamesInProgress = getAreAnyGamesInProgress(mlbGames);
      const areAnyBoxingMatchesInProgress = getAreAnyGamesInProgress(boxingMatches);
      const areAnyMMAMatchesInProgress = getAreAnyGamesInProgress(mmaMatches);

      return (
        <div style={{backgroundColor: 'rgb(255, 255, 255)', fontFamily: 'monospace'}} className="fade-in">
          <div style={{backgroundColor:"black", position: "absolute", width:"100%", height:"100%", opacity: ".9", zIndex:"1"}}>
          </div>
          <div style={{
            top: "10px",
            right: "10px", 
            position: "fixed",
            zIndex:"777"
          }}>
            <Popover 
              borderStyle={{maxWidth: '100px', padding: '16px', backgroundColor: '#000', color: '#fff', cursor: 'pointer', borderRadius: '10px'}}
              title={'How To Play'}>
              <div style={{padding:'16px'}}>
                <div style={{marginBottom:'16px'}}>To feel the thrill of betting without risking a thing:</div>
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
          <div style={{position: "absolute", width:"100%", height:"100%"}}>
            <img style={{width:'100%', height: "100%"}} src={getHomePageImage()} alt=""/>
          </div>
          <div style={{
            color: "white",
            padding: "16px",
            fontSize: "30px",
            top: "5%",
            position: "fixed",
            left: "0", 
            zIndex:"2"
          }}>
            <div style={styles.footerLinks}>
              <div style={{textAlign:"left"}}>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/nfl'}>
                    NFL
                  </Link>
                  {areAnyNflGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/nba'}>
                    NBA
                  </Link>
                  {areAnyNbaGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/premier'}>
                    PREMIER LEAGUE
                  </Link>
                  {areAnyPremierGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/mlb'}>
                    MLB
                  </Link>
                  {areAnyMlbGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/wnba'}>
                    WNBA
                  </Link>
                  {areAnyWnbaGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/boxing'}>
                    BOXING
                  </Link>
                  {areAnyBoxingMatchesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/mma'}>
                    MMA
                  </Link>
                  {areAnyMMAMatchesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={styles.link} to={'/scoreboards/ncaaf'}>
                    COLLEGE FOOTBALL
                  </Link>
                  {areAnyNCAAFGamesInProgress && <span style={styles.inProgress} />}
                </div>
              </div>
            </div>
          </div>
          <div style={{
            color: "white",
            padding: "10px",
            fontSize: "12px",
            bottom: "0",
            position: "fixed",
            right: "0", 
            zIndex:"2"
          }}>
            <div style={styles.footerLinks}>
              <div>
                <div><Link className="links" style={styles.link} to={'/tips'}>Tips</Link></div>
                <div><Link className="links" style={styles.link} to={'/shop'}>Shop</Link></div>
                <div><Link className="links" style={styles.link} to={'/play'}>Play</Link></div>
                {true && <div><Link style={styles.link} to={''} onClick={()=>this.tube()}>Tube</Link></div>}
              </div>
              <div style={{paddingLeft:'50px'}}>
                <div><Link className="links" style={styles.link} to={'/about'}>About</Link></div>
                <div><Link className="links" style={styles.link} to={'/contact'}>Contact</Link></div>
                <div><Link className="links" style={styles.link} to={'/oftheweek'}>#$%@ of the Week</Link></div>
                <div><Link className="links" style={styles.link} to={''} onClick={()=>this.gram()}>Gram</Link></div>
              </div>
            </div>
            <div>© {year} Me vs Yall</div>
            <div>
            {
              false && 
              <span style={{position:'absolute',left:0,bottom:'10px',fontSize:'25px'}}>
              {"🎸"}
              </span>
            }
            {moment().tz("America/New_York").format('MM/DD/YYYY hh:mm a')}{" ATL"}</div>
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
    isAuthenticated: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, {})(withStyles(styles, { withTheme: true })(Home));
