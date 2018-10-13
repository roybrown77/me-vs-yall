import React, { Component } from 'react';

import PageContainer from './PageContainer';

class MvyPage extends Component {
    render() {
        return (
            <PageContainer>
                <div style={{margin: '24px 12px 12px 12px'}}> 
                    <div style={{textAlign: 'left'}}>
                        Pick winners of sporting events and compete with others around the world.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        Check out the Stat of the Week (SOTW).
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        If ya can't win here you probably shouldn't bet the house, electric bill or peanut butter jelly sandwich there.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                        Enjoy the National Football League and English Premier League.
                    </div>
                </div>
            </PageContainer>
        );
    }
}

export default MvyPage;