import React from 'react';

import { googleLogin } from '../middleware/authenticationService';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LoginPage(props) {
        return (
        	<div>
                <Header/>
	            <div style={{marginTop: '91px',fontWeight:'600'}}>
                    Login in with Google
                </div>
            	<div className="fa fa-google" style={{cursor:'pointer'}} onClick={() => googleLogin()}/>
	            <Footer/>
	        </div>
        );
}

export default LoginPage;