import React, { Component } from 'react';

import PageContainer from '../PageContainer';

class About extends Component {
    render() {
        return (
            <PageContainer>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    In 2007, a buddy of mine and I would text each other picks for the 
                    upcoming week's NFL games.  This was just for bragging rights or a meal.  After a 
                    few weeks, he said 'hey, ur a dev make an app'.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    But after 10 years of messaging/emailing, I still didn't find time to create it.  Only 
                    after getting laid off in July 2017 did I decide to have it ready for the next NFL season.  This 
                    increased my dev skills to prepare for my next job and grew confidence I can build something great.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Since then we've added free pick games for Premier League, NBA, NCAAF, MMA, Boxing, MLS and in 
                    the future X Games and World Cup.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    This app was built for the love of sports, competition and the fighting spirit.  Enjoy!  :D
                </div>
            </PageContainer>
        );
    }
}

export default About;