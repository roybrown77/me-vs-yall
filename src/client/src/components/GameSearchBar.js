import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
import moment from 'moment';
import { connect } from 'react-redux'
import { loadGames } from '../actions'

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

import api from '../middleware/api.js';

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
        marginBottom: '16px'
    }
};

class GameSearchBar extends Component {
  constructor(props) {
    super(props);
  }
  
  shouldComponenetUpdate() {
    return false;
  }

  handleFilterLeagueInputChange(e) {
    this.props.onFilterLeague(e.target.value);
  }
  
  handleFilterYearInputChange(e) {
    this.props.handleFilterYear(e.target.value);
  }

  onFilterWeek(event, index) {
    this.props.onFilterWeek(index);
  }
  
  render() {
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
            <DropDownMenu
                value={0}
                onChange={this.handleFilterLeagueInputChange}
                style={dropDown.root}
                autoWidth={false}
                >
                <MenuItem value={0} primaryText={this.props.league}/>
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
                value={this.props.weekNo}
                onChange={this.handleFilterWeekInputChange}
                style={dropDownFull.root}
                autoWidth={false}
                >
                {weeks}
            </DropDownMenu>
        </div>);
    }
}

GameSearchBar.propTypes = {
  league: PropTypes.string,
  year: PropTypes.number,
  weekNo: PropTypes.number,
  weeks: PropTypes.array,
  onFilterWeek: PropTypes.func
};

export default GameSearchBar;