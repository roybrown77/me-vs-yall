import React, { Component } from 'react';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

import PageContainer from './PageContainer';

const styles = {
  title: {
    margin: '12px 12px 0 12px',
    paddingTop: '12px'
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
                    <div style={styles.title}>
                      <Typography variant="headline" component="h3">
                        Stat of the Week
                      </Typography>
                    </div>
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
                          NFL September 25, 2018
                        </Typography>
                      </Paper>
                    </div>
                </PageContainer>
            </div>
        );
}

export default StatOfTheWeekPage;