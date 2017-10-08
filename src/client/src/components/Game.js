import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

import {GridList, GridTile} from 'material-ui/GridList';

import angry from '../styles/images/angry.png';
import money from '../styles/images/money.png';

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
    handleMakePick(gameId, pickId) {
        if ((!!this.props.pick && (this.props.pick.pickId === pickId || this.props.pick.inProgress)) || this.hasGameStarted(this.props.game.startDateTime)) {
            return;
        }

        const pick = {
            gameId: gameId,
            pickId: pickId
        };
        this.props.handleMakePick(pick);
    }

    hasGameStarted(dateTime) {
        const gameStartDateTime = moment(new Date(dateTime));
        const currentDateTime = moment(new Date());
        const difference = gameStartDateTime.diff(currentDateTime,'minutes');

        return difference < 5;
    }

    render() {
        const { game, pick } = this.props;
        const inProgress = !!pick && !!pick.inProgress;
        
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
                        <div 
                            className={inProgress && !competitor.showCheck ? 'fast-flash' : ''}
                            style={{border: competitor.showCheck ? 
                            (game.isGameOver ? '8px solid gray' : '8px solid #BA68C8') : (inProgress ? '8px solid #BA68C8' : '0'), height: "91%", color: competitor.color}}>
                                <div style={{position:'absolute', display: game.isGameOver ? (game.winner !== competitor._id && competitor.showCheck ? 'block' : 'none') : 'none'}}>
                                    <img className="emoji-image" src={angry} alt=""/>
                                </div>
                                <div style={{position:'absolute', display: game.isGameOver ? (game.winner === competitor._id && competitor.showCheck ? 'block' : 'none') : 'none'}}>
                                    <img className="emoji-image" src={money} alt=""/>
                                </div>
                                <div style={{fontSize:'36px', paddingTop:'10px', block: competitor.score ? 'block' : 'none'}}>
                                    {competitor.score}
                                </div>
                                <div style={{paddingTop: !!game.isGameOver ? '10px' : competitor.showCheck ? '20px' : '30px'}}>
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