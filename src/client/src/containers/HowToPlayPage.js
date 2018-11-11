import React, { Component } from 'react';

import PageContainer from './PageContainer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <PageContainer>
                    <div style={{padding: '12px'}}>
                        <div style={{textAlign: 'left'}}>
                            1.  Hit 'Log In To Play!'.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            2.  Tap team you believe will win or tie.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            3.  Watch live play and your numbers grow on Scores and Leaders.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            4.  Invite friends to compete with and brag on how much yall could have won in Vegas.
                        </div>
                        <br/>
                    </div>
                </PageContainer>
            </div>
        );
    }
}

export default HowToPlayPage;