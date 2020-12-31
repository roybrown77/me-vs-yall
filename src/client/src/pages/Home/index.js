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
import { getHomePageImage } from '../../utilities';

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
    color: 'white',
    marginTop: '4px'
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
      const year = moment().format('YYYY');

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
                </div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/nba'}>NBA</Link></div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/premier'}>PREMIER LEAGUE</Link></div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/mlb'}>MLB</Link></div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/wnba'}>WNBA</Link></div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/boxing'}>BOXING</Link></div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/mma'}>MMA</Link></div>
                <div><Link className="links" style={styles.link} to={'/scoreboards/ncaaf'}>COLLEGE FOOTBALL</Link></div>
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
            <div><span style={{position:'absolute',left:0,bottom:'10px',fontSize:'25px'}}>{"🎸 "}</span>{moment().tz("America/New_York").format('MM/DD/YYYY hh:mm a')}{" ATL"}</div>
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
