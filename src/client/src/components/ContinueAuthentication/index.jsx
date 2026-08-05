import { useState } from 'react';
import Snackbar from '@mui/material/Snackbar';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';

import GoogleImage from '../../styles/images/google.png';

import { 
    autoGoogleLogin, 
    isLoggedIn, 
    continueAuthentication, 
    waitForAuth, 
    isConfirmedAuthentication,
    getUser 
} from '../../utilities/authenticationClient';

const ContinueAuthentication = () => {
    const [open, setOpen] = useState(true);
    const [user] = useState(getUser());
    const [authUserImageFailed, setAuthUserImageFailed] = useState(false);

    const handleClose = () => {
        setOpen(false);
        continueAuthentication(false);
    };

    const handleContinueAuthentication = () => {
        setOpen(false);
        continueAuthentication(true);
    };

    if (!waitForAuth() && !isLoggedIn()) {
        autoGoogleLogin();
        return;
    }

    if (!isConfirmedAuthentication() && !waitForAuth()) {
        return (
            <Slide direction={'up'} in={true} mountOnEnter unmountOnExit timeout={750}>
                <Snackbar
                    className='one-tap-sign-in'
                    open={open}
                    autoHideDuration={30000}
                >
                    <div style={{fontFamily: 'monospace', backgroundColor: '#fff', width: '100%', textAlign: 'left', borderRadius: '15px'}}>
                        <div>
                            <div style={{display: 'inline-flex', margin: '15px 0 15px 10px'}}>
                                <img style={{height: '20px', width: '20px', borderRadius: '50px'}} src={GoogleImage} alt="Google"/>
                                <div style={{margin: '0 30px 0 15px'}}>Sign in to Me vs Yall with Google</div>
                                <div style={{
                                    margin: '-5px 0 0 0',
                                    right: '10px',
                                    position: 'absolute',
                                    cursor: 'pointer'
                                }}>
                                    <CloseIcon onClick={handleClose} />
                                </div>
                            </div>
                            <div onClick={handleContinueAuthentication} 
                                 style={{
                                    cursor: 'pointer', 
                                    display: 'inline-flex', 
                                    borderTop: '1px solid lightgray', 
                                    borderBottom: '1px solid lightgray', 
                                    width: '100%', 
                                    padding: '15px 0', 
                                    marginBottom: '15px'
                            }}>
                                <div style={{marginLeft: '10px'}}>
                                    {!authUserImageFailed && user.picture && (
                                        <img
                                            style={{height: '30px', width: '30px', borderRadius: '50px'}}
                                            src={user.picture}
                                            alt="Sign in to Me vs Yall"
                                            onError={() => setAuthUserImageFailed(true)}
                                        />
                                    )}
                                    {(authUserImageFailed || !user.picture) && (
                                        <div
                                            style={{
                                                height: '30px',
                                                width: '30px',
                                                borderRadius: '50px',
                                                backgroundColor: '#707070',
                                                color: '#fff',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '0.9rem',
                                                fontWeight: '700',
                                            }}
                                        >
                                            {(user.given_name || user.name || '?')[0]}
                                        </div>
                                    )}
                                </div>
                                <div style={{width: '100%', marginLeft: '10px'}}>
                                    <div>
                                        {user.given_name} {user.family_name}
                                    </div>
                                    <div style={{color: 'gray'}}>
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Snackbar>
            </Slide>
        )
    } else {
        return null;
    }
};

export default ContinueAuthentication;