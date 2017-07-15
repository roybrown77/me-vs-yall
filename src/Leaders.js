import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Header from './Header';
import Footer from './Footer';

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
                    <table style={{width:"100%"}}>
                        <tbody>
                            <tr>
                                <th>
                                </th>
                                <th>
                                    <div className="leader-win-loss-tie-header" style={{backgroundColor: "#388E3C"}}>
                                        W
                                    </div>
                                 </th>
                                 <th>
                                    <div className="leader-win-loss-tie-header" style={{backgroundColor: "#D32F2F"}}>
                                        L
                                    </div>
                                 </th>
                                 <th>
                                    <div className="leader-win-loss-tie-header" style={{backgroundColor: "#f0ad4e"}}>
                                        T
                                    </div>
                                 </th>
                            </tr>
                            {players.map((player, index) => (
                                <tr key={player.id}
                                    style={{paddingBottom:"16px"}}>
                                    <td>
                                        <div className="leader-item">
                                            {player.username}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="leader-item">
                                            {player.wins}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="leader-item">
                                            {player.losses}
                                        </div>
                                    </td>
                                    <td>
                                        <div className="leader-item">
                                            {player.ties}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default Leaders;