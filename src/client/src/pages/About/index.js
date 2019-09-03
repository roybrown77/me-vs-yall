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
                    texts, we finally got around to doing it.  Enjoy.  :D
                </div>
            </PageContainer>
        );
    }
}

export default About;