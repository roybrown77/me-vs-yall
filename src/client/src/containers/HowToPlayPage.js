import React, { Component } from 'react';

import PageContainer from './PageContainer';

class HowToPlayPage extends Component {
    render() {
        return (
            <div>
                <PageContainer>
                    <div style={{margin: '12px'}}>
                        <div style={{textAlign: 'left'}}>
                            1.  Hit 'Press To Play!' and Log in with Google.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            2.  Select the National Football League or English Premier League.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            3.  Tap on team you believe will win.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            4.  Watch your numbers grow on Scores and Leaders pages.
                        </div>
                        <br/>
                        <div style={{textAlign: 'left'}}>
                            5.  Invite friends to compete with and brag on how much yall could have won in Vegas.
                        </div>
                        <br/>
                    </div>
                </PageContainer>
            </div>
        );
    }
}

export default HowToPlayPage;