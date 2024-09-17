import { useEffect } from 'react';

import Slide from '@material-ui/core/Slide';

import { isLoggedIn, googleLogin } from '../../utilities/authenticationClient';
import mvy from '../../styles/images/mvy.png';

const Play = () => {
    useEffect(() => {
        if (isLoggedIn()) {
            setTimeout(() => { window.location = '/scoreboards/nfl'; }, 1000);
        } else {
            setTimeout(() => { googleLogin(); }, 1000);
        }
    },[]);

    return (
        <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
            <div style={{marginTop: '35%'}}>
                <img style={{width:'275px'}} src={mvy} alt=""/>
            </div>
        </Slide>
    );
};

export default Play;