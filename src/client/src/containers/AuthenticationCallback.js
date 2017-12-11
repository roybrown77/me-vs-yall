import { Component } from 'react';
import { setIdToken, setAccessToken, setExpiration } from '../middleware/authenticationService';

class AuthenticationCallback extends Component {
  componentDidMount() {
    setAccessToken();
    setIdToken();
    setExpiration();
    window.location.href = "/leagues/nfl";
  }

  render() {
    return null;
  }
}

export default AuthenticationCallback;