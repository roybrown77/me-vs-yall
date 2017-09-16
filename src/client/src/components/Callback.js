import { Component } from 'react';
import { setIdToken, setAccessToken, setExpiration } from '../middleware/AuthService';

class Callback extends Component {
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

export default Callback;