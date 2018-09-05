import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div style={{margin:'16px', marginTop: '91px'}}>
                    Send us ways we can improve at https://github.com/roybrown77/me-vs-yall/issues
                </div>
                <Footer/>
            </div>
        );
    }
}

export default AboutPage;