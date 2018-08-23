import React, { Component } from 'react';

import Header from '../components/Header';
import Footer from '../components/Footer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <Header/>
                <div style={{textAlign: 'left', padding:'16px'}}>
                    1.  On Scores page, click 'Start To Play' and Login with Google Account.
                </div>
                <div style={{textAlign: 'left', padding:'16px'}}>
                    2.  Select your winners before game starts.
                </div>
                <div style={{textAlign: 'left', padding:'16px'}}>
                    3.  Watch your numbers grow on Scores and Leader pages.
                </div>
                <div style={{textAlign: 'left', padding:'16px'}}>
                    4.  Invite friends and family to compete with and brag on how much yall could have won in Vegas!
                </div>
                <div style={{textAlign: 'left', padding:'16px'}}>
                    * Simulated betting assume $110 bet and $100 payout on each game.  Spreads are not considered at this time.
                </div>
                <Footer/>
            </div>
        );
    }
}

export default HowToPlayPage;