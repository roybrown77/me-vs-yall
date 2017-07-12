import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ActionCheck from 'material-ui/svg-icons/action/done';

import Header from './Header';
import Patriots from './images/new-england-patriots.png';
import Falcons from './images/atlanta-falcons.png';

const gameCheck = {
    large: {
        width: 120,
        height: 120
    },
    largeIcon: {
        width: 90,
        height: 90,
        color: 'green'
    }
};

const dropDown = {
    root: {
        width: '50%'
    }
};

const dropDownFull = {
    root: {
        width: '100%'
    }
};

let tilesData = [
    {
        gameId: 1,
        competitorId: 1,
        img: Falcons,
        name: 'Atlanta Falcons',
        showCheck: false
    },
    {
        gameId: 1,
        competitorId: 2,
        img: Patriots,
        name: 'New England Patriots',
        showCheck: false
    },
    {
        gameId: 2,
        competitorId: 1,
        img: Falcons,
        name: 'Atlanta Falcons',
        showCheck: false
    },
    {
        gameId: 2,
        competitorId: 2,
        img: Patriots,
        name: 'New England Patriots',
        showCheck: false
    }
];

const grid = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around',
        marginTop: '8px'
    },
    list: {
        width: '100%'
    },
    tile: {
        width: '100%',
        background: 'lightgray',
        cursor: 'pointer'
    }
};

class LeagueScheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {value1: 1, value2: 1, value3: 1, winnerSelected: false};
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});

    selectCompetitor (gameId, competitorId) {
        tilesData.map((tile) => {
            if (tile.gameId === gameId) {
                tile.showCheck = false;
            }
        });

        let competitor = tilesData.find(x=>x.competitorId === competitorId && x.gameId === gameId);
        competitor.showCheck = !competitor.showCheck;
        this.setState({winnerSelected: true});
    }

    render() {
        let name = this.props.match.params.name;

        return (
            <div>
                <Header/>
                <div style={{marginTop: '8px'}}>
                    <DropDownMenu
                        value={this.state.value1}
                        onChange={this.handleChange1}
                        style={dropDown.root}
                        autoWidth={false}
                        >
                        <MenuItem value={1} primaryText={name.toUpperCase()}/>
                    </DropDownMenu>
                    <DropDownMenu
                        value={this.state.value2}
                        onChange={this.handleChange2}
                        style={dropDown.root}
                        autoWidth={false}
                        >
                        <MenuItem value={1} primaryText="2017" />
                    </DropDownMenu>
                    <DropDownMenu
                        value={this.state.value3}
                        onChange={this.handleChange3}
                        style={dropDownFull.root}
                        autoWidth={false}
                        >
                        <MenuItem value={1} primaryText="Week 1 Thursday 9/7 - Monday 9/11" />
                    </DropDownMenu>
                </div>
                <div style={{color:'red'}}>*tap winners</div>
                <div style={grid.root}>
                    <GridList
                        cellHeight={180}
                        style={grid.list}
                        >
                        {tilesData.map((tile) => (
                            <GridTile
                                key={tile.gameId + "." + tile.competitorId}
                                title={tile.name}
                                style={grid.tile}
                                onClick={() => this.selectCompetitor(tile.gameId, tile.competitorId)}
                                >
                                <div className="game-check" style={{display: tile.showCheck ? 'block' : 'none'}}>
                                    <IconButton
                                        tooltip="top-center"
                                        touch={true}
                                        tooltipPosition="top-center"
                                        iconStyle={gameCheck.largeIcon}
                                        style={gameCheck.large}
                                        >
                                        <ActionCheck />
                                    </IconButton>
                                </div>
                                <div style={{display: tile.showCheck ? 'none' : 'block'}}>
                                    <img className="competitor-image" src={ tile.img } alt=""/>
                                </div>
                            </GridTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

export default LeagueScheduler;