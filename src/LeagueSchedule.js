import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import IconButton from 'material-ui/IconButton';
import ActionCheck from 'material-ui/svg-icons/action/done';
import Checkbox from 'material-ui/Checkbox';

import Header from './Header';

const gameCheck = {
    large: {
        width: '90',
        height: '90',
        borderLeft: '1px solid lightgray'
    },
    largeIcon: {
        width: '50',
        height: '50'
    }
};

const dropDown = {
    root: {
        width: '50%'
    }
};

const checkBox = {
    root: {
        width: '2em',
        height: '4em'
    }
};

const dropDownFull = {
    root: {
        width: '100%'
    }
};

const tilesData = [
    {
        img: 'images/falcons.png',
        title: 'Atlanta Falcons',
        author: 'add link'
    },
    {
        img: 'images/patriots.png',
        title: 'New England Patriots',
        author: 'add link'
    },
    {
        img: 'images/grid-list/camera-813814_640.jpg',
        title: 'Camera',
        author: 'Danson67'
    },
    {
        img: 'images/grid-list/morning-819362_640.jpg',
        title: 'Morning',
        author: 'fancycrave1'
    },
    {
        img: 'images/grid-list/hats-829509_640.jpg',
        title: 'Hats',
        author: 'Hans'
    },
    {
        img: 'images/grid-list/honey-823614_640.jpg',
        title: 'Honey',
        author: 'fancycravel'
    },
    {
        img: 'images/grid-list/vegetables-790022_640.jpg',
        title: 'Vegetables',
        author: 'jill111'
    },
    {
        img: 'images/grid-list/water-plant-821293_640.jpg',
        title: 'Water plant',
        author: 'BkrmadtyaKarki'
    },
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
        width: '100%'
    }
};

class LeagueScheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {value1: 1, value2: 1, value3: 1, gameId: -1};
        this.handleTeamClick = this.handleTeamClick.bind(this);
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});
    handleTeamClick = function (event, index, gameId) {
        this.setState({gameId});
    }

    render() {
        let name = this.props.match.params.name;
        let gameId = this.state.gameId;

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
                                key={tile.img}
                                title={tile.title}
                                style={grid.tile}
                                >
                                <div onClick={this.handleTeamClick}>
                                    <IconButton
                                        className="game-check"
                                        tooltip="top-center"
                                        touch={true}
                                        tooltipPosition="top-center"
                                        iconStyle={gameCheck.largeIcon}
                                        style={gameCheck.large}
                                        >
                                        <ActionCheck />
                                    </IconButton>
                                </div>
                                <img src={tile.img} alt=""/>
                            </GridTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

export default LeagueScheduler;