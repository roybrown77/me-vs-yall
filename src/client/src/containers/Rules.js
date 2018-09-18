import React, { Component } from 'react';

import PageContainer from './PageContainer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <PageContainer>
                    <div style={{margin: '75px 12px'}}>
                        <div style={{textAlign: 'left'}}>
                            1.  New games are loaded the day before they start.  If weekly games, they'll load the day before week starts.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            2.  Simulated betting assume $110 bet and $100 payout on each game.  Total Vegas payout would equal what you won plus
                            what you bet.  For example, if you see 'ya won $500 bet'n $1760', the total Vegas payout would be $2260.  
                            If you see 'ya lost $1760 bet'n $1760', the total Vegas payout would be $0.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            3.  Spreads are not considered at this time.
                        </div>
                    </div>
                </PageContainer>
            </div>
        );
    }
}

export default HowToPlayPage;