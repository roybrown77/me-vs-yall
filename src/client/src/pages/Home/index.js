import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import PropTypes from 'prop-types';
import {createBrowserHistory} from 'history';

import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Slide from '@material-ui/core/Slide';
import IconButton from '@material-ui/core/IconButton';
import LightOff from '@material-ui/icons/EmojiObjects';

import { loadGamesInProgress } from '../../actions';
import Typer from './Typer';

import { getAreAnyGamesInProgress } from '../../utilities';

import mvy from '../../styles/images/mvy-balls-cut.png';
import { isConfirmedAuthentication, googleLogin } from '../../middleware/authenticationClient';

const history = createBrowserHistory({forceRefresh: true});

const styles = {
  inProgress: {
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    position: 'absolute',
    margin: '15px 0 0 10px'
  },
  signIn: {
    margin: '50px auto 25px auto',
    padding: '10px',
    borderRadius: '4px',
    border: '3px solid #000',
    fontFamily: 'monospace',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#000',
    width: '175px'
  },
  selections: {
    marginTop: '4rem',
    fontSize: '15px',
    gap: '1rem',
    display: 'grid'
  },
  footerLinks: {
    padding:'20px',
    display:'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: '#000',
  },
  toggleOn: {
    color: '#fff',
    fontSize: '5em'
  },
  toggleOff: {
    color: '#000',
    fontSize: '5em'
  }
};

const gamesInProgress = (games, leagueId) => {
  const filteredGames = games.filter(x=>x.leagueId===leagueId);
  return getAreAnyGamesInProgress(filteredGames);
};

const tagLines = [
  `"the ultimate sports pick'em game"`,
  `"your mission should you choose to accept is to pick the perfect week.  correctly pick the winner of every game this week and you will succeed.  this message will self destruct."`
];

class Home extends Component {
    constructor(props) {
      super(props);
      this.state = {
        showInfo: false
      };
    }

    componentDidMount() {
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

    handleToggleShowInfo = () => {
        this.setState((state) => ({
          showInfo: !state.showInfo
        }));
    }

    render() {
      const { games } = this.props;
      const { showInfo } = this.state;

      const year = moment().format('YYYY');

      return (
        <div style={{ backgroundColor: 'transparent', fontFamily: 'monospace' }} className="fade-in">
          <div style={{ backgroundColor:"transparent", position: "absolute", width:"100%", height:"100%", zIndex:"1" }}>
            <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
              <div style={{ marginTop: '2em' }}>
                <img style={{ height:'137px', width:'275px' }} src={mvy} alt=""/>
              </div>
            </Slide>
          </div>
          <div style={{
            bottom: "0",
            right: "0", 
            position: "fixed",
            zIndex:"777"
          }}>
            <IconButton style={{ fontSize: '10px' }} aria-label="show info" onClick={this.handleToggleShowInfo}>
              <LightOff style={styles.toggleOff}/>
            </IconButton>
          </div>
          <div style={{
            color: "#fff",
            padding: "16px",
            fontSize: "25px",
            top: "3em",
            position: "relative",
            left: "0", 
            zIndex:"2",
            paddingTop: "5em"
          }}>
            <div style={{ color: '#000', fontSize: '15px' }}>
              sports x fun x friends x vegas
            </div>
            <div style={{ marginTop: '1.5rem', color: '#000', fontSize: '15px' }}>
              <Typer
                dataText={tagLines} 
              />
            </div>
            <div style={styles.selections}>
              <div>
                <Link className="link-group" onClick={googleLogin}>
                  <span style={{ marginRight: '.5rem' }}>{">"}</span><span className="link-text-main">Sign In</span>
                </Link>
              </div>
              <div>
                <Link className="link-group" to={"/scoreboards/nfl"}>
                  <span style={{ marginRight: '.5rem' }}>{">"}</span><span className="link-text-main">View Games</span>
                </Link>
              </div>
            </div>
          </div>
          {showInfo && <div style={{
            color: "#fff",
            padding: "10px",
            fontSize: "10px",
            bottom: "0",
            position: "fixed",
            right: "4rem", 
            zIndex:"2"
          }}>
            <div className="link-group" style={{...styles.footerLinks, color:'#000'}}>
              <div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={'/tips'}>Tips</Link></div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={'/shop'}>Shop</Link></div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={'/play'}>Play</Link></div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={''} onClick={this.tube}>Tube</Link></div>
              </div>
              <div style={{ paddingLeft:'50px' }}>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={'/origin'}>Origin</Link></div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={'/contact'}>Contact</Link></div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={'/oftheweek'}>#$%@ of the Week</Link></div>
                <div><Link className="link-group link-text" style={{...styles.link,color:'#000'}} to={''} onClick={this.gram}>Gram</Link></div>
              </div>
            </div>
            <div style={{ color: '#000' }}>
              <div>© 2017-{year} Me vs Yall</div>
              <div>
                {moment().tz("America/New_York").format('MM/DD/YYYY hh:mm a')}{" ATL"}
              </div>
            </div>
          </div>}
        </div>
      );
    }
}

const mapStateToProps = (state, ownProps) => {
    const homePageDomain = state.get('homePageDomain').toJS();
    const games = get(homePageDomain, 'games', []);
    const isAuthenticated = isConfirmedAuthentication();

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
