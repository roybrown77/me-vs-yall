import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Skeleton from '@material-ui/lab/Skeleton';

import get from 'lodash/get';

const styles = theme => ({
  container: {
    backgroundColor: 'transparent', 
    boxShadow: 'none'
  },
  select: {
    fontFamily: 'monospace',
    fontSize: '17px'
  },
  formControl: {
    margin: '8px',
    minWidth: 100,
    backgroundColor: '#fff',
    padding: '10px',
    fontWeight: 'bold'
  }
});

class GameSearchBar extends Component {
  render() {
    const { classes, weeks, weekId, leagueId, year } = this.props;

    const weekIndex = weeks.findIndex(x=>x._id === weekId);
    const weeksToDisplay = this.props.weeks.map((week, index) =>
                    <MenuItem key={index} value={index}>{week.displayName}</MenuItem>
                  );

    const years = this.props.years.map((year, index) =>
                    <MenuItem key={year} value={year}>{year}</MenuItem>
                  );

    const leagues = this.props.leagues.map((league, index) =>
                    <MenuItem key={league.id} value={league.id}>{get(league, 'description', '').toUpperCase()}</MenuItem>
                  );

    if (weeks.length === 0) {
      return (
        <div style={{margin: '10px'}}>
            <div style={{display: 'inline-flex', marginBottom: '10px'}}>
                <Skeleton style={{marginRight: '20px'}} animation="pulse" height='40px' width='100px' variant="rect"/>
                <Skeleton animation="pulse" height='40px' width='100px' variant="rect"/>
            </div>
            <Skeleton animation="pulse" height='40px' variant="rect"/>
        </div>
      );
    }
  
    return (
          <div className={classes.container}>
              <Grid item xs={12} justifyContent="center" sm container>
                  <FormControl className={classes.formControl}>
                    <Select
                        value={leagueId}
                        onChange={this.props.onFilterLeague}
                        displayEmpty
                        name='league'
                        className={classes.select}
                        >
                        {leagues}
                    </Select>
                  </FormControl> 
                  <FormControl className={classes.formControl}>
                    <Select
                        value={year}
                        onChange={this.props.onFilterYear}
                        displayEmpty
                        name='year'
                        className={classes.select}
                        >
                        {years}
                    </Select>
                  </FormControl>  
              </Grid>
              <Grid item xs={12} justifyContent="center" sm container>
                <FormControl className={classes.formControl}>
                  <Select
                      value={weekIndex}
                      onChange={this.props.onFilterWeek}
                      displayEmpty
                      name='week'
                      style={styles.select}
                      className={classes.select}
                      >
                      {weeksToDisplay}
                  </Select>
                </FormControl>
              </Grid>
          </div>
        );
    }
}

GameSearchBar.propTypes = {
  leagueId: PropTypes.string,
  leagues: PropTypes.array,
  beginDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  year: PropTypes.number,
  years: PropTypes.array,
  weekId: PropTypes.string,
  weeks: PropTypes.array,
  isDaily: PropTypes.bool,
  weekIndex: PropTypes.number,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  onFilterDate: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default (withStyles(styles, { withTheme: true })(GameSearchBar));