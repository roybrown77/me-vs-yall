import React from 'react';

import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from './PageContainer';

const styles = {
  titleContainer: {
    margin: '0 12px 12px 12px',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.2rem',
    fontWeight: '700'
  },
  stats: {
    margin: '12px 0',
    backgroundColor: '#ffffff'
  },
  container: {
    padding: '12px'
  },
  main: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  contentTitle: {
    color: '#767676'
  },
  content: {
    fontWeight: '600',
    fontSize: '1rem'
  }
};

const stats = [
  {
    title: 'SPREAD',
    content: `The negative number in upper right corner is the Westgate Las Vegas SuperBook spread.  It's what they think that team will win 
              by so that the casino doesn't lose money.  This number can change all week as they adjust due to injuries and other factors.  Westgate 
              currently has the best overall record in Me vs Yall for NFL/NBA.`
  },
  {
    title: 'HOME TEAMS',
    content: `In the NFL, home teams (team on right) win more than away teams.`
  },
  {
    title: 'NBA',
    content: `For NBA games, it's easier to make picks daily since teams can be streaky.  It's a challenging league to pick winners so study well.`
  },
  {
    title: 'PICKS',
    content: `You can view another person's picks by tapping their name on Leaders page after game starts.  You can also change your pick until game starts.`
  },
  {
    title: 'NEW APP FEATURES',
    content: `Log in again to get new app features.`
  }
];

function StatOfTheWeekPage () {
     return (
            <div>
                <PageContainer>
                  <div style ={{paddingTop: '12px'}}>
                    <div style={styles.titleContainer}>
                      <Typography component="h3" align={'left'} style={styles.title}>
                        Tips
                      </Typography>
                      <Typography align={'left'} style={styles.contentTitle}>
                        Because We All Need Them
                      </Typography>
                    </div>
                    {
                      stats.map(stat=>(
                        <div key={stat.title.replace(' ', '')} style={styles.stats}>
                          <div style={styles.container}>
                            <Typography align={'left'} style={styles.contentTitle}>
                              {stat.title}
                            </Typography>
                            <br/>
                            <Typography align={'left'} style={styles.content}>
                              {stat.content}
                            </Typography>
                            <Divider style={{
                              margin: '12px 0',
                              height: '10px',
                              backgroundColor: '#'+Math.floor(Math.random()*16777215).toString(16)
                            }} />
                          </div>
                        </div>
                    ))}
                  </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;
