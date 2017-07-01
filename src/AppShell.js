import React, { Component } from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import AppBar from 'material-ui/AppBar';

class AppShell extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => this.setState({open: !this.state.open});
    handleClose = () => this.setState({open: false});

    render() {
        return (
            <MuiThemeProvider>
                <div className="App">
                    <AppBar
                        id="app-bar"
                        iconClassNameRight="muidocs-icon-navigation-expand-more"
                        onTouchTap={this.handleToggle}
                        />
                    <Drawer docked={false}
                            open={this.state.open}
                            onRequestChange={(open) => this.setState({open})}
                        >
                        <MenuItem onTouchTap={this.handleClose}>Menu Item</MenuItem>
                        <MenuItem onTouchTap={this.handleClose}>Menu Item 2</MenuItem>
                    </Drawer>
                </div>
            </MuiThemeProvider>
        );
    }
}

export default AppShell;