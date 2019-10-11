import React, { Component } from 'react';

import PageContainer from '../PageContainer';

class About extends Component {
    render() {
        return (
            <PageContainer>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    In 2007, a buddy of mine and I would text our picks for the 
                    upcoming week's NFL games.  This was just for bragging rights or a meal.  After a 
                    few weeks, he said 'hey, ur a dev make an app'.  10 years later and many seasons of 
                    texts, we finally built it.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Since then we've added free pick games for Premier League, NBA, NCAAF, MMA, Boxing, MLS and in the future X Games and World Cup.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    This app was built for the love of sport, competition and the fighting spirit.  Enjoy!  :D
                </div>
            </PageContainer>
        );
    }
}

export default About;