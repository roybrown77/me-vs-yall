import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';

import Header from './Header';

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
        this.state = {value1: 1, value2: 1, value3: 1};
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});

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
                <div style={grid.root}>
                    <GridList
                        cellHeight={180}
                        style={grid.list}
                        >
                        <Subheader></Subheader>
                        {tilesData.map((tile) => (
                            <GridTile
                                key={tile.img}
                                title={tile.title}
                                style={grid.tile}
                                >
                                <div className="game-check"></div>
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