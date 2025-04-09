import './styles/App.css';

import { render } from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Home from './pages/Home';
import Scoreboard from './pages/Scoreboard';
import Leader from './pages/Leader';
import Shop from './pages/Shop';
import OfTheWeek from './pages/OfTheWeek';
import Tips from './pages/Tips';
import Origin from './pages/Origin';
import Contact from './pages/Contact';
import Play from './pages/Play';
import AuthenticationCallback from './pages/AuthenticationCallback';

render(
  <BrowserRouter>
      <div className="App">
        <main>
          <div style={{height:'100%'}}>
              <Switch>
                <Route exact path='/' component={Home}/>
                <Route path='/scoreboards/:leagueName' component={Scoreboard}/>
                <Route path='/leaders/:leagueName' component={Leader}/>
                <Route path='/shop' component={Shop}/>
                <Route path='/oftheweek' component={OfTheWeek}/>
                <Route path='/tips' component={Tips}/>
                <Route path='/origin' component={Origin}/>
                <Route path='/play' component={Play}/>
                <Route path='/contact' component={Contact}/>
                <Route path='/authenticationCallback' component={AuthenticationCallback}/>
                <Route path='*' component={Home}/>
              </Switch>
          </div>
        </main>
    </div>
  </BrowserRouter>,
  document.getElementById('root')
);