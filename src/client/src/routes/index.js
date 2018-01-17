import React from 'react'
import { Route, Switch } from 'react-router-dom'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HomePage from '../containers/HomePage';
import ScoreboardPage from '../containers/ScoreboardPage';
import AboutPage from '../containers/AboutPage';
import LoginPage from '../containers/LoginPage';
import LeagueSelectionPage from '../containers/LeagueSelectionPage';
import LeaderPage from '../containers/LeaderPage';
import AuthenticationCallback from '../containers/AuthenticationCallback';

const routes = (
		 <MuiThemeProvider>
		    <div className="App">
		        <main>
		            <Switch>
		                <Route exact path='/' component={HomePage}/>
		                <Route exact path='/login' component={LoginPage}/>
		                <Route exact path='/leagues' component={LeagueSelectionPage}/>
		                <Route path='/scoreboards/:name' component={ScoreboardPage}/>
		                <Route path='/leaders/:name' component={LeaderPage}/>
		                <Route path='/about' component={AboutPage}/>
		                <Route path='/authenticationCallback' component={AuthenticationCallback}/>
		            </Switch>
		        </main>
		    </div>
		</MuiThemeProvider>
)

export default routes;