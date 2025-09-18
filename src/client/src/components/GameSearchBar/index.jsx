import PropTypes from 'prop-types';

import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import get from 'lodash/get';

const styles = {
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
};

const GameSearchBar = ({ leagueId, leagues, weekId, yearSelected, weeks, loading, onFilterLeague, onFilterYear, onFilterWeek }) => {
  const leagueSelected = leagueId && leagues.find(league => league.id === leagueId);
  const leaguesToDisplay = leagueId && leagues.map((league) =><MenuItem key={league.id} value={league.id}>{get(league, 'description', '').toUpperCase()}</MenuItem>);

  const yearsToDisplay = leagueId && leagueSelected.years.map((year) => <MenuItem key={year} value={year}>{year}</MenuItem>);
  const isYearFound = leagueId && yearsToDisplay.findIndex(x=>x.key === yearSelected.toString()) !== -1;

  const weekIndexSelected = leagueId && weeks.findIndex(x=>x._id === weekId);
  const weeksToDisplay = leagueId && weeks.map((week, index) => <MenuItem key={index} value={index}>{week.displayName}</MenuItem>);

  return (
    <div style={styles.container}>
        <Grid item xs={12} justifyContent="center" sm container>
            <FormControl style={styles.formControl}>
              <Select
                  value={leagueId}
                  onChange={onFilterLeague}
                  displayEmpty
                  name='league'
                  style={styles.select}
                  disabled={loading || !leagueId}
                  >
                  {leaguesToDisplay}
              </Select>
              {!leagueId && <Skeleton animation="pulse" height='40px' width='100px' variant="rect"/>}
            </FormControl> 
            <FormControl style={styles.formControl}>
               <Select
                  value={yearSelected}
                  onChange={onFilterYear}
                  displayEmpty
                  name='year'
                  style={styles.select}
                  disabled={loading || !isYearFound}
                  >
                  {yearsToDisplay}
              </Select>
            </FormControl>  
        </Grid>
        <Grid item xs={12} justifyContent="center" sm container>
          <FormControl style={styles.formControl}>
            <Select
                value={weekIndexSelected === -1 ? 0 : weekIndexSelected}
                onChange={onFilterWeek}
                displayEmpty
                name='week'
                style={styles.select}
                disabled={loading}
                >
                {weekIndexSelected === -1 ? <MenuItem key={0} value={0}>Loading weeks...</MenuItem> : weeksToDisplay}
            </Select>
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
};

GameSearchBar.defaultProps = {
  loading: false,
};

export default GameSearchBar;