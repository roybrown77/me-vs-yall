import { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setIdToken, setAccessToken, setExpiration } from '../middleware/authenticationService';
import { loadUser } from '../actions';

class AuthenticationCallback extends Component {
  componentWillMount() {
    setAccessToken();
    setIdToken();
    setExpiration();
    this.props.loadUser();
  }

  render() {
    return null;
  }
}

AuthenticationCallback.propTypes = {
    loadUser: PropTypes.func.isRequired
};

export default connect(undefined, {
  loadUser
})(AuthenticationCallback);