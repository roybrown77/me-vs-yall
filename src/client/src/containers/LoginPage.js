import React from 'react';

import { googleLogin, previewLogin } from '../middleware/authenticationService';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LoginPage(props) {
        return (
        	<div>
                <Header/>
	            <div className="page-container">
	            <div style={{fontSize:'25px', color:'gray', margin: '24px 0'}}>login</div>
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

export default LoginPage;