import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import TextField from '@material-ui/core/TextField';

import moment from 'moment-timezone';
import get from 'lodash/get';

const dateStyle = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: '20px',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
});

const filterButton = {
  button: {
    margin: 0,
    width: '100%'
  }
};

const dropDown = {
    root: {
        width: '50%'
    }
};

const dropDownFull = {
    root: {
        width: '100%',
        marginBottom: '12px'
    }
};

class GameSearchBar extends Component {  
  shouldComponenetUpdate() {
    return false;
  }
  
  render() {
    const seasonTypeWeekNo = this.props.weeks.findIndex(x=>(x.seasonType === this.props.seasonType) && (x.weekNo === this.props.weekNo));
    const weekIndex = (seasonTypeWeekNo === 0 || !!seasonTypeWeekNo) && this.props.seasonType && this.props.weekNo ? seasonTypeWeekNo : this.props.weeks.findIndex(x=>x.beginDateTime === this.props.beginDateTime);
                      
    const weeks = this.props.weeks.map((week, index) =>
                    <MenuItem key={index} value={index} primaryText={week.displayName}/>
                  );

    const years = this.props.years.map((year, index) =>
                    <MenuItem key={year} value={year} primaryText={year}/>
                  );

    const leagues = this.props.leagues.map((league, index) =>
                    <MenuItem key={league.id} value={league.id} primaryText={get(league, 'description', '').toUpperCase()}/>
                  );
    const date = moment().format('YYYY-MM-DD');

    return (
        <div style={{
          marginTop: '12px', 
          backgroundColor: '#f4f7f6', 
          paddingBottom: '10px',
          boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 6px, rgba(0, 0, 0, 0.12) 0px 1px 4px'
        }}>
            <div className='game-search-container'>
              <DropDownMenu
                  value={this.props.league}
                  onChange={this.props.onFilterLeague}
                  style={{width: this.props.isDaily ? 'auto' : '50%'}}
                  autoWidth={false}
                  >
                  {leagues}
              </DropDownMenu>
              <DropDownMenu
                  value={this.props.year}
                  onChange={this.props.onFilterYear}
                  style={dropDown.root}
                  autoWidth={false}
                  >
                  {years}
              </DropDownMenu>
              <DropDownMenu
                  value={weekIndex}
                  onChange={this.props.onFilterWeek}
                  style={dropDownFull.root}
                  autoWidth={false}
                  >
                  {weeks}
              </DropDownMenu>
            </div>
        </div>);
    }
}

GameSearchBar.propTypes = {
  league: PropTypes.string,
  leagues: PropTypes.array,
  beginDateTime: PropTypes.string,
  endDateTime: PropTypes.string,
  year: PropTypes.number,
  years: PropTypes.array,
  weekNo: PropTypes.number,
  weeks: PropTypes.array,
  seasonType: PropTypes.number,
  isDaily: PropTypes.bool,
  onFilterLeague: PropTypes.func,
  onFilterYear: PropTypes.func,
  onFilterWeek: PropTypes.func,
  onFilterDate: PropTypes.func
};

export default GameSearchBar;