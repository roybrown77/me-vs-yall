import React from 'react'
import { Route, Switch } from 'react-router-dom';

import HomePage from '../containers/HomePage';
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
		                <Route exact path='/' component={HomePage}/>
		                <Route path='/scoreboards/:leagueName' component={ScoreboardPage}/>
		                <Route path='/leaders/:leagueName' component={LeaderPage}/>	
		                <Route path='/statOfTheWeek' component={StatOfTheWeekPage}/>	
		                <Route path='/feedback' component={Feedback}/>		   
		                <Route path='/about' component={AboutPage}/>
		                <Route path='/login' component={LoginPage}/>
		                <Route path='/authenticationCallback' component={AuthenticationCallback}/>
		            </Switch>
		        </div>
	        </main>
	    </div>
    </MuiThemeProvider>
)

export default routes;