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
                    after getting laid off in July 2017 did I decide to have it ready for the NFL season.  This 
                    prepared me for my next job in addition to growing confidence I can build something great we can use.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Since then we've added free pick games for Premier League, NBA, NCAAF, MMA, Boxing, MLS and in 
                    the future X Games and World Cup.
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    This app was built for the love of sports, competition and the fighting spirit.  Enjoy!  :D
                </div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    Feel free to contact us or join our mailing list at info@mevsyall.com.
                </div>
            </PageContainer>
        );
    }
}

export default About;