import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';

import Header from './Header';
import Chiefs from './images/kansas-city-chiefs.png';
import Patriots from './images/new-england-patriots.png';
import Falcons from './images/atlanta-falcons.png';
import Bears from './images/chicago-bears.png';

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
        let competitor = games.find(x=>x.competitorId === competitorId && x.id === gameId);

        if (competitor.showCheck) {
            competitor.showCheck = false;
        } else {
            games.map((game) => {
                if (game.id === gameId) {
                    game.showCheck = false;
                }

                return game;
            });

            competitor.showCheck = true;
        }

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
                <div style={{color:'#BA68C8'}}>*tap winners</div>
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
                                    <div style={{border: game.showCheck ? '8px solid #BA68C8': '0', height: "91%", }}>
                                    <div>
                                        <img className="competitor-image" src={ game.img } alt=""/>
                                    </div>
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