import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';
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
    const weekIndex = this.props.weeks.findIndex(x=>x.seasonType === this.props.seasonType && x.weekNo === this.props.weekNo);
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
        <div style={{marginTop: '12px', backgroundColor: '#fff'}}>
            <RaisedButton
              label="Filtration"
              labelPosition="before"
              primary={true}
              icon={<ActionAndroid />}
              style={filterButton.button}
            />
            <div className='game-search-container'>
              <DropDownMenu
                  value={this.props.league}
                  onChange={this.props.onFilterLeague}
                  style={dropDown.root}
                  autoWidth={false}
                  >
                  {leagues}
              </DropDownMenu>
              {this.props.isDaily && 
                <div style={dateStyle.container}>
                <TextField
                  id="date"
                  type="date"
                  defaultValue={this.props.date || date}
                  className={dateStyle.textField}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  onChange={this.props.onFilterDate}
                />
                </div>
              }
              {!this.props.isDaily && 
                <DropDownMenu
                  value={this.props.year}
                  onChange={this.props.onFilterYear}
                  style={dropDown.root}
                  autoWidth={false}
                  >
                  {years}
                </DropDownMenu>
              }
              {!this.props.isDaily && 
                <DropDownMenu
                  value={weekIndex}
                  onChange={this.props.onFilterWeek}
                  style={dropDownFull.root}
                  autoWidth={false}
                  >
                  {weeks}
                </DropDownMenu>
              }
            </div>
        </div>);
    }
}

GameSearchBar.propTypes = {
  league: PropTypes.string,
  leagues: PropTypes.array,
  date: PropTypes.string,
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