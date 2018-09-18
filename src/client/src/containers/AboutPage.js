import React, { Component } from 'react';

import PageContainer from './PageContainer';

class AboutPage extends Component {
    render() {
        return (
            <PageContainer>
                <div style={{margin: '75px 12px'}}> 
                    <div style={{textAlign: 'left'}}>
                        Win fake money here before losing real money there.
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
                        texts, I finally got around to doing it. :D Enjoy the National Football League and 
                        English Premier League!
                    </div>
                </div>
            </PageContainer>
        );
    }
}

export default AboutPage;