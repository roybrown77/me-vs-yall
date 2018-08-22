import React, {Component} from 'react';
import { Route } from 'react-router-dom'

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
        return (
            <Paper zDepth={1}>
                <BottomNavigation selectedIndex={this.state.selectedIndex} style={{position:"fixed", bottom:"0", backgroundColor: "#f4f7f6", borderTop: "1px solid #000"}}>
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="Leagues"
                                icon={leaguesIcon}
                                />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="Scoreboards"
                                icon={scoreboardsIcon}
                                onTouchTap={() => { history.push('/scoreboards/nfl') }}
                                        />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                            label="Leaders"
                            icon={leadersIcon}
                            onTouchTap={() => { history.push('/leaders/nfl') }}
                                />
                    )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="Me"
                                icon={meIcon}
                                />
                    )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <BottomNavigationItem
                                label="Yall"
                                icon={yallIcon}
                                />
                    )} />
                    )}
                </BottomNavigation>
            </Paper>
        );
    }
}

export default Footer;