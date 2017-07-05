import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import './App.css';
import Home from './Home';
import LeagueSelection from './LeagueSelection';
import LeagueSchedule from './LeagueSchedule';
import About from './About';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {open: false};
    }

    handleToggle = () => {
        this.setState({open: !this.state.open});
    }

    handleClose = () => {
        this.setState({open: false});
    }

   render() {
    return (
        <BrowserRouter>
            <MuiThemeProvider>
                <div className="App">
                    <main>
                        <Switch>
                            <Route exact path='/' component={Home}/>
                            <Route exact path='/league' component={LeagueSelection}/>
                            <Route path='/league/:name' component={LeagueSchedule}/>
                            <Route path='/about' component={About}/>
                        </Switch>
                    </main>
                </div>
            </MuiThemeProvider>
        </BrowserRouter>
    );
  }
}

export default App;