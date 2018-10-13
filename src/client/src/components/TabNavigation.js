import React, {Component} from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Route } from 'react-router-dom'
import get from 'lodash/get';

import { withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  tabsRoot: {
    borderBottom: '1px solid #e8e8e8',
  },
  tabsIndicator: {
    backgroundColor: '#1890ff',
  },
  tabRoot: {
    textTransform: 'initial',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing.unit * 4,
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    '&:hover': {
      color: '#40a9ff',
      opacity: 1,
    },
    '&$tabSelected': {
      color: '#1890ff',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#40a9ff',
    },
  },
  tabSelected: {},
  typography: {
    padding: theme.spacing.unit * 3,
  },
});

class TabNavigation extends Component {
    state = {
        value: 0,
    };

    handleChange = (event, value) => {
        this.setState({ value });
    };

    render() {
        const { classes, leagueName } = this.props;
        const { value } = this.state;

        return (
            <div className={classes.root}>
                <Tabs
                  value={value}
                  onChange={this.handleChange}
                  classes={{ root: classes.tabsRoot, indicator: classes.tabsIndicator }}
                >
                    {(
                        <Route render={({ history}) => (
                            <Tab
                                label="#MvY"
                                disableRipple
                                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                                onClick={() => { history.push('/mvy') }}
                                        />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <Tab
                                label="#Scores"
                                disableRipple
                                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                                onClick={() => { history.push('/scoreboards/' + leagueName) }}
                                        />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <Tab
                                label="#Leaders"
                                disableRipple
                                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                                onClick={() => { history.push('/leaders/' + leagueName) }}
                                    />
                        )} />
                    )}
                    {(
                        <Route render={({ history}) => (
                            <Tab
                                label="#SOTW"
                                disableRipple
                                classes={{ root: classes.tabRoot, selected: classes.tabSelected }}
                                onClick={() => { history.push('/statOfTheWeek') }}
                                />
                        )} />
                    )}
                </Tabs>
            </div>
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

TabNavigation.propTypes = {
    leagueName: PropTypes.string,
};

export default connect(mapStateToProps)(withStyles(styles, { withTheme: true })(TabNavigation));