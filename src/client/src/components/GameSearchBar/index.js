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

const GameSearchBar = ({ classes, leagueId, leagues, year, years, weekId, weeks, onFilterLeague, onFilterYear, onFilterWeek }) => {
  const weekIndex = weeks.findIndex(x=>x._id === weekId);
  const weeksToDisplay = weeks.map((week, index) => <MenuItem key={index} value={index}>{week.displayName}</MenuItem>);
  const yearsToDisplay = years.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>);
  const leaguesToDisplay = leagues.map((league) =><MenuItem key={league.id} value={league.id}>{get(league, 'description', '').toUpperCase()}</MenuItem>);

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
                  onChange={onFilterLeague}
                  displayEmpty
                  name='league'
                  className={classes.select}
                  >
                  {leaguesToDisplay}
              </Select>
            </FormControl> 
            <FormControl className={classes.formControl}>
              <Select
                  value={year}
                  onChange={onFilterYear}
                  displayEmpty
                  name='year'
                  className={classes.select}
                  >
                  {yearsToDisplay}
              </Select>
            </FormControl>  
        </Grid>
        <Grid item xs={12} justifyContent="center" sm container>
          <FormControl className={classes.formControl}>
            <Select
                value={weekIndex}
                onChange={onFilterWeek}
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

GameSearchBar.propTypes = {
  leagueId: PropTypes.string,
  leagues: PropTypes.array,
  year: PropTypes.number,
  years: PropTypes.array,
  weekId: PropTypes.string,
  weeks: PropTypes.array,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

export default (withStyles(styles, { withTheme: true })(GameSearchBar));