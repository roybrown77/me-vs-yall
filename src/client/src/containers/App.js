import React from 'react';
import PropTypes from 'prop-types';
import routes from '../routes';
import { BrowserRouter } from 'react-router-dom';

const App = () => {
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