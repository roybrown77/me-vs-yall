import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import Promo from '../pages/Promo';
import Home from '../pages/Home';
import Scoreboard from '../pages/Scoreboard';
import Leader from '../pages/Leader';
import Shop from '../pages/Shop';
import StatOfTheWeek from '../pages/StatOfTheWeek';
import Tips from '../pages/Tips';
import Contact from '../pages/Contact';
import About from '../pages/About';
import MailingList from '../pages/MailingList';
import Login from '../pages/Login';
import AuthenticationCallback from '../pages/AuthenticationCallback';

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
		                <Route exact path='/' component={Home}/>
		                <Route path='/scoreboards/:leagueName' component={Scoreboard}/>
		                <Route path='/leaders/:leagueName' component={Leader}/>
		                <Route path='/shop' component={Shop}/>
		                <Route path='/statoftheweek' component={StatOfTheWeek}/>
		                <Route path='/tips' component={Tips}/>
		                <Route path='/contact' component={Contact}/>
		                <Route path='/about' component={About}/>
		                <Route path='/mailinglist' component={MailingList}/>
		                <Route path='/login' component={Login}/>
		                <Route path='/authenticationCallback' component={AuthenticationCallback}/>
		            </Switch>
		        </div>
	        </main>
	    </div>
    </MuiThemeProvider>
)

export default routes;