import React from 'react';

import { googleLogin } from '../middleware/authenticationService';
import PageContainer from './PageContainer';

const styles = {
    login: {
        margin: '8px',
        fontWeight: '600'
    },
    google: {
        border: '8px solid #dd4b39',
        borderRadius: '8px',
        color: '#dd4b39',
        cursor:'pointer'
    }
};

function LoginPage(props) {
        return (
        	<div>
                <PageContainer>
                    <div style={{paddingTop: '16px'}}>
                        <div style={styles.login}>
                            Log in with Google
                        </div>
                        <div className="fa fa-google" style={styles.google} onClick={() => googleLogin()}/>
                    </div>
                </PageContainer>
	        </div>
        );
}

export default LoginPage;
