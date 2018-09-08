import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class AboutPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div className='page-container'>
                    <div style={{textAlign: 'left'}}>
                        Lose fake money here before losing real money there.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        Pick winners of sporting events and compete with others around the world.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        In 2007, a buddy of mine and I would text each other who we thought would win the
                        upcoming week's nfl games.  This was just for bragging rights or a meal.  After a 
                        few weeks, he said 'hey, ur a dev make an app'.  10 years later and many seasons of 
                        texts, I finally got around to doing it. :D Enjoy!
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default AboutPage;