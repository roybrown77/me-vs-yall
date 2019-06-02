import React from 'react';
import PropTypes from 'prop-types';
import routes from '../routes';
import { Router } from 'react-router-dom';

import {createBrowserHistory} from 'history';
const history = createBrowserHistory();

const App = () => {
  return (
    <Router history={history}>
    	{routes}
    </Router>
  )
}

App.propTypes = {
  history: PropTypes.object
};

export default App;