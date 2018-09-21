import React, { Component } from 'react';

import PageContainer from './PageContainer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <PageContainer>
                    <div style={{margin: '75px 12px'}}>
                        <div style={{textAlign: 'left'}}>
                            Simulated betting assume $110 bet and $100 payout on each game.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            Total Vegas payout would equal what you won plus what you bet.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            For example, if you see 'ya won $500 bet'n $1760', the total Vegas payout would be $2260.  
                            If you see 'ya lost $550 bet'n $1760', the total Vegas payout would be $1210.
                        </div>
                    </div>
                </PageContainer>
            </div>
        );
    }
}

export default HowToPlayPage;