import React, { Component } from 'react';
import { Switch, Route, BrowserRouter } from 'react-router-dom'

import MuiThemeProvider from '../node_modules/material-ui/styles/MuiThemeProvider';

import Callback from './Callback';
import Home from './Home';
import LeagueSelection from './LeagueSelection';
import LeagueSchedule from './LeagueSchedule';
import Leaders from './Leaders';
import About from './About';

class App extends Component {
   render() {
    return (
        <BrowserRouter>
            <MuiThemeProvider>
                <div className="App">
                    <main>
                        <Switch>
                            <Route exact path='/' component={Home}/>
                            <Route exact path='/leagues' component={LeagueSelection}/>
                            <Route path='/leagues/:name' component={LeagueSchedule}/>
                            <Route path='/leaders' component={Leaders}/>
                            <Route path='/about' component={About}/>
                            <Route path='/callback' component={Callback}/>
                        </Switch>
                    </main>
                </div>
            </MuiThemeProvider>
        </BrowserRouter>
    );
  }
}

export default App;