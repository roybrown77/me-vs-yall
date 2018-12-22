import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';

import get from 'lodash/get';

const styles = theme => ({
  container: {
    padding: '5px 0', 
    backgroundColor: '#f4f7f6', 
    boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
  },
  select: {
    width: '50%'
  },
  selectMenu: {
    border: 0,
    borderRadius: '6px',
    backgroundColor: '#F2F2F2',
    color: 'white'
  },
  formControl: {
    margin: theme.spacing.unit,
    minWidth: 120,
  },
  button: {
    width: '100%',
    color: 'black',
    fontSize: '1rem', 
    fontWeight: '700',
    border: '5px solid black',
    borderRadius: '8px'
  }
});

class GameSearchBar extends Component {  
  shouldComponenetUpdate() {
    return false;
  }
  
  render() {
    const { classes, weeks, weekId } = this.props;
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

    return (
          <div className={classes.container}>
              <Grid item xs={12} sm container justify="center">
                  <FormControl className={classes.formControl}>
                    <Select
                        value={this.props.league}
                        onChange={this.props.onFilterLeague}
                        displayEmpty
                        name='league'
                        >
                        {leagues}
                    </Select>
                  </FormControl> 
                  <FormControl className={classes.formControl}>
                    <Select
                        value={this.props.year}
                        onChange={this.props.onFilterYear}
                        displayEmpty
                        name='year'
                        >
                        {years}
                    </Select>
                  </FormControl>  
              </Grid>
              <Grid item xs={12} justify="center" sm container>
                <FormControl className={classes.formControl}>
                  <Select
                      value={weekIndex !== -1 ? weekIndex : this.props.weeks.length-1}
                      onChange={this.props.onFilterWeek}
                      displayEmpty
                      name='year'
                      style={styles.select}
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
  league: PropTypes.string,
  leagues: PropTypes.array,
  beginDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  year: PropTypes.number,
  years: PropTypes.array,
  weekId: PropTypes.string,
  weeks: PropTypes.array,
  seasonType: PropTypes.number,
  isDaily: PropTypes.bool,
  weekIndex: PropTypes.number,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  onFilterDate: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default (withStyles(styles, { withTheme: true })(GameSearchBar));