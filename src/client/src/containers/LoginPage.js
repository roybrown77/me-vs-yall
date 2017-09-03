import React from 'react';

import { googleLogin } from '../middleware/AuthService';
import Header from '../components/Header';
import Footer from '../components/Footer';

function LoginPage(props) {
        return (
        	<div>
                <Header></Header>
	            <div className="page-container">
	            	<div style={{fontSize:'25px', color:'gray', marginTop: '24px'}}>Login</div>
	            	<div style={{fontSize:'20px', color:'gray', margin: '24px 0'}}>with</div>
	            	<div className="fa fa-google" style={{cursor:'pointer'}} onClick={() => googleLogin()}></div>
	            </div>
	            <Footer></Footer>
	        </div>
        );
}

export default LoginPage;