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

const GameSearchBar = ({ classes, leagueId, leagues, weekId, yearSelected, weeks, loading, onFilterLeague, onFilterYear, onFilterWeek }) => {
  const leagueSelected = leagueId && leagues.find(league => league.id === leagueId);
  const leaguesToDisplay = leagueId && leagues.map((league) =><MenuItem key={league.id} value={league.id}>{get(league, 'description', '').toUpperCase()}</MenuItem>);

  const yearsToDisplay = leagueId && leagueSelected.years.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>);
  const isYearFound = leagueId && yearsToDisplay.findIndex(x=>x.key === yearSelected.toString()) !== -1;

  const currentWeekIndex = weeks.findIndex(x=>x._id === weekId);
  const weekIndexSelected = leagueId && (weeks.findIndex(x=>x.description?.includes('Week')) || weeks.findIndex(x=>x.description?.includes('Playoffs'))) && false ? currentWeekIndex : weeks.findIndex(x=>x.description?.includes('Entire'));
  const weeksToDisplay = leagueId && weeks.map((week, index) => <MenuItem key={index} value={index}>{week.displayName}</MenuItem>);

  return (
    <div className={classes.container}>
        <Grid item xs={12} justifyContent="center" sm container>
            <FormControl className={classes.formControl}>
            {leagueId && <Select
                  value={leagueId}
                  onChange={onFilterLeague}
                  displayEmpty
                  name='league'
                  className={classes.select}
                  >
                  {leaguesToDisplay}
              </Select>}
              {!leagueId && <Skeleton animation="pulse" height='40px' width='100px' variant="rect"/>}
            </FormControl> 
            <FormControl className={classes.formControl}>
              {isYearFound && <Select
                  value={yearSelected}
                  onChange={onFilterYear}
                  displayEmpty
                  name='year'
                  className={classes.select}
                  >
                  {yearsToDisplay}
              </Select>}
              {!isYearFound && <Skeleton animation="pulse" height='40px' width='100px' variant="rect"/>}
            </FormControl>  
        </Grid>
        <Grid item xs={12} justifyContent="center" sm container>
          <FormControl className={classes.formControl}>
            {!loading && <Select
                value={weekIndexSelected}
                onChange={onFilterWeek}
                displayEmpty
                name='week'
                style={styles.select}
                className={classes.select}
                >
                {weeksToDisplay}
            </Select>}
            {loading && <Skeleton animation="pulse" height='40px' variant="rect"/>}
          </FormControl>
        </Grid>
    </div>
  );
}

GameSearchBar.propTypes = {
  leagueId: PropTypes.string,
  leagues: PropTypes.array,
  weekId: PropTypes.string,
  weeks: PropTypes.array,
  yearSelected: PropTypes.number,
  loading: PropTypes.bool,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  classes: PropTypes.object.isRequired,
};

GameSearchBar.defaultProps = {
  loading: false,
};

export default withStyles(styles, { withTheme: true })(GameSearchBar);