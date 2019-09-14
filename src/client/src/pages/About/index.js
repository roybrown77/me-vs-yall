import React, { Component } from 'react';

import PageContainer from '../PageContainer';

class About extends Component {
    render() {
        return (
            <PageContainer>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    In 2007, a buddy of mine and I would text each other who we thought would win the
                    upcoming week's NFL games.  This was just for bragging rights or a meal.  After a 
                    few weeks, he said 'hey, ur a dev make an app'.  10 years later and many seasons of 
                    texts, we finally got around to building it.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Since then we've added the Premier League, NBA, NCAAF and in the future X Games, MLS and World Cup.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    We support athletes like skaters, music/graffiti/design artists, writers, entrepreneurs and learners so please reach out for more info.  It may be called 
                    Me vs Yall but it also means We help U.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                   Good people, sneakers and graffiti to music and home architecture influences us.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Cop some merch too.  Enjoy.  :D
                </div>
            </PageContainer>
        );
    }
}

export default About;