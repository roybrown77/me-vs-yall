import React from 'react';

import { googleLogin, previewLogin } from './middleware/AuthService';
import Header from './Header';
import Footer from './Footer';

function Login(props) {
        return (
        	<div>
                <Header/>
	            <div className="page-container">
	            <div style={{margin: '24px 0'}}></div>
	            	<div className="fa fa-google" style={{cursor:'pointer'}} onClick={() => googleLogin()}></div>
	            	<div style={{fontSize:'25px', color:'gray', margin: '24px 0'}}>or</div>
	            	<div className="fa preview" style={{cursor:'pointer', color:'white'}} onClick={() => previewLogin()}>
	            		Preview
	            	</div>
	            </div>
	            <Footer/>
	        </div>
        );
}

export default Login;