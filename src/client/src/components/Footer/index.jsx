import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';
import BottomNavigation from '@mui/material/BottomNavigation';

import { getLeagueName } from '../../utilities/getLeagueName';

const styles = {
  root: {
    zIndex: 99,
    position: "fixed", 
    bottom: "0", 
    backgroundColor: "#f5fffa", 
    boxShadow: "none",
    width: "100%",
    color: "#000"
  },
  action: {
    fontSize: '15px',
    padding: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  }
};

const Footer = () => {
    const leagueName = getLeagueName();
    const selected = window?.location?.pathname?.includes('scoreboards') ? 'scoreboards' : 
    window?.location?.pathname?.includes('leaders') ? 'leaders' : 
    window?.location?.pathname?.includes('oftheweek') ? 'oftheweek' : 'MvY';

    return (
        <BottomNavigation style={styles.root}>
        <Route render={({ history}) => (
            <div style={styles.action} onClick={() => { history.push('/') }}>
                MvY
            </div>
        )} />
        <Route render={({ history}) => (
            <div style={{...styles.action, borderBottom: selected === 'scoreboards' ? '7px solid #1e90ff' : ''}} 
            onClick={() => { history.push('/scoreboards/' + leagueName) }}>
                Scores
            </div>
        )} />
        <Route render={({ history}) => (
            <div style={{...styles.action, borderBottom: selected === 'leaders' ? '7px solid #1e90ff' : ''}} 
                onClick={() => { history.push('/leaders/' + leagueName) }}>
                Leaders
            </div>
        )} />
        <Route render={({ history}) => (
            <div style={{...styles.action, borderBottom: selected === 'oftheweek' ? '7px solid #1e90ff' : ''}} 
                onClick={() => { history.push('/oftheweek') }}>
                OTW
            </div>
        )} />
        </BottomNavigation>
    );
};

Footer.propTypes = {
    leagueName: PropTypes.string,
};

export default Footer;