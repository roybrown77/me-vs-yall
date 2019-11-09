import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import {createBrowserHistory} from 'history';

import BottomNavigation from '@material-ui/core/BottomNavigation';

const history = createBrowserHistory({forceRefresh: true});

const styles = {
  root: {
    zIndex: 1,
    position: "fixed", 
    bottom: "0", 
    backgroundColor: "#f0f8ff", 
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
    navigateTo = (route) => {
      history.push(route);
    };

    render() {
        const leagueName = this.props.leagueName;
        const selected = window.location.pathname.includes('scoreboards') ? 'scoreboards' : 
        window.location.pathname.includes('leaders') ? 'leaders' : 
        window.location.pathname.includes('oftheweek') ? 'oftheweek' : 'MvY';

        return (
            <BottomNavigation 
                    style={styles.root}
                    showLabels
                    >
                    {
                        true &&
                        <div style={styles.action} 
                        onClick={() => {this.navigateTo('/')}}>
                            MvY
                        </div>
                    }
                    {
                        true &&
                        <div style={{...styles.action, borderBottom: selected === 'scoreboards' ? '7px solid rgb(239, 253, 87)' : ''}} 
                        onClick={() => {this.navigateTo('/scoreboards/' + leagueName)}}>
                            Scores
                        </div>
                    }
                    {
                        true &&
                        <div style={{...styles.action, borderBottom: selected === 'leaders' ? '7px solid rgb(239, 253, 87)' : ''}} 
                        onClick={() => {this.navigateTo('/leaders/' + leagueName)}}>
                            Leaders
                        </div>
                    }
                    {
                        true &&
                        <div style={{...styles.action, borderBottom: selected === 'oftheweek' ? '7px solid rgb(239, 253, 87)' : ''}} 
                        onClick={() => {this.navigateTo('/oftheweek')}}>
                            OTW
                        </div>
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
    const leagueId = get(request, 'leagueId') || leagues.find(x=>x.name.toLowerCase() === 'nfl').id;
    const league = leagues.find(x=>x.id === leagueId);

    const leagueName = get(league,'name','nfl');

    return {
        leagueName
    }
};

Footer.propTypes = {
    leagueName: PropTypes.string,
};

export default connect(mapStateToProps)(Footer);