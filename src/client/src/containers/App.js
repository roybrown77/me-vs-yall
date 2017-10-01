import React from 'react';
import PropTypes from 'prop-types';
//import { ConnectedRouter } from 'connected-react-router/immutable';
import routes from '../routes';
import { Route, Router } from 'react-router-dom';

const App = ({ history }) => {
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