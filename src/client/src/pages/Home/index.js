import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {createBrowserHistory} from 'history';
import ReactGA from 'react-ga';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import LightOn from '@material-ui/icons/EmojiObjectsOutlined';
import LightOff from '@material-ui/icons/EmojiObjects';

import Popover from '../../components/Popover';
import { loadGamesInProgress } from '../../actions';
import Typer from './Typer';

import { getAreAnyGamesInProgress } from '../../utilities';
import { getHomePageImage, getHomePageEmoji } from './utilities';

import mvy from '../../styles/images/mvy-balls-cut.png';

const history = createBrowserHistory({forceRefresh: true});

const styles = {
  inProgress: {
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    position: 'absolute',
    margin: '15px 0 0 10px'
  },
  footerLinks: {
    padding:'20px',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontFamily: 'monospace !important'
  },
  toggleOn: {
    color: 'white',
    fontSize: '5em'
  },
  toggleOff: {
    color: 'black',
    fontSize: '5em'
  }
};

const instructions = [
  '1. Tap league.',
  '2. Tap "Play For Free" to sign in.',
  '3. Tap teams you think will win this week.',
  '4. View Leaders to see if you won.',
  "5. No purchase necessary.  It's free yall.  :D"
];

const tagLines = [
  `"track what you could have won or loss in vegas"`,
  `"the ultimate sports pick'em game"`,
  `"if you can't win here don't bet real money over there"`,
  `"play for fun or play for the 💰 it's your world"`,
  `"compete with friends worldwide"`,
  `"your mission should you choose to accept is to beat vegas every week.  this message will self destruct."`,
  `"the underground mixtape version of sports"`
  //`"counting up cheese like i ate up a bag of some cheetos" - migos`,
  //`"awesome baby!" - dickie v`,
  //`"at the end of the game the team with the most points on the board is going to win" - john madden`,
  //`"there are always new, grander challenges to confront, and a true winner will embrace each one" – mia hamm`,
  //`"we will be perfect in every aspect of the game. you drop a pass, you run a mile. you miss a blocking assignment, you run a mile." - denzel washington in remember the titans`,
  //`"who cares what kind of job i did if it doesn't produce results" - sean astin in rudy`
];

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        darkModeOn: false
      };
    }

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

    handleToggleDarkMode = () => {
        this.setState((state) => ({
            darkModeOn: !state.darkModeOn
        }));
    }

    render() {
      const { games } = this.props;
      const { darkModeOn } = this.state;

      const year = moment().format('YYYY');

      const nflGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f10');
      const nbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f19');
      const ncaafGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f15');
      // const premierGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f17');
      // const wnbaGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f37');
      const mlbGames = games.filter(x=>x.leagueId==='59723313734d1d6202a85f21');
      const boxingMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f25');
      const mmaMatches = games.filter(x=>x.leagueId==='59723313734d1d6202a85f27');

      const areAnyNflGamesInProgress = getAreAnyGamesInProgress(nflGames);
      const areAnyNbaGamesInProgress = getAreAnyGamesInProgress(nbaGames);
      const areAnyNCAAFGamesInProgress = getAreAnyGamesInProgress(ncaafGames);
      // const areAnyPremierGamesInProgress = getAreAnyGamesInProgress(premierGames);
      // const areAnyWnbaGamesInProgress = getAreAnyGamesInProgress(wnbaGames);
      const areAnyMlbGamesInProgress = getAreAnyGamesInProgress(mlbGames);
      const areAnyBoxingMatchesInProgress = getAreAnyGamesInProgress(boxingMatches);
      const areAnyMMAMatchesInProgress = getAreAnyGamesInProgress(mmaMatches);

      const emoji = getHomePageEmoji();

      return (
        <div style={{backgroundColor: 'transparent', fontFamily: 'monospace'}} className="fade-in">
          {darkModeOn && <div style={{backgroundColor:"black", position: "absolute", width:"100%", height:"100%", opacity: ".9", zIndex:"1"}}>
          </div>}
          {!darkModeOn && <div style={{backgroundColor:"transparent", position: "absolute", width:"100%", height:"100%", zIndex:"1"}}>
            {
              !darkModeOn &&
              <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
                <div style={{marginTop: '2em'}}>
                  <img style={{width:'275px'}} src={mvy} alt=""/>
                </div>
              </Slide>
            }
          </div>}
          <div style={{
            bottom: "0",
            left: "0", 
            position: "fixed",
            zIndex:"777"
          }}>
            <IconButton style={{fontSize: '10px'}} aria-label="dark mode" onClick={this.handleToggleDarkMode}>
                {darkModeOn ? <LightOn style={styles.toggleOn}/> : <LightOff style={styles.toggleOff}/>}
            </IconButton>
          </div>
          <div style={{
            bottom: "9em",
            left: "10px", 
            position: "fixed",
            zIndex:"777"
          }}>
          {
            false && 
            <Popover 
              borderStyle={{maxWidth: '100px', padding: '16px', backgroundColor: '#000', color: '#fff', cursor: 'pointer', borderRadius: '10px', fontFamily: 'monospace !important'}}
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
          }
          </div>
          {darkModeOn && <div style={{position: "absolute", width:"100%", height:"100%"}}>
            <img style={{width:'100%', height: "100%"}} src={getHomePageImage()} alt=""/>
          </div>}
          <div style={{
            color: "white",
            padding: "16px",
            fontSize: "25px",
            top: "3em",
            position: "relative",
            left: "0", 
            zIndex:"2",
            paddingTop: darkModeOn ? "2em" : "5em"
          }}>
            <div style={{color: darkModeOn ? 'white' : 'black', fontSize: '15px'}}>
              sports x fun x friends x vegas
            </div>
            <div style={{marginTop: '10px', color: darkModeOn ? 'white' : 'black', fontSize: '15px'}}>
              <Typer
                dataText={tagLines} 
              />
            </div>
            <div style={darkModeOn ? styles.footerLinks : {...styles.footerLinks,color:'black'}}>
              <div style={{textAlign:"left"}}>
                <div>
                  <Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/scoreboards/nfl'}>
                    NFL
                  </Link>
                  {areAnyNflGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/scoreboards/nba'}>
                    NBA
                  </Link>
                  {areAnyNbaGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/scoreboards/mlb'}>
                    MLB
                  </Link>
                  {areAnyMlbGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/scoreboards/cfb'}>
                    CFB
                  </Link>
                  {areAnyNCAAFGamesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/scoreboards/mma'}>
                    MMA
                  </Link>
                  {areAnyMMAMatchesInProgress && <span style={styles.inProgress} />}
                </div>
                <div>
                  <Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/scoreboards/boxing'}>
                    BOXING
                  </Link>
                  {areAnyBoxingMatchesInProgress && <span style={styles.inProgress} />}
                </div>
              </div>
            </div>
          </div>
          <div style={{
            color: "white",
            padding: "10px",
            fontSize: "10px",
            bottom: "0",
            position: "fixed",
            right: "0", 
            zIndex:"2"
          }}>
            <div style={darkModeOn ? styles.footerLinks : {...styles.footerLinks,color:'black'}}>
              <div>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/tips'}>Tips</Link></div>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/shop'}>Shop</Link></div>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/play'}>Play</Link></div>
                {true && <div><Link style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={''} onClick={()=>this.tube()}>Tube</Link></div>}
              </div>
              <div style={{paddingLeft:'50px'}}>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/about'}>About</Link></div>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/contact'}>Contact</Link></div>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={'/oftheweek'}>#$%@ of the Week</Link></div>
                <div><Link className="links" style={darkModeOn ? styles.link : {...styles.link,color:'black'}} to={''} onClick={()=>this.gram()}>Gram</Link></div>
              </div>
            </div>
            <div style={{color: darkModeOn ? 'white' : 'black'}}>
              <div>© 2017-{year} Me vs Yall</div>
              <div>
                {moment().tz("America/New_York").format('MM/DD/YYYY hh:mm a')}{" ATL"}
                {
                  false && 
                  <span style={{margin: '-5px 0 0 10px', position: 'absolute', fontSize: '15px'}}>
                  {emoji}
                  </span>
                }
              </div>
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
    isAuthenticated: PropTypes.bool.isRequired,
    loadGamesInProgress: PropTypes.func.isRequired
};

export default connect(mapStateToProps, {loadGamesInProgress})(withStyles(styles, { withTheme: true })(Home));
