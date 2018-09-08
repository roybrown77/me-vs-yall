import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div className='page-container'>
                    <div style={{textAlign: 'left'}}>
                        1.  On Scores page, click 'Press Start To Play!' and Login with Google Account.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        2.  Select your winners before game starts.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        3.  Watch your numbers grow on Scores and Leaders pages.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        4.  Invite friends and family to compete with and brag on how much yall could have won in Vegas!
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        * New games are loaded the day before they start.  If weekly games, they'll load the day before week starts.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        ** Simulated betting assume $110 bet and $100 payout on each game.  Total Vegas payout would equal what you won plus
                        what you bet.  For example, if you see 'ya won $500 bet'n $1760', the total Vegas payout would be $2260.  
                        If you see 'ya lost $1760 bet'n $1760', the total Vegas payout would be $0.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        *** Spreads are not considered at this time.
                    </div>
                </div>
                <Footer/>
            </div>
        );
    }
}

export default HowToPlayPage;