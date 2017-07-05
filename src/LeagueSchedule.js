import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {GridList, GridTile} from 'material-ui/GridList';
import IconButton from 'material-ui/IconButton';
import Subheader from 'material-ui/Subheader';
import StarBorder from 'material-ui/svg-icons/toggle/star-border';

import Header from './Header';

const styles = {
    customWidth: {
        width: '50%'
    }
};

const tilesData = [
    {
        img: 'images/grid-list/00-52-29-429_640.jpg',
        title: 'Breakfast',
        author: 'jill111'
    },
    {
        img: 'images/grid-list/burger-827309_640.jpg',
        title: 'Tasty burger',
        author: 'pashminu'
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

const styles2 = {
    root: {
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-around'
    },
    gridList: {
        width: '100%'
    }
};

class LeagueScheduler extends Component {
    constructor(props) {
        super(props);
        this.state = {value1: 1, value2: 1};
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});

    render() {
        let name = this.props.match.params.name;

        return (
            <div>
                <Header/>
                <div>
                    <DropDownMenu
                        value={this.state.value1}
                        onChange={this.handleChange1}
                        style={styles.customWidth}
                        autoWidth={false}
                        >
                        <MenuItem value={1} primaryText={name.toUpperCase()}/>
                    </DropDownMenu>
                    <DropDownMenu
                        value={this.state.value2}
                        onChange={this.handleChange2}
                        style={styles.customWidth}
                        autoWidth={false}
                        >
                        <MenuItem value={1} primaryText="Week 1" />
                    </DropDownMenu>
                </div>
                <div style={styles2.root}>
                    <GridList
                        cellHeight={180}
                        style={styles2.gridList}
                        >
                        <Subheader>Week 1 9/7 - 9/10</Subheader>
                        {tilesData.map((tile) => (
                            <GridTile
                                key={tile.img}
                                title={tile.title}
                                subtitle={<span>by <b>{tile.author}</b></span>}
                                actionIcon={<IconButton><StarBorder color="white" /></IconButton>}
                                >
                                <img src={tile.img} />
                            </GridTile>
                        ))}
                    </GridList>
                </div>
            </div>
        );
    }
}

export default LeagueScheduler;