import React from 'react';

import { googleLogin } from '../middleware/authenticationService';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LoginPage(props) {
        return (
        	<div>
                <Header/>
	            <div className="page-container">
	            	<div className="fa fa-google" style={{cursor:'pointer', margin: '24px 0'}} onClick={() => googleLogin()}/>	        	
	            </div>
	            <Footer/>
	        </div>
        );
}

export default LoginPage;