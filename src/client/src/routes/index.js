import React from 'react'
import { Route, Switch } from 'react-router'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Home from '../components/Home';
import LeagueSelection from '../components/LeagueSelection';
import LeagueSchedule from '../components/LeagueSchedule';
import Leaders from '../components/Leaders';
import About from '../components/About';
import Login from '../components/Login';
import { requireAuth } from '../middleware/AuthService';
import Callback from '../components/Callback';

const routes = (
	 <MuiThemeProvider>
	    <div className="App">
	        <main>
	            <Switch>
	                <Route exact path='/' component={Home}/>
	                <Route exact path='/login' component={Login}/>
	                <Route exact path='/leagues' component={LeagueSelection}/>
	                <Route path='/leagues/:name' component={LeagueSchedule} onEnter={requireAuth}/>
	                <Route path='/leaders' component={Leaders}/>
	                <Route path='/about' component={About}/>
	                <Route path='/callback' component={Callback}/>
	            </Switch>
	        </main>
	    </div>
	</MuiThemeProvider>
)

export default routes