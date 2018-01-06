import React, { Component } from 'react';
import PropTypes from 'prop-types';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

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

  handleFilterLeagueInputChange(e) {
    this.props.onFilterLeague(e.target.value);
  }
  
  handleFilterYearInputChange(e) {
    this.props.handleFilterYear(e.target.value);
  }
  
  render() {
    const index = this.props.weeks.findIndex(x=>x.seasonType === this.props.seasonType && x.weekNo === this.props.weekNo);
    const weeks = this.props.weeks.map((week, index) =>
                    <MenuItem key={index} value={index} primaryText={week.displayName}/>
                  );

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
                  value={0}
                  onChange={this.handleFilterLeagueInputChange}
                  style={dropDown.root}
                  autoWidth={false}
                  >
                  <MenuItem value={0} primaryText={this.props.league.toUpperCase()}/>
              </DropDownMenu>
              <DropDownMenu
                  value={0}
                  onChange={this.onFilterWeek}
                  style={dropDown.root}
                  autoWidth={false}
                  >
                  <MenuItem value={0} primaryText={this.props.year} />
              </DropDownMenu>
              <DropDownMenu
                  value={index}
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
  year: PropTypes.number,
  weekNo: PropTypes.number,
  seasonType: PropTypes.number,
  weeks: PropTypes.array,
  onFilterWeek: PropTypes.func
};

export default GameSearchBar;