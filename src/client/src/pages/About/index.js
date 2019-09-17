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
                    Influences include everything from nature, skaters, musicians, graffiti and ux artists 
                    to writers, fighters, sneakerheads, architects, entrepreneurs and learners.  Basically the good.  Feel free to reach out to us about support.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Cop some merch too along the way.  Enjoy.  :D
                </div>
            </PageContainer>
        );
    }
}

export default About;