import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom'
import get from 'lodash/get';

import FontIcon from 'material-ui/FontIcon';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import Paper from 'material-ui/Paper';

const leaguesIcon = <FontIcon className="material-icons"></FontIcon>;
const scoreboardsIcon = <FontIcon className="material-icons"></FontIcon>;
const leadersIcon = <FontIcon className="material-icons"></FontIcon>;
const meIcon = <FontIcon className="material-icons"></FontIcon>;
const yallIcon = <FontIcon className="material-icons"></FontIcon>;

class Footer extends Component {
    state = {
        selectedIndex: 0
    };

    select = (index) => this.setState({selectedIndex: index});

    render() {
        const leagueName = this.props.leagueName;

        return (
            <Paper zDepth={1}>
                <BottomNavigation selectedIndex={this.state.selectedIndex} style={{position:"fixed", bottom:"0", backgroundColor: "#f4f7f6", borderTop: "1px solid #000", zIndex: "1"}}>
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="MvY"
                                icon={scoreboardsIcon}
                                        />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="Scores"
                                icon={scoreboardsIcon}
                                onTouchTap={() => { history.push('/scoreboards/' + leagueName) }}
                                        />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                            label="Leaders"
                            icon={leadersIcon}
                            onTouchTap={() => { history.push('/leaders/' + leagueName) }}
                                />
                    )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="News"
                                icon={meIcon}
                                />
                    )} />
                    )}
                </BottomNavigation>
            </Paper>
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