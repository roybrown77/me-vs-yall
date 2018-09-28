import React, { Component } from 'react';

import PageContainer from './PageContainer';

class MvyPage extends Component {
    render() {
        return (
            <PageContainer>
                <div style={{margin: '75px 12px'}}> 
                    <div style={{textAlign: 'left'}}>
                        Pick winners of sporting events and compete with others around the world.
                    </div>
                    <br/>
                    <div style={{textAlign: 'left'}}>
                       Check out Stat of the Week (SOTW).
                    </div>
                </div>
            </PageContainer>
        );
    }
}

export default MvyPage;