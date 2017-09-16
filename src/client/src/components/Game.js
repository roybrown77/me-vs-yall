import React, { Component } from 'react';
import PropTypes from 'prop-types';
import update from 'react-addons-update';
import createHistory from 'history/createBrowserHistory'
const history = createHistory();
import moment from 'moment';
import { connect } from 'react-redux'


import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import ActionAndroid from 'material-ui/svg-icons/action/android';
import RaisedButton from 'material-ui/RaisedButton';

import Header from '../components/Header';
import Footer from '../components/Footer';
import Spinner from '../components/Spinner';

const grid = {
    root: {
        marginTop: '12px'
    },
    list: {
        width: '100%',
        backgroundColor: '#fff',
        margin: '0 !important'
    },
    tile: {
        width: '100%',
        cursor: 'pointer',
        font: '4rem/1 Permanent Marker,sans-serif', 
        color: '#000'
    },
    subTitleStyle: {
        margin: '0'
    },
    titleStyle: {
        font:'1.4rem/1 Permanent Marker,sans-serif', 
        color: '#000'
    },
    titleBackground: 'transparent'
};

class Game extends Component {
    constructor(props) {
        super(props);

        this.state = {
            gameAndPickLoading: false,
            pickProcessing: false
        };
    }

    handleMakePick(gameId, pickId) {
        const pick = {
            leagueId: '59723313734d1d6202a85f10', 
            weekNo: 7,
            gameId: gameId,
            pickId: pickId
        };
        this.props.handleMakePick(pick);
    }

    render() {
        const { game, pick } = this.props;

        return (
            <div key={game._id} style={{width:'100%', marginBottom: '12px'}}>
                <GridList key={game._id + "-gridlist"} style={grid.list}>
                    {game.competitors.map((competitor) => (
                        <GridTile
                        key={game._id + "." + competitor._id}
                        className="grid-tile"
                        style={grid.tile}
                        title={competitor.name}
                        titleStyle={grid.titleStyle}
                        titleBackground={grid.titleBackground}
                        onClick={() => this.handleMakePick(game._id, competitor._id)}>
                        <div style={{border: competitor.showCheck ? 
                            (game.isGameOver ? '8px solid gray' : '8px solid #BA68C8') : '0', height: "91%", color: competitor.color}}>
                                <div style={{fontSize:'36px', paddingTop:'10px', block: competitor.score ? 'block' : 'none'}}>
                                    {competitor.score}
                                </div>
                                <div style={{paddingTop: competitor.score ? '10px' : '26px'}}>
                                    {competitor.shortLocation}
                                </div>
                        </div>
                        </GridTile>
                    ))}                            
                </GridList>
                <div style={{width: '100%',fontSize: '14px',fontWeight: 'bold',color: 'gray'}}>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.startDateTimeDisplay}</div>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.station}</div>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumName}</div>
                    <div style={{float: 'left', marginRight:'24px'}}>{game.stadiumCity}</div>
                </div>
            </div>
        );
    }
}

Game.propTypes = {
  game: PropTypes.object,
  pick: PropTypes.object,
  handleMakePick: PropTypes.func
};

export default Game;