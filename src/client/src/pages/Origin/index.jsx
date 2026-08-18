import { useEffect } from 'react';

import PageContainer from '../../components/PageContainer';

const line1 = `A long time ago (2007) in a galaxy far, far away (Alpharetta, Georgia), a buddy and I would scribble on paper 
               who we thought would win the upcoming week's NFL games.  Whoever got the most correct would win bragging rights 
               or a meal.  After a few weeks he said "hey, ur a dev -- make an app."`;

const line2 = `But after 10 years, I still didn't find time to create it.  Only after losing my job in July 2017 did I decide 
               to have it ready for the NFL season.  It prepared me for my next gig (and still does) in addition to growing confidence I can 
               build something great we can use.`;

const line3 = `This app is for the love of sports, competition and the fighting spirit.  Enjoy!  :D`;

const line4 = `Me vs Yall Engineering and Internship Program has provided code `;

const videoUrl = `https://www.youtube.com/embed/k2KTcFctHyU?autoplay=1`;

const Origin = () => {
    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    return (
        <PageContainer>
            <div style={{ marginTop: '10%' }}>
                <div style={{textAlign: 'left', padding: '12px'}}>{line1}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>{line2}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>{line3}</div>
                <div style={{textAlign: 'left', padding: '12px'}}>
                    {line4}<a href="https://www.github.com/roybrown77/me-vs-yall">here</a>.
                </div>
            </div>
        </PageContainer>
    );
};

export default Origin;
