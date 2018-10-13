import React from 'react';

import { googleLogin } from '../middleware/authenticationService';
import PageContainer from './PageContainer';

function LoginPage(props) {
        return (
        	<div>
                <PageContainer>
                    <div style={{padding: '12px'}}>
                        <div style={{fontWeight:'600'}}>
                            Log in with Google
                        </div>
                        <div className="fa fa-google" style={{cursor:'pointer'}} onClick={() => googleLogin()}/>
                    </div>
                </PageContainer>
	        </div>
        );
}

export default LoginPage;
