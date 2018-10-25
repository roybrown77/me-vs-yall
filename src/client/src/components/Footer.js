import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom'
import get from 'lodash/get';

import BottomNavigation from '@material-ui/core/BottomNavigation';
import ButtonBase from '@material-ui/core/ButtonBase';

const styles = {
  root: {
    zIndex: 1,
    position: "fixed", 
    bottom: "0", 
    backgroundColor: "#f4f7f6", 
    boxShadow: "rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px",
    width: "100%",
    color: "black"
  },
  action: {
    margin: '0 15px',
    fontSize: '15px',
    color: 'rgba(0, 0, 0, 0.54)'
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
                    {(
                        <Route render={({ history}) => (
                            <ButtonBase focusRipple style={styles.action} onClick={() => { history.push('/') }}>
                                #MvY
                            </ButtonBase>
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <ButtonBase focusRipple style={styles.action} onClick={() => { history.push('/scoreboards/' + leagueName) }}>
                                #Scores
                            </ButtonBase>
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <ButtonBase focusRipple style={styles.action} onClick={() => { history.push('/leaders/' + leagueName) }}>
                                #Leaders
                            </ButtonBase>
                    )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <ButtonBase focusRipple style={styles.action} onClick={() => { history.push('/statOfTheWeek') }}>
                                #SOTW
                            </ButtonBase>
                    )} />
                    )}
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