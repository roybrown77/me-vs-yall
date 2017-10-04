import React from 'react';
import PropTypes from 'prop-types';
//import { ConnectedRouter } from 'connected-react-router/immutable';
import routes from '../routes';
import { BrowserRouter } from 'react-router-dom';

const App = ({ history }) => {
  return (
    <BrowserRouter>
    {routes}
    </BrowserRouter>
  )
}

App.propTypes = {
  history: PropTypes.object
};

export default App;