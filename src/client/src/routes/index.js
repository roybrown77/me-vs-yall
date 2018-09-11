import React from 'react'
import { Route, Switch } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import HowToPlayPage from '../containers/HowToPlayPage';
import ScoreboardPage from '../containers/ScoreboardPage';
import LeaderPage from '../containers/LeaderPage';
import Feedback from '../containers/Feedback';
import AboutPage from '../containers/AboutPage';
import LoginPage from '../containers/LoginPage';
import AuthenticationCallback from '../containers/AuthenticationCallback';

const routes = (
	<MuiThemeProvider>
	    <div className="App">
	        <main>
	        	<div style={{height:'100%'}}>
		            <Switch>
		                <Route exact path='/' component={ScoreboardPage}/>
		                <Route path='/howtoplay' component={HowToPlayPage}/>
		                <Route path='/scoreboards/:leagueName' component={ScoreboardPage}/>
		                <Route path='/leaders/:leagueName' component={LeaderPage}/>	
		                <Route path='/feedback' component={Feedback}/>		   
		                <Route path='/about' component={AboutPage}/>
		                <Route exact path='/login' component={LoginPage}/>
		                <Route path='/authenticationCallback' component={AuthenticationCallback}/>
		            </Switch>
		        </div>
	        </main>
	    </div>
	</MuiThemeProvider>
)

export default routes;