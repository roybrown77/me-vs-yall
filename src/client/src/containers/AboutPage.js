import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div className="page-container" style={{marginTop: '1em'}}>
                    Pick winners of sporting events and compete with others around the world.
                </div>
                <Footer/>
            </div>
        );
    }
}

export default AboutPage;