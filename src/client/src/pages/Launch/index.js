import { useEffect } from 'react';

import Slide from '@material-ui/core/Slide';

import mvy from '../../styles/images/mvy.png';

const Launch = () => {
    useEffect(() => {
        setTimeout(() => { window.location = '/'; }, 1000);
    }, []);

    return (
        <Slide direction={'down'} in={true} mountOnEnter unmountOnExit timeout={750}>
            <div style={{marginTop: '35%'}}>
                <img style={{width:'275px'}} src={mvy} alt=""/>
            </div>
        </Slide>
    );
};

export default Launch;