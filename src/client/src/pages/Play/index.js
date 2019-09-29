import React, { Component } from 'react';

import Slide from '@material-ui/core/Slide';

import { isLoggedIn, googleLogin } from '../../middleware/authenticationService';
import mvy from '../../styles/images/mvy.png';

class Play extends Component {
    componentWillMount() {
        if (isLoggedIn()) {
            setTimeout(() => { window.location = '/scoreboards/nfl'; }, 1000);
        } else {
            setTimeout(() => { googleLogin(); }, 1000);
        }
    }

    render() {
        return (
            <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
                <div style={{marginTop: '35%'}}>
                    <img style={{width:'275px'}} src={mvy} alt=""/>
                </div>
            </Slide>
        );
    }
}

export default Play;