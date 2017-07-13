import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import {List, ListItem} from 'material-ui/List';

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

let players = [
    {
        id: 1,
        username: 'Roy',
        wins: 5,
        losses: 1,
        ties: 1
    },
    {
        id: 2,
        username: 'Scott',
        wins: 3,
        losses: 3,
        ties: 1
    }
];

class Leaders extends Component {
    constructor(props) {
        super(props);
        this.state = {value1: 1, value2: 1, value3: 1, winnerSelected: false};
    }

    handleChange1 = (event, index, value1) => this.setState({value1});
    handleChange2 = (event, index, value2) => this.setState({value2});
    handleChange3 = (event, index, value3) => this.setState({value3});

    render() {
        return (
            <div>
                <Header/>
                <div className="page-container" style={{marginTop: '8px'}}>
                    <div>
                        <DropDownMenu
                            value={this.state.value1}
                            onChange={this.handleChange1}
                            style={dropDown.root}
                            autoWidth={false}
                            >
                            <MenuItem value={1} primaryText="NFL"/>
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
                    <div>
                        <List style={{width:"100%", padding:"0 0 32px 0"}}>
                            <ListItem style={{paddingBottom:"16px"}}>
                                <div style={{fontWeight:"bold", color:"white", fontSize:"32px", float: "left", margin:"2px 2px 2px 128px",
                                backgroundColor: "#388E3C",
                                height: "1.5em",
                                width: "1.5em",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"}}>
                                    W
                                </div>
                                <div style={{fontWeight:"bold", color:"white", fontSize:"32px", float: "left", margin:"2px",
                                backgroundColor: "#D32F2F",
                                height: "1.5em",
                                width: "1.5em",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"}}>
                                    L
                                </div>
                                <div style={{fontWeight:"bold", color:"white", fontSize:"32px", float: "left", margin:"2px",
                                backgroundColor: "#FFFF8D",
                                height: "1.5em",
                                width: "1.5em",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center"}}>
                                    T
                                </div>
                            </ListItem>
                        </List>
                        <List style={{width:"100%"}}>
                        {players.map((player, index) => (
                                <ListItem style={{paddingBottom:"16px"}}>
                                    <div style={{fontWeight:"bold", color:"#757575", width:"40%", fontSize:"24px", float: "left"}}>
                                        {player.username}
                                    </div>
                                    <div style={{fontWeight:"bold", color:"#757575", width:"20%", fontSize:"24px", float: "left"}}>
                                        {player.wins}
                                    </div>
                                    <div style={{fontWeight:"bold", color:"#757575", width:"20%", fontSize:"24px", float: "left"}}>
                                        {player.losses}
                                    </div>
                                    <div style={{fontWeight:"bold", color:"#757575", width:"20%", fontSize:"24px", float: "left"}}>
                                        {player.ties}
                                    </div>
                                </ListItem>
                        ))}
                        </List>
                    </div>
                </div>
            </div>
        );
    }
}

export default Leaders;