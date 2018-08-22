import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <br />
                <div style={{textSlign: 'left'}}>
                    In 2007, a buddy of mine and I would simply text who we thought would win the
                    upcoming week nfl games for bragging rights or dinner.  After a few weeks 
                    he said hey ur a dev make an app.  So here we are many eons later.  Enjoy!
                </div>
                <Footer/>
            </div>
        );
    }
}

export default AboutPage;