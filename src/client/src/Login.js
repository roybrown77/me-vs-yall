import React from 'react';
import { googleLogin } from './middleware/AuthService';

function Login(props) {
        return (
            <div id="login-container fade-in">
            	<div style={{fontSize:'25px', color:'gray', marginTop: '24px'}}>Login</div>
            	<div style={{fontSize:'20px', color:'gray', margin: '24px 0'}}>connect with</div>
            	<a href="#" className="fa fa-google" onClick={() => googleLogin()}></a>
            </div>
        );
}

export default Login;