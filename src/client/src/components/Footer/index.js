import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom'
import get from 'lodash/get';

import BottomNavigation from '@material-ui/core/BottomNavigation';

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
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const leagueName = this.props.leagueName;
        const { value } = this.state;

        return (
            <BottomNavigation 
                    value={value} 
                    onChange={this.handleChange}
                    style={styles.root}
                    showLabels
                    >
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
                            <div style={styles.action} onClick={() => { history.push('/scoreboards/' + leagueName) }}>
                                Scores
                            </div>
                        )} />
                    }
                    {
                        true &&
                        <Route render={({ history}) => (
                            <div style={styles.action} onClick={() => { history.push('/leaders/' + leagueName) }}>
                                Leaders
                            </div>
                        )} />
                    }
                    {
                        true &&
                        <Route render={({ history}) => (
                            <div style={styles.action} onClick={() => { history.push('/statoftheweek') }}>
                                SOTW
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