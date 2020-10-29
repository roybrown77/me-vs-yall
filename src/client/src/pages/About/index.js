import React, { Component } from 'react';
import ReactGA from 'react-ga';

import PageContainer from '../PageContainer';

const line1 = `A long time ago (2007) in a galaxy far, far away (Alpharetta, Georgia), a buddy and I would scribble on paper 
               who we thought would win the upcoming week's NFL games.  Whoever got the most correct would win bragging rights 
               or a meal.  After a few weeks he said "hey, ur a dev -- make an app."`;

const line2 = `But after 10 years, I still didn't find time to create it.  Only after losing my job in July 2017 did I decide 
               to have it ready for the NFL season.  It prepared me for my next gig in addition to growing confidence I can 
               build something great we can use.`;

const line3 = `This app is for the love of sports, competition and the fighting spirit.  Enjoy!  :D`;

const line4 = `Feel free to contact us or join our mailing list at info@mevsyall.com.`;

const line5 = `Me vs Yall Engineering and Internship Program has provided our design & elegant engineering first approach (that's sorely missing in the sports industry) code `;
class About extends Component {
    componentDidMount() {
      ReactGA.ga('send', 'pageview', '/about');
      window.scrollTo(0, 0);
    }

    render() {
        return (
            <PageContainer>
                <div style={{textAlign: 'left', padding: '12px'}}>{line1}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>{line2}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>{line3}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>{line4}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    {line5}<a href="https://www.github.com/roybrown77/me-vs-yall">here</a>.
                </div>
            </PageContainer>
        );
    }
}

export default About;
