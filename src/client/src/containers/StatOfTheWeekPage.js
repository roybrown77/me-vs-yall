import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from './PageContainer';

const styles = {
  titleContainer: {
    margin: '12px 12px 0 12px',
    paddingTop: '12px',
  },
  title: {
    color: 'rgba(0, 0, 0, 0.87)',
    fontSize: '1.2rem',
    fontWeight: '700'
  },
  stats: {
    margin: '12px 12px 0 12px'
  },
  container: {
    padding: '12px'
  },
  divider: {
    margin: '12px 0'
  },
  main: {
    color: 'rgba(0, 0, 0, 0.87)'
  },
  contentTitle: {
    color: '#767676'
  },
  content: {
    fontWeight: '700'
  }
};

const stats = [
  {
    title: 'BIG SACK ATTACK',
    content: `10 players have at least 5 sacks after 5 weeks.  Leaders include brothers 
              J.J. Watt (Texans) and T.J. Watt (Steelers) with 6.  All have a 
              chance to break the record of 22.5 set by Michael Strahan (Giants).`,
    leagueName: 'NFL',
    date: 'October 10, 2018',
  },
  {
    title: 'GIVE THE KID SOME CRED',
    content: 'Patrick Mahomes and the Kansas City Chiefs are undefeated at 4-0 which includes 3 road wins.',
    leagueName: 'NFL',
    date: 'October 3, 2018',
  },
  {
    title: 'HOME FIELD ADVANTAGE IS REAL',
    content: '16 teams have not won on the road after 3 weeks.',
    leagueName: 'NFL',
    date: 'September 26, 2018',
  }
];

function StatOfTheWeekPage () {
     return (
            <div>
                <PageContainer>
                  <div style={styles.titleContainer}>
                    <Typography variant="headline" component="h3" align={'left'} style={styles.title}>
                      Stat of the Week
                    </Typography>
                  </div>
                  {
                    stats.map(stat=>(
                      <div key={stat.title.replace(' ', '')} style={styles.stats}>
                        <Paper style={styles.container} elevation={1}>
                          <Typography align={'left'} style={styles.contentTitle}>
                            {stat.title}
                          </Typography>
                          <br/>
                          <Typography align={'left'} style={styles.content} variant="headline" component="h3">
                            {stat.content}
                          </Typography>
                          <Divider style={styles.divider} />
                          <Typography>
                            {stat.leagueName} {stat.date}
                          </Typography>
                        </Paper>
                      </div>
                  ))}
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;
