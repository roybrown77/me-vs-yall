import React from 'react';

import { googleLogin } from './middleware/AuthService';
import Header from './Header';
import Footer from './Footer';

function Login(props) {
        return (
        	<div>
                <Header/>
	            <div className="page-container">
	            	<div style={{fontSize:'25px', color:'gray', marginTop: '24px'}}>Login</div>
	            	<div style={{fontSize:'20px', color:'gray', margin: '24px 0'}}>with</div>
	            	<a href="#" className="fa fa-google" onClick={() => googleLogin()}></a>
	            </div>
	            <Footer/>
	        </div>
        );
}

export default Login;