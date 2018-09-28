import React, { Component } from 'react';

import PageContainer from './PageContainer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <PageContainer>
                    <div style={{margin: '75px 12px'}}>
                        <div style={{textAlign: 'left'}}>
                            1.  Hit 'Press Start To Play' and Login with Google Account.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            2.  Tap on team you believe will win.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            3.  Watch your numbers grow on Scores and Leaders pages.
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