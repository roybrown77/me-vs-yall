import React, { Component } from 'react';

import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';

import Header from './Header';

const styles = {
    customWidth: {
        width: '50%'
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
            </div>
        );
    }
}

export default LeagueScheduler;