import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment-timezone';

import Slide from '@mui/material/Slide';

import Typer from './Typer';

import mvy from '../../styles/images/mvy-balls-cut.png';
import { googleLogin, isConfirmedAuthentication } from '../../utilities/authenticationClient';
import Header from '../../components/Header';
import useSyncServiceWorker from './useSyncServiceWorker';
import useGoogleAnalytics from '../../utilities/useGoogleAnalytics';

const styles = {
  inProgress: {
    height: '10px',
    width: '10px',
    backgroundColor: 'red',
    position: 'absolute',
    margin: '15px 0 0 10px',
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
    width: '175px',
  },
  selections: {
    marginTop: '4rem',
    fontSize: '15px',
    gap: '1rem',
    display: 'grid',
  },
  footerLinks: {
    padding: '20px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  link: {
    color: '#000',
  },
  toggleOn: {
    color: '#fff',
    fontSize: '5em',
  },
  toggleOff: {
    color: '#000',
    fontSize: '5em',
  },
};

const tagLines = [
  `"the ultimate sports pick'em game"`,
  `"your mission, should you choose to accept it, is to pick the perfect week. correctly pick the winner of every game this week and you will succeed. it's one of the toughest things to do in the universe. this message will self destruct."`,
];

const Home = () => {
  useSyncServiceWorker();
  useGoogleAnalytics();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const gram = () => {
    window.location = 'https://www.instagram.com/_mevsyall';
  };

  const tube = () => {
    window.location = 'https://www.youtube.com/channel/UC3BFY6ohNlayFkPVnlPKqww';
  };

  const year = moment().format('YYYY');

  return (
    <Header disableTopBanner={true}>
      <div style={{ backgroundColor: 'transparent', fontFamily: 'monospace' }} className="fade-in">
        <div
          style={{
            backgroundColor: 'transparent',
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: '1',
          }}
        >
          <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
            <div style={{ marginTop: '2em' }}>
              <img style={{ height: '137px', width: '275px' }} src={mvy} alt="" />
            </div>
          </Slide>
        </div>
        <div
          style={{
            color: '#000',
            padding: '16px',
            fontSize: '25px',
            top: '3em',
            position: 'relative',
            left: '0',
            zIndex: '2',
            paddingTop: '5em',
          }}
        >
          <div style={{ fontSize: '15px' }}>sports x fun x friends x vegas</div>
          <div style={{ marginTop: '1.5rem', fontSize: '15px' }}>
            <Typer dataText={tagLines} />
          </div>
          <div style={styles.selections}>
            {false && !isConfirmedAuthentication() && 
            <div>
              <Link className="link-group" to={() => {}} onClick={googleLogin}>
                <span style={{ marginRight: '.5rem' }}>{'>'}</span>
                <span className="link-text-main">Sign In (Invitation Only)</span>
                <div style={{ marginTop: '3rem', fontSize: '15px' }}>
                  <div style={{ marginTop: '1rem' }}>An Exclusive Sports Experience Awaits You</div>
                </div>
              </Link>
              <div style={{ marginTop: '3rem', fontSize: '14px' }}>
                <div style={{ marginTop: '1rem' }}>
                  If you wish to inquire about access, please contact us at info@mevsyall.com
                </div>
              </div>
            </div>}
            <div>
              <Link className="link-group" to="/scoreboards/nfl">
                <span style={{ marginRight: '.5rem' }}>{'>'}</span>
                <span className="link-text-main">View Games</span>
              </Link>
            </div>
            <div>
              <Link className="link-group" to="/leaders/nfl">
                <span style={{ marginRight: '.5rem' }}>{'>'}</span>
                <span className="link-text-main">View Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
          <div
            style={{
              color: '#fff',
              fontSize: '8px',
              position: 'fixed',
              right: '0',
              bottom: '1rem',
              zIndex: '2',
            }}
          >
          <div className="link-group" style={{ ...styles.footerLinks, color: '#000' }}>
            <div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="/tips">
                  Tips
                </Link>
              </div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="/shop">
                  Shop
                </Link>
              </div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="/play">
                  Play
                </Link>
              </div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="" onClick={tube}>
                  Tube
                </Link>
              </div>
            </div>
            <div style={{ paddingLeft: '50px' }}>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="/origin">
                  Origin
                </Link>
              </div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="/contact">
                  Contact
                </Link>
              </div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="/oftheweek">
                  #$%@ of the Week
                </Link>
              </div>
              <div>
                <Link className="link-group link-text" style={{ ...styles.link, color: '#000' }} to="" onClick={gram}>
                  Gram
                </Link>
              </div>
            </div>
          </div>
          <div style={{ color: '#000' }}>
            <div>© 2017-{year} Me vs Yall</div>
            <div>{moment().tz('America/New_York').format('MM/DD/YYYY hh:mm a')} ATL</div>
          </div>
        </div>
        {false && !isConfirmedAuthentication() && (
          <div
            style={{
              color: '#fff',
              fontSize: '10px',
              marginTop: '5rem',
            }}
          >
            <Link className="link-text" style={{ ...styles.link, cursor: 'pointer' }} to="/origin">
              Origin
            </Link>
            <div style={{ color: '#000', marginTop: '1rem' }}>
              <div>© 2017-{year} Me vs Yall</div>
              <div>{moment().tz('America/New_York').format('MM/DD/YYYY hh:mm a')} ATL</div>
            </div>
          </div>
        )}
      </div>
    </Header>
  );
};

export default Home;
