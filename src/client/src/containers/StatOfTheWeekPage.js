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
    color: '#555',
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
                      false &&
                      <div style={styles.stats}>
                      <Paper style={styles.container} elevation={1}>
                        <Typography align={'left'} style={styles.contentTitle}>
                          BIG SACK ATTACK
                        </Typography>
                        <br/>
                        <Typography align={'left'} style={styles.content} variant="headline" component="h3">
                          10 players have at least 5 sacks after 5 weeks.  All have a chance to get 20 for the season.  
                          2 brothers lead with 6 (Texan's J.J. Watt and Steeler's T.J. Watt).
                        </Typography>
                        <Divider style={styles.divider} />
                        <Typography>
                          NFL October 10, 2018
                        </Typography>
                      </Paper>
                    </div>}
                    <div style={styles.stats}>
                      <Paper style={styles.container} elevation={1}>
                        <Typography align={'left'} style={styles.contentTitle}>
                          GIVE THE KID SOME CRED
                        </Typography>
                        <br/>
                        <Typography align={'left'} style={styles.content} variant="headline" component="h3">
                          Patrick Mahomes and the Kansas City Chiefs are undefeated at 4-0 which includes 3 road wins.
                        </Typography>
                        <Divider style={styles.divider} />
                        <Typography>
                          NFL October 3, 2018
                        </Typography>
                      </Paper>
                    </div>
                    <div style={styles.stats}>
                      <Paper style={styles.container} elevation={1}>
                        <Typography align={'left'} style={styles.contentTitle}>
                          HOME FIELD ADVANTAGE IS REAL
                        </Typography>
                        <br/>
                        <Typography align={'left'} style={styles.content} variant="headline" component="h3">
                          16 teams have not won on the road after 3 weeks.
                        </Typography>
                        <Divider style={styles.divider} />
                        <Typography>
                          NFL September 26, 2018
                        </Typography>
                      </Paper>
                    </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;