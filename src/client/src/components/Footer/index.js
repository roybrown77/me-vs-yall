import React, {Component} from 'react';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import get from 'lodash/get';

import BottomNavigation from '@material-ui/core/BottomNavigation';

const styles = {
  root: {
    zIndex: 99,
    position: "fixed", 
    bottom: "0", 
    backgroundColor: "#f5fffa", 
    boxShadow: "none",
    width: "100%",
    color: "black"
  },
  action: {
    fontSize: '15px',
    padding: '20px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontFamily: 'monospace'
  }
};

class Footer extends Component {
    render() {
        const leagueName = this.props.leagueName;
        const selected = window.location.pathname.includes('scoreboards') ? 'scoreboards' : 
        window.location.pathname.includes('leaders') ? 'leaders' : 
        window.location.pathname.includes('oftheweek') ? 'oftheweek' : 'MvY';

        return (
            <BottomNavigation style={styles.root}>
            {
                true &&
                <Route render={({ history}) => (
                    <div style={styles.action} onClick={() => { history.push('/') }}>
                        MvY
                    </div>
                )} />
            }
            {
                true &&
                <Route render={({ history}) => (
                    <div style={{...styles.action, borderBottom: selected === 'scoreboards' ? '7px solid rgb(239, 253, 87)' : ''}} 
                    onClick={() => { history.push('/scoreboards/' + leagueName) }}>
                        Scores
                    </div>
                )} />
            }
            {
                true &&
                <Route render={({ history}) => (
                    <div style={{...styles.action, borderBottom: selected === 'leaders' ? '7px solid rgb(239, 253, 87)' : ''}} 
                     onClick={() => { history.push('/leaders/' + leagueName) }}>
                        Friends
                    </div>
                )} />
            }
            {
                true &&
                <Route render={({ history}) => (
                    <div style={{...styles.action, borderBottom: selected === 'oftheweek' ? '7px solid rgb(239, 253, 87)' : ''}} 
                     onClick={() => { history.push('/oftheweek') }}>
                        OTW
                    </div>
                )} />
            }
            </BottomNavigation>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const ui = state.get('ui').toJS();
    const request = get(ui,'request');

    const lookup = state.get('lookup').toJS();
    const leagues = get(lookup, 'leagues', []);
    const leagueId = get(request, 'leagueId');
    const league = leagues.find(x=>x.id === leagueId);

    const leagueName = get(league,'name');

    return {
        leagueName
    }
};

Footer.propTypes = {
    leagueName: PropTypes.string,
};

export default connect(mapStateToProps)(Footer);