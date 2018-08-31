import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div style={{textAlign: 'left', margin:'16px', marginTop: '91px'}}>
                    Pick winners of sporting events and compete with others around the world.
                </div>
                <div style={{textAlign: 'left', padding:'16px'}}>
                    In 2007, a buddy of mine and I would text each other who we thought would win the
                    upcoming week's nfl games.  This was just for bragging rights or a meal.  After a 
                    few weeks, he said 'hey, ur a dev make an app'.  10 years later and many seasons of 
                    texts, I finally got around to doing it :D.  Enjoy!
                </div>
                <Footer/>
            </div>
        );
    }
}

export default AboutPage;