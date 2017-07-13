import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import ActionCheck from 'material-ui/svg-icons/action/done';

import Header from './Header';
import Chiefs from './images/kansas-city-chiefs.png';
import Patriots from './images/new-england-patriots.png';
import Falcons from './images/atlanta-falcons.png';
import Bears from './images/chicago-bears.png';

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

let games = [
    {
        id: 1,
        competitorId: 1,
        img: Chiefs,
        name: 'Kansas City Chiefs',
        showCheck: false
    },
    {
        id: 1,
        competitorId: 2,
        img: Patriots,
        name: 'New England Patriots',
        showCheck: false
    },
    {
        id: 2,
        competitorId: 1,
        img: Falcons,
        name: 'Atlanta Falcons',
        showCheck: false
    },
    {
        id: 2,
        competitorId: 2,
        img: Bears,
        name: 'Chicago Bears',
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

class LeagueSchedule extends Component {
    constructor(props) {
        super(props);
        this.state = {value1: 1, value2: 1, value3: 1, winnerSelected: false};
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});

    selectCompetitor (gameId, competitorId) {
        games.map((game) => {
            if (game.id === gameId) {
                game.showCheck = false;
            }
        });

        let competitor = games.find(x=>x.competitorId === competitorId && x.id === gameId);
        competitor.showCheck = !competitor.showCheck;
        this.setState({winnerSelected: true});
    }

    render() {
        let name = this.props.match.params.name;

        return (
            <div>
                <Header/>
                <div className="page-container">
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
                        {games.map((game, index) => (
                            <GridTile
                                key={game.id + "." + game.competitorId}
                                title={game.name}
                                style={grid.tile}
                                onClick={() => this.selectCompetitor(game.id, game.competitorId)}
                                >
                                <div style={{display: game.showCheck ? 'block' : 'none'}}>
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
                                <div style={{display: game.showCheck ? 'none' : 'block'}}>
                                    <img className="competitor-image" src={ game.img } alt=""/>
                                </div>
                            </GridTile>
                        ))}
                    </GridList>
                </div>
                </div>
            </div>
        );
    }
}

export default LeagueSchedule;