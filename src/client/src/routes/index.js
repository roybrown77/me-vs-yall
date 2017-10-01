import React from 'react'
import { Route, Switch } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from '../containers/HomePage';
import SchedulePage from '../containers/SchedulePage';
import AboutPage from '../containers/AboutPage';
import LoginPage from '../containers/LoginPage';
import LeagueSelectionPage from '../containers/LeagueSelectionPage';
import LeaderPage from '../containers/LeaderPage';
import Callback from '../components/Callback';

const routes = (
	 <MuiThemeProvider>
	    <div className="App">
	        <main>
	            <Switch>
	                <Route exact path='/' component={HomePage}/>
	                <Route exact path='/login' component={LoginPage}/>
	                <Route exact path='/leagues' component={LeagueSelectionPage}/>
	                <Route path='/leagues/:name' component={SchedulePage}/>
	                <Route path='/leaders' component={LeaderPage}/>
	                <Route path='/about' component={AboutPage}/>
	                <Route path='/callback' component={Callback}/>
	            </Switch>
	        </main>
	    </div>
	</MuiThemeProvider>
)

export default routes