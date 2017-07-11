import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ActionCheck from 'material-ui/svg-icons/action/done';

import Header from './Header';
import Background from './images/patriots.png';

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

const tilesData = [
    {
        gameId: 1,
        competitorId: 1,
        img: '/src/images/falcons.png',
        name: 'Atlanta Falcons',
    },
    {
        gameId: 1,
        competitorId: 2,
        img: '/src/images/patriots.png',
        name: 'New England Patriots',
        showCheck: true
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
        background: 'rgba(0, 0, 0, 0.4)'
    }
};

const image = {
    root: {
        backgroundImage: `url(${'/src/images/falcons.png'}`
    }
};

class LeagueScheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {value1: 1, value2: 1, value3: 1, gameId: -1};
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});

    selectCompetitor (gameId, competitorId) {
    }

    render() {
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
                                <div className="game-check2" style={{display: tile.showCheck ? 'block' : 'none'}}>
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
                                <img src={ Background } alt="" style={{display: tile.showCheck ? 'none' : 'contents'}}/>
                            </GridTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

export default LeagueScheduler;