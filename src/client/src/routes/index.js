import React from 'react'
import { Route, Switch } from 'react-router-dom';

import MvyPage from '../containers/MvyPage';
import HowToPlayPage from '../containers/HowToPlayPage';
import Rules from '../containers/Rules';
import ScoreboardPage from '../containers/ScoreboardPage';
import LeaderPage from '../containers/LeaderPage';
import StatOfTheWeekPage from '../containers/StatOfTheWeekPage';
import Feedback from '../containers/Feedback';
import AboutPage from '../containers/AboutPage';
import LoginPage from '../containers/LoginPage';
import AuthenticationCallback from '../containers/AuthenticationCallback';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
	typography: {
    	useNextVariants: true
  	}
});

const routes = (
	<MuiThemeProvider theme={theme}>
		<div className="App">
	        <main>
	        	<div style={{height:'100%'}}>
		            <Switch>
		                <Route exact path='/' component={ScoreboardPage}/>
		                <Route exact path='/mvy' component={MvyPage}/>
		                <Route path='/howtoplay' component={HowToPlayPage}/>
		                <Route path='/rules' component={Rules}/>
		                <Route path='/scoreboards/:leagueName' component={ScoreboardPage}/>
		                <Route path='/leaders/:leagueName' component={LeaderPage}/>	
		                <Route path='/statOfTheWeek' component={StatOfTheWeekPage}/>	
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