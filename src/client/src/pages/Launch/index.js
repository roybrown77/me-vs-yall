import React, { Component } from 'react';

import Slide from '@material-ui/core/Slide';

import mvy from '../../styles/images/mvy.png';

class Launch extends Component {
    componentDidMount() {
        setTimeout(() => { window.location = '/'; }, 1000);
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

export default Launch;