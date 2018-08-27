import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div style={{margin:'16px', marginTop: '91px'}}>
                    Send ways we can improve at mevsyallsports@gmail.com!
                </div>
                <Footer/>
            </div>
        );
    }
}

export default AboutPage;